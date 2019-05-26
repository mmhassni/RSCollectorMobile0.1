import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {ToastController} from "ionic-angular";
import { Device } from '@ionic-native/device';



/*
  Generated class for the AuthentificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthentificationProvider {


  public parametresAuthentification = null;
  public parametresAuthentification$ = new Subject<any>();

  public login = "";
  public mdp = "";

  constructor(private device: Device,public httpClient: HttpClient, public toastCtrl : ToastController) {
    console.log('Hello AuthentificationProvider Provider');
    //pour la premiere fois la fonction emitUtilisateur ne poura pas s'executer toute seule
    //this.emit();
    //this.checkParametresAuthentification();
    this.emit();
  }

  //permet d'indiquer qu'une mise à jour au niveau du service est necessaire
  //en d'autre terme on informe le subject (la chaine youtube ) pour notifier les abonnés
  emit() {
    this.parametresAuthentification$.next(this.parametresAuthentification);
    console.log(this.parametresAuthentification);
  }

  update(parametresAuthentification : any){

    this.parametresAuthentification = parametresAuthentification;
    this.emit();

  }

  public checkParametresAuthentification():void {

    let formData = new FormData();
    formData.append('action', "authentif");
    formData.append('login', this.login);
    formData.append('passwd', this.mdp);


    let headers = new HttpHeaders();
    headers = headers.set('Accept', "application/json, text/plain," + "*/*");


    //headers = headers.set('Access-Control-Allow-Origin', '*');
    //headers = headers.set('content', 'application/json');
    //headers = headers.set('content-type', 'application/x-www-form-urlencoded');
    //headers = headers.set('Upgrade-Insecure-Requests', '1');
    //headers = headers.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8');
    //headers = headers.set('enctype', 'multipart/form-data');
    //headers = headers.set('Origin', 'http://localhost:8100');



    this.httpClient.post("http://172.20.10.2:8081/WEBCORE/MainServlet",formData, {headers: headers})
      .subscribe(data => {
        //console.log( JSON.parse((data as any).data.replace("'","Jw==")) );
        //console.log( JSON.parse((data as any).data) );

        if((data as any).success){


          (data as any).data = JSON.parse((data as any).data);


          this.parametresAuthentification = data;

          (this.parametresAuthentification as any).data["role"] = JSON.parse((data as any).data.filter).idrole;
          (this.parametresAuthentification as any).data["profile"] = "technicienPrestataire";
          try{
            (this.parametresAuthentification as any).data["ime"] = this.device.uuid;
            //alert(JSON.stringify(this.device));
          }
          catch(e){
            console.log(e);
          }


          let toast = this.toastCtrl.create({
            message: (data as any).msg,
            duration: 3000,
            position: 'top',
            cssClass: "toast-success"
          });

          toast.present();

          this.emit();



        }
        else{
          let toast = this.toastCtrl.create({
            message: (data as any).msg,
            duration: 3000,
            position: 'top',
            cssClass: "toast-echec"
          });

          toast.present();

        }


      },err=> {
        console.log("une erreur est survenue");
        console.log(err.message);
        console.log(err);

      });

  }


  nouvelleConnexion(login: any, mdp: any) {

    this.login = login;
    this.mdp = mdp;
    this.checkParametresAuthentification();


  }
}
