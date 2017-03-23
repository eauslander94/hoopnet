import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-enter-detailed-info',
  templateUrl: 'enter-detailed-info.html'
})
export class EnterDetailedInfoPage {

  physicality: number = 75;
  ballMovement: number = 75;
  wait: number = 2.7;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  // post: TEMPORARY: pops twice, retuening to basket list
  submit(){
    this.navCtrl.pop();
  }

}// EnterDetailedInfo paren
