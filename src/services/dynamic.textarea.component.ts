import {Component, Input, OnInit} from '@angular/core';
import {Events} from "ionic-angular";


@Component({
  selector: 'dynamic-component',
  template: `    
    <ion-item *ngIf="visible" [id]="id">
      <ion-label  style="color: #000;" >{{libelle}}:</ion-label>
      <ion-textarea rows="3" [readonly]="readonly"  [(ngModel)]="value"></ion-textarea>
    </ion-item>
  `
})
export class DynamicTextareaComponent implements OnInit {


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

    DynamicTextareaComponent.listProperties = Object.getOwnPropertyNames(this);


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

    if(this.visible == "in"){
      this.visible= true;
    }
    if(this.visible == "out"){
      this.visible= false;
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
