import { Component, Input } from '@angular/core';
import { PopoverController, ModalController } from 'ionic-angular';
import { DetailedGameInfoComponent } from '../../components/detailed-game-info/detailed-game-info';


import { CourtDataService } from '../../services/courtDataService.service';

@Component({
  selector: 'basket-list',
  templateUrl: 'basket-list.html',
})

export class BasketListComponent {

  dummy: any;
  @Input() court;

  constructor(private courtDataService: CourtDataService,
              public modalCtrl: ModalController) {}

  presentDetailedBasketInfo(basket){
    let detailedBasketInfo = this.modalCtrl.create(DetailedGameInfoComponent,
      { "basket": basket,
        "courtName": this.court.name }
    );
    detailedBasketInfo.present();
  }



} //Basket List Component paren
