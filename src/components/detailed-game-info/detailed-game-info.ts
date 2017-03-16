import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'detailed-game-info',
  templateUrl: 'detailed-game-info.html'
})
export class DetailedGameInfoComponent {

  wait;
  params: NavParams;

  constructor(params: NavParams, public viewCtrl: ViewController) {
    this.wait = params.get("wait");
  }

  // dismsses the modal, returns to basket list
  dismissModal(){   this.viewCtrl.dismiss();   }
}// Class Paren
