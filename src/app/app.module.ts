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
    DynamicPhotoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
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
    DynamicPhotoComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DynamiqueComponentService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CameraProvider,
    Camera,
    FilePath,
    Geolocation,
    AuthentificationProvider
  ]
})
export class AppModule {}
