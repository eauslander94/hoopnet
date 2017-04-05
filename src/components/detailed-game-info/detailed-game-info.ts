import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'detailed-game-info',
  templateUrl: 'detailed-game-info.html'
})
export class DetailedGameInfoComponent {

  wait: number;
  physicality: number;
  ballMovement: number;
  params: NavParams;


  constructor(params: NavParams, public viewCtrl: ViewController) {
    this.wait = params.get("wait");
    this.physicality = params.get("physicality");
    this.ballMovement = params.get("ballMovement");
  }

  // dismsses the modal, returns to basket list
  dismissModal(){   this.viewCtrl.dismiss();   }
}// Class Paren
