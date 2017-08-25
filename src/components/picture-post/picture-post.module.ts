import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { PicturePost } from './picture-post';

@NgModule({
  declarations: [
    PicturePost,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    PicturePost
  ]
})
export class PicturePostModule {}
