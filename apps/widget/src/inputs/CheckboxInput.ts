import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import z from 'zod';

export const checkboxInputAttributesSchema = z.object({
    values: z.array(
        z.object({
            key: z.string(),
            label: z.string()
        })
    )
});

type CheckboxInputValue = z.infer<typeof checkboxInputAttributesSchema>['values'][number];

@customElement('checkbox-input')
export class CheckboxInput extends LitElement {
    @property()
    public id!: string;

    @property({ type: Array })
    public values: CheckboxInputValue[] = [];

    @property({ type: Array })
    public selectedKeys: CheckboxInputValue['key'][] | null = null;

    @property({ type: Boolean })
    public error: boolean = false;

    private changeValue(event: Event) {
        const target = event.target as HTMLInputElement;
        const key = target.value;

        const current = this.selectedKeys ?? [];
        const newSelected = target.checked ? [...current, key] : current.filter(k => k !== key);

        this.dispatchEvent(
            new CustomEvent('value-changed', {
                detail: newSelected.length > 0 ? newSelected : null
            })
        );
    }

    private renderInputs() {
        return this.values.map(
            value => html`
                <label>
                    <input
                        type="checkbox"
                        name=${this.id}
                        value=${value.key}
                        .checked=${this.selectedKeys?.includes(value.key)}
                        @change=${this.changeValue}
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
