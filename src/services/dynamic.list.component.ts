import {Component, Input, OnInit} from '@angular/core';




@Component({
  selector: 'dynamic-component',
  template: `<ion-item [id]="id" >
    
                <ion-label style="color: #000;">{{libelle}}</ion-label>
    
                <ion-select name = "libelle"  >
                  
                  <ion-option  *ngFor="let el of initvalues" [value]="el.value">{{el.libelle}}</ion-option>
             
                </ion-select>
    
             </ion-item>`
})
export class DynamicListComponent implements OnInit{



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
  @Input() value: any = '';
  public static listProperties = [];

  constructor() {

    DynamicListComponent.listProperties = Object.getOwnPropertyNames(this);



  }

  ngOnInit(){
    console.log("e");

    //si le champ value n'a pas encore etait saisie alors on doit l initiliser par initvalue
    if(typeof this.initvalues == "string" && this.initvalues.length>0 && this.initvalues.substring(0,1) == "%"){
      this.initvalues = [];
    }
    if(!this.value){
      this.value = this.initvalue;
    }
  }


}
