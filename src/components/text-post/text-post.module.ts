import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { TextPost } from './text-post';

@NgModule({
  declarations: [
    TextPost,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    TextPost
  ]
})
export class TextPostModule {}
