import {Component, Input, OnInit} from '@angular/core';
import {Events, NavController, NavParams} from "ionic-angular";
import {MapLocationPage} from "../pages/map-location/map-location";




@Component({
  selector: 'dynamic-component',
  template: `<ion-item  *ngIf="visible" [id]="id"  style="padding:4" >
            
               <ion-label style="color: #000;">Position
                 <!--
                 <p *ngIf="x" >{{xlibelle}} = {{x}}</p>
                 <p *ngIf="!x && graphicPoint" >{{xlibelle}} = {{x.toFixed(5)}}</p>
                 <p *ngIf="y">{{ylibelle}} = {{y}} </p>
                 <p *ngIf="!y && graphicPoint"> {{ylibelle}} = {{y.toFixed(5)}} </p>
                 -->
               </ion-label>
            
               <button *ngIf="readonly"  ion-button clear  item-end (click)="recupererGraphic()">
                 <ion-icon style="zoom:1.8; margin-right: 0px;padding-right: 0px;" name="md-pin"></ion-icon>
               </button>
            
             </ion-item>`
})
export class DynamicLocationComponent  implements OnInit {



  @Input() id: any ='';
  @Input() type: any ='text';
  @Input() libelle: any = 'default';
  @Input() readonly: any = false; //pour la modification des champs
  @Input() size: any = 50;
  @Input() tag: any = '';
  @Input() required: any = false;
  @Input() initvalue: any ='default';
  @Input() initvalues: any = [];
  @Input() visible: any = true;
  @Input() x: any = '';
  @Input() xlibelle: any = '';
  @Input() y: any = '';
  @Input() ylibelle: any = '';

  public graphicPoint = null;
  public static listProperties = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,public events: Events)  {

    DynamicLocationComponent.listProperties = Object.getOwnPropertyNames(this);

    this.events.subscribe('graphicActuel', graphicActuel => {
      console.log(graphicActuel);

      if (graphicActuel) {
          this.x = (graphicActuel as any).geometry.latitude;
          this.y = (graphicActuel as any).geometry.longitude;
      }

    });


  }

  ngOnInit(): void {



  }

  ionViewDidEnter() {
    console.log(this.navCtrl);
  }


  recupererGraphic() {

    this.navCtrl.push(MapLocationPage,{x: this.x, y: this.y,action: "getLocation"});
  }




}
