import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChoixApplicationPage } from './choix-application';

@NgModule({
  declarations: [
    ChoixApplicationPage,
  ],
  imports: [
    IonicPageModule.forChild(ChoixApplicationPage),
  ],
})
export class ChoixApplicationPageModule {}
