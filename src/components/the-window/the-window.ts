import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController, ViewController } from 'ionic-angular';
import { GamesModal }  from "../games-modal/games-modal";
import { ActionModal } from '../action-modal/action-modal';
import  moment  from 'moment';
import {Observable} from 'rxjs/Rx';
import { AnimationService, AnimationBuilder } from 'css-animator';
import { CourtDataService } from '../../services/courtDataService.service';


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

  // For animation
  @ViewChild('alivingTimestamp') alivingTimestampRef: ElementRef;
  @ViewChild('glivingTimestamp') glivingTimestampRef: ElementRef;
  @ViewChild('basket') basket;
  private animator: AnimationBuilder;

  constructor (public modalCtrl: ModalController,
               private animationService: AnimationService,
               private courtDataService: CourtDataService) {

    // Update the living timestamps every minute
    Observable.interval(1000 * 60).subscribe( x => {
      this.updateLivingTimestamps();
    })

    // The morning reset:
    // Check every 59 minutes if the time is between 5:00am and 6:00am
    Observable.interval(1000 * 3540).subscribe( x => {
      // reset window if the hour is 5
      if (new Date().getHours() === 5)  this.resetWindowData();
    })

    this.animator = animationService.builder();
  }

  // When windowData has been initialized, update the living timestamps
  // Post: aLivingTimestamp and gLiving timestamp updated
  ngOnInit(){
    this.updateLivingTimestamps();
  }

  // validate()
  // param: validated: String - games, action, or both
  // pre: validated is either "games", "action" or "both"
  // post: last validated and living timestamp reset for the supplied param
  private validate(validated: String){

    let timeNow:Date = new Date();
    switch(validated){
      case "both": {
        this.windowData.gLastValidated = timeNow;
        this.windowData.aLastValidated = timeNow;
        this.updateLivingTimestamps();
        this.courtDataService.putWindowData(this.windowData);
        break;
      }
      case "games": {
        this.flash(this.glivingTimestampRef);
        this.windowData.gLastValidated = timeNow;
        this.gLivingTimestamp = moment(timeNow).fromNow();  // update the timestamp
        if(this.gLivingTimestamp === "a few seconds ago") this.gLivingTimestamp = "just now";
        this.courtDataService.putWindowData(this.windowData);
        break;
      }
      case "action":{
        this.flash(this.alivingTimestampRef);
        this.windowData.aLastValidated = timeNow;
        this.aLivingTimestamp = moment(timeNow).fromNow();
        if(this.aLivingTimestamp === "a few seconds ago") this.aLivingTimestamp = "just now";
        this.courtDataService.putWindowData(this.windowData);
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
  // Post: Data received is sent to server
  private presentGamesModal(){
    // Pass in the number of baskets at the court
    let gamesModal = this.modalCtrl.create(GamesModal,
      {"baskets": this.windowData.baskets});


    // When the submit button is pressed, set the returned games array to windowdata
    gamesModal.onDidDismiss(data => {
      if(data){
        this.windowData.games = data;
        this.validate("games");
        // TO DO: Send new court data to the server
        //this.courtDataService.putWindowData(this.windowData);
      }


    });
    gamesModal.present();
  }

  // presentActionModal()
  // Pre: User is authenticated and at the court
  // Post: Modal which collects information about court action is presented
  // Post: Data received is sent to server
  private presentActionModal(){

    let actionModal = this.modalCtrl.create(ActionModal,
      {showBackdrop: true, enableBackdropDismiss: true});

    actionModal.onDidDismiss(data => {
      if(data){
        // TO DO: send this data to the server

        this.windowData.action = data.action;
        this.windowData.actionDescriptor = data.actionDescriptor;
        this.validate("action");
        //this.courtDataService.putWindowData(this.windowData);
      }
    })

    actionModal.present();
  }


  //getActionColor()
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
    this.validate("both");
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
