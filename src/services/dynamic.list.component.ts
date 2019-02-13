import {Component, Input} from '@angular/core';




@Component({
  selector: 'dynamic-component',
  template: `      <ion-item>
    <ion-label style="color: #000;">{{libelle}}</ion-label>
    <ion-select name = "libelle"  >
      <ion-option *ngFor="let el of initvalues" [value]="el.value">{{el.libelle}}</ion-option>

    </ion-select>
  </ion-item>`
})
export class DynamicListComponent {



  @Input() type: string ='text';
  @Input() libelle: string = 'default';
  @Input() readonly: boolean = false; //pour la modification des champs
  @Input() size: number = 50;
  @Input() tag: string = '';
  @Input() required: boolean = false;
  @Input() initvalue: string ='default';
  @Input() initvalues: any[] = [];
  @Input() visible: boolean = true;
  public static instanceOfDynamicComponent = new DynamicListComponent();
  public static listProperties = Object.getOwnPropertyNames(DynamicListComponent.instanceOfDynamicComponent);


  constructor() {


    console.log(DynamicListComponent.listProperties);
    //console.log(Object.getOwnPropertyNames(this.instanceOfDynamicComponent));

  }


}
