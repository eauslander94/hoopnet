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
  court: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // Generate the UI only data upon construction
    this.generateUIData();
  }


  private generateUIData(){

    this.court = {
      "name": "Tompkins Square Park",
      "type": "indoor",
      // a latLng location
      "location": {
        lat: "",
        lng: "",
      },
      "baskets": 4,
      "windowData": {
        "baskets": 4,
        "games": ["5", "4", "2"],
        "gLastValidated": new Date(),
        "action": "Active",
        "actionDescriptor": "continuous runs",
        "aLastValidated": new Date(),
        "pNow": []
      },
      "hours": {},
      "closures": {},
    }

    this.windowData = this.court.windowData;

    this.windowData.gLastValidated.setMinutes(this.windowData.gLastValidated.getMinutes() - 5);
    this.windowData.aLastValidated.setMinutes(this.windowData.aLastValidated.getMinutes() - 5);
  }


}
