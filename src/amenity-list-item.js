import { LitElement, html, css } from 'lit-element';
import './haversine-distance';

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
export class AmenityListItem extends LitElement {
  static get properties() {
    return {
      searchCenterLatitude: { type: Number },
      searchCenterLongitude: { type: Number },
      amenity: { type: Object },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      a {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        padding: 8px 8px 8px 8px;
        font-size: 14px;
        font-weight: 300;
        overflow: hidden;
        text-decoration: none;
        color: olive;
      }

      h2 {
        margin: 0;
      }

      .info {
        display: flex;
        flex-direction: column;
      }
    `;
  }

  constructor() {
    super();
  }

  render() {
    return html`
        <a href="/amenity/${this.amenity.id}" @click="${this.selectAmenity}">
            <div class="info">
              <h2>${this.amenity.tags.name ? this.amenity.tags.name : this.amenity.tags.amenity}</h2>
              <div>${this.amenity.tags["addr:street"]} ${this.amenity.tags["addr:housenumber"]}</div>
              <div></div>${this.amenity.tags["addr:city"]}</div>
            </div>
            <span>(${this.calculateDistance([this.searchCenterLongitude, this.searchCenterLatitude],[this.amenity.lon, this.amenity.lat])} m)</span>
        </a>
    `;
  }

  selectAmenity() {
    const event = new CustomEvent('select-amenity', {
      detail: {
        amenity: this.amenity,
      },
    });
    this.dispatchEvent(event);
  }

  calculateDistance(coords1, coords2) {
    function toRad(x) {
      return x * Math.PI / 180;
    }

    var lon1 = coords1[0];
    var lat1 = coords1[1];

    var lon2 = coords2[0];
    var lat2 = coords2[1];

    var R = 6371; // km

    var x1 = lat2 - lat1;
    var dLat = toRad(x1);
    var x2 = lon2 - lon1;
    var dLon = toRad(x2)
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c;

    return Math.round(distance*1000);
  }
}
customElements.define('amenity-list-item', AmenityListItem);
