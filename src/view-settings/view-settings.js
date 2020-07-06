import { html, css, LitElement } from 'lit-element';
import '@material/mwc-tab-bar';
import '@material/mwc-tab';
import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item.js';


export class ViewSettings extends LitElement {
  static get properties() {
    return {
      currentAmenityTypeValue: { type: String },
      // https://wiki.openstreetmap.org/wiki/Key:amenity
      amenityTypes: { type: Array }, // value/label-Object
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
    this.amenityTypes = [
      // restaurant, parking, drinking_water, bicycle_rental, bus_station, car_wash, fuel, atm, post_box, toilets
      { value: "restaurant", label: "Restaurant"},
      { value: "parking", label: "Parking"},
      { value: "drinking_water", label: "Drinking Water"},
      { value: "bicycle_rental", label: "Bicycle Rental"},
      { value: "bus_station", label: "Bus Station"},
      { value: "car_wash", label: "Car Wash"},
      { value: "fuel", label: "Fuel"},
      { value: "atm", label: "ATM"},
      { value: "post_box", label: "Post Box"},
      { value: "toilets", label: "Toilets"},
    ];
  }

  render() {
    return html`
      <h2>Settings</h2>
      <mwc-select @selected="${this.selectAmenityType}" label="Amenity Type">
      ${this.amenityTypes.map(amenityType => html`
        <mwc-list-item ?selected="${this.currentAmenityTypeValue === amenityType.value}" value="${amenityType.value}">${amenityType.label}</mwc-list-item>
      `)};
      </mwc-select>
    `;
  }

  selectAmenityType(e) {
    const amenityType = this.amenityTypes[e.detail.index];
    const event = new CustomEvent('change-amenity-type', {
      detail: {
        amenityType: amenityType.value,
      },
    });
    this.dispatchEvent(event);

  }
}
customElements.define('view-settings', ViewSettings);
