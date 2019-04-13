import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {Events, NavController, NavParams} from 'ionic-angular';
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

  public idEnregistrementGetRow = "2";
  public nomTable = "incident";
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

  constructor(public navCtrl: NavController, public navParams: NavParams,public events: Events, public dynamiqueComponentService: DynamiqueComponentService, public authentificationProvider : AuthentificationProvider,public httpClient : HttpClient) {



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

          //headers = headers.set('Origin', 'http://localhost:8081');


          this.httpClient.post("http://172.20.10.2:8081/WEBCORE/MainServlet",formData, {headers: headers})
            .subscribe(dataFields => {

              this.fichierJsonGetFields = dataFields;
              console.log(dataFields);


              console.log(this.parametresAuthentificationActuelles.data.idSession);
              this.bootstrapGetRowToForm();
              this.chargerFormulaire();




            });

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
  chargerFormulaire(){

    //on fait reference au composant parent pour qu'il soit connu au niveau du service
    this.dynamiqueComponentService.addDynamicComponent(this.viewContainerRef,(this.fichierJsonGetFields as any));

  }

  ionViewDidEnter() {
    console.log(this.navParams.data);
  }

  recupererPointTest() {
    this.navCtrl.push(MapLocationPage);
  }


  enregistrerInformations() {

    this.bootstrapGetRowToForm();


  }

  actualiserFormulaire() {

    this.chargerFormulaire();

  }
}
