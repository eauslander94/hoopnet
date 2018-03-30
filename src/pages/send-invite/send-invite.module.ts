import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendInvitePage } from './send-invite';

@NgModule({
  declarations: [
    SendInvitePage,
  ],
  imports: [
    IonicPageModule.forChild(SendInvitePage),
  ],
  exports: [
    SendInvitePage
  ]
})
export class SendInvitePageModule {}
