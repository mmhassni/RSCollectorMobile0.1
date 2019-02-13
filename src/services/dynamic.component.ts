import {Component, Input} from '@angular/core';




@Component({
  selector: 'dynamic-component',
  template: `<ion-item>
    <ion-label style="color: #000;">
      <div >{{libelle}}: {{name}} </div>

    </ion-label>
    <ion-input [type]="type" name="nom" [placeholder]="tag" [value]="initvalue" > {{name}}</ion-input>
  </ion-item>`
})
export class DynamicComponent {



  @Input() type: string ='text';
  @Input() libelle: string = 'default';
  @Input() readonly: boolean = false; //pour la modification des champs
  @Input() size: number = 50;
  @Input() tag: string = '';
  @Input() required: boolean = false;
  @Input() initvalue: string ='default';
  @Input() visible: boolean = true;
  public static instanceOfDynamicComponent = new DynamicComponent();
  public static listProperties = Object.getOwnPropertyNames(DynamicComponent.instanceOfDynamicComponent);


  constructor() {


    console.log(DynamicComponent.listProperties);
    //console.log(Object.getOwnPropertyNames(this.instanceOfDynamicComponent));

  }


}
