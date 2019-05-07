import {
  ComponentFactoryResolver,
  Injectable
} from '@angular/core';

import { DynamicComponent } from './dynamic.component';
import { DynamicListComponent } from './dynamic.list.component'
import {DynamicPhotoComponent} from "./dynamic.photo.component";
import {DynamicLocationComponent} from "./dynamic.location.component";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DynamicDateComponent} from "./dynamic.date.component";

@Injectable()
export class DynamiqueComponentService {


  public rootViewContainer: any;

  constructor(private factoryResolver: ComponentFactoryResolver,public httpClient : HttpClient) {
    console.log("On est arrive au service DynamiqueComponentService");
  }

  //prepare la requete http pour l envoyer
  public enregistrerInformationFormulaire(fichierJsonGetFields,action,nomTable,idSession){

    let formData = new FormData();


    let headers = new HttpHeaders();
    headers = headers.set('Accept', "application/json, text/plain," + "*/*");

    let editData = {};

    formData.append("action", "writeRow");
    formData.append("table", nomTable);

    for(let i = 0; i< fichierJsonGetFields.items.length; i++){




        //si l'action est "modifier" alors on doit preparer egalement l'objet editData
        if(action == "modifier") {
          if(typeof fichierJsonGetFields.items[i].value == "string") {
            if("date_add" == fichierJsonGetFields.items[i].id.toString()) {

              /*
              let dateTemp = new Date();
              console.log(dateTemp.getTime());
              let dateTempMilSec = dateTemp.getTime().toString();
              let dateTempMilSecCopy = dateTempMilSec;
              */
              editData["date_add"] = (new Date(fichierJsonGetFields.items[i].value)).getTime();
              formData.append(fichierJsonGetFields.items[i].id, (new Date(fichierJsonGetFields.items[i].value)).getTime().toString() );
            }
            else{
              editData[fichierJsonGetFields.items[i].id] = fichierJsonGetFields.items[i].value.toString();
              formData.append(fichierJsonGetFields.items[i].id, fichierJsonGetFields.items[i].value);


            }
          }
          else if ("shape" == fichierJsonGetFields.items[i].id) {

          }
          else if("epsg" == fichierJsonGetFields.items[i].id.toString()){

            editData[fichierJsonGetFields.items[i].id] = fichierJsonGetFields.items[i].value.toString();
            formData.append(fichierJsonGetFields.items[i].id, fichierJsonGetFields.items[i].value);


          }
          else{
            editData[fichierJsonGetFields.items[i].id] = fichierJsonGetFields.items[i].value;
            formData.append(fichierJsonGetFields.items[i].id, fichierJsonGetFields.items[i].value);

          }
        }


    }

    formData.append("editData", JSON.stringify(editData));
    formData.append("idSession", idSession);

    console.log(editData);


    return  this.httpClient.post("http://172.20.10.2:8081/WEBCORE/MainServlet",formData, {headers: headers});




  }

  public setRootViewContainerRef(viewContainerRef) {
    //on recupere la reference du composant template dans lequel on va inserer notre composant
    this.rootViewContainer = viewContainerRef;
  }

  public bootstrapRowToForm(fichierJsonGetRow , fichierJsonGetFields){


    let fichierJsonGetField = [];
    for(let i = 0; i< fichierJsonGetFields.items.length; i++){

      fichierJsonGetField.push(this.raffraichirProprietes(fichierJsonGetFields.items[i], JSON.parse(fichierJsonGetRow.item),[fichierJsonGetFields.items[i]["id"]],true,["value"]));

    }

    console.log(fichierJsonGetField);

    return fichierJsonGetField;

  }

  public refreshFormWithFormActualValue(actualForm , fichierJsonGetFields){


    let fichierJsonGetField = [];
    for(let i = 0; i< fichierJsonGetFields.items.length; i++){

      for(let j = 0; j< actualForm._embeddedViews.length; j++){
        console.log((actualForm._embeddedViews[j] as any).nodes[1].instance["id"]);
        console.log(fichierJsonGetFields.items[i]["id"]);
        if(actualForm._embeddedViews[j].nodes[1].instance["id"] == fichierJsonGetFields.items[i]["id"] ){

          fichierJsonGetField.push(this.raffraichirProprietes(fichierJsonGetFields.items[i], actualForm._embeddedViews[j].nodes[1].instance,["value"],true,["value"]));

        }

      }


    }

    console.log(fichierJsonGetField);

    return fichierJsonGetField;

  }

  public raffraichirProprietes(objetPrincipal,objetAvecNouvellePP,listeProprieteACopier,forcerLaCopie,tableauValeursParForce){

    for(let i = 0 ; i < listeProprieteACopier.length; i++) {


        //on doit voir d'abord si elle existe vraiment dans notre objet
        for (let ppNouvelles in objetAvecNouvellePP) {

          //si c'est le cas alors on l'ajoute a notre objet meme si cette propriete
          if (ppNouvelles == listeProprieteACopier[i]) {

            //si l'utilisateur demande de forcer la copie alors on doit la copier meme si la propriete n existe pas dans l'objet principal
            if(forcerLaCopie){
              if(tableauValeursParForce.length){
                objetPrincipal[tableauValeursParForce[i]] = objetAvecNouvellePP[listeProprieteACopier[i]];
              }
              else{
                objetPrincipal[listeProprieteACopier[i]] = objetAvecNouvellePP[listeProprieteACopier[i]];
              }

            }else{
              if( objetPrincipal[listeProprieteACopier[i]] == undefined){
                objetPrincipal[listeProprieteACopier[i]] = objetAvecNouvellePP[listeProprieteACopier[i]];

              }
            }

          }

        }


    }

    console.log(objetPrincipal);
    return objetPrincipal;

  }

  public addDynamicComponent(viewContainerRef, fichierJsonGlobal,idSession) {

    let inputListPropertiesTempLocation = null;
    let inputListPropertiesTempX = null;
    let inputListPropertiesTempY = null;

    try{
      //On suprime les elements du formulaire existant
      this.rootViewContainer.clear();
    }
    catch(e){
      console.log(e);
    }


    this.setRootViewContainerRef(viewContainerRef);

    let champSpatialeEnregistre = false;

    for(let i=0; i< fichierJsonGlobal.items.length ; i++){

      let inputListProperties = this.jsonFiltre(fichierJsonGlobal.items[i]);



      console.log(fichierJsonGlobal);

      if( inputListProperties["initvalues"] == "" ){

        if(inputListProperties["id"].length >= 5 && inputListProperties["id"].substring(0,5) == "photo"){
          this.associerParametreInputAuModelEtAjouter( DynamicPhotoComponent , inputListProperties);

        }
        else if( inputListProperties["type"] == "date" ){

          this.associerParametreInputAuModelEtAjouter( DynamicDateComponent , inputListProperties);


        }
        else if(!champSpatialeEnregistre  && fichierJsonGlobal.isSpatial ){



          for(let j=0; j< fichierJsonGlobal.items.length ; j++) {
            let inputListPropertiesTemp = this.jsonFiltre(fichierJsonGlobal.items[j]);
            if(inputListPropertiesTemp["id"] == "x"){
              inputListProperties["x"] = inputListPropertiesTemp["initvalue"];
              inputListProperties["xlibelle"] = inputListPropertiesTemp["libelle"];
              inputListPropertiesTempX = inputListPropertiesTemp;

            }
            if(inputListPropertiesTemp["id"] == "y"){
              inputListProperties["y"] = inputListPropertiesTemp["initvalue"];
              inputListProperties["ylibelle"] = inputListPropertiesTemp["libelle"];
              inputListPropertiesTempY = inputListPropertiesTemp;


            }

          }
          inputListPropertiesTempLocation = inputListProperties;
          console.log(inputListProperties);



          champSpatialeEnregistre = true;

        }
        else if(inputListProperties["ref"] != "" ){

          inputListProperties["idSession"]= idSession;
          this.associerParametreInputAuModelEtAjouter( DynamicListComponent , inputListProperties);


        }
        else{

          if(inputListProperties["type"] == "integer"  || inputListProperties["type"] == "string"){
            this.associerParametreInputAuModelEtAjouter( DynamicComponent , inputListProperties);

          }

        }

      }

      if( inputListProperties["initvalues"] != "" ){

        this.associerParametreInputAuModelEtAjouter( DynamicListComponent , inputListProperties);

      }



    }

    this.associerParametreInputAuModelEtAjouter( DynamicLocationComponent , inputListPropertiesTempLocation);
    this.associerParametreInputAuModelEtAjouter( DynamicComponent , inputListPropertiesTempX);
    this.associerParametreInputAuModelEtAjouter( DynamicComponent , inputListPropertiesTempY);



  }// fin de la fonction addDynamicComponent


  //Cette fonction ca permetre de faire les associations entre les parametre de notre model
  //et de notre liste de propriete recupere à partir de  notre objet json.
  //Elle permet d'ajouter à la fin le composant créé a notre page
  //ModelClass correspond au composant dynamic exemple : DynamicComponent , DynamicListComponent , DynamicPhotoComponent ...
  public associerParametreInputAuModelEtAjouter( ModelClass : any, inputListProperties : any ){

    //this.rootViewContainer.clear();

    //Une factoryResolver peut etre vu comme un objet qui sait comment fabriquer un composant
    //remarque cette etape est independante de toutes les autres etapes precedentes
    const factory = this.factoryResolver.resolveComponentFactory(ModelClass);

    //On recupere le composant parent (composant de base)
    //dans notre cas c'est la balise qui contient la balise template
    const component = factory.create(this.rootViewContainer.parentInjector);

    //dans cette boucle on va essayer d associer chaque propriete du model avec l objet json en etree
    //fixons d abord une propriete de notre model
    for(let i=0; i<ModelClass.listProperties.length;i++){

      // on cherche la propriete dsi elle existe dans notre objet
      for(let property in inputListProperties){

        //si la popriete est bien celle qu'on cherche
        if( property == ModelClass.listProperties[i]){

          //onsole.log(inputListProperties);

          component.instance[property] = DynamiqueComponentService.adapteType(inputListProperties[property]);

          //console.log(component.instance)
        }

      }

    }


    this.rootViewContainer.insert(component.hostView);

  }


  //permet d adapter le fichier json en entré selon les regles applicatif du projet et selon la compatibilite avec
  //les specificités du langugage javascript
  public jsonFiltre(inputListProperties : any){

    let returnedInputListProperties = {};

    for(let property in inputListProperties) {

      returnedInputListProperties[property] = DynamiqueComponentService.adapteType(inputListProperties[property]);
      if(property == "initvalues"){

        try{
          returnedInputListProperties[property] = JSON.parse(inputListProperties[property]);
        }
        catch (e) {
          console.log(e + " cette propriete ne peux pas etre converti en un obet json");
        }

      }

    }

    return returnedInputListProperties;

  }


  //permet d adapter le type de l entre
  public static adapteType(inputValue : any){

    //on change le type de l input
    if(inputValue === "true"){
      return true;
    }

    else if(inputValue === "false"){
      return false;
    }

    else if(Number(inputValue).toString() != "NaN" ){
      return Number(inputValue);

    }
    else{
      return inputValue;
    }

  }



}
