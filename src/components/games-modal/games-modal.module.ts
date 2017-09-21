import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { GamesModal } from './games-modal';

@NgModule({
  declarations: [
    GamesModal,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    GamesModal
  ]
})
export class GamesModalModule {}
