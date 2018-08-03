import { Component, Input, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { ModalController, ViewController, AlertController, Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import  moment  from 'moment';
import { Observable } from 'rxjs/Rx';

import { GamesModal }  from "../games-modal/games-modal";
import { WaitTimeModal } from '../wait-time-modal/wait-time-modal';
import { CourtDataService } from '../../services/courtDataService.service';
import { AuthService }      from '../../services/auth.service';
import { QuickCourtsideProvider } from '../../providers/quick-courtside/quick-courtside';
import { ProfileModal } from '../profile-modal/profile-modal';
import { DominoSpinner } from '../domino-spinner/domino-spinner';


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
  loadText: string = 'loading players';

  // user data for players in the window
  playerData: Array<any>;

  // wheter or not we are prompting users to scout the court
  scoutPrompt: boolean = false;
  // which, between players and games, has been validated.
  validated: string = '';
  // coordinates of the court
  coordinates: Array<number>;
  waitNum: string = '';


  constructor (public modalCtrl: ModalController,
               public viewCtrl: ViewController,
               public alertCtrl: AlertController,
               private courtDataService: CourtDataService,
               private quick: QuickCourtsideProvider,
               private geolocation: Geolocation,
               private events: Events,
               private cdr: ChangeDetectorRef,
               private zone: NgZone)
  {
    // Update the living timestamps every minute
    Observable.interval(1000 * 60).subscribe( x => {
      this.updateLivingTimestamps();
    })

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

    // Set wait number
    this.setWaitNum();

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
        this.zone.run(() => {
          this.gotPlayers = true ;
          this.sortPlayers(res.json());
        })
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
      this.updateUI(JSON.parse(message));
    }


  // Post1: new WindowData replaces current window data
  // Post2: living timestamps updated based on new lastValidated values
  public updateUI(newWindowData: any){

    this.windowData = JSON.parse(JSON.stringify(newWindowData));
    this.setWaitNum();
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
        this.courtDataService.scout(this.nwd);

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
        this.courtDataService.scout(this.nwd);

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
    let gamesModal = this.modalCtrl.create(GamesModal, {
      baskets: this.windowData.baskets,
      court_id: this.windowData.court_id,
      inWindow: true
    });

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
          this.courtDataService.scout(this.nwd);  // send data to server
          this.scoutcounter = 0;                          // reset scoutcounter
        }
      }

      // On cancel, when we already have one set of data entered
      else if (this.scoutcounter === 1){
        this.courtDataService.scout(this.nwd);  // send data to server
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
          this.courtDataService.scout(this.nwd);  // send data to server
          this.scoutcounter = 0;                          // reset scoutcounter
        }

      }

      // On cancel, when we already have one set of data entered
      else if (this.scoutcounter === 1){
        this.courtDataService.scout(this.nwd);  // send data to server
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
      // Catch for corrupted checkIn data
      if (!player.hoopString) player.hoopString = 'gametime';
    }

    // finally, based on time and friendship.
    // Priority = 1 - friend of currentUser
    // Priority = 0 - no priority
    this.playerData = players.sort( (a, b) => {
      if(a.priority > b.priority) return -1;
      else if(a.priority < b.priority) return 1;
      if(a.hoopTime && b.hoopTime){
        // if priority is equal, sort by hoopTime
        if(a.hoopTime.getTime() < b.hoopTime.getTime()) return 1;
        else if(a.hoopTime.getTime() > b.hoopTime.getTime()) return - 1;
      }
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
        case "short": return "#2dc937";
        case "medium": return "#007fff";
        case "long": return "red";
        default: return "black";
      }
  } catch(e) {return "black"}
  }

  private setWaitNum(){
    switch(this.windowData.waitTime.toLowerCase()){
      case "short": this.waitNum = '1 - 2 games';  break;
      case "medium": this.waitNum = "2 - 3 games"; break;
      case "long": this.waitNum = "3+ games";      break;
      default: this.waitNum = "";
    }
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


  // ensures that the user is authenticated and at the court
  // param: a string referencing the method to be called once user as been verified
  public verifyCourtside(callbackString: string){

    // ensure we're autenticated
    if(!this.courtDataService.auth.isAuthenticated()){
      this.courtDataService.toastMessage("Log-in to contribute", 3000);
      return;
    }

    // Ensure we're at the court
    this.geolocation.getCurrentPosition().then((position) => {
      if(this.quick.courtside(JSON.parse(this.windowData.court), [position.coords.longitude, position.coords.latitude]))
        // call the corresponding metod
        switch(callbackString){
          case "validateGames":    this.validate('games');     break;
          case 'validateWaitTime': this.validate('waitTime');    break;
          case 'gamesModal':       this.presentGamesModal();   break;
          case 'waitTimeModal':    this.presentWaitTimeModal();  break;
          default: break;
      }
      else this.courtDataService.toastMessage('Log-in to contribute', 3000)
    }).catch((err) => {alert('Error retrieving your current location')})
 }


 // Post:  Profile Modal of provided user is presented
 // Param: user whose profile will be presented
 public presentProfile(user: any){
   if(!this.courtDataService.auth.isAuthenticated()) return;

   // Here, we would restrict access to user's profile if user is private
   this.modalCtrl.create(ProfileModal, {
     user: user,
     myProfile: false,
     inWindow: true
   }).present();
 }















}
