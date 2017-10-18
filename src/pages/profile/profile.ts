import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FriendsPage }     from '../friends-page/friends-page';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class Profile {

  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams)
  {
    this.generateUser();
  }


  // Post: Friends page is pushed onto navstack
  navToFriends(){
    this.navCtrl.push(FriendsPage, {
      friends: this.user.friends,
      friendRequests: this.user.friendRequests,
    });
  }

  private generateUser(){
    this.user = {
      fName: "Eli",
      nName: "White Iverson",
      lName: "Auslander",
      // An array of pointers to court objects
      homecourts: [],
      // An array of pointers to user objects
      friends: [],
      // Array of pointers to user objects
      friendRequests: [{}, {}],
      // for now, string link to the image
      avatar: '../assets/img/sampleAvatar.jpg',
      backgroundImage: "https://i.amz.mshcdn.com/kJsKVWzrBmN0e7A4xwcbAyGm9DI=/fit-in/1200x9600/https%3A%2F%2Fblueprint-api-production.s3.amazonaws.com%2Fuploads%2Fcard%2Fimage%2F108414%2FGettyImages-638822.jpg",
      // pointer to the court object the user is beside
      courtside: {},
    }
    let user2 = {
      fName: "Allen",
      nName: "The Answer",
      lName: "Iverson",
      // An array of pointers to court objects
      homecourts: [],
      // An array of pointers to user objects
      friends: [],
      // Array of pointers to user objects
      friendRequests: [{}, {}],
      // for now, string link to the image
      avatar: '../assets/img/IversonAvatar.jpg',
      backgroundImage: "",
      // pointer to the court object the user is beside
      courtside: {},
    }

    let user3 = {
      fName: "Stephen",
      nName: "",
      lName: "Curry",
      // An array of pointers to court objects
      homecourts: [],
      // An array of pointers to user objects
      friends: [],
      // Array of pointers to user objects
      friendRequests: [{}, {}],
      // for now, string link to the image
      avatar: '../assets/img/curryAvatar.jpg',
      backgroundImage: "",
      // pointer to the court object the user is beside
      courtside: {},
    }

    this.user.friends.push(user2);
    this.user.friends.push(user3);
  }


}
