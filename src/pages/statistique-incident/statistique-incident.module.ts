import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatistiqueIncidentPage } from './statistique-incident';

@NgModule({
  declarations: [
    StatistiqueIncidentPage,
  ],
  imports: [
    IonicPageModule.forChild(StatistiqueIncidentPage),
  ],
})
export class StatistiqueIncidentPageModule {}
