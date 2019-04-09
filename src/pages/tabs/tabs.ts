import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import {MapLocationPage} from "../map-location/map-location";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = AboutPage;
  tab2Root = HomePage;
  tab3Root = ContactPage;
  tab4Root = MapLocationPage;

  constructor() {

  }
}
