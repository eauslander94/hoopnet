import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ActionModal } from './action-modal';

@NgModule({
  declarations: [
    ActionModal,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    ActionModal
  ]
})
export class ActionModalModule {}
