import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Subscription} from "rxjs";
import {AuthentificationProvider} from "../../providers/authentification/authentification";
import {StockageProvider} from "../../providers/stockage/stockage";
import {TabsPage} from "../tabs/tabs";



/**
 * Generated class for the AuthentificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-authentification',
  templateUrl: 'authentification.html',
})
export class AuthentificationPage {


  public parametresAuthentificationSubscription : Subscription;
  public parametresAuthentificationActuelles = null;

  public login='';
  public mdp='';


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              public authentificationProvider : AuthentificationProvider,
              public stockageProvider : StockageProvider) {




    //Importation des nouvelles donnees relatives aux champs du formulaire
    this.parametresAuthentificationSubscription = this.authentificationProvider.parametresAuthentification$.subscribe(
      (objectImported : any) => {
        this.parametresAuthentificationActuelles = objectImported;
        console.log(objectImported);
        if(objectImported && objectImported.success) {

          this.stockageProvider.setValue("identifiants",{"login":this.login,"mdp":this.mdp});
          this.navCtrl.push(TabsPage);
          this.parametresAuthentificationSubscription.unsubscribe();


        }
      }
    );


    this.stockageProvider.storage.get("identifiants").then((val) => {

      this.login = val.login;
      this.mdp = val.mdp;
      this.seConnecter();

    }).catch((error) => {
      console.log('get error for ' + "identifiant" + '', error);
    });







  }


  seConnecter() {

    this.authentificationProvider.nouvelleConnexion(this.login,this.mdp);

  }

  ionViewWillLeave(){

    this.parametresAuthentificationSubscription.unsubscribe();


  }


}
