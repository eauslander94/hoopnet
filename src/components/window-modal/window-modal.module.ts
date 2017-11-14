import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { WindowModal } from './window-modal';
import { TheWindow } from '../the-window/the-window';

@NgModule({
  declarations: [
    WindowModal,
    TheWindow,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    WindowModal
  ]
})
export class WindowModalModule {}
