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

  public name = 'from Angular';

  @ViewChild('dynamic', {
    read: ViewContainerRef
  }) viewContainerRef: ViewContainerRef;

  public fichierJson = [];
  public parametresAuthentificationSubscription : Subscription;
  public parametresAuthentificationActuelles = null;

  public pointTest = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,public events: Events, public dynamiqueComponentService: DynamiqueComponentService, public authentificationProvider : AuthentificationProvider,public httpClient : HttpClient) {

    this.authentificationProvider.emit();


    this.events.subscribe('graphicActuel', graphicActuel => {
      console.log(graphicActuel);

      if (graphicActuel) {
        this.pointTest = {
          "latitude": (graphicActuel as any).geometry.latitude,
          "longitude": (graphicActuel as any).geometry.longitude
        };
      }
    });


    this.parametresAuthentificationSubscription = this.authentificationProvider.parametresAuthentification$.subscribe(

      (objectImported : any) => {
        this.parametresAuthentificationActuelles = objectImported;
        console.log(objectImported);

        if(objectImported && objectImported.success){

          let formData = new FormData();
          formData.append('action', "fields");
          formData.append('idSession', objectImported.idSession);
          formData.append('table', "incident");
          formData.append('page', "1");
          formData.append('start', "0");
          formData.append('limit', "25");


          let headers = new HttpHeaders();
          headers = headers.set('Access-Control-Allow-Origin', '*');
          headers = headers.set('enctype', 'multipart/form-data');
          //headers = headers.set('Origin', 'http://localhost:8081');


          this.httpClient.post("http://172.20.10.2:8081/WEBCORE/MainServlet",formData, {headers: headers})
            .subscribe(dataFields => {

              console.log(dataFields);
              this.chargerFormulaire(dataFields);





            });

        }

      }

    );



  }

  ngOnInit() {


  }

  chargerFormulaire(dataFields){

    this.dynamiqueComponentService.setRootViewContainerRef(this.viewContainerRef);

    for(let i=0; i< (dataFields as any).fields.length ; i++){

      this.dynamiqueComponentService.addDynamicComponent((dataFields as any).fields[i]);

    }

  }

  ionViewDidEnter() {
    console.log(this.navParams.data);
  }

  recupererPointTest() {
    this.navCtrl.push(MapLocationPage);
  }
}
