import {Component, Input, OnInit} from '@angular/core';
import {CameraProvider} from "../providers/camera/camera";




@Component({
  selector: 'dynamic-component',
  template: `<div [id]="id" >
               <ion-item   style="padding-bottom:4px;padding-top: 4px">
                   <ion-label>{{libelle}}:</ion-label>
               </ion-item>
  
               <img *ngIf="value" [(src)]="value"/>
  
               <br>
             
               <div text-center>
                 <button ion-button round (click)="photoChooser()">
                   Charger Photo  <ion-icon padding name="camera"></ion-icon>
                 </button>
               </div>
             </div>`
})
export class DynamicPhotoComponent implements OnInit {



  @Input() id: any ='';
  @Input() type: any ='text';
  @Input() libelle: any = '';
  @Input() readonly: any = false; //pour la modification des champs
  @Input() size: any = 50;
  @Input() tag: any = '';
  @Input() required: any = false;
  @Input() initvalue: any ='';
  @Input() initvalues: any = [];
  @Input() visible: any = true;
  @Input() objetActuel: any = null;
  @Input() photoAttributName: any = "";
  @Input() value: any = "";

  public static listProperties = [];

  constructor(public cameraProvider : CameraProvider) {

    DynamicPhotoComponent.listProperties = Object.getOwnPropertyNames(this);



  }


  photoChooser() {

    this.cameraProvider.photoChooser(this,"value");

  }

  ngOnInit(): void {

    //si le champ value n'a pas encore etait saisie alors on doit l initiliser par initvalue
    if(!this.value){
      this.value = this.initvalue;
    }

  }



}
