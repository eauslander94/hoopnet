import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// components
import { BasketListComponent } from '../../components/basket-list/basket-list'

@Component({
  selector: 'page-one-court',
  templateUrl: 'one-court.html'
})
export class OneCourtPage {

court: any;
courtName: String;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.court = this.navParams.get('court');
    if(this.court)
      this.courtName = this.court.name;
    else this.courtName = "TestCourt"
  }

}
