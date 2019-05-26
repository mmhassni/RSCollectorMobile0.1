import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {Events, NavController, NavParams, ToastController} from 'ionic-angular';
import {DynamiqueComponentService} from "../../services/DynamicComponentService";
import {AuthentificationProvider} from "../../providers/authentification/authentification";
import {Subscription} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MapLocationPage} from "../map-location/map-location";



@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

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

    if(this.navParams.data.nomTable){
      this.nomTable = this.navParams.data.nomTable;
    }

    if(this.informationsActuelles && (this.informationsActuelles as any).id){
      this.idEnregistrementGetRow = (this.informationsActuelles as any).id.toString();
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


    //Importation des nouvelles donnees relatives aux champs du formulaire
    this.parametresAuthentificationSubscription = this.authentificationProvider.parametresAuthentification$.subscribe(
      (objectImported : any) => {

        if(!this.parametresAuthentificationActuelles){

          this.parametresAuthentificationActuelles = objectImported;
          console.log(objectImported);

          if(objectImported && objectImported.success){

            let formData = new FormData();
            formData.append('action', "fields");
            formData.append('idSession', objectImported.data.idSession);
            formData.append('table', this.nomTable);
            formData.append('page', this.page);
            formData.append('start', this.start);
            formData.append('limit', this.limit);


            let headers = new HttpHeaders();
            headers = headers.set('Accept', "application/json, text/plain," + "*/*");

            //headers = headers.set('Origin', 'http://172.20.10.2:8081');


            this.httpClient.post("http://172.20.10.2:8081/WEBCORE/MainServlet",formData, {headers: headers})
              .subscribe(dataFields => {

                this.fichierJsonGetFields = dataFields;
                console.log(dataFields);


                console.log(this.parametresAuthentificationActuelles.data.idSession);
                if(this.action == "refcreer"){




                    this.action = "creer";

                    if(this.navParams.data.localGetRow){
                      let items = {};
                      items["id" + this.navParams.data.nomTableParent ] = this.navParams.data.localGetRow.id;
                      this.fichierJsonGetFields.items =  this.dynamiqueComponentService.bootstrapRowToForm(
                        {"item":
                          JSON.stringify(items)

                        },
                        this.fichierJsonGetFields);
                    }
                    this.chargerFormulaire();



                }
                else if(this.action == "refmodifier"){
                  this.action = "modifier";
                  this.bootstrapGetRowToForm();

                }
                else if(this.action == "creer" || this.idEnregistrementGetRow == ""){

                  if(this.navParams.data.localGetRow){
                    this.fichierJsonGetFields.items =  this.dynamiqueComponentService.bootstrapRowToForm(
                      {"item":this.navParams.data.localGetRow},
                      this.fichierJsonGetFields);
                  }
                  this.chargerFormulaire();

                }

                else{
                  this.bootstrapGetRowToForm();

                }





              });

          }

        }


      }
    );

    this.authentificationProvider.emit();




  }

  ngOnInit() {


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


    //headers = headers.set('Origin', 'http://172.20.10.2:8081');

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



    this.fichierJsonGetFields.items =  this.actualiserListeFields(this.viewContainerRef, this.fichierJsonGetFields);
    this.fichierJsonGetFields.fields = this.fichierJsonGetFields.items;

    this.dynamiqueComponentService.enregistrerInformationFormulaire(
      this.fichierJsonGetFields,
      this.action,
      this.nomTable,
      this.parametresAuthentificationActuelles.data.idSession)
      .subscribe( data => {

        console.log(data);

        if((data as any).msg == "Opération terminée avec succès"){

          let toast = this.toastCtrl.create({
            message: "Informations enregistrées",
            duration: 3000,
            position: 'top',
            cssClass: "toast-success"
          });

          toast.present();

        }
        else{
          let toast = this.toastCtrl.create({
            message: "Informations non enregistrées",
            duration: 3000,
            position: 'top',
            cssClass: "toast-echec"
          });

          toast.present();

        }

      });


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
