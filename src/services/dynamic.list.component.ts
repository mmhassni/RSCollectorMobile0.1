import {Component, Input, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";




@Component({
  selector: 'dynamic-component',
  template: `<ion-item *ngIf="visible" [id]="id" >
    
                <ion-label style="opacity:1; color: #000;">{{libelle}}</ion-label>
    
                <ion-select [disabled]="readonly" name = "libelle" [(ngModel)]="value" >
                  
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
  @Input() ref: any = '';
  @Input() required: any = false;
  @Input() initvalue: any ='default';
  @Input() initvalues: any = [];
  @Input() visible: any = true;
  @Input() value: any = '';
  @Input() idSession: any = null;
  public static listProperties = [];

  constructor(public httpClient : HttpClient) {

    DynamicListComponent.listProperties = Object.getOwnPropertyNames(this);



  }

  ngOnInit(){
    console.log("e");

    //si le champ value n'a pas encore etait saisie alors on doit l initiliser par initvalue
    if(typeof this.initvalues == "string" && this.initvalues.length>0 && this.initvalues.substring(0,1) == "%"){
      this.initvalues = [];
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

      //headers = headers.set('Origin', 'http://localhost:8081');


      this.httpClient.post("http://172.20.10.2:8081/WEBCORE/MainServlet",formData, {headers: headers})
        .subscribe(dataFields => {

          let newInitValues = [];
          for(let i=0; i<(dataFields as any).items.length;i++){
              newInitValues.push({
                "value": (dataFields as any).items[i][this.ref.split(":")[1].split(",")[0]],
                "libelle": (dataFields as any).items[i][this.ref.split(":")[1].split(",")[1]]
              });
          }
          this.initvalues = newInitValues;

          //si le champ value n'a pas encore etait saisie alors on doit l initiliser par initvalue
          if (!this.value) {
            this.value = this.initvalue;
            //si la valeur est toujours null alors il vaut mieux la remplacer par "" au lieu de 0 pour le type text
            if( !this.value && this.type == "text"){
              this.value = "";
            }
          }


        });


    }

    //si le champ value n'a pas encore etait saisie alors on doit l initiliser par initvalue
    if (!this.value) {
      this.value = this.initvalue;
      //si la valeur est toujours null alors il vaut mieux la remplacer par "" au lieu de 0 pour le type text
      if( !this.value && this.type == "text"){
        this.value = "";
      }
    }

  }


}
