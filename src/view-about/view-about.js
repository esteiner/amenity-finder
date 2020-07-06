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
      div {
        padding-left: 16px;
        padding-right: 16px;
        color: var(--mdc-theme-primary);
      }
      mwc-tab {
        padding: 2px;
        background-color: #F0F0E3;
      }
    `;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <h2>About</h2>
      <div><p>Showcase SPA with web components using open data APIs.</p></div>
      <div>
        <p>Tech stack:</p>
        <ul>
          <li><a href="https://lit-html.polymer-project.org/" target="_blank">lit-html</a></li>
          <li><a href="https://lit-element.polymer-project.org/" target="_blank">LitElement</a></li>
          <li><a href="https://github.com/material-components/material-components-web-components" target="_blank">Material Web Components</a></li>
          <li><a href="https://github.com/visionmedia/page.js/" target="_blank">Page</a></li>
          <li><a href="https://open-wc.org/" target="_blank">open-wc</a></li>
        </ul>
      </div>
      <div>
        <p>APIs:</p>
        <ul>
          <li><a href="https://openstreetmap.org" target="_blank">OpenStreetMap</a></li>
          <li><a href="https://overpass-turbo.eu/" target="_blank">Overpass-Turbo</a></li>
        </ul>
      </div>
      <div><p>Brought to you by Edwin Steiner (v1)</p></div>
    `;
  }
}customElements.define('view-about', ViewAbout);
