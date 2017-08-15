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

  posts: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // Generate the dummy reports upon construction
    this.posts = [];
    this.generateDummyReports();
  }

  private generateDummyReports() {
    let dummyReport = {
      // attempt to create date Jun 10 2017, 10:00a
      "timeStamp": new Date(2017, 6, 10, 10, 0, 0),
      // valid level
      "valid": {
        "total": 9,
        "usersUp": [],
        "userdDown": []
      },
      "hoopingNow": "0-10",
      // Games array
      "games": [
        {
          "game": 5,
          "details": {},
          "comments": {}
        },
        {
          "game": 4,
          "details": {},
          "comments": {}
        },
        {
          "game": 2,
          "Details": {},
          "comments": {}
        }]
    }

    let post = {
      "type": "courtReport",
      "data": dummyReport
    }

    let post2 = {
      "type": "courtReport",
      "data": dummyReport
    }

    this.posts.push(post);
    //this.posts.push(post2);
  }

}
