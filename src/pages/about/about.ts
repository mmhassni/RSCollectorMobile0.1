import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import { NavController } from 'ionic-angular';
import {DynamiqueComponentService} from "../../services/DynamicComponentService";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  public name = 'from Angular';

  @ViewChild('dynamic', {
    read: ViewContainerRef
  }) viewContainerRef: ViewContainerRef;

  public fichierJson = [

    {
      "table": "ire_source",
      "id": "nom",
      "nom": "nom",
      "libelle": "Nom",
      "ref": "",
      "type": "string",
      "size": "",
      "readonly": "true",
      "visible": "true",
      "search": "true",
      "required": "false",
      "tag": "",
      "group": "",
      "initvalue": "",
      "initvalues": ""
    },

    {
      "table": "ire_source",
      "id": "epsg",
      "nom": "codeepsg",
      "libelle": "RS",
      "ref": "",
      "type": "integer",
      "size": "",
      "readonly": "true",
      "visible": "system",
      "search": "false",
      "required": "false",
      "tag": "",
      "group": "",
      "initvalue": "26191",
      "initvalues": "[{\"group\":\"RefSpatiales\",\"id\":\"26191\",\"libelle\":\"Maroc Zone 1\",\"visible\":\"true\",\"value\":\"26191\"},{\"group\":\"RefSpatiales\",\"id\":\"26192\",\"libelle\":\"Maroc Zone 2\",\"visible\":\"false\",\"value\":\"26192\"},{\"group\":\"RefSpatiales\",\"id\":\"26194\",\"libelle\":\"Maroc Zone 3\",\"visible\":\"false\",\"value\":\"26194\"},{\"group\":\"RefSpatiales\",\"id\":\"26195\",\"libelle\":\"Maroc Zone 4\",\"visible\":\"false\",\"value\":\"26195\"},{\"group\":\"RefSpatiales\",\"id\":\"4261\",\"libelle\":\"Merchich (DD)\",\"visible\":\"true\",\"value\":\"4261\"},{\"group\":\"RefSpatiales\",\"id\":\"4326\",\"libelle\":\"WGS84 (DD)\",\"visible\":\"true\",\"value\":\"4326\"},{\"group\":\"RefSpatiales\",\"id\":\"3857\",\"libelle\":\"Web Mercator\",\"visible\":\"true\",\"value\":\"3857\"},{\"group\":\"RefSpatiales\",\"id\":\"32628\",\"libelle\":\"Projection UTM28\",\"visible\":\"false\",\"value\":\"32628\"},{\"group\":\"RefSpatiales\",\"id\":\"32629\",\"libelle\":\"Projection UTM29\",\"visible\":\"false\",\"value\":\"32629\"},{\"group\":\"RefSpatiales\",\"id\":\"32630\",\"libelle\":\"Projection UTM30\",\"visible\":\"false\",\"value\":\"32630\"},{\"group\":\"RefSpatiales\",\"id\":\"null\",\"libelle\":\"Inconnu\",\"value\":\"null\"}]"
    }



  ];

  constructor(public navCtrl: NavController, public dynamiqueComponentService: DynamiqueComponentService) {



  }

  ngOnInit() {
    this.dynamiqueComponentService.setRootViewContainerRef(this.viewContainerRef);

    console.log('test');


    for(let i=0; i< this.fichierJson.length ; i++){

      this.dynamiqueComponentService.addDynamicComponent(JSON.parse(JSON.stringify(this.fichierJson[i])));

    }

  }

}
