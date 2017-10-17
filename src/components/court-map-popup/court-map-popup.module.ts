import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CourtMapPopup } from './court-map-popup';

@NgModule({
  declarations: [
    CourtMapPopup,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    CourtMapPopup
  ]
})
export class CourtMapPopupModule {}
