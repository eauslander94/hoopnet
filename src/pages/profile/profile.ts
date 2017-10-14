import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class Profile {

  user: any;

  dummy: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  private generateUser(){
    this.user = {
      "fName": "Eli",
      "nName": "White Iverson",
      "lName": "Auslander",
      // An array of pointers to court objects
      "homecourts": [],
      // An array of pointers to user objects
      "friends": [],
      // pointer to court object
      "lastHcourt": "" ,
      "lastHdate": new Date("September 17, 2017"),
      // for now, string link to the image
      "avatar": '../assets/img/sampleAvatar.jpg',
      "backgroundImage": "https://i.amz.mshcdn.com/kJsKVWzrBmN0e7A4xwcbAyGm9DI=/fit-in/1200x9600/https%3A%2F%2Fblueprint-api-production.s3.amazonaws.com%2Fuploads%2Fcard%2Fimage%2F108414%2FGettyImages-638822.jpg",
      // pointer to the court object the user is beside
      "courtside": {},
    }
  }

  public test(){
    this.dummy = "success";
  }

}
