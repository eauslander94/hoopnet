import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Tabs, Events,
         AlertController } from 'ionic-angular';
import { FriendsPage }     from '../friends-page/friends-page';
import { EnterProfileInfo } from '../enter-profile-info/enter-profile-info';
import { HomeCourtDisplay } from '../../components/home-court-display/home-court-display';
import { CourtDataService } from '../../services/courtDataService.service';
import { AuthService } from '../../services/auth.service';
import { JwtHelper } from 'angular2-jwt'

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

  homecourtObjects: Array<any> = [];
  gotHomeCourts: boolean = false;

  constructor(public navCtrl: NavController,
              public params: NavParams,
              public modalCtrl: ModalController,
              private tabs: Tabs,
              public events: Events,
              private alertCtrl: AlertController,
              public courtDataService: CourtDataService,
              public auth: AuthService)
  {
    // User in params - someone else's profile. otherwise go get current user
    if(params.get('user')){
      this.user = params.get('user');
      this.myProfile = false;
    }
    else {
      this.myProfile = true;
      // Get a blank user object ready to be filled
      this.user = this.generateUserTemplate();

      if(auth.isAuthenticated()){
       // use the authID in our id_token to retreive the current user
       courtDataService.getUsersByAuth_id(new JwtHelper().decodeToken
         (this.auth.getStorageVariable('id_token')).sub)
         .subscribe(
           data => {
             // populate with data retreived
             this.user = data.json();
             this.user_id = this.user._id;
             this.courtDataService.currentUser = this.user._id;
             this.getHomecourts();
           },
           err => {
             console.log("error getUsersByAuth_id");
           }
         )
     }
    }

    // On login event, get user's profile or prompt to enter profle info
    events.subscribe('loggedIn', ()=> {
      let jwtHelper = new JwtHelper();
      let sub = jwtHelper.decodeToken(this.auth.getStorageVariable('id_token')).sub;

      courtDataService.getUsersByAuth_id(sub)
        .subscribe(
          data => {
            // If we've got an existing user, populate with user data returned
            if(data.json().fName){
              this.user = data.json();
              this.user_id = this.user._id;
              this.courtDataService.currentUser = this.user._id;
              this.getHomecourts();
            }
            // If not, promt to enter profile info
            else
              this.navCtrl.push(EnterProfileInfo, {'edit': false, 'auth_id': sub})
          },
          err => {console.log("error getUsersByAuth_id on profile page")}
        )
  })
  }

  // Post: this.homecourtObjects is populated with court objects from db
  // Pre:  This.user has been loaded
  getHomecourts(){
    if (this.user.homecourts.length === 0) return;
    this.courtDataService.getCourtsById(this.user.homecourts).subscribe(
      res => { this.homecourtObjects = res.json(); console.log(res.json()) },
      err => { console.log('error: getCourtsById on profile page ' + err) }
    )
  }

  getCurrentUser(){
    this.courtDataService.getCurrentUser().subscribe(
      res => { this.user = res.json()[0]; console.log(this.user.fName)},
      err => { console.log('error getCurrentUser() on profile page\n' + err)}
    )
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


  // Post: Friends page is pushed onto navstack
  navToFriends(){
    this.navCtrl.push(FriendsPage, {
      'friends': this.user.friends,
      'friendRequests': this.user.friendRequests,
      'myProfile': this.myProfile,
    });
  }

  // Post: enter profile info page is pushed with edit set to true
  // Used for editing profile information
  navToEnterProfileInfo(){
    this.navCtrl.push(EnterProfileInfo, {'edit': true, 'user': this.user});
  }


  // Post:  HomeCourtDisplay is presented
  presentHomeCourts(){
    if (!this.homecourtObjects[0]) return;
    let homeCourtDisplay = this.modalCtrl.create(HomeCourtDisplay,
      { homecourts: this.homecourtObjects,
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
            // TODO: check to see if this.user is one of currentUser's friends
            this.courtDataService.requestFriend(this.user._id);
            console.log(this.user.nName + ' added');
          }
        },
        { text: 'cancel', role: 'cancel' },
      ]
    })

    alert.present();
  }

  // Generates blank user object as a placeholder while we retreive user data
  generateUserTemplate(){
    return {
      fName: "",
      nName: "",
      lName: "",
      // get the auth_id passed in nav params.
      auth_id: this.params.get('auth_id'),
      // An array of pointers to court objects
      homecourts: [],
      // An array of pointers to user objects
      friends: [],
      // Array of pointers to user objects
      friendRequests: [],
      // for now, string link to the image
      avatar: {},
      backgroundImage: {},
      // pointer to the court object the user is beside
      courtside: "",
    }
  }


  // Generates a test user
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
