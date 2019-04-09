import {Component, ElementRef, ViewChild} from '@angular/core';
import {Events, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import { loadModules } from 'esri-loader';
import { Geolocation } from '@ionic-native/geolocation';



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

  @ViewChild('map') mapEl: ElementRef;LocateButton
  public currentLong = 0;
  public currentLat = 0;
  public erreur = 0;

  public static graphicActuel = null;
  public static popedGraphicActuel = null;


  constructor(public navCtrl: NavController,public events: Events, public navParams: NavParams,public platform: Platform, private geolocation: Geolocation) {
    this.getGeo();

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
    const [Map, MapView,Locate, Graphic,
      SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol]:any = await loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/widgets/Locate',
      "esri/Graphic",

      "esri/symbols/SimpleMarkerSymbol",
      "esri/symbols/SimpleLineSymbol",
      "esri/symbols/SimpleFillSymbol"
    ])
      .catch(err => {
        console.error("ArcGIS: ", err);
      });

    console.log("Starting up ArcGIS map");

    let map = new Map({
      basemap: 'hybrid'
    });

    let mapView = new MapView({
      // create the map view at the DOM element in this component
      container: this.mapEl.nativeElement,
      center: [this.currentLong, this.currentLat],
      zoom: 20
    });

    mapView.map = map;




    /*
    if(this.laureatsList && this.laureatsList.length){

      for(let i=0;i<this.laureatsList.length;i++) {


        if (this.laureatsList[i] && this.laureatsList[i].long && this.laureatsList[i].lat) {


          let pointGraphic = new Graphic({
            geometry: {
              type: "point", // autocasts as new Point()
              longitude: Number(this.laureatsList[i].long),
              latitude: Number(this.laureatsList[i].lat)
            },
            symbol: {
              type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
              color: [255, 0, 255],
              outline: { // autocasts as new SimpleLineSymbol()
                color: [255, 255, 255],
                width: 1
              }
            },
            attributes: {
              Nom: this.laureatsList[i].nom,
              Prenom: this.laureatsList[i].prenom,
              Organisme: this.laureatsList[i].nomorganisme,
              Filiere: this.laureatsList[i].filiere,
            },
            popupTemplate: {  // autocasts as new PopupTemplate()
              title: "{Nom} {Prenom}",
              content: [{
                type: "fields",
                fieldInfos: [{
                  fieldName: "Nom"
                }, {
                  fieldName: "Prenom"
                }, {
                  fieldName: "Organisme"
                }, {
                  fieldName: "Filiere"
                }]
              }]
            }


          });

          mapView.graphics.add(pointGraphic);


        }//fin if
      }

    }

    */


    let symbol = {
      type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        color: [255, 0, 255],
        outline: { // autocasts as new SimpleLineSymbol()
        color: [255, 255, 255],
          width: 1
      }
    };

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

    function addToMap(evt) {
      var symbol;
      mapView.showZoomSlider();
      switch (evt.geometry.type) {
        case "point":
        case "multipoint":
          symbol = new SimpleMarkerSymbol();
          break;
        case "polyline":
          symbol = new SimpleLineSymbol();
          break;
        default:
          symbol = new SimpleFillSymbol();
          break;
      }

      var graphic = new Graphic(evt.geometry, symbol);
      map.graphics.add(graphic);

    }


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
