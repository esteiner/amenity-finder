import { LitElement, html, css } from 'lit-element';
import page from 'page';
import '@material/mwc-drawer';
import '@material/mwc-top-app-bar-fixed';
import '@material/mwc-linear-progress';
import '@material/mwc-icon-button';
import '@material/mwc-icon';
import '@material/mwc-tab-bar';
import '@material/mwc-tab';
import 'pwa-helper-components/pwa-update-available.js';
import { lazyLoad } from "./utils/lazy-loading";
import { PendingContainer } from "./utils/pending-container";
import './amenity-list-item';

const osmApi = "https://overpass.osm.ch/api/interpreter?";
const overpassTurboApi = "https://overpass-turbo.eu/map.html?";
const sort_by = (field, reverse, primer) => {

  const key = primer ?
    function(x) {
      return primer(x[field])
    } :
    function(x) {
      return x[field]
    };

  reverse = !reverse ? 1 : -1;

  return function(a, b) {
    console.log("comparing", a, b);
    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
  }
}

export class AmenityFinder extends PendingContainer(LitElement) {
  static get properties() {
    return {
      showDrawer: { type: Boolean },
      currentView: { type: String },
      // https://wiki.openstreetmap.org/wiki/Key:amenity
      amenityType: { type: String }, // restaurant, parking, drinking_water, bicycle_rental, bus_station, car_wash, fuel, atm, post_box, toilets
      searchType: { type: String},
      searchByLocationCenterLatitude: { type: Number },
      searchByLocationCenterLongitude: { type: Number },
      searchByLocationRadius: { type: Number },
      query: { type: String },
      nodes: { type: Array },
      selectedNodeId: { type: Number }
    };
  }

  static get styles() {
    return css`
      // app
      .drawer-content {
        padding: 0px 16px 0 16px;
      }

      mwc-top-app-bar-fixed {
        padding-top: env(safe-area-inset-top);
        padding-right: env(safe-area-inset-right);
        padding-left: env(safe-area-inset-left);
    }


      .app-title {
        text-decoration: none;
        text-transform: uppercase;
      }

      mwc-icon {
        color: var(--mdc-theme-on-primary);
      }

      // grid layout with 3 rows: mwc-top-app-bar, mwc-linear-progress, .viewContent
      .appContent {
        min-height: 100%;
        display: grid;
        grid-template-rows: 65px 48px 1fr;
        grid-template-columns: 100%;
      }

      // page
      section {
        display: grid;
        grid-template-rows: 10px 1fr;
        grid-template-columns: 100%;
        color: var(--mdc-theme-primary);
        background-color: var(--mdc-theme-on-primary);
      }

      mwc-tab {
        background-color: #F0F0E3;
      }

      .about {
        padding: 8px;
        text-align: center;
        color: var(--mdc-theme-primary);
        font-size: 2em;
      }

      img {
        width: 100%;
      }

      .amenities {
        max-width: 432px;
        margin: 0 auto;
        padding: 8px;
        box-sizing: border-box;
        /* remove margin between inline-block nodes */
        font-size: 0;
      }

      li {
        display: inline-block;
        position: relative;
        width: calc(100% - 16px);
        min-height: 80px;
        margin: 8px;
        font-size: 14px;
        vertical-align: top;
        background: #fff;
        border-radius: 2px;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                    0 1px 5px 0 rgba(0, 0, 0, 0.12),
                    0 3px 1px -2px rgba(0, 0, 0, 0.2);
        list-style: none;
      }

      a {
        text-decoration: none;
      }
    `;
  }

  constructor() {
    super();
    this.amenityType = "restaurant";
    this.searchByLocationCenterLatitude = 47.04869;
    this.searchByLocationCenterLongitude = 8.30809;
    this.searchByLocationRadius = 1000;
    this.query = null;
    this.nodes = null;
    this.selectedNodeId = null;
    this._installRoutes();
  }

  render() {
    const {
      currentView,
      amenityType,
    } = this;
    // True to hide the menu button and show the back button.
    const showMenuBtn = currentView === 'home';
    return html`
      <mwc-drawer hasHeader type="modal" .open="${this.showDrawer}">
        <nav slot="title" @click="${() => this.showDrawer = false}">
          <div><a href="/">Home</a></div>
          <div><a href="/about">About</a></div>
          <div><a href="/bylocation">By Location</a></div>
          <div><a href="/byarea">By Area</a></div>
          <div><a href="/settings">Settings</a></div>
        </nav>
        <div slot="appContent">
          <mwc-top-app-bar-fixed centerTitle>
            <div slot="navigationIcon" ?hidden="${!showMenuBtn}">
                <mwc-icon-button @click="${() => this.showDrawer = true}" icon="menu"></mwc-icon-button>
            </div>
            <a slot="navigationIcon" ?hidden="${showMenuBtn}" href="/"><mwc-icon>arrow_back</mwc-icon></a>
            <div slot="title" class="app-title">${amenityType} finder</div>
            <div slot="actionItems" >
              <a href="/bylocation"><mwc-icon>my_location</mwc-icon></a>
            </div>
          </mwc-top-app-bar-fixed>
          <mwc-linear-progress .closed="${this.hasPendingChildren}"></mwc-linear-progress>
          <div class="viewContent">${this._renderCurrentView()}</div>
        </div>
      </mwc-drawer>
      <pwa-update-available></pwa-update-available>
    `;
  }

  _renderCurrentView() {
    switch(this.currentView) {
      case 'home':
        return html`
          <section>
            ${this.nodes
              ? html`
                  <div class="result">
                    <mwc-tab-bar>
                        <mwc-tab @click="${this.openMap}" label="${this.nodes.length} Results On Map" icon="map" stacked indicatorIcon="false"></mwc-tab>
                    </mwc-tab-bar>
                    <ul class="amenities" ?hidden="${!this.query}">
                      ${this.nodes.map(node => html`
                        <li>
                          <amenity-list-item .searchCenterLatitude="${this.searchByLocationCenterLatitude}" .searchCenterLongitude="${this.searchByLocationCenterLongitude}" .amenity="${node}" @select-amenity="${this.showAmenity}"></amenity-list-item>
                        </li>
                      `)}
                    </ul>
                  </div>`
              : html`
                  <mwc-tab-bar>
                      <mwc-tab @click="${this.searchByLocation}" label="by location" icon="my_location" data-mdc-ripple-is-unbounded stacked indicatorIcon="false"></mwc-tab>
                      <mwc-tab @click="${this.searchByArea}" label="by area" icon="place" stacked indicatorIcon="false"></mwc-tab>
                  </mwc-tab-bar>
                  <div class="about">Find your ${this.amenityType} by location or area</div>
                  <img src="./images/map.jpg"/>`
            }
          </section>`;
      case 'searchByLocation':
        return lazyLoad(import('./view-search-by-location/view-search-by-location.js'),
          html`<view-search-by-location @change-location="${this.updateByLocationCenter}" .centerLatitude="${this.searchByLocationCenterLatitude}" .centerLongitude="${this.searchByLocationCenterLongitude}" .radius="${this.searchByLocationRadius}"></view-search-by-location>`);
      case 'searchByArea':
        return lazyLoad(import('./view-search-by-area/view-search-by-area.js'),
          html`<view-search-by-area></view-search-by-area>`);
      case 'about':
        return lazyLoad(import('./view-about/view-about.js'),
          html`<view-about></view-about>`);
      case 'settings':
        return lazyLoad(import('./view-settings/view-settings.js'),
          html`<view-settings @change-amenity-type="${this.updateAmenityType}" .currentAmenityTypeValue="${this.amenityType}"></view-settings>`);
      case 'amenity':
        return lazyLoad(import('./view-amentiy/view-amenity.js'),
          html`<view-amenity .amenity="${this.getOrLoadNode(this.selectedNodeId)}" .searchCenterLatitude="${this.searchByLocationCenterLatitude}" .searchCenterLongitude="${this.searchByLocationCenterLongitude}"></view-amenity>`);
    }
  }

  // https://github.com/visionmedia/page.js/
  _installRoutes() {
    page('/', () => this.currentView = 'home');
    page('/bylocation', () => this.currentView = 'searchByLocation');
    page('/byarea', () => this.currentView = 'searchByArea');
    page('/about', () => this.currentView = 'about');
    page('/settings', () => this.currentView = 'settings');
    page('/amenity/:node_id', (ctx) => {
      this.selectedNodeId = ctx.params.node_id;
      this.currentView = 'amenity';
    });
    page('*', () => this.currentView = 'home');
    page();
  }

  searchByLocation() {
    page('/bylocation');
  }
  searchByArea() {
    page('/byarea');
  }
  openMap() {
    const url = `${overpassTurboApi}Q=(node%5B%22amenity%22%3D%22${this.amenityType}%22%5D(around%3A${this.searchByLocationRadius}%2C${this.searchByLocationCenterLatitude}%2C+${this.searchByLocationCenterLongitude})%3B%0A)%3B%0A(._%3B%3E%3B)%3B%0Aout%3B`;
    // const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_foot&route=${this.searchByLocationCenterLatitude},${this.searchByLocationCenterLongitude};${this.searchByLocationCenterLatitude},${this.searchByLocationCenterLongitude}`;
    window.open(url);
  }

  amenity() {
    page('/amenity');
  }

  updateByLocationCenter(e) {
    this.searchByLocationCenterLatitude = e.detail.latitude;
    this.searchByLocationCenterLongitude = e.detail.longitude;
    this.searchByLocationRadius = e.detail.radius;
    this.query = `${osmApi}data=%5Bout%3Ajson%5D%3B%0A(%0Anode%5B%22amenity%22%3D%22${this.amenityType}%22%5D(around%3A${this.searchByLocationRadius}%2C${this.searchByLocationCenterLatitude}%2C+${this.searchByLocationCenterLongitude})%3B%0A)%3B%0A(._%3B%3E%3B)%3B%0Aout%3B`;
    this.currentView = "home";
    this.fetchOpenStreetMapData();
  }

  async fetchOpenStreetMapData() {
    this.loading = true;
    const response = await fetch(this.query);
    const jsonResponse = await response.json();
    this.nodes = jsonResponse.elements;
    this.loading = false;
  }

  getOrLoadNode(nodeId) {
    return this.nodes.find(({id}) => id.toString() === nodeId);
  }

  updateAmenityType(e) {
    console.log(e.detail.amenityType);
    this.amenityType = e.detail.amenityType;
  }
}
customElements.define('amenity-finder', AmenityFinder);
