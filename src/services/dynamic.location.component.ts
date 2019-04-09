import {Component, Input} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {MapLocationPage} from "../pages/map-location/map-location";




@Component({
  selector: 'dynamic-component',
  template: `<ion-item style="padding:4"  *ngIf="!utilisateur.organisme">

    <ion-label style="color: #000;">Position
      <p >Long = {{long}}</p>
      <p>Lat = {{lat}} </p>
    </ion-label>

    <button padding ion-button clear  item-end (click)="recupererGraphic()">
      Mesurer
    </button>

  </ion-item>`
})
export class DynamicLocationComponent {



  @Input() type: string ='text';
  @Input() libelle: string = 'default';
  @Input() readonly: boolean = false; //pour la modification des champs
  @Input() size: number = 50;
  @Input() tag: string = '';
  @Input() required: boolean = false;
  @Input() initvalue: string ='default';
  @Input() initvalues: any[] = [];
  @Input() visible: boolean = true;
  public static listProperties = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    DynamicLocationComponent.listProperties = Object.getOwnPropertyNames(this);

  }

  ionViewDidEnter() {
    console.log(this.navCtrl);
  }


  recupererGraphic() {
    this.navCtrl.push(MapLocationPage);
  }
}
