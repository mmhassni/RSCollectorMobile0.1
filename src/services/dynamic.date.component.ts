import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'dynamic-date-component',
  template:
   `<ion-item *ngIf="visible" >
      <ion-label style="opacity:1; color: #000;">{{libelle}} :</ion-label>
      <ion-datetime [disabled]="readonly"  displayFormat="DDD DD MMMM, YYYY" pickerFormat="DDD MM YYYY" [(ngModel)]="value"
                    monthNames="Janvier,février, mars, Avril, Mai, Juin, Juillet, Aout, Septembre, Octobre, Novembre, Décembre"
                    monthShortNames="jan, fev, mar, avr, mai, jun , jul, aou, sep, oct, nov ,dec"
                    dayNames= "Dimanche, Lundi, Mardi, Mercredi, Jeudi, Vendredi, Samedi"
                    dayShortNames= "dim, lun, mar, mer, jeu, ven, sam"
      >

      </ion-datetime>
    </ion-item>`
})
export class DynamicDateComponent implements OnInit {


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

    DynamicDateComponent.listProperties = Object.getOwnPropertyNames(this);

  }

  ngOnInit(): void {



    //si le champ value n'a pas encore etait saisie alors on doit l initiliser par initvalue
    let date=new Date(this.value);


    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    let year = date.getFullYear();


    if((date.getDate()) < 10){
      day = "0" + (date.getDate()).toString();
    }
    if((date.getMonth() + 1) < 10){
      month = "0" + (date.getMonth() + 1).toString();
    }

    this.value = year + "-" + month + "-" + day ;



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
