import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CourtPage } from './court-page';
import { TheWindow } from './the-window/the-window';


@NgModule({
  declarations: [
    CourtPage,
    TheWindow,
  ],
  imports: [
    IonicPageModule.forChild(CourtPage),
  ],
  exports: [
    CourtPage
  ]
})
export class CourtPageModule {}
