import { Component, NgZone } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController,
         ModalController, Events } from 'ionic-angular';
import 'rxjs/add/operator/debounceTime';

import { ProfileModal }     from '../../components/profile-modal/profile-modal';
import { CourtDataService } from '../../services/courtDataService.service';

@IonicPage()
@Component({
  selector: 'page-friends-page',
  templateUrl: 'friends-page.html',
})
export class FriendsPage {


  // Friends and requests recieved from profile page
  friends: Array<any>;
  // Friend Request User Objects
  friendRequests: Array<any>;
  // Pointers to friend request user objects
  requestPointers: Array<string>
  gotFriendRequests: boolean;

  friendLoading: boolean = true;
  addLoading: boolean = false;
  requestsLoading: boolean = true;

  // So that when we filter friends we do not lose values that were filtered out
  friendsShowing: Array<any>;

  // the results from querying our server for friends to add
  addResults: Array<any>;

  // the search queries for adding friends
  friendSearchTerm: string = '';
  addSearchTerm: string = '';
  // Form Controls
  friendSearchControl: FormControl;
  addSearchControl: FormControl;

  // Which tab is currently showing
  showing: string;

  //whether or not we are viewing the profile of the user currently logged in
  myProfile: boolean;

  constructor(public navCtrl: NavController,
              public params: NavParams,
              public actionSheetCtrl: ActionSheetController,
              public courtDataService: CourtDataService,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              public events: Events,
              public zone: NgZone)
  {
    this.requestPointers = params.get('friendRequests');
    this.gotFriendRequests = false;
    // Whether or not we are viewing the current user's profile
    this.myProfile = params.get('myProfile');

    // Call the server, set friends, friends showing and friend requests
    this.getFriends(params.get('friends'))
    this.getFriendRequests(params.get('friendRequests'))

    //this.addResults = this.friends;
    this.showing = 'friends';

    this.friendSearchControl = new FormControl;
    this.addSearchControl = new FormControl
  }


  ionViewDidLoad(){
    // wait 700ms before triggering a search so that we don't search on every keystroke
    this.friendSearchControl.valueChanges.debounceTime(10).subscribe(search => {
      this.friendsShowing = this.filterFriends(this.friendSearchTerm);
    });

    // This observable controls the moment at which we ask the server for friends to add
    this.addSearchControl.valueChanges.debounceTime(500).subscribe(search => {
      if (search === '') {
        this.addResults = [];
        return;
      }
      this.addLoading = true;
      this.courtDataService.getUsersByName(this.addSearchTerm).subscribe(
        res => {
          this.addResults = res.json()
          this.addLoading = false;
        },
        err => this.courtDataService.notify('Error', err)
      );
    });

    this.events.subscribe('updateCurrentUser', (user) => {
      this.zone.run(() => {
        this.getFriends(user.friends);
      })
    })

    // Load wheel, updateCurrentUser event soon to follow
    this.events.subscribe('removingFriend', () => {
      this.zone.run(() => {
        this.friendLoading = true;
      })
    })
  }


  // Post: friends and friends showing set to friends retrieved
  // Param: array of ids of friends to be retreived
  public getFriends(friend_ids: Array<string>){
    // Call the server, set friends and friends showing
    this.courtDataService.getUsers(friend_ids).subscribe(
      res => {
        this.friends = res.json();
        this.friendsShowing = res.json();
        this.friendLoading = false;
      },
      err => { this.courtDataService.notify('Error', err) },
    )
  }


  // Post: Freind Requests set to usere retreived, got friend requests becomes true
  public getFriendRequests(ids: Array<string>){
    this.courtDataService.getUsers(ids).subscribe(
      res => {
        this.friendRequests = res.json();
        this.gotFriendRequests = true;
        this.requestsLoading = false;
      },
      err => { this.courtDataService.notify('Error', err)},
    )
  }


  // Post 1: this.showing becomes requests
  // Post 2: Gets friend requests if we aven't already
  public requestTabTapped(){
    this.showing = 'requests';
    if (this.gotFriendRequests) return;
    this.getFriendRequests(this.requestPointers);
  }




  // Post:  friendsShowing becomes a filtered version of friends
  // Param: string to filter by
  // Returns: filtered version of this.friends
  private filterFriends(searchTerm: string){

    return this.friends.filter((profile) => {
      // Return true if item matches the searchterm(both lowercased)
      let name = profile.fName + " " + profile.nName + " " + profile.lName;
      return name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
    })
  }

  // Post:  DB is queried for users whose names match the searchterm.
  public addSearch(){
    // If searchterm is blank don't query the db
    if(this.addSearchTerm === '')
      this.addResults = [];
    // Below is only temporary
    else
      this.addResults = this.filterFriends(this.addSearchTerm);
  }

  // Post:  profile page is pulled up with the clicked friend's profile
  // Param: user - the user whose page we will pull up
  public presentProfile(user: any){
    this.modalCtrl.create(ProfileModal, {
      user: user,
      myProfile: false
    }).present()
  }

  alreadyFriendsAlert(user: any) {
    let alert = this.alertCtrl.create({
      subTitle: user.fName + ' ' + user.lName + ' is already your friend',
      buttons: ['Dismiss']
    }).present();
  }
  requestedYouAlert(user: any) {
    let alert = this.alertCtrl.create({
      subTitle: user.fName + ' ' + user.lName + ' has already requested you',
      buttons: ['Dismiss']
    }).present();
  }

  // Confirming a friend request
  // Post:  Action sheet displaying friend request options is presented
  // Param: user - the user to be potentially added
  public confirmRequestSheet(user: any){
    let action = this.actionSheetCtrl.create({
      title: 'Confirm ' + user.fName + " " + user.lName + "?",
      buttons: [
        { text: 'Add Friend',
          handler: () => {
            // load wheel, get updated user
            this.requestsLoading = true;
            this.courtDataService.confirmFriendRequest('currentUser', user._id).subscribe(
              res => {
                // Update currentUser, pull added user from requests & requestPointers
                this.events.publish('updateCurrentUser', res.json()[0])
                this.friendRequests.splice(this.friendRequests.indexOf(user), 1);
                this.requestPointers.splice(this.requestPointers.indexOf(user._id), 1)
                this.requestsLoading = false;
              },
              err => {this.courtDataService.notify('Error', err)}
            );
          }
        },
        // Nav to user's profile
        { text: 'View Profile',
        handler: () =>{
          this.presentProfile(user);
        }
      },
      { text: 'cancel', role: 'cancel' }
      ]
    })

    action.present();
  }

  // Post:  showing is switched to the given parameter
  // Param: string switchTo - the string which we will switch showing to
  // Pre:   switchTo is either 'friends' 'add' or 'requests'
  public tabSwitch(switchTo: string){
    this.showing = switchTo;
  }

  // Post user data is refreshed and saved, refresher stops spinning
  public doRefresh(refresher: any){
    this.courtDataService.getUsersByAuth_id(JSON.parse(window.localStorage.getItem('currentUser')).auth_id)
    .subscribe(res => {
      this.events.publish('updateCurrentUser', res.json())
      this.getFriendRequests(res.json().friendRequests);
      refresher.complete()
    },
    err => {
      this.courtDataService.notify('Error', 'Error refreshing user data'),
      refresher.complete()
    })
  }








}
