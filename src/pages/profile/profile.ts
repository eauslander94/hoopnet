import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Tabs, Events,
         AlertController } from 'ionic-angular';
import { FriendsPage }     from '../friends-page/friends-page';
import { EnterProfileInfo } from '../enter-profile-info/enter-profile-info';
import { HomeCourtDisplay } from '../../components/home-court-display/home-court-display';
import { CourtDataService } from '../../services/courtDataService.service';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class Profile {

  user: any;
  // The id of our current user.  Eventually we will store this in local storage.
  user_id: string;

  // Whether or not we are displaying the profile of the user currently logged in
  myProfile: boolean;

  constructor(public navCtrl: NavController,
              public params: NavParams,
              public modalCtrl: ModalController,
              private tabs: Tabs,
              public events: Events,
              private alertCtrl: AlertController,
              public courtDataService: CourtDataService)
  {
    // If we've got a user in the nav params, display that user. else generate user
    if(params.get('user')){
      this.user = params.get('user');
      this.myProfile = false;
    }
    else {
      this.user = this.generateUser();
      this.myProfile = true;
    }

    this.user_id = '59f0e28dc4f3db7741253df8';
    // To test
    this.putUser();
  }


  getUsers(user_ids: Array<String>){
    this.courtDataService.getUsers(user_ids).subscribe(
      res => {
        console.log(res.json()[0].nName);
      },
      err => {console.log(err)},
      () =>  {}
    )
  }


    putUser(){
      this.courtDataService.putUser(this.generateUser());
    }


  // Post: Friends page is pushed onto navstack
  navToFriends(){
    this.navCtrl.push(FriendsPage, {
      'friends': this.user.friends,
      'friendRequests': this.user.friendRequests,
      'myProfile': this.myProfile,
    });
  }

  navToEnterProfileInfo(){
    this.navCtrl.push(EnterProfileInfo, {'edit': true, 'user': this.user});
  }

  // Post:  HomeCourtDisplay is presented
  presentHomeCourts(){
    let homeCourtDisplay = this.modalCtrl.create(HomeCourtDisplay,
      { homecourts: this.user.homecourts,
        myProfile: this.myProfile
      })
    homeCourtDisplay.onDidDismiss((data) => {
      if(data.toMap){
        // Navigate to first tab
        this.navCtrl.parent.select(0);
        this.events.publish('homeCourtMessage');
      }
    });
    homeCourtDisplay.present();
  }

  // Post:  Action sheet displaying add friend options is presented
  public presentAddSheet(){
    let alert = this.alertCtrl.create({
      subTitle: 'Add ' + this.user.fName + " " + this.user.lName + "?",
      buttons: [
        { text: 'send friend request',
          handler: () => {
            console.log(this.user.nName + ' added');
            // TO DO: put request - pointer to 'current user' put into list of
            // 'param user's friend requests
          }
        },
        { text: 'cancel', role: 'cancel' },
      ]
    })

    alert.present();
  }

  private generateUser(){
    return {
      fName: "Eli",
      nName: "White-Iverson",
      lName: "Auslander",
      _id: '59f7b8e5cf12061d37c159a5',
      // An array of pointers to court objects
      homecourts: ['59f77e89da1d9f295b577f09'],
      // An array of pointers to user objects
      friends: ['59f7b7f44929d51be74ffd09'],
      // Array of pointers to user objects
      friendRequests: ['59f77e89da1d9f295b577f0f'],
      // for now, string link to the image
      avatar: {},
      backgroundImage: {},
      // pointer to the court object the user is beside
      courtside: {},
    }/*
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
      avatar: 'http://cdn.hoopshype.com/i/2f/d5/2b/allen-iverson.png',
      backgroundImage: "https://i.amz.mshcdn.com/kJsKVWzrBmN0e7A4xwcbAyGm9DI=/fit-in/1200x9600/https%3A%2F%2Fblueprint-api-production.s3.amazonaws.com%2Fuploads%2Fcard%2Fimage%2F108414%2FGettyImages-638822.jpg",
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
      avatar: 'http://hickokbelt.com/files/3014/5624/0606/CurryStephen-headshot-sm.jpg',
      backgroundImage: "https://i.pinimg.com/736x/fa/ac/96/faac96d6c158461bff12d6a8e24c5503--nba-now-stephen-curry-quotes.jpg",
      // pointer to the court object the user is beside
      courtside: {},
    }

    //this.user.friends.push(user2);
    //this.user.friends.push(user3);
    */
  }


}
