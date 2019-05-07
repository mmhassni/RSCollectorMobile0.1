import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Subscription} from "rxjs";
import {AuthentificationProvider} from "../../providers/authentification/authentification";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AboutPage} from "../about/about";

/**
 * Generated class for the ListeIncidentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-liste-incident',
  templateUrl: 'liste-incident.html',
})
export class ListeIncidentPage {


  public parametresAuthentificationSubscription : Subscription;
  public parametresAuthentificationActuelles = null;

  //les informations recuperees d'un push a partir d'une page precedente
  public informationsActuelles = {};


  public objetActuel = {};


  public nomTable = "declaration";
  public page = "1";
  public start = "0";
  public limit = "25";
  
  public fichierJsonGetRows = [];
  public fichierJsonGetRowsFiltre = [];
  public listeValeurFiltre = ["id","description"];

  constructor(public navCtrl: NavController, public navParams: NavParams,public events: Events, public authentificationProvider : AuthentificationProvider,public httpClient : HttpClient) {


    //Importation des donnees de connexion
    this.parametresAuthentificationSubscription = this.authentificationProvider.parametresAuthentification$.subscribe(
      (objectImported : any) => {
        this.parametresAuthentificationActuelles = objectImported;
        if(this.parametresAuthentificationActuelles && this.parametresAuthentificationActuelles.success){

          this.refresh();


        }
      }
    );
    this.authentificationProvider.emit();


  }

  ionViewDidEnter() {
    this.refresh();

  }


  refresh(){


    let formData = new FormData();
    formData.append('action', "getRows");
    formData.append('idSession', this.parametresAuthentificationActuelles.data.idSession);
    formData.append('table', this.nomTable);
    formData.append('page', this.page);
    formData.append('start', this.start);
    formData.append('limit', this.limit);


    let headers = new HttpHeaders();
    headers = headers.set('Accept', "application/json, text/plain," + "*/*");

    //headers = headers.set('Origin', 'http://localhost:8081');


    this.httpClient.post("http://172.20.10.2:8081/WEBCORE/MainServlet",formData, {headers: headers})
      .subscribe(dataFields => {

        (this.fichierJsonGetRows as any) = (dataFields as any).items;
        console.log(this.fichierJsonGetRows);
        this.fichierJsonGetRowsFiltre = this.fichierJsonGetRows;






      });

  }

  getItems(ev) {
    // Reset items back to all of the items
    this.fichierJsonGetRowsFiltre = this.fichierJsonGetRows;

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.fichierJsonGetRowsFiltre = this.fichierJsonGetRowsFiltre.filter((item) => {
        let requeteFiltre = "";
        for(let i = 0 ; i < this.listeValeurFiltre.length ; i++){
          if(item[this.listeValeurFiltre[i]] != undefined){
            requeteFiltre = requeteFiltre + " " + item[this.listeValeurFiltre[i]];
          }
        }
        console.log(requeteFiltre);
        return ( requeteFiltre.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }


  ajouterItem() {



  }

  detailItemTapped($event, item) {




    
  }

  itemTapped($event, item) {

    let navOptions = {
      animation: 'ios-transition',
      duration: 1000
    };

    this.navCtrl.push(
      AboutPage,
      {
      informationsActuelles: item,
      action: "modifier"
      },
      navOptions
        );

  }
}
