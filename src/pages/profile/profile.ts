
import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events,
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
              public events: Events,
              private alertCtrl: AlertController,
              public courtDataService: CourtDataService,
              public auth: AuthService,
              private cdr: ChangeDetectorRef,
              public zone: NgZone)
  {
    // set user data to te param passed in
    this.user = params.get('user');
    this.myProfile = params.get('myProfile')

    // Update profile page wen editProfileInfo was navigated to from profile page
    events.subscribe('profileInfoEntered', (user) => {
      this.saveUser(user);
      this.events.publish('gotCurrentUser')
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

  // saves user to this.user, saves clone of user without images to local storage
  public saveUser(user: any){
    // zone.run triggers change detection
    this.zone.run(() => {
      this.user = user;
      this.user_id = user._id;
    })
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

  // post: auth service's logout method is called
  // Post: checks out of given court if we are currently checked in
  public logout(){

    this.auth.logout()
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
  }
