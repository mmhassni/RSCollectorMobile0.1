import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapLocationPage } from './map-location';

@NgModule({
  declarations: [
    MapLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(MapLocationPage),
  ],
})
export class MapLocationPageModule {}
