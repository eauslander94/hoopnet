import { Component, Input } from '@angular/core';
import { ModalController, ViewController, ActionSheetController } from 'ionic-angular';
import { GamesModal } from "../games-modal/games-modal";

@Component({
  selector: 'the-window',
  templateUrl: 'the-window.html',
})

export class TheWindow {

  @Input() windowData;

  constructor(public modalCtrl: ModalController,
              public actionSheetCtrl: ActionSheetController) {}

  // When games or activityBox has been pressed
  private onPress(tapped){
    if(tapped === "games"){
      console.log("hello")
      this.presentGamesModal();
    }
    else if (tapped === "activity"){
      this.actionPrompt();
      this.windowData.atime = new Date();
    }
  }

  // When games or activityBox has been double tapped
  private onDoubleTap(tapped){
    if (tapped === "games")
      this.windowData.gtime = new Date();
    else if (tapped === "activity")
      this.windowData.atime = new Date();
  }

  // presentGamesModal()
  // Pre: User is authenticated and at the court
  // Post: Model which collects information about games being currently played
  //    is presented
  private presentGamesModal(){
    // Pass in the number of baskets at the court
    let gamesModal = this.modalCtrl.create(GamesModal,
      {"baskets": 4/*this.windowData.baskets*/});

    // When the submit button is pressed, set the returned games array to windowdata
    gamesModal.onDidDismiss(data => {
      this.windowData.games = data;
      //TO DO:   Reset living timesamp

      // TO DO: Send new court data to the server
    });
    gamesModal.present();
  }


  // present actionPrompt()
  // pre: User is authenticated and at the court
  // post: action sheet is presented, collects data about current action,
  //       and sends it to the server.
  actionPrompt() {

    let actionPrompt = this.actionSheetCtrl.create({
      title: 'Describe the court\'s action',
      buttons: [
        {text: "Active", handler:()=> {
          this.windowData.action = "Active"
          this.windowData.actionDescriptor = "Continuous runs";
          // TO DO: send this data to the server
        }},
        {text:'Packed', handler:()=> {
          this.windowData.action = "Packed";
          this.windowData.actionDescriptor = "Long wait times";
          //TO DO: send this data to server
        }},
        {text: 'Empty', handler: () => {
          this.windowData.action = "Empty"
          this.windowData.actionDescriptor = "Need more players";
          // TO DO: send this data to the server
          }},
        {text: 'Cancel', role:'cancel', handler:()=> {}}
      ]
    })

    actionPrompt.present();
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




















}
