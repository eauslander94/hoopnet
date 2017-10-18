import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Data }  from '../../providers/data';
import 'rxjs/add/operator/debounceTime';

@IonicPage()
@Component({
  selector: 'page-friends-page',
  templateUrl: 'friends-page.html',
})
export class FriendsPage {

  // Friends and requests recieved from profile page
  friends: Array<any>
  friendRequests: Array<any>;

  items: any;
  searchTerm: string = '';
  searchControl: FormControl;

  // Which tab is currently showing
  showing: string;

  constructor(public navCtrl: NavController,
              public params: NavParams,
              public dataService: Data)
  {
    this.friends = params.get('freinds');
    this.friendRequests = params.get('friendRequests');
    this.showing = 'friends';

    this.searchControl = new FormControl;
  }

  ionViewDidLoad(){
    this.setFilteredItems();

    // wait 700ms before triggering a search so that we don't search on every keystroke
    this.searchControl.valueChanges.debounceTime(10).subscribe(search => {
      this.setFilteredItems();
    });
  }

  // Post:  Our items is replaced by items filtered by our search term
  setFilteredItems(){
    this.items = this.dataService.filterItems(this.searchTerm)
  }

  // Post:  showing is switched to the given parameter
  // Param: string switchTo - the string which we will switch showing to
  // Pre:   switchTo is either 'friends' 'add' or 'requests'
  public tabSwitch(switchTo: string){  this.showing = switchTo;  }

}
