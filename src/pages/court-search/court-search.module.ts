import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CourtSearchPage } from './court-search';

@NgModule({
  declarations: [
    CourtSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(CourtSearchPage),
  ],
  exports: [
    CourtSearchPage
  ]
})
export class CourtSearchPageModule {}
