import { LitElement, TemplateResult, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import './inputs/SubmitInput';
import { textInputAttributesSchema } from './inputs/TextInput';
import z from 'zod';

const inputsSchema = z.array(
    z.discriminatedUnion('inputType', [
        z.object({
            id: z.string().nonempty(),
            inputType: z.literal('text'),
            attributes: textInputAttributesSchema
        })
    ])
);

type Input = z.infer<typeof inputsSchema>[number];

type InputType = Input['inputType'];

type InputRenderer = (item: Input) => TemplateResult;

@customElement('n-form')
export class FormWidget extends LitElement {
    @state()
    private inputsStrucure: Input[] = [];

    @state()
    private inputErrors: Record<string, boolean> = {};

    @state()
    private values: Record<string, string> = {};

    @state()
    private loading = false;

    @state()
    private fetchError = false;

    private renderers: Record<InputType, InputRenderer> = {
        text: item =>
            html` <text-input
                id=${item.id}
                value=${this.values[item.id] ?? ''}
                placeholder=${item.attributes.placeholder ?? ''}
                ?error=${this.inputErrors[item.id]}
                @value-changed=${(e: CustomEvent<string>) => this.handleValueChange(item.id, e)}
            ></text-input>`
    };

    private async fetchData(): Promise<Input[]> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return [
            {
                id: '1',
                inputType: 'text',
                attributes: { required: true, placeholder: 'placeholder' }
            },
            {
                id: '2',
                inputType: 'text',
                attributes: {}
            }
        ];
    }

    private async loadInputs() {
        this.loading = true;
        this.fetchError = false;

        try {
            const data = await this.fetchData();
            this.inputsStrucure = inputsSchema.parse(data);
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error('Fetched inputs have incorrect shape. Issues:', error.issues);
            } else {
                console.error('An error occured while fetching form inputs:', error);
            }

            this.fetchError = true;
        } finally {
            this.loading = false;
        }
    }

    private getInputsHtml() {
        return this.inputsStrucure.map(input => this.renderers[input.inputType](input));
    }

    private validate() {
        const errors: Record<string, boolean> = {};

        for (const input of this.inputsStrucure) {
            const value = this.values[input.id]?.trim() ?? '';
            if (input.attributes.required && !value) {
                errors[input.id] = true;
            }
        }

        this.inputErrors = errors;

        return Object.keys(errors).length === 0;
    }

    private handleValueChange(id: string, event: CustomEvent<string>) {
        this.values = { ...this.values, [id]: event.detail };
        this.inputErrors = {};
    }

    private handleFormSubmit() {
        if (this.validate()) {
            console.log(this.values);
        } else {
            console.log('Form invalid');
        }
    }

    public override connectedCallback() {
        super.connectedCallback();
        this.addEventListener('form-submitted', this.handleFormSubmit.bind(this));
        this.loadInputs();
    }

    public override render() {
        if (this.loading) {
            return html`<p>Loading...</p>`;
        }

        if (this.fetchError) {
            return html`<p>Error loading inputs.</p>`;
        }

        return html`
            <form action="/">
                ${this.getInputsHtml()}
                <submit-input></submit-input>
            </form>
            <pre>structure: ${JSON.stringify(this.inputsStrucure, null, 2)}</pre>
            <pre>values: ${JSON.stringify(this.values, null, 2)}</pre>
            <pre>errors: ${JSON.stringify(this.inputErrors, null, 2)}</pre>
        `;
    }
}
