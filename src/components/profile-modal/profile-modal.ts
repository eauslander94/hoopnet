import { Component, NgZone } from '@angular/core';
import { ViewController, NavParams, AlertController, NavController, ModalController,
         Events} from 'ionic-angular';

import { HomeCourtDisplay } from '../home-court-display/home-court-display';
import { CourtDataService } from '../../services/courtDataService.service';
import { FriendsPage }      from '../../pages/friends-page/friends-page';

@Component({
  selector: 'profile-modal',
  templateUrl: 'profile-modal.html'
})
export class ProfileModal {

  // user object which holds all profile data
  user: any;

  // to handle loading homecourt name to display
  gotHomecourtName: boolean = false;
  homecourtName: string = "-";

  // To control the margin-top property programatically
  margin: any;

  // Whether or not this is te current user's profile
  myProfile: boolean;

  constructor(private viewCtrl: ViewController,
              private params: NavParams,
              private navCtrl: NavController,
              private modalCtrl: ModalController,
              private courtDataService: CourtDataService,
              private zone: NgZone,
              private alertCtrl: AlertController,
              private events: Events)
  {
    this.user = params.get('user');
    this.getHomeCourtName();
    // Position box correctly
    if(params.get('inWindow')) this.margin = '83vw'
    else this.margin = '54vw';

    if(this.user._id === JSON.parse(window.localStorage.getItem('currentUser'))._id)
      this.myProfile = true;
    else this.myProfile = params.get('myProfile');
    // If we're being used w/ modal wrapper, get viewCtrl from modal wrapper
    if(params.get("viewCtrl"))
      this.viewCtrl = params.get("viewCtrl");
  }

  // Post: Friends page is pushed onto the naviation stack
  public navToFriends(){
    this.navCtrl.push(FriendsPage, {
      friends: this.user.friends,
      myProfile: false
    })
  }

  // Post: Homecourts modal is pulled up
  public presentHomeCourts(){
    if(this.user.homecourts.length === 0) return;
    this.modalCtrl.create(HomeCourtDisplay, {
      'courtPointers': this.user.homecourts,
      'myProfile': this.params.get('myProfile')
    }).present()
  }

  // Post: Name of first homecourt in te list is retreived from db ad set to html
  public getHomeCourtName(){
    if(this.user.homecourts.length === 0) return;
    this.courtDataService.getCourtsById([this.user.homecourts[0]]).subscribe(
      res => {
        this.zone.run(() => {
          this.gotHomecourtName = true;
          this.homecourtName = res.json()[0].name;
        })
      }
    )
  }

  // Post: friend request sent to user
  public addFriend(){
    if(this.isMyFriend()){
      this.removeFriend()
      return;
    }

    let request = this.alertCtrl.create({
      title: 'Request ' + this.user.fName + ' ' + this.user.lName + '?',
      buttons: [
        { text: 'Cancel', handler: ()=> {} },
        { text: 'Send Friend Request', handler: ()=> {
          this.courtDataService.requestFriend(this.user._id)
          request.dismiss().then(() => {
            this.courtDataService.notify('Request sent!', 'A friend request has been sent to ' + this.user.fName + ' ' + this.user.lName + '.')
          })
          return false;
        }}
      ]
    })
    request.present()
  }

  // Post: user and current user are o loner friends
  public removeFriend(){
    let remove = this.alertCtrl.create({
      title: 'Remove ' + this.user.fName + ' ' + this.user.lName + '?',
      buttons: [
        { text: 'Cancel', handler: ()=> {} },
        { text: 'Remove Friend', handler: ()=> {
          // Remove friend, update currentUser
          this.events.publish('removingFriend');  // Tell friends page to present load wheel while waiting for update
          this.courtDataService.removeFriend(this.user._id).subscribe(
            res => { this.events.publish('updateCurrentUser', res.json()[1]) },
            err => this.courtDataService.notify('ERROR', err)
          )
          // dismiss this alert, dismiss profile, present message alert
          remove.dismiss().then(() => {
            this.viewCtrl.dismiss().then(() => {
              this.courtDataService.notify('Friend Removed', 'You and ' + this.user.fName + ' ' + this.user.lName + ' are no longer friends. We hope you patch things up.')
            });
          })
        return false;
        }}
      ]
    })
    remove.present()
  }

  // Returns: true of this is te profile of one of currentUser's Friends, false otherwise
  public isMyFriend(){
    for(let friend of JSON.parse(window.localStorage.getItem('currentUser')).friends)
      if(friend === this.user._id) return true;
    return false;
  }

}
