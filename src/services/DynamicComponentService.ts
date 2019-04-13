import {
  ComponentFactoryResolver,
  Injectable
} from '@angular/core'

import { DynamicComponent } from './dynamic.component'
import { DynamicListComponent } from './dynamic.list.component'
import {DynamicPhotoComponent} from "./dynamic.photo.component";
import {DynamicLocationComponent} from "./dynamic.location.component";

@Injectable()
export class DynamiqueComponentService {


  public rootViewContainer: any;

  constructor(private factoryResolver: ComponentFactoryResolver) {
    console.log("On est arrive au service DynamiqueComponentService");
  }


  public setRootViewContainerRef(viewContainerRef) {
    //on recupere la reference du composant template dans lequel on va inserer notre composant
    this.rootViewContainer = viewContainerRef;
  }

  public bootstrapRowToForm(fichierJsonGetRow , fichierJsonGetFields){


    let fichierJsonGetRowReturned = [];
    for(let i = 0; i< fichierJsonGetFields.items.length; i++){

      fichierJsonGetRowReturned.push(this.raffraichirProprietes(fichierJsonGetFields.items[i], JSON.parse(fichierJsonGetRow.item),[fichierJsonGetFields.items[i]["id"]],true,["value"]));

    }

    console.log(fichierJsonGetRowReturned);

    return fichierJsonGetRowReturned;

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

  public addDynamicComponent(viewContainerRef, fichierJsonGlobal) {

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
        else if(!champSpatialeEnregistre && (inputListProperties["id"] == "x" || inputListProperties["id"] == "y") && fichierJsonGlobal.isSpatial ){


          for(let j=0; j< fichierJsonGlobal.items.length ; j++) {
            let inputListPropertiesTemp = this.jsonFiltre(fichierJsonGlobal.items[j]);
            if(inputListPropertiesTemp["id"] == "x"){
              inputListProperties["x"] = inputListPropertiesTemp["initvalue"];
              inputListProperties["xlibelle"] = inputListPropertiesTemp["libelle"];
            }
            if(inputListPropertiesTemp["id"] == "y"){
              inputListProperties["y"] = inputListPropertiesTemp["initvalue"];
              inputListProperties["ylibelle"] = inputListPropertiesTemp["libelle"];
            }

          }
          console.log(inputListProperties);

          this.associerParametreInputAuModelEtAjouter( DynamicLocationComponent , inputListProperties);
          champSpatialeEnregistre = true;

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

          console.log(inputListProperties);

          component.instance[property] = DynamiqueComponentService.adapteType(inputListProperties[property]);

          console.log(component.instance)
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

      try{
        inputListProperties[property] = JSON.parse(inputListProperties[property]);
      }
      catch (e) {
        console.log(e + " cette propriete ne peux pas etre converti en un obet json");
      }
      returnedInputListProperties[property] = DynamiqueComponentService.adapteType(inputListProperties[property]);

    }

    return returnedInputListProperties;

  }


  //permet d adapter le type de l entre
  public static adapteType(inputValue : any){

    //on change le type de l input
    if(inputValue === true){
      return true;
    }

    else if(inputValue === false){
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
