import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CourtReport } from './court-report';

@NgModule({
  declarations: [
    CourtReport,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    CourtReport
  ]
})
export class CourtReportModule {}
