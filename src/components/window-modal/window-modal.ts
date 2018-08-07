import { Component, NgZone, ElementRef, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ViewController, NavParams, Content, ModalController, NavController, Events } from 'ionic-angular';

import { HoursDisplay }  from '../hours-display/hours-display';
import { AuthService }   from '../../services/auth.service';
import { CourtDataService } from '../../services/courtDataService.service';
import { CourtHelper }   from '../../providers/court-helper/court-helper';

import * as Realtime from 'realtime-messaging';

@Component({
  selector: 'window-modal',
  templateUrl: 'window-modal.html',
})
export class WindowModal {

  court: any;
  windowData: any;

  // Whether or not the court is currently open for pick-up
  openNow: boolean;
  openString: string;

  marginNumber: number;
  marginMin: number;
  marginMax: number;
  margin: string;

  expanded: boolean;

  @ViewChild(Content) content: Content;


  constructor(public viewCtrl: ViewController,
              private params: NavParams,
              public zone: NgZone,
              public renderer: Renderer2,
              public cdr: ChangeDetectorRef,
              public modalCtrl: ModalController,
              public navCtrl: NavController,
              public auth: AuthService,
              public courtDataService: CourtDataService,
              public events: Events,
              public courtHelper: CourtHelper)
  {
    this.court = params.get('court');
    this.windowData = params.get('court').windowData;
    this.windowData.coordinates = this.court.location.coordinates;

    let court = JSON.stringify(params.get('court'))
    this.windowData.court = court;

    // pass in the realtime client
    this.windowData.realtime = params.get('realtime');
    // Prompt user to enter info
    if(params.get('scoutPrompt'))
      this.windowData.scoutPrompt = params.get('scoutPrompt')

    // Find out if the court is open right now
    if(this.courtHelper.isOpenNow(this.court)) this.openString = 'open';
    else this.openString = 'closed';
  }


  // Post: hours modal is presented
  public presentHours(){

    this.modalCtrl.create(HoursDisplay, {
      ot: this.court.openTimes,
      ct: this.court.closeTimes
    }).present()
  };


  // Post: Closures Modal is presented
  public presentClosures(){

    this.navCtrl.push('CourtClosingsPage', {
      closures: this.court.closures,
      courtBaskets: this.court.baskets,
      court_id: this.court._id
    })

    this.events.subscribe('closingsDismissed', (data) => {
      this.court.closures = data;
      // Check if court as opened or closed based on closures
      this.zone.run(() => {
        if(this.courtHelper.isOpenNow(this.court)) this.openString = 'open';
        else this.openString = 'closed';
      })
    })
  }


  // Post: Invite Friends Page is pused onto the naviation stack
  public presentInviteFriends(){

    if(!this.auth.isAuthenticated()){
      this.courtDataService.toastMessage(
        'Log in to invite friends to hoop!',
        3000
      )
      return;
    }
    this.navCtrl.push('SelectFriendsPage', { court: this.court})
  }


  // dismiss logic
  public hackground(){

    // Unless scoutPrompt, dismiss
    if(!this.params.get('scoutPrompt'))
      // Tell map to reload if window changes have occurred
      if(this.windowData.dataChanged)
        this.viewCtrl.dismiss({'reload': true, '_id': this.court._id});
      else this.viewCtrl.dismiss({})
  }
}
