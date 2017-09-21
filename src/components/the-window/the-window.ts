import { Component, Input } from '@angular/core';
import { ModalController, ViewController } from 'ionic-angular';
import { GamesModal } from "../games-modal/games-modal";

@Component({
  selector: 'the-window',
  templateUrl: 'the-window.html',
})

export class TheWindow {

  @Input() windowData;

  constructor(public modalCtrl: ModalController) {}

  // When games or activityBox has been pressed
  private onPress(tapped){
    if(tapped === "games"){
      console.log("hello")
      this.presentGamesModal();
    }
    else if (tapped === "activity"){
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
      {"baskets": 2/*this.windowData.baskets*/});

    // When the submit button is pressed, log the array of games to the console
    gamesModal.onDidDismiss(data => {
      console.log(data);
    });
    gamesModal.present();
  }


}
