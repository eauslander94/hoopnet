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
      "timeStamp": new Date(2017, 6, 10, 20, 0, 0),
      // valid level
      "validity": {
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

    // data for example text post
    let dummyTextPost = {
      "user": {
        "name": "Steph Curry",
        "avatar": "http://hauteliving.com/wp-content/uploads/2015/06/Stephen-Curry_Credit-Golden-State-Warriors-2.jpg",
        "userID": ""
      },
      "timeStamp": new Date(2017, 6, 20, 20, 0, 0),
      "validity": {
        "total": 3,
        "users": ["Kobe Bryant", "LeBron James", "Russell Westbrook"]
      },
      "text": "AI killing today. Nobody out here can guard him."
    }

    // dummy text post with empty object as data
     let post2 = {
       "type": "text",
       "data": dummyTextPost
     }

     // Example Picture Post
     let dummyPicturePost = {
       "user": {
         "name": "Julius 'Dr. J' Erving",
         "avatar": "http://www.eurweb.com/wp-content/uploads/2012/06/julius_dr_j_erving2012-headshot-big.jpg",
         "userID": ""
       },
       "timeStamp": new Date(2017, 6, 20, 20, 0, 0),
       "validity": {
         "total": 24,
         "users": ["Kobe Bryant", "LeBron James", "Russell Westbrook"]
       },
       "picture": "../assets/img/drJ.jpg",
       "caption": "It all started at the playground."
     }

     let post3 = {
       "type": "picture",
       data: dummyPicturePost
     }


    this.posts.push(post);
    this.posts.push(post2);
    this.posts.push(post3);
  }

}
