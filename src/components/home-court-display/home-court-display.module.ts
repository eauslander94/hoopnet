import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { HomeCourtDisplay } from './home-court-display';

@NgModule({
  declarations: [
    HomeCourtDisplay,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    HomeCourtDisplay
  ]
})
export class HomeCourtDisplayModule {}
