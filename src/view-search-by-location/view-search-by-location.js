import { html, css, LitElement } from 'lit-element';
import '../utils/lazy-loading';
import '@material/mwc-textfield';
import '@material/mwc-button';
import '@material/mwc-tab-bar';
import '@material/mwc-tab';
import {lazyLoad} from "../utils/lazy-loading";


export class ViewSearchByLocation extends LitElement {
  static get properties() {
    return {
      centerLatitude: { type: Number },
      centerLongitude: { type: Number },
      radius: { type: Number },
      positioning: { type: Boolean },
    };
  }

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
        <h2>By Location</h2>
        <div>
          <mwc-textfield label="Position" helper="Latitude,Longitude" value="${this.centerLatitude},${this.centerLongitude}" @input="${this.handlePositionEntered}"></mwc-textfield>
          <mwc-button @click="${this.getCurrentPosition}" label="get position" icon="my_location" outlined></mwc-button>
        </div>
        <div>
          <mwc-textfield label="Radius" helper="Meter" value="${this.radius}" @input="${e => this.radius = e.target.value}"></mwc-textfield>
        </div>
    `;
  }

  handlePositionEntered(e) {
    var values = e.target.value.split(',');
    this.centerLatitude = values[0];
    this.centerLongitude = values[1];
  }

  getCurrentPosition() {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    } else {
      lazyLoad(this.geolocation(), (value) => {
        this.centerLatitude = value[0];
        this.centerLongitude = value[1];
      });
      // this.positioning = true;
      // navigator.geolocation.getCurrentPosition((position) => {
      //   this.centerLatitude = position.coords.latitude;
      //   this.centerLongitude = position.coords.longitude;
      //   this.positioning = false;
      // }, () => {
      //   console.error('Unable to retrieve your location');
      //   this.positioning = false;
      // });
    }
  }

  geolocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        this.centerLatitude = position.coords.latitude;
        this.centerLongitude = position.coords.longitude;
        resolve([position.coords.latitude, position.coords.longitude])
      }, () => {
        reject();
        console.error('Unable to retrieve your location');
      });
    });
  }
  search(e) {
    const event = new CustomEvent('change-location', {
      detail: {
        latitude: this.centerLatitude,
        longitude: this.centerLongitude,
        radius: this.radius,
      },
    });
    this.dispatchEvent(event);
  }
}
customElements.define('view-search-by-location', ViewSearchByLocation);
