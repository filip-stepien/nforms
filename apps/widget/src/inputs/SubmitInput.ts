import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('submit-input')
export class SubmitInput extends LitElement {
    private handleClick() {
        this.dispatchEvent(
            new CustomEvent('form-submitted', {
                composed: true
            })
        );
    }

    public override render() {
        return html`<button @click=${this.handleClick}>Submit</button>`;
    }
}
