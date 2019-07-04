import {Component, ElementRef, ViewChild} from '@angular/core';
import {Events, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import { loadModules } from 'esri-loader';
import { Geolocation } from '@ionic-native/geolocation';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Subscription} from "rxjs";
import {AuthentificationProvider} from "../../providers/authentification/authentification";
import * as wellknow from 'wellknown';



/**
 * Generated class for the MapLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map-location',
  templateUrl: 'map-location.html',
})
export class MapLocationPage {

  @ViewChild('map') mapEl: ElementRef;
  public currentLong = 0;
  public currentLat = 0;
  public erreur = 0;

  public static graphicActuel = null;
  public static popedGraphicActuel = null;

  public listeCoucheTitreDA = [];
  public action = "";

  public parametresAuthentificationSubscription : Subscription;
  public parametresAuthentificationActuelles = null;

  public status = {
    1: "Déclaré",
    2: "Traité",
    3: "Rejeté",
    4: "Cloturé",
  };

  constructor(public navCtrl: NavController,public authentificationProvider : AuthentificationProvider,public events: Events, public httpClient: HttpClient, public navParams: NavParams,public platform: Platform, private geolocation: Geolocation) {


    if(this.navParams.data && this.navParams.data.action == "getLocation"){
      this.action = "getLocation";
    }

    //Importation des nouvelles donnees relatives aux champs du formulaire
    this.parametresAuthentificationSubscription = this.authentificationProvider.parametresAuthentification$.subscribe(
      (objectImported : any) => {
        this.parametresAuthentificationActuelles = objectImported;
        console.log(objectImported);
        if(objectImported && objectImported.success) {


          this.getGeo();

        }

      });

    this.authentificationProvider.emit();






    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
      try{

        this.erreur = data.coords.accuracy;
        this.currentLong=data.coords.longitude;
        this.currentLat=data.coords.latitude;

      }
      catch (exception)
      {

      }

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapLocationPage');
  }

  async  getGeo() {

    // Reference: https://ionicframework.com/docs/api/platform/Platform/#ready
    await this.platform.ready();


    // Load the ArcGIS API for JavaScript modules
    const [
      //Legend, TextSymbol, Font,
      //mathUtils,
      webMercatorUtils, Point, Color, geometryJsonUtils, Map, MapView,Locate, Graphic,SimpleFillSymbol,SimpleLineSymbol
    ]:any = await loadModules([
      //"esri/widgets/Legend",
      //"esri/symbols/TextSymbol",
      //"esri/symbols/Font",
      //"esri/geometry/mathUtils",
      "esri/geometry/support/webMercatorUtils",
      "esri/geometry/Point",
      'esri/Color',
      'esri/geometry/support/jsonUtils',
      'esri/Map',
      'esri/views/MapView',
      'esri/widgets/Locate',
      "esri/Graphic",

      "esri/symbols/SimpleFillSymbol",
      "esri/symbols/SimpleLineSymbol"
    ])
      .catch(err => {
        console.error("ArcGIS: ", err);
      });


    let map = new Map({
      basemap: 'hybrid'
    });




    let symbol = {
      type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
      color: [255, 0, 255],
      outline: { // autocasts as new SimpleLineSymbol()
        color: [255, 255, 255],
        width: 1
      }
    };


    let mapView;
    if((this.navParams as any).data.x && (this.navParams as any).data.y){

      mapView = new MapView({
        // create the map view at the DOM element in this component
        container: this.mapEl.nativeElement,
        center: [(this.navParams as any).data.x, (this.navParams as any).data.y],
        zoom: 20
      });

      mapView.map = map;

      let point = new Point({
        longitude: (this.navParams as any).data.x,
        latitude: (this.navParams as any).data.y
      });

      let graphicActuel = new Graphic(point, symbol);

      MapLocationPage.graphicActuel = graphicActuel;
      mapView.graphics.add(graphicActuel);

      mapView.goTo(point);

    }else{
      mapView = new MapView({
        // create the map view at the DOM element in this component
        container: this.mapEl.nativeElement,
        //center: [this.currentLong, this.currentLat],
        center: [-6.358620, 32.335308],
        zoom: 10
      });

      mapView.map = map;
    }




    let headers = new HttpHeaders();
    headers = headers.set('Accept', "application/json, text/plain," + "*/*");


    //headers = headers.set('Origin', 'http://172.20.10.2:8081');

    let formData = new FormData();
    formData.append('action', "getRows");
    formData.append('idSession', this.parametresAuthentificationActuelles.data.idSession);
    formData.append('table', "communegeom");
    formData.append('page', "1");
    formData.append('start', "0");
    formData.append('limit', "-1");

    let filter = '{"advanced_filter":"{\\"query\\":\\"';
    filter = filter + "f[" + "objectid" + "] in ( ";
    for(let i = 0 ; i < this.parametresAuthentificationActuelles["affectationsecteur"].items.length ; i++){

      filter = filter  + "" + this.parametresAuthentificationActuelles["affectationsecteur"].items[i].idsecteur + "," ;

    }

    filter = filter.substring(0,filter.length -1);
    filter = filter + ")";


    //filter = filter.substring(0,filter.length -3);
    filter = filter + '\\"}"}';
    formData.append('filter', filter);


    this.httpClient.post(
      "http://172.20.10.2:8081/WEBCORE/MainServlet",
      formData,
      {headers: headers}
    )
      .subscribe( data => {

        console.log(data);

        let coucheActuel = (data as any).items;

        let symobologiePolygon =  new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color([255,255,255]),0.5), new Color([155,255,100,0.10]));

        for(let i = 0; i< coucheActuel.length;i++){

          //let jsontext = this.polygonJsonToTerraformer(coucheActuel[i].shape);

          let jsontext = wellknow.parse(coucheActuel[i].geojson).coordinates[0];



          let pointGraphic = new Graphic({
            geometry: geometryJsonUtils.fromJSON( {"rings":jsontext} ),
            symbol: symobologiePolygon


          });



          mapView.graphics.add( pointGraphic );

          /*
          //Add district name to map
          let schFont = new Font("14pt",
            Font.STYLE_NORMAL,
            Font.VARIANT_NORMAL,
            Font.WEIGHT_BOLD, "Arial");

          let schTextSymbol = new TextSymbol("ffffeegege");
          //(schTextSymbol as any).setColor(new Color([255, 0, 0]));
//
          //(schTextSymbol as any).setAlign(TextSymbol.ALIGN_MIDDLE);
          //(schTextSymbol as any).setFont(schFont);

          let pt;
          pt = pointGraphic.geometry.extent.center;

          let gra = new Graphic(pt, schTextSymbol);

          mapView.graphics.add(gra);

          */


          /*
          console.log((Terraformer as any).WKT.parse('LINESTRING (30 10, 10 30, 40 40)'));
          console.log((Terraformer as any).WKT.parse(this.listeCoucheTitreDA[i].shape));

          (Terraformer as any).ArcGIS.convert({
            type:"polygon",


          })
          */
        }



      });

    headers = new HttpHeaders();
    headers = headers.set('Accept', "application/json, text/plain," + "*/*");


    //headers = headers.set('Origin', 'http://172.20.10.2:8081');

    formData = new FormData();
    formData.append('action', "getRows");
    formData.append('idSession', this.parametresAuthentificationActuelles.data.idSession);
    formData.append('table', "declaration");
    formData.append('page', "1");
    formData.append('start', "0");
    formData.append('limit', "-1");

    filter = '{"advanced_filter":"{\\"query\\":\\"';
    for(let i = 0 ; i < this.parametresAuthentificationActuelles["affectationsecteur"].items.length ; i++){
      filter = filter + "f[" + "idsecteur" + "] = " + this.parametresAuthentificationActuelles["affectationsecteur"].items[i].idsecteur + " or ";
    }
    filter = filter.substring(0,filter.length -3);
    filter = filter + '\\"}"}';

    formData.append('filter', filter);

    this.httpClient.post("http://172.20.10.2:8081/WEBCORE/MainServlet",
      formData,
      {headers: headers}).subscribe( data => {


      let coucheActuel = (data as any).items;



      let symbolPointCentroides;
      symbolPointCentroides = {
        type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
        size: 12,
        color: [255, 255, 0],
        outline: { // autocasts as new SimpleLineSymbol()
          color: [255, 255, 255],
          width: 0
        }
      };

      for(let i = 0; i< coucheActuel.length;i++){

        if(coucheActuel[i]["idstatut"] == 1){

          symbolPointCentroides = {
            type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
            size: 12,
            color: [99, 190, 196],
            outline: { // autocasts as new SimpleLineSymbol()
              color: [255, 255, 255],
              width: 0
            }
          };

          symbolPointCentroides = {
            type: 'picture-marker',  // autocasts as new PictureMarkerSymbol()
            url: 'http://172.20.10.2:8100/assets/imgs/1.png',
            width: '18px',
            height: '18px'

          };

        }
        if(coucheActuel[i]["idstatut"] == 2){

          symbolPointCentroides = {
            type: 'picture-marker',  // autocasts as new PictureMarkerSymbol()
            url: 'http://172.20.10.2:8100/assets/imgs/2.png',
            width: '18px',
            height: '18px'

          };

        }
        if(coucheActuel[i]["idstatut"] == 3){

          symbolPointCentroides = {
            type: 'picture-marker',  // autocasts as new PictureMarkerSymbol()
            url: 'http://localhost:8100/assets/imgs/3.png',
            width: '18px',
            height: '18px'

          };

        }
        if(coucheActuel[i]["idstatut"] == 4){

          symbolPointCentroides = {
            type: 'picture-marker',  // autocasts as new PictureMarkerSymbol()
            url: 'http://172.20.10.2:8100/assets/imgs/4.png',
            width: '18px',
            height: '18px'

          };

        }
        if(coucheActuel[i]["idstatut"] == 5){

          symbolPointCentroides = {
            type: 'picture-marker',  // autocasts as new PictureMarkerSymbol()
            url: 'http://172.20.10.2:8100/assets/imgs/5.png',
            width: '18px',
            height: '18px'

          };

        }





        let pointGraphic = new Graphic({
          geometry: {
            type: 'point', // autocasts as new Point()
            longitude: coucheActuel[i].x,
            latitude: coucheActuel[i].y
          },
          symbol: symbolPointCentroides
          ,
          attributes: {
              statut : this.status[coucheActuel[i]["idstatut"]],
              date : this.toDate(coucheActuel[i]["date_add"],""),
              description : coucheActuel[i]["description"]
          },
          popupTemplate: {
            title: "<h3>{statut}</h3>" +
              "<p>Date : {date}</p>" +
              "<p>Déscription : {statut}</p>"
            /*
            ,
            content:
              "<p>Superficie : {Superficie}</p>" +
              "<p>Contenance : {Contenance}</p>"

            */

          }


        });




        mapView.graphics.add( pointGraphic );


        /*
        console.log((Terraformer as any).WKT.parse('LINESTRING (30 10, 10 30, 40 40)'));
        console.log((Terraformer as any).WKT.parse(this.listeCoucheTitreDA[i].shape));

        (Terraformer as any).ArcGIS.convert({
          type:"polygon",


        })
        */
      }

    });




    let z = document.createElement('ion-icon'); // is a node
    console.log(z);
    console.log(document);
    z.setAttribute("name", "refresh")
    //z.innerHTML = 'test satu dua tiga';

    mapView.ui.add([
        {
        component: z,
        position: "bottom-left"
      }
    ]);



    mapView.on("click", function addElementToGraphic(evt){
      console.log(evt);
      console.log(mapView.graphics);

      if(MapLocationPage.graphicActuel){
        mapView.graphics.remove(MapLocationPage.graphicActuel);
      }

      let graphicActuel = new Graphic(evt.mapPoint, symbol);

      MapLocationPage.graphicActuel = graphicActuel;
      mapView.graphics.add(graphicActuel);
      console.log("X: " + evt.mapPoint.longitude.toString() + ", <br>Y: " + evt.mapPoint.latitude.toString());


      console.log(mapView.graphics);

      let pointRef = new Point(evt.mapPoint.longitude, evt.mapPoint.latitude);
      let pointRefWeb = webMercatorUtils.geographicToWebMercator(pointRef);

      let distMin ;
      let pointMin ;
      let pointActuelTempWeb;
      for(let i=0; i<mapView.graphics.items.length ; i++ ){

        if(mapView.graphics.items[i].geometry.__proto__.declaredClass == "esri.geometry.Point"){

          let pointActuelTemp = new Point(mapView.graphics.items[i].geometry.x, mapView.graphics.items[i].geometry.y);
          pointActuelTempWeb = webMercatorUtils.geographicToWebMercator(pointActuelTemp);

          if(distMin){

            if(((pointActuelTempWeb.x-pointRefWeb.x)**2 + (pointActuelTempWeb.y-pointRefWeb.y)**2 ) ** 0.5  < distMin){

              distMin = ((pointActuelTempWeb.x-pointRefWeb.x)**2 + (pointActuelTempWeb.y-pointRefWeb.y)**2 ) ** 0.5;
              pointMin = pointActuelTemp;

            }


          }else{
            distMin = ((pointActuelTempWeb.x-pointRefWeb.x)**2 + (pointActuelTempWeb.y-pointRefWeb.y)**2 ) ** 0.5;
            pointMin = pointActuelTemp;

          }


        }



      }

      console.log("distance min" , distMin);
      console.log("echel" , mapView.scale);

      if(distMin && mapView.scale/distMin >= 400){

        graphicActuel.geometry = {
          type: 'point', // autocasts as new Point()
          longitude: pointMin.x,
          latitude: pointMin.y
        };

        mapView.graphics.add(graphicActuel);


      }else{


        mapView.graphics.add(graphicActuel);



      }

    });


    let locateBtn = new Locate({
      view: mapView
    });

    // Add the locate widget to the top left corner of the view
    mapView.ui.add(locateBtn, {
      position: "top-left"
    });




  }


  popPosition() {
    MapLocationPage.popedGraphicActuel = MapLocationPage.graphicActuel;
    this.events.publish('graphicActuel', MapLocationPage.popedGraphicActuel);
    this.navCtrl.pop();
  }

  toDate(value,format){

    let dateRetour = null;

    if(value){
      let dateInput = new Date(value);
      if(format == ""){
        //dateRetour = dateInput.toISOString().substring(0,10)+" "+ dateInput.toISOString().substring(11,19);
        dateRetour = dateInput.toISOString().substring(0,10);

      }
    }


    return dateRetour;

  }


}
