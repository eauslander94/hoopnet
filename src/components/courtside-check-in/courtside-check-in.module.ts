import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CourtsideCheckIn } from './courtside-check-in';

@NgModule({
  declarations: [
    CourtsideCheckIn,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    CourtsideCheckIn
  ]
})
export class CourtsideCheckInModule {}
