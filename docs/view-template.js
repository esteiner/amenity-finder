import { html, css, LitElement } from 'lit-element';
import '@material/mwc-tab-bar';
import '@material/mwc-tab';


export class ViewAbout extends LitElement {
  static get properties() {
    return {
    };
  }

  static get styles() {
    return css`
      h2 {
        padding: 8px;
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
      <h2>View Title</h2>
    `;
  }
}
customElements.define('view-about', ViewAbout);
