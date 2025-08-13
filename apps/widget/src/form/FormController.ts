import { html, LitElement, ReactiveController } from 'lit';
import { InputStructure, FormFetch } from './FormFetch';
import { FormState } from './FormState';

export class FormController implements ReactiveController {
    private _host: LitElement;
    private _fetch: FormFetch = new FormFetch();
    private _state: FormState = new FormState();

    constructor(host: LitElement) {
        (this._host = host).addController(this);
    }

    private handleFormSubmit = () => {
        const inputValid = (input: InputStructure) => {
            const state = this._state.getById(input.id);
            const required = input.required;

            if (state && required && !state.value) {
                this._state.setErrorById(input.id, true);
                return false;
            }

            return true;
        };

        const formValid = this._fetch.inputs.every(inputValid);

        if (formValid) {
            // do submit stuff
            console.log(this._state.get());
        }

        this._host.requestUpdate();
    };

    private handleValueChange(id: string, event: CustomEvent<string> | CustomEvent<string[]>) {
        this._state.setValueById(id, event.detail);
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
        await this._fetch.fetchInputs();

        this._state.set(
            this._fetch.inputs.map(input => ({ id: input.id, value: null, error: false }))
        );

        this._host.addEventListener('form-submitted', this.handleFormSubmit);

        this._host.requestUpdate();
    }

    public hostDisconnected() {
        this._host.removeEventListener('form-submitted', this.handleFormSubmit);
    }

    public get inputElements() {
        return this._fetch.inputs.map(input => this.renderInput(input));
    }

    public get loading() {
        return this._fetch.loading;
    }

    public get error() {
        return this._fetch.error;
    }

    public get debug_stateElement() {
        return JSON.stringify(this._state.get(), null, 2);
    }
}
