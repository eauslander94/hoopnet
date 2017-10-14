import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { HoursDisplay } from './hours-display';

@NgModule({
  declarations: [
    HoursDisplay,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    HoursDisplay
  ]
})
export class HoursDisplayModule {}
