import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


/**
 * Generated class for the CourtPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-court-page',
  templateUrl: 'court-page.html',
})
export class CourtPage {

  courtReport: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  // Build dummy data court report used for testing
  private buildReport() {
    this.courtReport = {
      "games": ["5v5", "4v4", "2v2"],
      "timeStamp": Date(),
      "valid": {
        "total": 7,
        "usersUp": [],
        "usersDown": []
      },
      "DetailedInfo": {}
    }
  }

}
