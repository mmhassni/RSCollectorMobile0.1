import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AuthentificationProvider} from "../../providers/authentification/authentification";
import {Subscription} from "rxjs";
import {TabsPage} from "../tabs/tabs";
import {StockageProvider} from "../../providers/stockage/stockage";

/**
 * Generated class for the ChoixApplicationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-choix-application',
  templateUrl: 'choix-application.html',
})
export class ChoixApplicationPage {

  public parametresAuthentificationSubscription : Subscription;
  public parametresAuthentificationActuelles = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public stockageProvider : StockageProvider,
              public authentificationProvider : AuthentificationProvider) {

    console.log("hello");
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChoixApplicationPage');
  }

  choisirApplication(app){

    if(app == "enquetePoi"){
      this.authentificationProvider.changerApplication(2);

      this.stockageProvider.setValue("lastApplication",
        {"value":2});
    }
    if(app == "pageIncident"){

      this.stockageProvider.setValue("lastApplication",
        {"value":2});
      this.authentificationProvider.changerApplication(1);
    }
    this.navCtrl.setRoot(TabsPage);
  }

}
