import { html, css, LitElement } from 'lit-element';
import { nothing } from 'lit-html';
import '@material/mwc-tab-bar';
import '@material/mwc-tab';

// restaurant
// {
//   "type": "node",
//   "id": 644532757,
//   "lat": 47.0494899,
//   "lon": 8.3007794,
//   "tags": {
//   "addr:city": "Luzern",
//     "addr:housenumber": "10",
//     "addr:postcode": "6003",
//     "addr:street": "Klosterstrasse",
//     "amenity": "restaurant",
//     "email": "info@3koenige-luzern.ch",
//     "name": "Drei Könige",
//     "opening_hours": "Tu-Fr 11:00-14:00,17:00-23:00; Sa 18:00-23:00",
//     "outdoor_seating": "yes",
//     "phone": "+41 41 2507676",
//     "website": "https://www.3koenige-luzern.ch/home/restaurant/",
//     "wheelchair": "yes"
//   }
// }
export class ViewAmenity extends LitElement {
  static get properties() {
    return {
      amenity: { type: Object },
      searchCenterLatitude: { type: Number },
      searchCenterLongitude: { type: Number },
    };
  }

  static get styles() {
    return css`
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
        ${this.amenity
          ? html`
            <mwc-tab-bar>
                <mwc-tab @click="${this.openMap}" label="Direction" icon="place" stacked indicatorIcon="false"></mwc-tab>
              ${this.amenity.tags.phone
                ? html`<mwc-tab @click="${this.makePhoneCall}" label="${this.amenity.tags.phone}" icon="phone" stacked indicatorIcon="false"></mwc-tab>`
                : nothing}
                      ${this.amenity.tags.website
                ? html`<mwc-tab @click="${this.openWebPage}" label="www" icon="exit_to_app" stacked indicatorIcon="false"></mwc-tab>`
                : nothing}
                      ${this.amenity.tags.email
                ? html`<mwc-tab @click="${this.createEmail}" label="email" icon="email" stacked indicatorIcon="false"></mwc-tab>`
                : nothing}
            </mwc-tab-bar>
            <h2>${this.amenity.tags.name}</h2>
            <div>${this.amenity.tags["addr:street"]} ${this.amenity.tags["addr:housenumber"]}</div>
            <div>${this.amenity.tags["addr:postcode"]} ${this.amenity.tags["addr:city"]}</div>
            <div>${this.amenity.tags.opening_hours}</div>
            `
          : html`<p>no data</p>`
        }
    `;
  }

  openMap() {
    const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_foot&route=${this.searchCenterLatitude},${this.searchCenterLongitude};${this.amenity.lat},${this.amenity.lon}`;
    // const url = `https://www.openstreetmap.org/#map=16/${this.amenity.lat}/${this.amenity.lon}`;
    window.open(url);
  }

  makePhoneCall() {
    const url = `tel:${this.amenity.tags.phone}`
    window.open(url);
  }

  openWebPage() {
    window.open(this.amenity.tags.website, "_blank");
  }

  createEmail() {
    const url = `mailto:${this.amenity.tags.email}`
    window.open(url);
  }

}
customElements.define('view-amenity', ViewAmenity);
