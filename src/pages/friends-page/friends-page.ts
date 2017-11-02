import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Profile }     from '../profile/profile';
import { CourtDataService } from '../../services/courtDataService.service';
import 'rxjs/add/operator/debounceTime';

@IonicPage()
@Component({
  selector: 'page-friends-page',
  templateUrl: 'friends-page.html',
})
export class FriendsPage {


  // Friends and requests recieved from profile page
  friends: Array<any>;
  friendRequests: Array<any>;
  gotFriendRequests: boolean = false;

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
              public courtDataService: CourtDataService)
  {
    this.friendRequests = params.get('friendRequests');
    // Whether or not we are viewing the current user's profile
    this.myProfile = params.get('myProfile');

    // Call the server, set friends and friends showing
    this.courtDataService.getUsers(params.get('friends')).subscribe(
      res => {
        this.friends = res.json();
        this.friendsShowing = res.json();
      },
      err => { console.log ('error retrieving users in friends page ' + err) },
      () => {}
    )

    //this.addResults = this.friends;
    this.showing = 'friends';

    this.friendSearchControl = new FormControl;
    this.addSearchControl = new FormControl
  }

  // Post 1: this.showing becomes requests
  // Post 2: Gets friend requests from server upon first click of the tab
  public requestTabTapped(){
    this.showing = 'requests';
    if (this.gotFriendRequests)  return;
    this.gotFriendRequests = true;
    this.courtDataService.getUsers(this.params.get('friendRequests')).subscribe(
      res => { this.friendRequests = res.json(); console.log('got friend requests')},
      err => { console.log('error retrievein friend requests in friends page ' + err)},
      () => {}
    )
  }


  ionViewDidLoad(){
    // wait 700ms before triggering a search so that we don't search on every keystroke
    this.friendSearchControl.valueChanges.debounceTime(10).subscribe(search => {
      this.friendsShowing = this.filterFriends(this.friendSearchTerm);
    });

    // This observable controls the moment at which we ask the server for friends to add
    this.addSearchControl.valueChanges.debounceTime(700).subscribe(search =>{
      if (search === '') {
        this.addResults = [];
        return;
      }
      this.courtDataService.getUsersByName(this.addSearchTerm).subscribe(
        res => { this.addResults = res.json() },
        err => { console.log('error getUsersByName() on friends page ' + err) }
      );
    });
  }



  // Post:  friendsShowing becomes a filtered version of friends
  // Param: string to filter by
  // Returns: filtered version of items
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
  public navToProfile(user: any){
    this.navCtrl.popToRoot();
    this.navCtrl.push(Profile, {'user': user});
  }

  // Post:  Action sheet displaying add friend options is presented
  // Param: user - the user to be potentially added
  public sendRequestSheet(user: any){
    let action = this.actionSheetCtrl.create({
      title: 'Add ' + user.fName + " " + user.lName + "?",
      buttons: [
        { text: 'send friend request',
          handler: () => {
            console.log(user.nName + ' added');
            // TO DO: put request - pointer to 'current user' put into list of
            this.courtDataService.requestFriend(user);
          }
        },
        // Nav to user's profile
        { text: 'view profile',
        handler: () =>{
          this.navToProfile(user);
        }
      },
      { text: 'cancel', role: 'cancel' }
      ]
    })

    action.present();
  }

  // Confirming a friend request
  // Post:  Action sheet displaying friend request options is presented
  // Param: user - the user to be potentially added
  public confirmRequestSheet(user: any){
    let action = this.actionSheetCtrl.create({
      title: 'Confirm ' + user.fName + " " + user.lName + "?",
      buttons: [
        { text: 'add friend',
          handler: () => {

            this.courtDataService.addFriend('currentUser', user._id).subscribe();
            // Below is a 'cheat' to save a server call.  If prolems arise,
            // we can ask server for the actual users from the db.
            this.friends.push(user);
            this.friendRequests.splice(this.friendRequests.indexOf(user));
          }
        },
        // Nav to user's profile
        { text: 'view profile',
        handler: () =>{
          this.navToProfile(user);
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








}
