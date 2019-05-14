import {Component, Input, OnInit} from '@angular/core';
import {Events} from "ionic-angular";


@Component({
  selector: 'dynamic-component',
  template: `
    <ion-item *ngIf="visible" [id]="id">

      <ion-label style="color: #000;">
        <div>{{libelle}}:</div>
      </ion-label>

      <ion-input text-center [type]="type" [readonly]="readonly"  [(ngModel)]="value"></ion-input>

    </ion-item>`
})
export class DynamicComponent implements OnInit {


  @Input() id: any = '';
  @Input() type: any = 'text';
  @Input() libelle: any = 'default';
  @Input() readonly: any = false; //pour la modification des champs
  @Input() size: any = 50;
  @Input() tag: any = '';
  @Input() required: any = false;
  @Input() initvalue: any = '';
  @Input() visible: any = true;
  @Input() value: any = '';
  public static listProperties = [];

  constructor(public events: Events) {

    DynamicComponent.listProperties = Object.getOwnPropertyNames(this);

    this.events.subscribe('graphicActuel', graphicActuel => {
      console.log(graphicActuel);

      if (graphicActuel && this.id == "x") {
        this.value = (graphicActuel as any).geometry.longitude.toFixed(6);
      }

      if (graphicActuel && this.id == "y") {
        this.value = (graphicActuel as any).geometry.latitude.toFixed(6);
      }

      if(graphicActuel && this.id == "wkt"){
        this.value = "POINT( " +
          (graphicActuel as any).geometry.longitude.toFixed(6) +
          " " +
          (graphicActuel as any).geometry.latitude.toFixed(6) +
          ")";
      }

    });

  }

  ngOnInit(): void {

    if(this.type == "string"){
      this.type = "text";
    }

    //si le champ value n'a pas encore etait saisie alors on doit l initiliser par initvalue
    if (!this.value) {
      this.value = this.initvalue;
      //si la valeur est toujours null alors il vaut mieux la remplacer par "" au lieu de 0 pour le type text
      if( !this.value && this.type == "text"){
        this.value = "";
      }
    }

    if(this.id == "x" || this.id == "y"){
      if(this.value == 0){
        this.value = "";
      }
    }



    //si le champ value n'a pas encore etait saisie alors on doit l initiliser par initvalue
    if (!this.tag) {
      this.tag = this.initvalue;
      //si la valeur est toujours null alors il vaut mieux la remplacer par "" au lieu de 0 pour le type text
      if( !this.tag && this.type == "text"){
        this.tag = "";
      }
    }



  }




}
