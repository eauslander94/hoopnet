import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Profile }     from '../profile/profile';
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
              public actionSheetCtrl: ActionSheetController)
  {
    this.friends = params.get('friends');
    this.friendsShowing = this.friends;
    this.friendRequests = params.get('friendRequests');

    this.myProfile = params.get('myProfile');
    // Post server hookup:
    // get users associated with friend request pointers when we hit the requests tab
    // For now, just set it to friends for some dummy data
    this.friendRequests = this.friends;
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
    this.addSearchControl.valueChanges.debounceTime(700).subscribe(search =>{
      this.addSearch();
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
  public presentAddSheet(user: any){
    let action = this.actionSheetCtrl.create({
      title: 'Add ' + user.fName + " " + user.lName + "?",
      buttons: [
        { text: 'send friend request',
          handler: () => {
            console.log(user.nName + ' added');
            // TO DO: put request - pointer to 'current user' put into list of
            // 'param user's friend requests
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

  // Post:  Action sheet displaying friend request options is presented
  // Param: user - the user to be potentially added
  public presentRequestSheet(user: any){
    let action = this.actionSheetCtrl.create({
      title: 'Confirm ' + user.fName + " " + user.lName + "?",
      buttons: [
        { text: 'add friend',
          handler: () => {
            console.log(user.nName + ' added');
            // TO DO: Add friends put
            // Takes pointers to 2 users, adds each to the list of the other's friends
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
