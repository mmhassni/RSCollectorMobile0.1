import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
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
    GenericFilterPage

  ],
  imports: [
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
    GenericFilterPage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    DynamiqueComponentService,
    //{provide: ErrorHandler, useClass: IonicErrorHandler},
    CameraProvider,
    Camera,
    FilePath,
    Geolocation,
    HTTP,
    AuthentificationProvider,
    StockageProvider
  ]
})
export class AppModule {}
