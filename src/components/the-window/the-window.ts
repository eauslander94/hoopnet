import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController, ViewController } from 'ionic-angular';
import { GamesModal }  from "../games-modal/games-modal";
import { ActionModal } from '../action-modal/action-modal';
import  moment  from 'moment';
import { Observable} from 'rxjs/Rx';
import { AnimationService, AnimationBuilder } from 'css-animator';
import { CourtDataService } from '../../services/courtDataService.service';
import { AuthService }      from '../../services/auth.service';
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
  aLivingTimestamp: any;

  // For connecting to the server socket
  socketURL: String = 'http://localhost:3000/'
  socket: any;

  // Controls the behavioral loop for entering window data
  scoutcounter:number = 0;
  // Holds data which is used to update the window
  nwd:any;

  // For animation
  @ViewChild('alivingTimestamp') alivingTimestampRef: ElementRef;
  @ViewChild('glivingTimestamp') glivingTimestampRef: ElementRef;
  @ViewChild('basket') basket;
  private animator: AnimationBuilder;

  constructor (public modalCtrl: ModalController,
               private animationService: AnimationService,
               private courtDataService: CourtDataService)
  {

    // Update the living timestamps every minute
    Observable.interval(1000 * 60).subscribe( x => {
      this.updateLivingTimestamps();
    })

    // For animation
    this.animator = animationService.builder();
  }

  // When windowData has been initialized, update the living timestamps
  // Post: aLivingTimestamp and gLiving timestamp updated
  ngOnInit(){

    // Update the timestamps
    this.updateLivingTimestamps();

    // Set nwd to window data, it will be updated as we go along
    this.resetNWD();

    // Let the window come to life! UI update on any change from the server
    this.socket = io(this.socketURL);
    this.socket.on("windowUpdate" + this.windowData.court_id, (data)=> {
      this.updateUI(data);
    })
  }


  // Post1: new WindowData replaces current window data
  // Post2: living timestamps updated based on new lastValidated values
  // Post3: Update animations fired, if their correspong data were updated
  // Param: new windowData to update the old
  private updateUI(newWindowData: any){

    // If we have a new action, animate action and its timestamp
    if(newWindowData.action !== this.windowData.action){
      //animate action, here
      this.flash(this.alivingTimestampRef)
    }
    // Just new timestamp, animate just that
    else if(newWindowData.aLastValidated !== this.windowData.aLastValidated)
      this.flash(this.alivingTimestampRef)

    // Check if we have a new games array, if so animate and its timestamp
    let newGames = false;
    for(let game in this.windowData.games){
      if(newWindowData.games[game] !== this.windowData.games[game]){
        newGames = true
      }
    }
    if(newGames){
      //animate games, here
      this.flash(this.glivingTimestampRef)
    }
    // Just new timestamp, animate just that
    else if(newWindowData.gLastValidated !== this.windowData.gLastValidated)
      this.flash(this.glivingTimestampRef)

    this.windowData = newWindowData;
    this.resetNWD();
    this.updateLivingTimestamps();
  }


  // validate()
  // param: validated: String - games or action
  // pre: validated is either "games" or "action"
  // post: nwd updated with current time for last validated, data sent to server
  private validate(validated: String){

    switch(validated){
      case "games": {
        this.nwd.gLastValidated = new Date();
        this.courtDataService.putWindowData(this.nwd);
        break;
      }
      case "action":{
        this.nwd.aLastValidated = new Date();
        this.courtDataService.putWindowData(this.nwd);
        break;
      }
      default: break;
    }
  }


  // Post: both living timestamps have been replaced with their current
  //       'ago' values
  private updateLivingTimestamps(){
    this.aLivingTimestamp = moment(this.windowData.aLastValidated).fromNow();
    this.gLivingTimestamp = moment(this.windowData.gLastValidated).fromNow();
    // enter "just now" for a few seconds ago
    if(this.aLivingTimestamp === "a few seconds ago") this.aLivingTimestamp = "just now";
    if(this.gLivingTimestamp === "a few seconds ago") this.gLivingTimestamp = "just now";
  }


  // presentGamesModal()
  // Pre: User is authenticated and at the court
  // Post: Model which collects information about games being currently played
  //    is presented
  // PostSubmit 1: ActionModal is presented if its data hasn't already been collected
  // PostSubmit 2: nwd is sent to server
  // Post Cancel: nwd is sent to server if we are coming from games modal. else nada
  private presentGamesModal(){

    // ensure we're authenticated
    if(!this.courtDataService.auth.isAuthenticated()){
      this.courtDataService.toastMessage("You must be logged in to perform this action", 3000);
      return;
    }

    // Pass in the number of baskets at the court
    let gamesModal = this.modalCtrl.create(GamesModal,
      {"baskets": this.windowData.baskets});

    // Dismiss logic
    gamesModal.onDidDismiss(data => {
      if(data){
        this.nwd.games = data.map(String);  // update nwd with new games array
        this.nwd.gLastValidated = new Date();
        this.scoutcounter++;                          // increment scoutcounter
        console.log("scoutcounter: " + this.scoutcounter);
        // Where we are in enter window data behavioral loop
        if(this.scoutcounter === 1)       // just games entered
          this.presentActionModal()
        else if(this.scoutcounter === 2){ // both games and action entered
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


  // presentActionModal()
  // Pre: User is authenticated and at the court
  // Post: Modal which collects information about court action is presented
  // PostSubmit 1: Games modal is presented if it's data hasn't already been collected
  // PostSubmit 2: nwd is sent to server
  // Post Cancel: nwd is sent to server if we are coming from actionModal. else nada
  private presentActionModal(){

    // make sure we're authenticated
    if(!this.courtDataService.auth.isAuthenticated()){
      this.courtDataService.toastMessage("You must be logged in to perform this action", 3000);
      return;
    }

    let actionModal = this.modalCtrl.create(ActionModal,
      {showBackdrop: true, enableBackdropDismiss: true});

    actionModal.onDidDismiss(data => {
      if(data){

        // increment scoutcounter
        this.scoutcounter++;

        // update nwd with new action data
        this.nwd.action = data.action;
        this.nwd.actionDescriptor = data.actionDescriptor;
        this.nwd.aLastValidated = new Date();

        // Where we are in enter window data behavioral loop
        if(this.scoutcounter === 1)       // just action entered
          this.presentGamesModal()
        else if(this.scoutcounter === 2){ // both games and action entered
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

    actionModal.present();
  }


  // post: color, green, yellow, red, is returned based on the value of action
  private getActionColor(){
    switch(this.windowData.action.toLowerCase()){
      case "active": return "green";
      case "packed": return "red";
      case "empty": return "#FFB300";
      default: return "black";
    }
  }


  // resetWindowData
  // post: action is set to empty and games array is emptied
  private resetWindowData(){
    this.windowData.games = [];
    this.windowData.action = "Empty";
    this.windowData.actionDescriptor = "Need more players";
    this.validate("games");
    this.validate("action");
  }


  // Post: nwd data is replaced with current windowData
  private resetNWD(){
    let wd = this.windowData;
    this.nwd = {
      court_id: wd.court_id,
      baskets: wd.baskets,
      games: wd.games,
      gLastValidated: wd.gLastValidated,
      action: wd.action,
      actionDescriptor: wd.actionDescriptor,
      aLastValidated: wd.aLastValidated,
      pNow: wd.pNow,
    };
  }


  // fadeInRight(object)
  // param: object - String - the object to be faded in
  // post:  object fades in from the right
  private flash(ref: ElementRef){
    this.animator.setType('flash').show(ref.nativeElement);
  }


  private wiggle(){
    this.animator.setType('shake').show(this.basket.nativeElement);
  }


  private fadeOut(ref: ElementRef){
    this.animator.setType('fadeOut').show(ref.nativeElement);
  }









































}
