import { Component, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ModalController, ViewController, AlertController, Events } from 'ionic-angular';
import { GamesModal }  from "../games-modal/games-modal";
import { WaitTimeModal } from '../wait-time-modal/wait-time-modal';
import  moment  from 'moment';
import { Observable } from 'rxjs/Rx';
import { AnimationService, AnimationBuilder } from 'css-animator';
import { CourtDataService } from '../../services/courtDataService.service';
import { AuthService }      from '../../services/auth.service';
import { QuickCourtsideProvider } from '../../providers/quick-courtside/quick-courtside';
import { Geolocation } from '@ionic-native/geolocation';


import * as Realtime from 'realtime-messaging';

import { SocketIOClient } from 'socket.io-client';
import * as io from "socket.io-client";

@Component({
  selector: 'the-window',
  templateUrl: 'the-window.html',
})

export class TheWindow {

  // The data which populates the window, coming in from a court object
  @Input() windowData;

  // The living timestamp times, converted into momentjs objects
  gLivingTimestamp: any;
  wLivingTimestamp: any;

  // For connecting to the server socket
  socketURL: string;
  socket: any;

  // Controls the behavioral loop for entering window data
  scoutcounter:number = 0;
  // Holds data which is used to update the window
  nwd:any;

  realtime: Realtime.Client;

  // whether or not we've retreived player data from db
  gotPlayers: boolean = false;
  // user data for players in the window
  playerData: Array<any>;

  // wheter or not we are prompting users to scout the court
  scoutPrompt: boolean = false;
  // which, between players and games, has been validated.
  validated: string = '';
  // coordinates of the court
  coordinates: Array<number>;

  animating: boolean = false;

  // For animation - lowercase l
  @ViewChild('wlivingTimestamp') wLivingTimestampRef: ElementRef;
  @ViewChild('glivingTimestamp') gLivingTimestampRef: ElementRef;
  @ViewChild('basket') basket;
  private animator: AnimationBuilder;

  constructor (public modalCtrl: ModalController,
               public viewCtrl: ViewController,
               public alertCtrl: AlertController,
               private animationService: AnimationService,
               private courtDataService: CourtDataService,
               private quick: QuickCourtsideProvider,
               private geolocation: Geolocation,
               private events: Events,
               private cdr: ChangeDetectorRef)
  {

    // Update the living timestamps every minute
    Observable.interval(1000 * 60).subscribe( x => {
      this.updateLivingTimestamps();
    })

    // For animation
    this.animator = animationService.builder();

    // Get the route on which we listen for window updates
    this.socketURL = courtDataService.route;
    // set got players flag to false
    this.gotPlayers = false;

  }

  // When windowData has been initialized, update the living timestamps
  // Post: wLivingTimestamp and gLiving timestamp updated
  ngOnInit(){

    // Update the timestamps
    this.updateLivingTimestamps();

    // Set nwd to window data, it will be updated as we go along
    this.resetNWD();

    // If we've got realtime capabilities coming in, set up connection to webhook
    if(this.windowData.realtime){

      this.realtime = this.windowData.realtime;
      // if connected, subscribe to realtime channel corresponding to this window
      this.realtime.onConnected = () => {
        this.realtime.subscribe("windowUpdate" + this.windowData.court_id, false, this.onUpdate.bind(this));
      }
      // set the court's coordinates
      this.coordinates = this.windowData.coordinates;
    }

    // get actual player data from list of pointers provided
    this.courtDataService.windowGetUsers(this.windowData.players).subscribe(
      res => {
        this.gotPlayers = true;
        this.sortPlayers(res.json());
      },
      err => {
        console.log(err + 'err getPlayers in theWindow')
      }
    )

    // If we are to prompt user to scout the court
    if(this.windowData.scoutPrompt)
      this.scoutPrompt = true;
  }

    // Let the window come to life! UI update on any change from the server
    onUpdate(client: Realtime.Client, channel: string, message: string) {
      this.windowData.dataChanged = true;
      //alert(JSON.parse(message).wLastValiddated)
      this.updateUI(JSON.parse(message));
    }


  // Post1: new WindowData replaces current window data
  // Post2: living timestamps updated based on new lastValidated values
  // Post3: Update animations fired, if their correspong data were updated
  // Param: new windowData to update the old
  public updateUI(newWindowData: any){

    // If we have a new waitTime, animate waitTime and its timestamp
    if(newWindowData.waitTime !== this.windowData.waitTime){
      //animate waitTime, here
      this.flash(this.wLivingTimestampRef)
    }
    // Just new timestamp, animate just that
    else if(newWindowData.wLastValiddated !== this.windowData.wLastValiddated)
      this.flash(this.wLivingTimestampRef)
    // Check if we have a new games array, if so animate and its timestamp
    let newGames = false;
    for(let game in this.windowData.games){
      if(newWindowData.games[game] !== this.windowData.games[game]){
        newGames = true
      }
    }
    if(newGames){
      //animate games, here
      this.flash(this.gLivingTimestampRef)
    }
    // Just new timestamp, animate just that
    else if(newWindowData.gLastValidated !== this.windowData.gLastValidated)
      this.flash(this.gLivingTimestampRef)

    // alert(moment(newWindowData.wLastValiddated).fromNow())
    this.windowData = JSON.parse(JSON.stringify(newWindowData));
    // alert("data from message: " + new Date(newWindowData.wLastValiddated).getMinutes());
    // alert("now our window: " + new Date(this.windowData.wLastValiddated).getMinutes());
    this.resetNWD();
    this.updateLivingTimestamps();
  }


  // validate()
  // param: validated: String - games or waitTime
  // pre: validated is either "games" or "waitTime"
  // post: nwd updated with current time for last validated, data sent to server
  private validate(validated: String){

    switch(validated){
      case "games": {
        this.nwd.gLastValidated = new Date();
        this.courtDataService.putWindowData(this.nwd);

        // Keeping track of what has been validated during scoutPrompt
        if(this.scoutPrompt){
          this.validated += 'g';
          if(this.validated.includes('a')){
            this.validated = '';
            this.viewCtrl.dismiss({invite: true});
          }
        }
        break;
      }
      case "waitTime":{
        this.nwd.wLastValiddated = new Date();
        this.courtDataService.putWindowData(this.nwd);

        // Keeping track of what has been validated during scoutPrompt
        if(this.scoutPrompt){
          this.validated += 'a';
          if(this.validated.includes('g')){
            this.validated = '';
            this.viewCtrl.dismiss({invite: true});
          }
        }

        break;
      }
      default: break;
    }
  }


  // Post: both living timestamps have been replaced with their current
  //       'ago' values
  private updateLivingTimestamps(){

    this.wLivingTimestamp = moment(this.windowData.wLastValidated).fromNow();
    this.gLivingTimestamp = moment(this.windowData.gLastValidated).fromNow();
    // enter "just now" for a few seconds ago
    if(this.wLivingTimestamp === "a few seconds ago") this.wLivingTimestamp = "just now";
    if(this.gLivingTimestamp === "a few seconds ago") this.gLivingTimestamp = "just now";

    if (!this.cdr['destroyed'])
      this.cdr.detectChanges();
  }


  // presentGamesModal()
  // Pre: User is authenticated and at the court. This is handled by verifyCourtside()
  // Post: Model which collects information about games being currently played
  //    is presented
  // PostSubmit 1: waitTimeModal is presented if its data hasn't already been collected
  // PostSubmit 2: nwd is sent to server
  // Post Cancel: nwd is sent to server if we are coming from games modal. else nada
  private presentGamesModal(){

    // Pass in the number of baskets at the court
    let gamesModal = this.modalCtrl.create(GamesModal,
      {"baskets": this.windowData.baskets, "inWindow": true});

    // Dismiss logic
    gamesModal.onDidDismiss(data => {
      if(data){

        this.nwd.games = data.games;  // update nwd with new games array
        this.nwd.gLastValidated = new Date();
        this.scoutcounter++;                          // increment scoutcounter
        // Keeping track of what has been validated during scoutPrompt
        if(this.scoutPrompt){
          this.validated += 'g';
          if(this.validated.includes('a')){
            this.validated = '';
            this.viewCtrl.dismiss({invite: true});
          }
        }
        // Where we are in enter window data behavioral loop
        if(this.scoutcounter === 1)       // just games entered
          this.presentWaitTimeModal()
        else if(this.scoutcounter === 2){ // both games and waitTime entered
          this.courtDataService.putWindowData(this.nwd);  // send data to server
          this.scoutcounter = 0;                          // reset scoutcounter
        }
      }

      // On cancel, when we already have one set of data entered
      else if (this.scoutcounter === 1){
        this.courtDataService.putWindowData(this.nwd);  // send data to server
        this.scoutcounter = 0;                          // reset scoutcounter
      }
    });
    gamesModal.present();
  }



  // presentWaitTimeModal()
  // Pre: User is authenticated and at the court
  // Post: Modal which collects information about court waitTime is presented
  // PostSubmit 1: Games modal is presented if it's data hasn't already been collected
  // PostSubmit 2: nwd is sent to server
  // Post Cancel: nwd is sent to server if we are coming from waitTimeModal. else nada
  private presentWaitTimeModal(){

    let waitTimeModal = this.modalCtrl.create(WaitTimeModal, {"inWindow": true});

    waitTimeModal.onDidDismiss(data => {
      if(data){

        // increment scoutcounter
        this.scoutcounter++;

        // update nwd with new waitTime data
        this.nwd.waitTime = data.waitTime;
        this.nwd.wLastValidated = new Date();
        // Keeping track of what has been validated during scoutPrompt
        if(this.scoutPrompt){
          this.validated += 'a';
          if(this.validated.includes('g')){
            this.validated = '';
            this.viewCtrl.dismiss({invite: true});
            return;
          }
        }
        // Where we are in enter window data behavioral loop
        if(this.scoutcounter === 1)       // just  entered
          this.presentGamesModal()
        else if(this.scoutcounter === 2){ // both games and waitTime entered
          this.courtDataService.putWindowData(this.nwd);  // send data to server
          this.scoutcounter = 0;                          // reset scoutcounter
        }

      }

      // On cancel, when we already have one set of data entered
      else if (this.scoutcounter === 1){
        this.courtDataService.putWindowData(this.nwd);  // send data to server
        this.scoutcounter = 0;                          // reset scoutcounter
      }
    })

    waitTimeModal.present();
  }

  // post: playerDaya is sorted by criteria described below
  // param: Array of user objects to be sorted
  // Time complexity: O(n^2). Players is capped at 50. We're good.
  public sortPlayers(players: Array<any>){

    // get the current user, if present. We will access their friends
    let gotCurrentUser: boolean = false;
    let currentUser;
    if(window.localStorage.getItem('currentUser')){
      currentUser = JSON.parse(window.localStorage.getItem('currentUser'))
      gotCurrentUser = true;
    }

    // this loop gets the hoopString for each player and calculates her priority
    for(let player of players){
      // priotity used for sorting
      player.priority = 0;

      // if current user is friends with the player
      if(gotCurrentUser)
        if(currentUser.friends.indexOf(player._id) > -1)
          player.priority ++;

      // loop trough player's checkIns, Get the correct time at which player was at this court
      for(let checkIn of player.checkIns){
        // get the player's checkIn object of this court
        if(checkIn.court_id == this.windowData.court_id){
          // set hoopTime & hoopString so that window can display the player's time
          player.hoopTime = new Date(checkIn.in);
          player.hoopString = moment(player.hoopTime).fromNow();
        }
      }
    }

    // finally, based on time and friendship.
    // Priority = 1 - friend of currentUser
    // Priority = 0 - no priority
    this.playerData = players.sort( (a, b) => {
      if(a.priority > b.priority) return -1;
      else if(a.priority < b.priority) return 1;
      // if priority is equal, sort by hoopTime
      if(a.hoopTime.getTime() < b.hoopTime.getTime()) return 1;
      else if(a.hoopTime.getTime() > b.hoopTime.getTime()) return - 1;
      return 0;
    });
    // tell angular that we ave canges
    if (!this.cdr['destroyed'])
      this.cdr.detectChanges();
  }


  // post: color green, yellow, red is returned based on the value of waitTime
  private getWaitColor(){
    try{
      switch(this.windowData.waitTime.toLowerCase()){
        case "0 - 1": return "#2dc937";
        case "1 - 2": return "#007fff";
        case "3+": return "red";
        default: return "black";
      }
  } catch(e) {return "black"}
  }


  // resetWindowData
  // post: games array is emptied
  private resetWindowData(){
    this.windowData.games = [];
    this.validate("games");
  }


  // Post: nwd data is replaced with current windowData
  private resetNWD(){
    let wd = JSON.parse(JSON.stringify(this.windowData));
    this.nwd = {
      court_id: wd.court_id,
      baskets: wd.baskets,
      games: wd.games,
      gLastValidated: wd.gLastValidated,
      waitTime: wd.waitTime,
      wLastValidated: wd.wLastValidated,
      players: wd.players,
    };
  }


  // fadeInRight(object)
  // param: object - String - the object to be faded in
  // post:  object fades in from the right
  private flash(ref: ElementRef){

    // if animating, wait for animation finised event, return
    if(this.animating){
      this.events.subscribe('animationFinished', () => {
        //alert('we waited');
        this.animating = true;
        this.animator.setType('flash').show(ref.nativeElement).then(() => {
          this.animating = false;
          this.events.publish('animationFinished');
          this.events.unsubscribe('animationFinished');
        });
      });
    }
    else {
    // otherwise flash then notify app we're done flasing
    this.animating = true;
    this.animator.setType('flash').show(ref.nativeElement).then(() => {
      this.animating = false;
      this.events.publish('animationFinished');
    });
  }
  }


  private wiggle(){
    this.animator.setType('shake').show(this.basket.nativeElement);
  }


  private fadeOut(ref: ElementRef){
    this.animator.setType('fadeOut').show(ref.nativeElement);
  }

  // ensures that the user is authenticated and at the court
  // param: a string referencing the method to be called once user as been verified
  public verifyCourtside(callbackString: string){

    // ensure we're autenticated
    if(!this.courtDataService.auth.isAuthenticated()){
      this.courtDataService.toastMessage("You must be logged in to contribute", 3000);
      return;
    }
    // ensure we are courtside, first check based on time
    if(!this.quick.timeCheck(this.coordinates)){
      // Verify versus user's current location
      this.geolocation.getCurrentPosition().then((position) => {
        if(!this.quick.isCourtside(this.coordinates, [position.coords.longitude, position.coords.latitude]))
          this.courtDataService.toastMessage('You must be at this court to scout this court', 3000)
        else{
          // call the corresponding metod
          switch(callbackString){
            case "validateGames":    this.validate('games');     break;
            case 'validateWaitTime': this.validate('waitTime');    break;
            case 'gamesModal':       this.presentGamesModal();   break;
            case 'waitTimeModal':    this.presentWaitTimeModal();  break;
            default: break;
        }
        }
      }).catch((err) => {alert('Error retrieving your current location')})
    }
    else{
      // call the corresponding metod
      switch(callbackString){
        case "validateGames":  this.validate('games');     break;
        case 'validateWaitTime': this.validate('waitTime');    break;
        case 'gamesModal':     this.presentGamesModal();   break;
        case 'waitTimeModal':    this.presentWaitTimeModal();  break;
        default: break;
    }
}
}














}
