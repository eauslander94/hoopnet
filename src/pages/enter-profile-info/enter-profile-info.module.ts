import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnterProfileInfo } from './enter-profile-info';

@NgModule({
  declarations: [
    EnterProfileInfo,
  ],
  imports: [
    IonicPageModule.forChild(EnterProfileInfo),
  ],
  exports: [
    EnterProfileInfo
  ]
})
export class EnterProfileInfoModule {}
