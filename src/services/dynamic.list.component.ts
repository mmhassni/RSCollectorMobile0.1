import {Component, Input, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Events} from "ionic-angular";




@Component({
  selector: 'dynamic-component',
  template: `<ion-item *ngIf="visible" [id]="id" >
    
                <ion-label style="opacity:1; color: #000;">{{libelle}}</ion-label>
    
                <ion-select (ionChange)="onChange()"  [disabled]="readonly" name = "libelle" [(ngModel)]="value" >

                    <ion-option  *ngFor="let el of listValues" [value]="el.value">{{el.libelle}}</ion-option>
                    <ion-option [value]="">Aucun</ion-option>
                    
                  
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
  @Input() ref: any = '';
  @Input() required: any = false;
  @Input() initvalue: any ='default';
  @Input() initvalues: any = [];
  @Input() visible: any = true;
  @Input() value: any = '';
  @Input() idSession: any = null;
  @Input() refParent: any = null;
  public initvaluesInitiale: any = null;
  public filtre: any = null;
  public listValues : any = [];
  public static listProperties = [];

  constructor(public httpClient : HttpClient,public events: Events) {

    DynamicListComponent.listProperties = Object.getOwnPropertyNames(this);




  }

  ngOnInit(){
    console.log("e");

   console.log(this.refParent);

   this.listValues = this.initvalues;

    //si le champ value n'a pas encore etait saisie alors on doit l initiliser par initvalue
    if(typeof this.initvalues == "string" && this.initvalues.length>0 && this.initvalues.substring(0,1) == "%"){
      this.initvalues = [];
    }

    if(this.visible == "in"){
      this.visible= true;
    }
    if(this.visible == "out"){
      this.visible= false;
    }


    //si le champ value n'a pas encore etait saisie alors on doit l initiliser par initvalue
    if (!this.value) {
      this.value = this.initvalue;
      //si la valeur est toujours null alors il vaut mieux la remplacer par "" au lieu de 0 pour le type text
      if( !this.value && this.type == "text"){
        this.value = "";
      }
      this.events.publish('list'+this.id.substring(2), this.value);


    }

    if(this.ref != ""){
      let formData = new FormData();
      formData.append('action', "getRows");
      formData.append('idSession', this.idSession);
      formData.append('table', this.ref.split(":")[0]);
      formData.append('page', "1");
      formData.append('start', "0");
      formData.append('limit', "-1");
      formData.append('sort', '[{"property":"'+ this.ref.split(":")[1].split(",")[1] +'","direction":"ASC"}]');


      let headers = new HttpHeaders();
      headers = headers.set('Accept', "application/json, text/plain," + "*/*");

      //headers = headers.set('Origin', 'http://172.20.10.2:8081');


      this.httpClient.post("http://172.20.10.2:8081/WEBCORE/MainServlet",formData, {headers: headers})
        .subscribe(dataFields => {


          let newInitValues = [];
          for(let i=0; i<(dataFields as any).items.length;i++){

              let objetActuel = Object.assign((dataFields as any).items[i],{
                "value": (dataFields as any).items[i][this.ref.split(":")[1].split(",")[0]],
                "libelle": (dataFields as any).items[i][this.ref.split(":")[1].split(",")[1]]
              });

              newInitValues.push(objetActuel);
          }
          this.initvalues = newInitValues;
          this.initvaluesInitiale = newInitValues;
          this.listValues = newInitValues;

          //si le champ value n'a pas encore etait saisie alors on doit l initiliser par initvalue
          if (!this.value) {
            this.value = this.initvalue;
            //si la valeur est toujours null alors il vaut mieux la remplacer par "" au lieu de 0 pour le type text
            if( !this.value && this.type == "text"){
              this.value = "";
            }
          }


          for(let pp in (dataFields as any).items[0]){
            if(pp.length >= 3 && pp.substring(0,2) == "id" ){

              console.log('list' + pp.substring(2));

              this.filtre = pp;

              for(let i=0; i< this.initvaluesInitiale.length ; i++){
                if(this.initvaluesInitiale[i]["value"] == this.value){
                  this.listValues = this.initvaluesInitiale.filter( item => item.idvoletpanne == this.initvaluesInitiale[i][pp]);

                }
              }



              this.events.subscribe("listvoletpanne", nouvelleValeur => {
                console.log(nouvelleValeur);
                this.listValues = this.initvaluesInitiale.filter( item => item.idvoletpanne == nouvelleValeur);
                this.listValues = this.initvaluesInitiale.filter( item => item.idvoletpanne == nouvelleValeur);

              });



            }
          }

          this.events.publish('list'+this.id.substring(2), this.value);



        });




    }





  }

  onChange() {

    this.events.publish('list'+this.id.substring(2), this.value);

  }
}
