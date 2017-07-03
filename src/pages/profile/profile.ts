import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the Profile page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class Profile {

  // For scrollable list
  cards: any;
  category: String = 'gear';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.cards = new Array(10);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Profile');
  }

}
