import { Component, NgZone, ElementRef, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ViewController, NavParams, Content, ModalController, NavController, Events } from 'ionic-angular';

import { HoursDisplay }  from '../hours-display/hours-display';
import { AuthService }   from '../../services/auth.service';
import { CourtDataService } from '../../services/courtDataService.service';

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
              public events: Events)
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
    if(this.isOpenNow()) this.openString = 'open';
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
        if(this.isOpenNow()) this.openString = 'open';
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


  // Returns: true if court is currently open for pick-up, false otherwise
  public isOpenNow(){
    // get te dayOfWeek
    let day = new Date().getDay();

    // If outside the court's hours for today, return false
    if(this.afterCurrentTime(this.court.openTimes[day]) // if currently before court's open time for today
    || this.beforeCurrentTime(this.court.closeTimes[day])){ // if currently after court's close time for today
      return false;
    }

    // Check for a closure curently going on right now
    let closedNow = false;
    for(let closure of this.court.closures){

      // if closure is not in effect today, or it does not take up all baskets
      if(closure.days[day] === 0 || closure.baskets < this.court.baskets)
        continue;  // move on to next closure

      // if closure is in effect right now, the court is closed
      if(this.beforeCurrentTime(closure.clStart) // If currently after te beginning of the closure
      && this.afterCurrentTime(closure.clEnd)){ // If currently before the end of the closure
        closedNow = true;
        break;
      }
    }
    if(closedNow) return false;
    // If we got here the court is open, triumphantly return true
    return true;
  }



  // Performs a strictly time-based comparison between provided date and current time
  // Param: UTC timestring to be compared to the current time
  // Returns: True if date is before current time(by milliseconds), false otherwise
  public beforeCurrentTime(dateString: string){
    let now = new Date();
    let date = new Date(dateString);
    // set day, month and year to today for a strictly time comparison
    date.setFullYear(now.getFullYear(), now.getMonth(), now.getDate())
    return (date.getTime() < now.getTime())
  }

  // Performs a strictly time-based comparison between provided date and current time
  // Param: the UTC timestring to be compared to the current time
  // Returns: True if date is after current time(by milliseconds), false otherwise
  public afterCurrentTime(dateString: string){
    let now = new Date();
    let date = new Date(dateString);
    // set day, month and year tyo today for a strictly time comparison
    date.setFullYear(now.getFullYear(), now.getMonth(), now.getDate())
    return (date.getTime() > now.getTime())
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
