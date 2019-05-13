import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Subscription} from "rxjs";
import {DynamiqueComponentService} from "../../services/DynamicComponentService";
import {AuthentificationProvider} from "../../providers/authentification/authentification";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MapLocationPage} from "../map-location/map-location";

/**
 * Generated class for the GenericFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-generic-filter',
  templateUrl: 'generic-filter.html',
})
export class GenericFilterPage {


  public idEnregistrementGetRow = "";
  public nomTable = "";
  public page = "1";
  public start = "0";
  public limit = "25";



  @ViewChild('dynamic', {
    read: ViewContainerRef
  }) viewContainerRef: ViewContainerRef;

  public fichierJsonGetFields = null;
  public fichierJsonGetRow = null;
  public parametresAuthentificationSubscription : Subscription;
  public parametresAuthentificationActuelles = null;

  public pointTest = null;
  public informationsActuelles = null;
  public action = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public events: Events,
              public dynamiqueComponentService: DynamiqueComponentService,
              public authentificationProvider : AuthentificationProvider,
              public httpClient : HttpClient,
              public toastCtrl : ToastController) {


    //on recupere les informations du push
    this.informationsActuelles = this.navParams.data.informationsActuelles;
    this.action = this.navParams.data.action;

    if(this.informationsActuelles && (this.informationsActuelles as any).id){
      this.idEnregistrementGetRow = (this.informationsActuelles as any).id.toString();
    }

    if(this.navParams.data.nomTable){
      this.nomTable = this.navParams.data.nomTable;
    }

    this.events.subscribe('graphicActuel', graphicActuel => {
      console.log(graphicActuel);

      if (graphicActuel) {
        this.pointTest = {
          "latitude": (graphicActuel as any).geometry.latitude,
          "longitude": (graphicActuel as any).geometry.longitude
        };
      }
    });







  }

  ngOnInit() {

    //Importation des nouvelles donnees relatives aux champs du formulaire
    this.parametresAuthentificationSubscription = this.authentificationProvider.parametresAuthentification$.subscribe(
      (objectImported : any) => {

        if(!this.parametresAuthentificationActuelles){

          this.parametresAuthentificationActuelles = objectImported;
          console.log(objectImported);

          if(objectImported && objectImported.success){

            if(this.navParams.data.fichierJsonGetFields){

              this.fichierJsonGetFields =  this.navParams.data.fichierJsonGetFields;

              if(this.navParams.data.localGetRow){
                this.fichierJsonGetFields.items =  this.dynamiqueComponentService.bootstrapRowToForm(
                  {"item":this.navParams.data.localGetRow},
                  this.fichierJsonGetFields);
              }
              this.chargerFormulaire();

            }




          }

        }


      }
    );

    this.authentificationProvider.emit();


  }

  //permet de bootstraper le resultat d'une requete getRow
  bootstrapGetRowToForm(){

    //On recupere d'abord les donnes du get
    this.getRowRequest()
      .subscribe(dataFields => {
        this.fichierJsonGetRow = dataFields;
        console.log(dataFields);

        //il faut envoyer les element de notre formulaire actuel
        //et le resultat de la requete get row

        this.fichierJsonGetFields.items =  this.dynamiqueComponentService.bootstrapRowToForm(this.fichierJsonGetRow,this.fichierJsonGetFields);
        this.fichierJsonGetFields.fields = this.dynamiqueComponentService.bootstrapRowToForm(this.fichierJsonGetRow,this.fichierJsonGetFields);
        console.log(this.fichierJsonGetFields);

        this.chargerFormulaire();






      });


  }


  getRowRequest(){

    let headers = new HttpHeaders();
    headers = headers.set('Accept', "application/json, text/plain," + "*/*");


    //headers = headers.set('Origin', 'http://localhost:8081');

    let formData = new FormData();
    formData.append('action', "getRow");
    formData.append('table', this.nomTable);
    formData.append('filter', '{"simple_filter":"{\\"id\\":'+ this.idEnregistrementGetRow +'}"}');
    formData.append('idSession', this.parametresAuthentificationActuelles.data.idSession);

    return this.httpClient.post("http://172.20.10.2:8081/WEBCORE/MainServlet",formData, {headers: headers});

  }

  //permet de charger le formulaire vide
  chargerFormulaire() {

    //on fait reference au composant parent pour qu'il soit connu au niveau du service
    this.dynamiqueComponentService.addDynamicComponent(this.viewContainerRef, (this.fichierJsonGetFields as any),this.parametresAuthentificationActuelles.data.idSession);


  }

  ionViewDidEnter() {
    console.log(this.navParams.data);
  }

  actualiserListeFields(actualForm,actualFileds){
    return this.dynamiqueComponentService.refreshFormWithFormActualValue(actualForm,actualFileds);
  }

  recupererPointTest() {
    this.navCtrl.push(MapLocationPage);
  }


  enregistrerInformations() {

    let filtreFormulaire = {};
    for(let i = 0; i< (this.viewContainerRef as any)._embeddedViews.length; i++){

      filtreFormulaire[(this.viewContainerRef as any)._embeddedViews[i].nodes[1].instance["id"]] = (this.viewContainerRef as any)._embeddedViews[i].nodes[1].instance["value"];

    }
    this.events.publish('filtreFormulaire', filtreFormulaire);




  }

  actualiserFormulaire() {


    //on recupere les donne du get du serveur et on actualise les variables items et fields de l objet fichierJsonGetFields
    this.bootstrapGetRowToForm();

    //on ajoute les nouveau composant (tenant compte des nouvelles modifications) et on supprime les anciens
    this.chargerFormulaire();

    /*
    console.log(this.viewContainerRef._embeddedViews);
    this.actualiserListeFields(this.viewContainerRef, this.fichierJsonGetFields);
    */


  }
}
