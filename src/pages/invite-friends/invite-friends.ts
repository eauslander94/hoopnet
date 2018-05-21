import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl } from '@angular/forms'
import { CourtDataService } from '../../services/courtDataService.service';
import { RealtimeProvider } from '../../providers/realtime/realtime';


@IonicPage()
@Component({
  selector: 'page-invite-friends',
  templateUrl: 'invite-friends.html',
})
export class InviteFriendsPage {

  // the term to search by and the form control object
  searchTerm: string = '';
  formControl: FormControl;

  // to display and filter your friends
  friends: Array <any>;
  friendsShowing: Array <any>;
  invited: Array <string> = []

  user: any;

  allSelected: boolean = false;
  gotFriends: boolean = false;

  constructor(public navCtrl: NavController,
              public params: NavParams,
              private courtDataService: CourtDataService,
              private realtime: RealtimeProvider)
  {
    this.formControl = new FormControl;
    this.user = JSON.parse(window.localStorage.getItem('currentUser'))

    // Call the server, set friends and friends showing
    this.courtDataService.getUsers(this.user.friends).subscribe(
      res => {
        this.friends = res.json();
        this.friendsShowing = res.json();
        this.gotFriends = true;
      },
      err => { console.log ('error retrieving users in friends page ' + err) },
    )
  }

  ionViewDidLoad(){
    this.formControl.valueChanges.debounceTime(10).subscribe(search => {
      this.friendsShowing = this.filterFriends(this.searchTerm);
    });
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

  // adds given user to invited
  public select(_id){
    // if user is already in invited, remove
    if(this.invited.indexOf(_id) > -1)
      this.invited = this.invited.filter(user => user !== _id)
    // otherwise add to invited
    else
      this.invited.push(_id);
  }

  // sets style of ceck icon to primary if the user is selected
  public isSelected(_id){
    if(this.invited.indexOf(_id) > -1)
      return '#33ccff';
    else return "grey";
  }

  // toggles between selecting and unselecting all friends
  public selectAll(){
    // if all have been selected, set to false and empty invited
    if(this.allSelected){
      this.allSelected = false;
      this.invited = []
    }
    // otherwise set to true and fill invited
    else{
      this.allSelected = true;
      for(let user of this.friends)
        this.invited.push(user._id);
    }
  }

  public send(){

    let user = JSON.parse(window.localStorage.getItem('currentUser'))
    // massage te message
    let message = user.fName + " "
       + user.lName + ' is currently hooping at '
       + this.params.get('courtName') + ' and wants you to join him.'

    let payload = {
      messageType: 'hoopingNow',
      location: this.params.get('location'),
      message: message
    }

    this.realtime.notify(this.invited, payload, user.fName + " " + user.lName + ' is playing at ' + this.params.get('courtName') + '.')
    this.navCtrl.pop()
  }

}
