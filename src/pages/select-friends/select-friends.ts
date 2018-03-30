import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl } from '@angular/forms'
import { CourtDataService } from '../../services/courtDataService.service';
import { SendInvitePage }  from'../send-invite/send-invite';


@IonicPage()
@Component({
  selector: 'page-select-friends',
  templateUrl: 'select-friends.html',
})
export class SelectFriendsPage {

  // The court to which we are inviting friends
  court: any;

  // the term to search by and the form control object
  searchTerm: string = '';
  formControl: FormControl;

  // to display and filter your friends
  friends: Array<any>;
  friendsShowing: Array<any>;
  selected: Array<any> = [];

  user: any;

  allSelected: boolean = false;
  gotFriends: boolean = false;

  ortc: any;

  // Whether or not to show te error message
  error: boolean = false;

  constructor(public navCtrl: NavController,
              public params: NavParams,
              private courtDataService: CourtDataService)
  {
    this.court = params.get('court');
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

  // adds given user to selected
  public select(user){
    // if user is already in selected, remove
    if(this.selected.indexOf(user) > -1)
      this.selected = this.selected.filter(selectedUser => selectedUser != user)
    // otherwise add to selected
    else
      this.selected.push(user);
  }

  // sets style of ceck icon to primary if the user is selected
  public isSelected(user){
    if(this.selected.indexOf(user) > -1)
      return '#33ccff';
    else return "grey";
  }


  public next(){
    if(this.selected.length < 1){
      this.error = true;
      return;
    }
    this.navCtrl.push(SendInvitePage, {
      court: this.court,
      invited: this.selected
    })
  }

}
