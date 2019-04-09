import {Component, Input} from '@angular/core';
import {CameraProvider} from "../providers/camera/camera";




@Component({
  selector: 'dynamic-component',
  template: `<ion-item style="padding-bottom:4px;padding-top: 4px">
                 <ion-label>{{libelle}}:</ion-label>
             </ion-item>

             <img  [(src)]="initvalue"/>

             <br>
             <br>
           
             <div text-center>
               <button ion-button round (click)="photoChooser()">
                 Charger Photo  <ion-icon padding name="camera"></ion-icon>
               </button>
             </div>`
})
export class DynamicPhotoComponent {



  @Input() type: string ='text';
  @Input() libelle: string = 'default';
  @Input() readonly: boolean = false; //pour la modification des champs
  @Input() size: number = 50;
  @Input() tag: string = '';
  @Input() required: boolean = false;
  @Input() initvalue: string ='default';
  @Input() initvalues: any[] = [];
  @Input() visible: boolean = true;
  @Input() objetActuel: any = null;
  @Input() photoAttributName: string = "";

  public static listProperties = [];

  constructor(public cameraProvider : CameraProvider) {

    DynamicPhotoComponent.listProperties = Object.getOwnPropertyNames(this);

  }


  photoChooser() {
    this.cameraProvider.photoChooser(this,"initvalue");
  }



}
