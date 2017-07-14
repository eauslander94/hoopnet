import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Profile } from './profile';
import { HoopedCard } from '../hooped-card/hooped-card';

@NgModule({
  declarations: [
    Profile,
    HoopedCard,
  ],
  imports: [
    IonicPageModule.forChild(Profile),
  ],
  exports: [
    Profile
  ]
})
export class ProfileModule {}
