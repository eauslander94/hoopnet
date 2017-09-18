import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { TheWindow } from './the-window';


@NgModule({
  declarations: [
    TheWindow,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    TheWindow
  ]
})
export class TheWindowModule {}
