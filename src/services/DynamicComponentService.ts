import {
  ComponentFactoryResolver,
  Injectable
} from '@angular/core'

import { DynamicComponent } from './dynamic.component'
import { DynamicListComponent } from './dynamic.list.component'

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


    if( inputListProperties["initvalues"] == "" ){

    //this.rootViewContainer.clear();

    //Une factoryResolver peut etre vu comme un objet qui sait comment fabriquer un composant
    //remarque cette etape est independante de toutes les autres etapes precedentes
    const factory = this.factoryResolver.resolveComponentFactory(DynamicComponent);

    //On recupere le composant parent (composant de base)
    //dans notre cas c'est la balise qui contient la balise template
    const component = factory.create(this.rootViewContainer.parentInjector);

    //dans cette boucle on va essayer d associer chaque propriete du model avec l objet json en etree
    //fixons d abord une propriete de notre model
    for(let i=0; i<DynamicComponent.listProperties.length;i++){

      // on cherche la propriete dsi elle existe dans notre objet
      for(let property in inputListProperties){

        //si la popriete est bien celle qu'on cherche
        if( property == DynamicComponent.listProperties[i]){

          console.log(inputListProperties);

          component.instance[property] = DynamiqueComponentService.adapteType(inputListProperties[property]);


        }

      }

    }


    this.rootViewContainer.insert(component.hostView);

  }

    if( inputListProperties["initvalues"] != "" ){

      //this.rootViewContainer.clear();

      //Une factoryResolver peut etre vu comme un objet qui sait comment fabriquer un composant
      //remarque cette etape est independante de toutes les autres etapes precedentes
      const factory = this.factoryResolver.resolveComponentFactory(DynamicListComponent);

      //On recupere le composant parent (composant de base)
      //dans notre cas c'est la balise qui contient la balise template
      const component = factory.create(this.rootViewContainer.parentInjector);

      //dans cette boucle on va essayer d associer chaque propriete du model avec l objet json en etree
      //fixons d abord une propriete de notre model
      for(let i=0; i<DynamicListComponent.listProperties.length;i++){

        // on cherche la propriete dsi elle existe dans notre objet
        for(let property in inputListProperties){

          //si la popriete est bien celle qu'on cherche
          if( property == DynamicListComponent.listProperties[i]){

            console.log(inputListProperties);

            component.instance[property] = DynamiqueComponentService.adapteType(inputListProperties[property]);

            if(property == 'initvalues'){
              component.instance[property] = JSON.parse(inputListProperties[property]);

            }


          }

        }

      }


      this.rootViewContainer.insert(component.hostView);

    }


  }// fin de la fonction addDynamicComponent






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
