import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { HoopedCard } from './hooped-card';

@NgModule({
  declarations: [
    HoopedCard,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    HoopedCard
  ]
})
export class HoopedCardModule {}
