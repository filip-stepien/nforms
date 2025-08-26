import { html, LitElement, ReactiveController } from 'lit';
import { InputStructure, FormFetch } from './FormFetch';
import { FormState } from './FormState';

export class FormController implements ReactiveController {
    private readonly _host: LitElement;
    private readonly _fetch: FormFetch = new FormFetch();
    private readonly _state: FormState = new FormState();
    private _formId: string | null = null;
    private _error = false;

    constructor(host: LitElement) {
        (this._host = host).addController(this);

        // sync asynchronously fetched fields with state
        this._fetch.onChange = () => {
            this._state.set(
                this._fetch.inputs.map(input => ({ id: input.id, value: null, error: false }))
            );

            this._host.requestUpdate();
        };
    }

    private handleFormSubmit = async () => {
        const inputValid = (input: InputStructure) => {
            const state = this._state.getById(input.id);
            const required = input.required;

            if (state && required && !state.value) {
                this._state.setErrorById(input.id, true);
                return false;
            }

            return true;
        };

        // map first to set error on every invalid field
        const validationResult = this._fetch.inputs.map(inputValid);
        const formValid = validationResult.every(Boolean);

        if (this._formId === null) {
            this._error = true;
            this._host.requestUpdate(); // update to show invalid id error
            return;
        }

        if (!formValid) {
            this._host.requestUpdate(); // update to show invalid input indicators
            return;
        }

        const responses = this._state.get().map(({ id, value }) => ({
            id,
            value: value as NonNullable<typeof value>
        }));

        await this._fetch.uploadResponses(this._formId, responses);
    };

    private handleValueChange(id: string, event: CustomEvent<string> | CustomEvent<string[]>) {
        this._state.setValueById(id, event.detail);

        // reset errors
        this._state.set(this._state.get().map(state => ({ ...state, error: false })));

        this._host.requestUpdate();
    }

    private renderInput(structure: InputStructure) {
        const { id, inputType } = structure;
        const state = this._state.getById(id);

        if (!state) {
            console.error(
                `Input state not found (input id: "${id}"). Is update requested before state is set?`
            );
            return;
        }

        switch (inputType) {
            case 'text':
                return html`
                    <text-input
                        id=${id}
                        value=${state.value}
                        ?error=${state.error}
                        placeholder=${structure.attributes.placeholder}
                        @value-changed=${(e: CustomEvent<string>) => this.handleValueChange(id, e)}
                    ></text-inpuit>
                `;
            case 'radio':
                return html`
                    <radio-input
                        id=${id}
                        .values=${structure.attributes.values}
                        .selectedKey=${state.value}
                        ?error=${state.error}
                        @value-changed=${(e: CustomEvent<string>) => this.handleValueChange(id, e)}
                    ></radio-input>
                `;
            case 'checkbox':
                return html`
                    <checkbox-input
                        id=${id}
                        .values=${structure.attributes.values}
                        .selectedKeys=${state.value}
                        ?error=${state.error}
                        @value-changed=${(e: CustomEvent<string[]>) =>
                            this.handleValueChange(id, e)}
                    ></checkbox-input>
                `;
            default:
                console.error(`Unknown input type "${inputType}". Check input render method.`);
        }
    }

    public async hostConnected() {
        const id = this._host.getAttribute('id');

        if (id) {
            this._formId = id;
            this._host.addEventListener('form-submitted', this.handleFormSubmit);
            await this._fetch.fetchInputs(id);
        } else {
            this._error = true;
            console.error(
                'Form has no valid ID. Make sure you have added `id` attribute to the form tag.'
            );
        }
    }

    public get inputElements() {
        return this._fetch.inputs.map(input => this.renderInput(input));
    }

    public get loading() {
        return this._fetch.loading;
    }

    public get error() {
        return this._error || this._fetch.error;
    }

    public get debug_stateElement() {
        return JSON.stringify(this._state.get(), null, 2);
    }
}
