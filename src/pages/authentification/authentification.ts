import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {Subscription} from "rxjs";
import {AuthentificationProvider} from "../../providers/authentification/authentification";
import {StockageProvider} from "../../providers/stockage/stockage";
import {TabsPage} from "../tabs/tabs";
import {CodePush, SyncStatus} from "@ionic-native/code-push/ngx";



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


  constructor(public platform: Platform,
              public codePush : CodePush,
              public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              public authentificationProvider : AuthentificationProvider,
              public stockageProvider : StockageProvider) {


    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      alert("test");

      this.codePush.sync({}, (progress) => {

        alert("progress" + progress);

      }).subscribe( (status) => {
        alert("youpiii");

        if(status == SyncStatus.CHECKING_FOR_UPDATE){
          alert("checking for uodate");
        }
        if(status == SyncStatus.DOWNLOADING_PACKAGE){
          alert("checking for uodate");
        }
        if(status == SyncStatus.IN_PROGRESS){
          alert("checking for uodate");
        }
        if(status == SyncStatus.INSTALLING_UPDATE){
          alert("checking for uodate");
        }
        if(status == SyncStatus.UP_TO_DATE){
          alert("checking for uodate");
        }
        if(status == SyncStatus.UPDATE_INSTALLED){
          alert("checking for uodate");
        }
        if(status == SyncStatus.ERROR){
          alert("checking for uodate");
        }

      });

    });



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
