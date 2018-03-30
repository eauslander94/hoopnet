import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectFriendsPage } from './select-friends';

@NgModule({
  declarations: [
    SelectFriendsPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectFriendsPage),
  ],
  exports: [
    SelectFriendsPage
  ]
})
export class InviteFriendsPageModule {}
