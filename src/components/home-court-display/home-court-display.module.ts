import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { HomeCourtDisplay } from './home-court-display';
import { TheWindow } from '../../the-window/the-window';

@NgModule({
  declarations: [
    HomeCourtDisplay,
    TheWindow
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    HomeCourtDisplay
  ]
})
export class HomeCourtDisplayModule {}
