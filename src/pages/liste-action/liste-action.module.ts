import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListeActionPage } from './liste-action';

@NgModule({
  declarations: [
    ListeActionPage,
  ],
  imports: [
    IonicPageModule.forChild(ListeActionPage),
  ],
})
export class ListeActionPageModule {}
