import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { CourtDataService } from '../../services/courtDataService.service';
import { SelectFriendsPage } from '../select-friends/select-friends';


@IonicPage()
@Component({
  selector: 'page-court-search',
  templateUrl: 'court-search.html',
})
export class CourtSearchPage {

  // The term by which we query the db
  searchTerm: string = ''
  // searchControl so that we can see when the searchterm changes
  searchControl: FormControl;
  // the array which holds our search results
  searchResults: Array<any>;
  // Our User's homecourts for quick access to their regular courts
  suggestedCourts: Array<any>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public courtDataService: CourtDataService
  ) {
    this.searchControl = new FormControl;
    // Get user's recently visited courts as reference
    this.getSuggestedCourts();
  }

  ionViewDidLoad() {
    // This observable controls the moment at which we ask the server for friends to add
    this.searchControl.valueChanges.debounceTime(700).subscribe(search =>{
      if (search === '') {
        this.searchResults = this.suggestedCourts;
        return;
      }
      this.courtDataService.getCourtsByName(this.searchTerm).subscribe(
        res => { this.searchResults = res.json() },
        err => { console.log('error getUsersByName() on friends page ' + err) }
      );
    });
  }

  // Post: suggested courts and search results set user's recently visited courts
  //       Sorted to put homecourts first
  public getSuggestedCourts(){

    let courts: Array<string> = [];
    courts.concat(JSON.parse(window.localStorage.getItem('currentUser')).homecourts)
    // Loop thru user's recent checkIns, if not already in courts push to courts
    for(let checkIn of JSON.parse(window.localStorage.getItem('currentUser')).checkIns)
      if(courts.indexOf(checkIn.court_id) === -1) courts.push(checkIn.court_id)

    this.courtDataService.getCourtsById(courts).subscribe(
      res => {
        // sort putting homecourts up top
        this.suggestedCourts = res.json().sort((a, b) => {
          if(this.isHomecourt(a._id) && !this.isHomecourt(b._id)) return -1;
          if(!this.isHomecourt(a._id) && this.isHomecourt(b._id)) return 1;
          return 0;
        });
        this.searchResults = this.suggestedCourts;
      },
      err => {alert(err)}
    )
  }

  // Returns: true if court_id is one of the current user's homecourts, false otherwise
  // Param: id of court to be checked
  public isHomecourt(court_id: string){
    if(JSON.parse(window.localStorage.getItem('currentUser')).homecourts.indexOf(court_id) > -1)
      return true;
    return false;
  }


  // Post: Move on to select friends portion of invite friends loop
  // Param: court to be passed to next page
  public courtClicked(court: any){
    this.navCtrl.push(SelectFriendsPage, { court: court} )
  }

}
