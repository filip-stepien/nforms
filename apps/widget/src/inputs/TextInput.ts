import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import z from 'zod';

export const textInputAttributesSchema = z.object({
    placeholder: z.string().optional()
});

@customElement('text-input')
export class TextInput extends LitElement {
    @property()
    public id!: string;

    @property()
    public value: string | null = null;

    @property()
    public placeholder: string = '';

    @property({ type: Boolean })
    public error: boolean = false;

    private changeValue(event: Event) {
        const input = event.target as HTMLInputElement;
        this.value = input.value;

        this.dispatchEvent(
            new CustomEvent('value-changed', {
                detail: this.value || null
            })
        );
    }

    public override render() {
        return html`
            <input
                style=${this.error ? 'border: 1px solid red' : 'border: 1px solid black'}
                id=${this.id}
                name=${this.id}
                type="text"
                .value=${this.value}
                placeholder=${this.placeholder}
                @input=${this.changeValue}
            />
        `;
    }
}
