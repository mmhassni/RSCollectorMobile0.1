import {Component, ViewChild} from '@angular/core';
import {Events, Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {AuthentificationPage} from "../pages/authentification/authentification";
import {HomePage} from "../pages/home/home";
import {Subscription} from "rxjs";
import {AuthentificationProvider} from "../providers/authentification/authentification";
import {StockageProvider} from "../providers/stockage/stockage";
import {ListeIncidentPage} from "../pages/liste-incident/liste-incident";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage:any = AuthentificationPage;

  // used for an example of ngFor and navigation
  pages: Array<{title: string, component: any}>;

  public parametresAuthentificationSubscription : Subscription;
  public parametresAuthentificationActuelles = null;
  public pageIncident = ListeIncidentPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authentificationProvider : AuthentificationProvider,public stockageProvider : StockageProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.pages = [


      { title: 'Utilisateurs', component: HomePage }

    ];

    //Importation des donnees de connexion
    this.parametresAuthentificationSubscription = this.authentificationProvider.parametresAuthentification$.subscribe(
      (objectImported : any) => {
        this.parametresAuthentificationActuelles = objectImported;
        if(this.parametresAuthentificationActuelles && this.parametresAuthentificationActuelles.success){


        }
      }
    );


  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  deconnexion() {

    this.stockageProvider.setValue("identifiants",{"login":"","mdp":""});
    this.authentificationProvider.update(null);
    this.nav.setRoot(AuthentificationPage);


  }
}
