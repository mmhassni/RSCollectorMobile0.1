import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {AuthentificationPage} from "../pages/authentification/authentification";
import {HomePage} from "../pages/home/home";
import {Subscription} from "rxjs";
import {AuthentificationProvider} from "../providers/authentification/authentification";
import {StockageProvider} from "../providers/stockage/stockage";
import {TabsPage} from "../pages/tabs/tabs";
import {Pro} from "@ionic/pro";

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
  public pageIncident = {component : TabsPage};

  public progressBar = 0;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authentificationProvider : AuthentificationProvider,public stockageProvider : StockageProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      try{

        Pro.deploy.configure({channel: 'Production',updateMethod:"auto"}).then( onsucces => {

          this.getVersionInfo();

          this.checkChannel();

          this.performManualUpdate();

        })

      }
      catch (err) {
      // We encountered an error.
      // Here's how we would log it to Ionic Pro Monitoring while also catching:

      // Pro.monitoring.exception(err);
      }




    });

    this.pages = [


      { title: 'Reference Spatiale', component: HomePage }

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

  async getVersionInfo(){
    //const versionInfo = await Pro.deploy.getCurrentVersion();
  }

  async checkChannel() {
    try {
      //const res = await Pro.deploy.getConfiguration();
    } catch (err) {
      // We encountered an error.
      // Here's how we would log it to Ionic Pro Monitoring while also catching:

      // Pro.monitoring.exception(err);
    }
  }

  async performManualUpdate() {

    /*
      Here we are going through each manual step of the update process:
      Check, Download, Extract, and Redirect.

      Ex: Check, Download, Extract when a user logs into your app,
        but Redirect when they logout for an app that is always running
        but used with multiple users (like at a doctors office).
    */

    try {
      const update = await Pro.deploy.checkForUpdate();

      await Pro.deploy.downloadUpdate((progress) => {this.progressBar = progress;});
      await Pro.deploy.extractUpdate();
      await Pro.deploy.reloadApp();

      if (update.available){
        alert("MAJ Effectué");

      }
      else{
      }




    } catch (err) {
      // We encountered an error.
      // Here's how we would log it to Ionic Pro Monitoring while also catching:
      alert(JSON.stringify(err));

      // Pro.monitoring.exception(err);
    }

  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  deconnexion(){
    this.stockageProvider.setValue("identifiants",{"login":"","mdp":""});
    this.authentificationProvider.update(null);
    this.nav.setRoot(AuthentificationPage);


  }
}
