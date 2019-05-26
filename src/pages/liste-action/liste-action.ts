import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Subscription} from "rxjs";
import {AuthentificationProvider} from "../../providers/authentification/authentification";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AboutPage} from "../about/about";
import {GenericFilterPage} from "../generic-filter/generic-filter";

/**
 * Generated class for the ListeActionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-liste-action',
  templateUrl: 'liste-action.html',
})
export class ListeActionPage {

  tags = [];

  public parametresAuthentificationSubscription : Subscription;
  public parametresAuthentificationActuelles = null;

  //les informations recuperees d'un push a partir d'une page precedente
  public informationsActuelles = {};


  public objetActuel = {};


  public nomTable = "action";
  public nomTableRef = "";
  public pageTableRef = null;
  public page = "1";
  public start = "0";
  public limit = "25";
  public filter = "";
  public sort = '[{"property":"id","direction":"ASC"}]';

  //public filter = '{"simple_filter":"{\\"idincident\\":'+ this.idEnregistrementGetRow +'}"}';


  public fichierJsonGetFields = null;
  public fichierJsonGetRows = [];
  public fichierJsonGetRowsFiltre = [];
  public listeValeurFiltre = ["id","description"];

  public listeAction = [];
  public listeJointureRef  = {};
  public role = null;
  public filtreFormulaire = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,public events: Events, public authentificationProvider : AuthentificationProvider,public httpClient : HttpClient) {


    //on recupere les informations du push
    this.informationsActuelles = this.navParams.data.informationsActuelles;
    this.listeJointureRef = this.navParams.data.listeJointureRef;
    if(this.navParams.data.filter){
      this.filter = '{"simple_filter":"{\\"'+ this.navParams.data.filter.idChampFiltre +'\\":'+ this.navParams.data.filter.valeurFiltre +'}"}'
    }



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
    formData.append('sort', this.sort);

    if(this.filter){
      formData.append('filter', this.filter);
    }


    let headers = new HttpHeaders();
    headers = headers.set('Accept', "application/json, text/plain," + "*/*");

    //headers = headers.set('Origin', 'http://172.20.10.2:8081');


    this.httpClient.post("http://172.20.10.2:8081/WEBCORE/MainServlet",formData, {headers: headers})
      .subscribe(dataFields => {

        (this.fichierJsonGetRows as any) = (dataFields as any).items;
        console.log(this.fichierJsonGetRows);
        this.fichierJsonGetRowsFiltre = this.fichierJsonGetRows;


      });




    formData = new FormData();
    formData.append('action', "fields");
    formData.append('idSession', this.parametresAuthentificationActuelles.data.idSession);
    formData.append('table', this.nomTable);
    formData.append('page', this.page);
    formData.append('start', this.start);
    formData.append('limit', this.limit);


    headers = new HttpHeaders();
    headers = headers.set('Accept', "application/json, text/plain," + "*/*");

    //headers = headers.set('Origin', 'http://172.20.10.2:8081');


    this.httpClient.post("http://172.20.10.2:8081/WEBCORE/MainServlet",formData, {headers: headers})
      .subscribe(dataFields => {

        console.log(dataFields);

        (this.fichierJsonGetFields as any) = dataFields;
        //recuperation des champs des refs
        for(let i = 0 ; i < (dataFields as any).items.length; i++) {
          if ((dataFields as any).items[i]["ref"] != "") {
            let formData = new FormData();
            formData.append('action', "getRows");
            formData.append('idSession', this.parametresAuthentificationActuelles.data.idSession);
            formData.append('table', (dataFields as any).items[i]["ref"].split(":")[0]);
            formData.append('page', "1");
            formData.append('start', "0");
            formData.append('limit', "-1");
            formData.append('sort', '[{"property":"' + (dataFields as any).items[i]["ref"].split(":")[1].split(",")[1] + '","direction":"ASC"}]');


            let headers = new HttpHeaders();
            headers = headers.set('Accept', "application/json, text/plain," + "*/*");

            //headers = headers.set('Origin', 'http://172.20.10.2:8081');

            (function(classe,index){

              classe.httpClient.post("http://172.20.10.2:8081/WEBCORE/MainServlet", formData, {headers: headers})
                .subscribe(dataFieldsRef => {



                  let listValues = {};


                  for (let j = 0; j < (dataFieldsRef as any).items.length; j++) {

                    let objetActuel = Object.assign((dataFieldsRef as any).items[j], {
                      "value": (dataFieldsRef as any).items[j][(dataFields as any).items[i]["ref"].split(":")[1].split(",")[0]],
                      "libelle": (dataFieldsRef as any).items[j][(dataFields as any).items[i]["ref"].split(":")[1].split(",")[1]]
                    });

                    listValues[(dataFieldsRef as any).items[j][(dataFields as any).items[i]["ref"].split(":")[1].split(",")[0]]] = objetActuel;
                  }
                  classe.listeJointureRef[(dataFields as any).items[i]["ref"].split(":")[0]] = listValues;



                });

              console.log(classe.listeJointureRef);



            })(this,i);



          }

        }




        //recuperation des actions
        this.listeAction = [];

        let champAEvaluer = [];
        let valeurDeComparaison = [];
        for(let i = 0 ; i < (dataFields as any).items.length; i++){

          if( (dataFields as any).items[i]["id"].length >= 4 &&  (dataFields as any).items[i]["id"].substring(0,4) == "ref_" ){
            console.log((dataFields as any).items[i].tag);



            let posVirguleSeparation = 0;
            //elle correspong a la premiere virgule rencontré
            for(let j = 0 ; j < (dataFields as any).items[i].tag.length; j++){
              if( (dataFields as any).items[i].tag.charAt(j) == ","){
                posVirguleSeparation = j;
                break;
              }
            }

            //les champ qu'on va evaluer
            champAEvaluer = (dataFields as any).items[i].tag.substring(0,posVirguleSeparation).split("|");
            valeurDeComparaison = (dataFields as any).items[i].tag.substring(posVirguleSeparation+1).split("|");












          }

          let listeCriteres = [];
          let critereTemp = {};

          if(champAEvaluer.length){

            for(let j = 0 ; j < champAEvaluer.length; j++){
              critereTemp = {};
              if(valeurDeComparaison[j].charAt(0) == "{"){
                critereTemp = [champAEvaluer[j] , valeurDeComparaison[j].substring(1,valeurDeComparaison[j].length-1).split(",") ];
              }
              else{
                critereTemp = [champAEvaluer[j] , [valeurDeComparaison[j]] ];
              }
              //critereTemp[champAEvaluer[j]] = valeurDeComparaison[j] ;
              listeCriteres.push(critereTemp);
            }


            try {
              console.log({"themeAction" : JSON.parse(JSON.parse((dataFields as any).items[i].nom).table).id  , "criteres" : listeCriteres });
              this.listeAction.push({"libelle" : (dataFields as any).items[i].libelle,"themeAction" : JSON.parse(JSON.parse((dataFields as any).items[i].nom).table).id , "criteres" : listeCriteres });

            }
            catch(error) {

            }


          }



        }

        console.log(this.listeAction);





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

    let navOptions = {
      animation: 'ios-transition',
      duration: 1000
    };

    this.navCtrl.push(
      AboutPage,
      {
        informationsActuelles: {},
        action: "creer",
        nomTable:this.nomTable
      },
      navOptions
    );

  }

  detailItemTapped($event, item) {

    let navOptions = {
      animation: 'ios-transition',
      duration: 1000
    };

    let parametres = {
      informationsActuelles: item,
      action: "modifier",
      nomTable:this.nomTable
    };


    this.navCtrl.push(
      AboutPage,
      parametres,
      navOptions);



  }

  itemTapped($event, item) {

    event.stopPropagation();

    if(this.pageTableRef){

      let navOptions = {
        animation: 'ios-transition',
        duration: 1000
      };

      let parametres = {
        informationsActuelles: item,
        action: "modifier"
      };

      if(this.nomTableRef){
        parametres["filter"] = {"idChampFiltre": "id" + this.nomTable , "valeurFiltre": item.id };
      }

      this.navCtrl.push(
        this.pageTableRef,
        parametres,
        navOptions);

    }


  }


  traiterIncident() {



    let navOptions = {
      animation: 'ios-transition',
      duration: 1000
    };

    let parametres = {
      informationsActuelles: {},
      action: "creer",
      nomTable:"actionprestataire"
    };

    let objetLocalGetRow = {};
    objetLocalGetRow[this.navParams.data.filter.idChampFiltre] = this.navParams.data.filter.valeurFiltre;

    parametres["localGetRow"]=JSON.stringify(objetLocalGetRow);

    this.navCtrl.push(
      AboutPage,
      parametres,
      navOptions
    );

  }


  derniereAction(){


    let maxId = 0;
    let maxIdIndex = 0;
    for(let i = 0; i < this.fichierJsonGetRowsFiltre.length ; i++){

      if((this.fichierJsonGetRowsFiltre[i] as any).id > maxId){
        maxId = Number((this.fichierJsonGetRowsFiltre[i] as any).id);
        maxIdIndex = i;
      }

    }


    return (this.fichierJsonGetRowsFiltre[maxIdIndex] as any);

  }



  filterTapped($event: MouseEvent, item: any) {

    let listeChampFiltre = [];

    let getFieldsPageFiltre = {"items": []};

    this.events.subscribe('filtreFormulaire', filtreActuel => {

      this.filtreFormulaire = filtreActuel["ids"];

      this.tags = [];
      for(let pp in filtreActuel["libelles"]){
        this.tags.push(filtreActuel["libelles"][pp])
      }

    });


    for(let i = 0; i < this.fichierJsonGetFields.items.length ; i++){

      if( this.fichierJsonGetFields.items[i]["id"] == "search_simp"){

        if(this.fichierJsonGetFields.items[i]["nom"].length >= 2){
          listeChampFiltre = this.fichierJsonGetFields.items[i]["nom"].substring(1,this.fichierJsonGetFields.items[i]["nom"].length-1).split(";");

        }

      }

    }

    for(let i = 0; i < this.fichierJsonGetFields.items.length ; i++){

      if(listeChampFiltre.indexOf(this.fichierJsonGetFields.items[i]["id"]) >= 0 ){

        getFieldsPageFiltre["items"].push(this.fichierJsonGetFields.items[i]);

      }

    }


    let navOptions = {
      animation: 'ios-transition',
      duration: 1000
    };

    let parametres = {
      informationsActuelles: {},
      fichierJsonGetFields: getFieldsPageFiltre,
      action: "modifier",
      localGetRow: this.filtreFormulaire,
      nomTable:this.nomTable
    };


    this.navCtrl.push(
      GenericFilterPage,
      parametres,
      navOptions);





  }




  toLibelle(idattribut,value){
    let retour = "";

    if(this.listeJointureRef[idattribut.substring(2)]){
      if(value){
        retour = this.listeJointureRef[idattribut.substring(2)][value]["libelle"];
      }
    }

    return retour;
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
