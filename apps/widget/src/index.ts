import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { FormController } from './form/FormController';

import './inputs/TextInput';
import './inputs/RadioInput';
import './inputs/CheckboxInput';
import './inputs/SubmitInput';

@customElement('n-form')
export class FormWidget extends LitElement {
    private _form: FormController = new FormController(this);

    public override render() {
        if (this._form.loading) {
            return html`<p>Loading...</p>`;
        }

        if (this._form.error) {
            return html`<p>Error loading inputs.</p>`;
        }

        return html`
            <form>
                ${this._form.inputElements}
                <submit-input></submit-input>
            </form>
            <pre>state: ${this._form.debug_stateElement}</pre>
        `;
    }
}
