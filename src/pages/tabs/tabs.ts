import { Component } from '@angular/core';

import {MapLocationPage} from "../map-location/map-location";
import {ListeIncidentPage} from "../liste-incident/liste-incident";
import {ListeIncidentEncoursPage} from "../liste-incident-encours/liste-incident-encours";
import {ListeEnquetePoiPage} from "../liste-enquete-poi/liste-enquete-poi";
import {AuthentificationProvider} from "../../providers/authentification/authentification";
import {Subscription} from "rxjs";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ListeIncidentEncoursPage;
  tab2Root = ListeIncidentPage;
  tab3Root = ListeEnquetePoiPage;
  tab4Root = MapLocationPage;



  public parametresAuthentificationSubscription : Subscription;
  public parametresAuthentificationActuelles = null;

  constructor(public authentificationProvider : AuthentificationProvider) {

    //Importation des donnees de connexion
    this.parametresAuthentificationSubscription = this.authentificationProvider.parametresAuthentification$.subscribe(
      (objectImported : any) => {
        this.parametresAuthentificationActuelles = objectImported;
        if(this.parametresAuthentificationActuelles && this.parametresAuthentificationActuelles.success){



        }
      }
    );
    this.authentificationProvider.emit();


  }
}
