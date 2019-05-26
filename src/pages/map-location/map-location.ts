import {Component, ElementRef, ViewChild} from '@angular/core';
import {Events, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import { loadModules } from 'esri-loader';
import { Geolocation } from '@ionic-native/geolocation';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TabsPage} from "../tabs/tabs";
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
    const [ TextSymbol, Font, Point, Color, geometryJsonUtils, Map, MapView,Locate, Graphic,SimpleFillSymbol,SimpleLineSymbol
    ]:any = await loadModules([
      "esri/symbols/TextSymbol",
      "esri/symbols/Font",
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
        zoom: 16
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
        center: [-5.1495, 33.80804],
        zoom: 16
      });

      mapView.map = map;
    }


    let headers = new HttpHeaders();
    headers = headers.set('Accept', "application/json, text/plain," + "*/*");


    //headers = headers.set('Origin', 'http://172.20.10.2:8081');

    let formData = new FormData();
    formData.append('action', "getRows");
    formData.append('idSession', this.parametresAuthentificationActuelles.data.idSession);
    formData.append('table', "commune");
    formData.append('page', "1");
    formData.append('start', "0");
    formData.append('limit', "-1");

    let filter = '{"advanced_filter":"{\\"query\\":\\"';
    for(let i = 0 ; i < this.parametresAuthentificationActuelles["affectationsecteur"].items.length ; i++){

      filter = filter + "f[" + "objectid" + "] = " + this.parametresAuthentificationActuelles["affectationsecteur"].items[i].idsecteur + " or ";

    }
    filter = filter.substring(0,filter.length -3);
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



      let symbolPointCentroides = {
        type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
        size: 12,
        color: [255, 255, 0],
        outline: { // autocasts as new SimpleLineSymbol()
          color: [255, 255, 255],
          width: 0
        }
      };

      for(let i = 0; i< coucheActuel.length;i++){





        let pointGraphic = new Graphic({
          geometry: {
            type: 'point', // autocasts as new Point()
            longitude: coucheActuel[i].x,
            latitude: coucheActuel[i].y
          },
          symbol: symbolPointCentroides
          ,
          attributes: {

          },
          popupTemplate: {
            title: "<h3>{Traité}</h3>" +
              "<p>Date : 2019-09-25</p>" +
              "<p>Ordre : {Ordre}</p>" +
              "<p>Observation : En attente de la validation</p>"
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


    //ajout de la couche des titres DA
    this.httpClient.get("http://ec2-52-47-166-154.eu-west-3.compute.amazonaws.com:9091/requestAny/" +
      "select%20%20id,collectivi,ordre," + '"vocation p"' + ",superficie,%20St_astext(shape)%20as%20shape%20" +
      "from%20occupirr").subscribe( data => {

      let coucheActuel = (data as any).features;

      let symobologiePolygon =  new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
          new Color([255,255,255]),0.5), new Color([155,255,100,0.10]));

      for(let i = 0; i< coucheActuel.length;i++){

        //let jsontext = this.polygonJsonToTerraformer(coucheActuel[i].shape);

        let jsontext = wellknow.parse(coucheActuel[i].shape).coordinates[0];



        let pointGraphic = new Graphic({
          geometry: geometryJsonUtils.fromJSON( {"rings":jsontext} ),
          symbol: symobologiePolygon
          ,
          attributes: {
            Proprietaire: (coucheActuel[i] as any).collectivi,
            Superficie: (coucheActuel[i] as any).superficie,
            Ordre: (coucheActuel[i] as any).ordre,
            Contenance: (coucheActuel[i] as any)["vocation p"]
          },
          popupTemplate: {
            title: "<h3>{Proprietaire}</h3>" +
              "<p>Superficie : {Superficie}</p>" +
              "<p>Ordre : {Ordre}</p>" +
              "<p>Contenance : {Contenance}</p>"
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

    //ajout de la couche des titres DA
    this.httpClient.get("http://ec2-52-47-166-154.eu-west-3.compute.amazonaws.com:9091/requestAny/" +
      "select%20%20id,%20St_astext(shape)%20as%20shape%20" +
      "from%20titredademo").subscribe( data => {

      let coucheActuel = (data as any).features;

      let symobologiePolygon =  new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,255,0]),1),
        new Color([155,255,100,0]));

      for(let i = 0; i< coucheActuel.length;i++){

        //let jsontext = this.polygonJsonToTerraformer(coucheActuel[i].shape);
        let jsontext = wellknow.parse(coucheActuel[i].shape).coordinates[0];

        console.log( JSON.stringify(wellknow.parse(coucheActuel[i].shape).coordinates) );

        console.log(wellknow.parse(coucheActuel[i].shape));

        let pointGraphic = new Graphic({
          geometry: geometryJsonUtils.fromJSON( {"rings":jsontext} ),
          symbol: symobologiePolygon



        });

        mapView.graphics.add( pointGraphic );

      }

    });







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


}
