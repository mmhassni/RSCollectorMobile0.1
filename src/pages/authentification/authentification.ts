import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {Subscription} from "rxjs";
import {AuthentificationProvider} from "../../providers/authentification/authentification";
import {StockageProvider} from "../../providers/stockage/stockage";
import {TabsPage} from "../tabs/tabs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ChoixApplicationPage} from "../choix-application/choix-application";



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

  public nom = "";
  public prenom = "";
  public role = "";
  public lastApplication: number;



  constructor(public platform: Platform,
              public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              public authentificationProvider : AuthentificationProvider,
              public stockageProvider : StockageProvider,
              public httpClient: HttpClient) {






    //Importation des nouvelles donnees relatives aux champs du formulaire
    this.parametresAuthentificationSubscription = this.authentificationProvider.parametresAuthentification$.subscribe(
      (objectImported : any) => {
        this.parametresAuthentificationActuelles = objectImported;
        console.log(objectImported);
        if(objectImported && objectImported.success) {

          this.nom = this.parametresAuthentificationActuelles.data.nom;
          this.prenom = this.parametresAuthentificationActuelles.data.prenom;

          this.stockageProvider.setValue("identifiants",
            {"login":this.login,
              "mdp":this.mdp});


          let headers = new HttpHeaders();
          headers = headers.set('Accept', "application/json, text/plain," + "*/*");


          //headers = headers.set('Origin', 'http://172.20.10.2:8081');

          let formData = new FormData();
          formData.append('action', "getRows");
          formData.append('idSession', this.parametresAuthentificationActuelles.data.idSession);
          formData.append('table', "affectationsecteur");
          formData.append('page', "1");
          formData.append('start', "0");
          formData.append('limit', "-1");
          if(this.parametresAuthentificationActuelles && this.parametresAuthentificationActuelles.data["role"] != "0"){
            formData.append('filter ', '{"simple_filter":"{\\"loginutilisateur\\":\\"' + this.parametresAuthentificationActuelles.data.login + '\\"}"}');

          }



          this.httpClient.post(
            "http://172.20.10.2:8081/WEBCORE/MainServlet",
            formData,
            {headers: headers}
            )
            .subscribe( data => {

              console.log(data);

              this.parametresAuthentificationActuelles["affectationsecteur"] = data;
              this.parametresAuthentificationActuelles["eteindrenotification"] = true;


              this.stockageProvider.storage.get("lastApplication").then((val) => {

                if(val){

                  this.lastApplication = val.value;
                  this.parametresAuthentificationActuelles['lastApplication'] = val.value;

                  this.authentificationProvider.update(this.parametresAuthentificationActuelles);


                  if(!this.parametresAuthentificationActuelles['lastApplication']){
                    this.navCtrl.setRoot(ChoixApplicationPage);

                  }else{
                    this.navCtrl.setRoot(TabsPage);

                  }

                }else{
                  this.navCtrl.setRoot(ChoixApplicationPage);

                }




              }).catch((error) => {
                this.navCtrl.setRoot(ChoixApplicationPage);

                console.log('get error for ' + "identifiant" + '', error);
              });





            });

          this.parametresAuthentificationSubscription.unsubscribe();





        }
      }
    );


    this.stockageProvider.storage.get("identifiants").then((val) => {

      this.login = val.login;
      this.mdp = val.mdp;
      this.lastApplication = val.lastapplication;
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
