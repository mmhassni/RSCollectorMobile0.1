import { Component } from '@angular/core';

import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import {MapLocationPage} from "../map-location/map-location";
import {ListeIncidentPage} from "../liste-incident/liste-incident";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ListeIncidentPage;
  tab2Root = HomePage;
  tab3Root = ContactPage;
  tab4Root = MapLocationPage;

  constructor() {

  }
}
