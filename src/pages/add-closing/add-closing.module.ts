import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddClosingPage } from './add-closing';

@NgModule({
  declarations: [
    AddClosingPage,
  ],
  imports: [
    IonicPageModule.forChild(AddClosingPage),
  ],
  exports: [
    AddClosingPage
  ]
})
export class AddClosingPageModule {}
