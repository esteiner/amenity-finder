import { html, css, LitElement } from 'lit-element';
import '@material/mwc-icon'

export class ViewSearchByArea extends LitElement {
  static get styles() {
    return css`
     h2 {
        padding: 4px;
        text-align: center;
        color: var(--mdc-theme-primary);
        font-size: 2em;
      }
      mwc-tab {
        background-color: #F0F0E3;
      }
    `;
  }

  constructor() {
    super();
  }

  render() {
    return html`
        <mwc-tab-bar>
           <mwc-tab @click="${this.search}" label="search" icon="search" stacked indicatorIcon="false"></mwc-tab>
        </mwc-tab-bar>
      <h2>By Area</h2>
    `;
  }
}
customElements.define('view-search-by-area', ViewSearchByArea);
