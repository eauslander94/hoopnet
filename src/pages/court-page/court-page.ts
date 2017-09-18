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

  windowData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // Generate the UI only data upon construction
    this.generateUIData();
  }


  private generateUIData(){
    this.windowData = {
      "games": ["5", "4", "2", "4", "3"],
      "gtime": new Date(),
      "activity": "ACTIVE",
      "atime": new Date(),
      "pNow": []
    }
  }


}
