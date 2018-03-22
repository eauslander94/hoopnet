import { Component, NgZone } from '@angular/core';
import { ViewController, NavParams, AlertController, NavController, ModalController } from 'ionic-angular';

import { FriendsPage } from '../../pages/friends-page/friends-page'
import { HomeCourtDisplay } from '../home-court-display/home-court-display';
import { CourtDataService } from '../../services/courtDataService.service';

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

  constructor(private viewCtrl: ViewController,
              private params: NavParams,
              private navCtrl: NavController,
              private modalCtrl: ModalController,
              private courtDataService: CourtDataService,
              private zone: NgZone)
  {
    this.user = params.get('user');
    this.getHomeCourtName();
  }

  // Post: Friends page is pushed onto the naviation stack
  public navToFriends(){
    this.navCtrl.push(FriendsPage, {
      'friends': this.user.friends,
      'myProfile': false
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

}
