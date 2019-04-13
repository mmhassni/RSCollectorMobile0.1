import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'dynamic-component',
  template: `
    <ion-item [id]="id">

      <ion-label style="color: #000;">
        <div>{{libelle}}:</div>
      </ion-label>

      <ion-input [type]="type" [readonly]="readonly" [placeholder]="tag" [value]="value"></ion-input>

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

  constructor() {

    DynamicComponent.listProperties = Object.getOwnPropertyNames(this);

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
