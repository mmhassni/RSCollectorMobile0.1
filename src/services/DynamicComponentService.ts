import {
  ComponentFactoryResolver,
  Injectable
} from '@angular/core'

import { DynamicComponent } from './dynamic.component'
import { DynamicListComponent } from './dynamic.list.component'
import {DynamicPhotoComponent} from "./dynamic.photo.component";

@Injectable()
export class DynamiqueComponentService {


  public rootViewContainer: any;
  public name = "hamid";

  constructor(private factoryResolver: ComponentFactoryResolver) {

    console.log("On est arrive au service DynamiqueComponentService");
  }


  public setRootViewContainerRef(viewContainerRef) {

    //on recupere la reference du composant template dans lequel on va inserer notre composant
    this.rootViewContainer = viewContainerRef;

  }


  public addDynamicComponent(inputListProperties : any) {

    inputListProperties = this.jsonFiltre(inputListProperties);

    //this.rootViewContainer.clear();



    if( inputListProperties["initvalues"] == "" ){

      if(inputListProperties["id"] == "photo"){
        this.associerParametreInputAuModelEtAjouter( DynamicPhotoComponent , inputListProperties);

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


        }

      }

    }


    this.rootViewContainer.insert(component.hostView);

  }


  //permet d adapter le fichier json en entre selon les regles applicatif du projet et selon la compatibilite avec
  //les specificite du langugage javascript
  public jsonFiltre(inputListProperties : any){

    let returnedInputListProperties = {};

    for(let property in inputListProperties){
      console.log(property);

      if( property == "initvalues" && inputListProperties[property] != ""){
        console.log("avant");
        console.log(inputListProperties[property]);
        console.log("apres");
        if(inputListProperties[property].substring(0,1) != "%"){
          console.log(JSON.parse(inputListProperties[property]));
          returnedInputListProperties[property] = JSON.parse(inputListProperties[property]);

        }

      }

      else{

        if(property == "type" && inputListProperties[property] == "point"){



        }
        else{
          returnedInputListProperties[property] = DynamiqueComponentService.adapteType(inputListProperties[property]);
        }



      }

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
