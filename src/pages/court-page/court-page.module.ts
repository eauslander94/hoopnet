import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CourtPage } from './court-page';
import { CourtReport } from '../court-report/court-report';

@NgModule({
  declarations: [
    CourtPage,
    CourtReport,
  ],
  imports: [
    IonicPageModule.forChild(CourtPage),
  ],
  exports: [
    CourtPage
  ]
})
export class CourtPageModule {}
