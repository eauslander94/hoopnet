import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CourtPage } from './court-page';
import { CourtReport } from '../court-report/court-report';
import { TextPost }   from '../text-post/text-post';
import { PicturePost }from '../picture-post/picture-post';

@NgModule({
  declarations: [
    CourtPage,
    CourtReport,
    TextPost,
    PicturePost,
  ],
  imports: [
    IonicPageModule.forChild(CourtPage),
  ],
  exports: [
    CourtPage
  ]
})
export class CourtPageModule {}
