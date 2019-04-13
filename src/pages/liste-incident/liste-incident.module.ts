import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListeIncidentPage } from './liste-incident';

@NgModule({
  declarations: [
    ListeIncidentPage,
  ],
  imports: [
    IonicPageModule.forChild(ListeIncidentPage),
  ],
})
export class ListeIncidentPageModule {}
