import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'detailed-game-info',
  templateUrl: 'detailed-game-info.html'
})
export class DetailedGameInfoComponent {

  courtName: String;
  params: NavParams;
  basket: any;


  constructor(params: NavParams, public viewCtrl: ViewController) {

    this.basket = params.get("basket");
    this.courtName = params.get("courtName")
  }

  // dismsses the modal, returns to basket list
  dismissModal(){   this.viewCtrl.dismiss();   }
}// Class Paren
