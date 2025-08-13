import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import z from 'zod';

export const radioInputAttributesSchema = z.object({
    values: z.array(
        z.object({
            key: z.string(),
            label: z.string()
        })
    )
});

type RadioInputValue = z.infer<typeof radioInputAttributesSchema>['values'][number];

@customElement('radio-input')
export class RadioInput extends LitElement {
    @property()
    public id!: string;

    @property({ type: Array })
    public values: RadioInputValue[] = [];

    @property()
    public selectedKey?: RadioInputValue['key'] | null = null;

    @property({ type: Boolean })
    public error: boolean = false;

    private changeValue(event: Event) {
        const target = event.target as HTMLInputElement;
        const key = target.value;

        this.dispatchEvent(
            new CustomEvent('value-changed', {
                detail: key
            })
        );
    }

    private handleClick(event: Event) {
        const target = event.target as HTMLInputElement;

        if (target.checked) {
            this.dispatchEvent(
                new CustomEvent('value-changed', {
                    detail: null
                })
            );
        }
    }

    private renderInputs() {
        return this.values.map(
            value => html`
                <label>
                    <input
                        type="radio"
                        name=${this.id}
                        value=${value.key}
                        .checked=${this.selectedKey === value.key}
                        @change=${this.changeValue}
                        @click=${this.handleClick}
                    />
                    ${value.label}
                </label>
            `
        );
    }

    public override render() {
        return html`
            <div style=${this.error ? 'border: 1px solid red' : nothing}>
                ${this.renderInputs()}
            </div>
        `;
    }
}
