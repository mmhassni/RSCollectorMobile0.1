import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GenericFilterPage } from './generic-filter';

@NgModule({
  declarations: [
    GenericFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(GenericFilterPage),
  ],
})
export class GenericFilterPageModule {}
