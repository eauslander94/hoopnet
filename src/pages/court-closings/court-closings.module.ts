import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CourtClosingsPage } from './court-closings';
import { AddClosingPage }   from '../add-closing/add-closing';


@NgModule({
  declarations: [
    CourtClosingsPage,
  ],
  imports: [
    IonicPageModule.forChild(CourtClosingsPage),
  ],
  exports: [
    CourtClosingsPage,
  ]
})
export class CourtClosingsPageModule {}
