import { Component } from '@angular/core';

import { ContactPage } from '../contact/contact';
import {MapLocationPage} from "../map-location/map-location";
import {ListeIncidentPage} from "../liste-incident/liste-incident";
import {ListeIncidentEncoursPage} from "../liste-incident-encours/liste-incident-encours";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ListeIncidentEncoursPage;
  tab2Root = ListeIncidentPage;
  tab3Root = ContactPage;
  tab4Root = MapLocationPage;

  constructor() {

  }
}
