import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DynamiqueComponentService } from '../services/DynamicComponentService';

import { DynamicComponent } from '../services/dynamic.component';
import { DynamicListComponent } from '../services/dynamic.list.component';
import {DynamicPhotoComponent} from "../services/dynamic.photo.component";
import { CameraProvider } from '../providers/camera/camera';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera } from '@ionic-native/camera';
import { AuthentificationProvider } from '../providers/authentification/authentification';
import {HttpClientModule} from "@angular/common/http";
import {MapLocationPage} from "../pages/map-location/map-location";
import { Geolocation } from '@ionic-native/geolocation';

import { HTTP } from '@ionic-native/http/ngx';
import {DynamicLocationComponent} from "../services/dynamic.location.component";
import {AuthentificationPage} from "../pages/authentification/authentification";
import {ListeIncidentPage} from "../pages/liste-incident/liste-incident";
import { StockageProvider } from '../providers/stockage/stockage';

import { IonicStorageModule } from '@ionic/storage';
import {DynamicDateComponent} from "../services/dynamic.date.component";
import {DynamicTextareaComponent} from "../services/dynamic.textarea.component";
import {ListeActionPage} from "../pages/liste-action/liste-action";
import {GenericFilterPage} from "../pages/generic-filter/generic-filter";
import {CodePush} from "@ionic-native/code-push/ngx";
import { Device } from '@ionic-native/device';

import {IonTagsInputModule} from "ionic-tags-input";
import {ListeIncidentEncoursPage} from "../pages/liste-incident-encours/liste-incident-encours";
import {ListeEnquetePoiPage} from "../pages/liste-enquete-poi/liste-enquete-poi";
import {ChoixApplicationPage} from "../pages/choix-application/choix-application";
import {StatistiqueIncidentPage} from "../pages/statistique-incident/statistique-incident";



@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    MapLocationPage,
    DynamicComponent,
    DynamicListComponent,
    DynamicPhotoComponent,
    DynamicLocationComponent,
    DynamicDateComponent,
    DynamicTextareaComponent,
    AuthentificationPage,
    ListeIncidentPage,
    ListeActionPage,
    ListeIncidentEncoursPage,
    GenericFilterPage,
    ListeEnquetePoiPage,
    ChoixApplicationPage,
    StatistiqueIncidentPage

  ],
  imports: [
    IonTagsInputModule,
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    MapLocationPage,
    DynamicComponent,
    DynamicListComponent,
    DynamicPhotoComponent,
    DynamicLocationComponent,
    DynamicDateComponent,
    DynamicTextareaComponent,
    AuthentificationPage,
    ListeIncidentPage,
    ListeActionPage,
    ListeIncidentEncoursPage,
    GenericFilterPage,
    ListeEnquetePoiPage,
    ChoixApplicationPage,
    StatistiqueIncidentPage

  ],
  providers: [
    CodePush,
    StatusBar,
    SplashScreen,
    DynamiqueComponentService,
    CameraProvider,
    Camera,
    FilePath,
    Device,
    Geolocation,
    HTTP,
    AuthentificationProvider,
    StockageProvider
  ]
})
export class AppModule {}
