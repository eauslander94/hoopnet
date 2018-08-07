import { Component } from '@angular/core';
import { ViewController, NavParams, AlertController } from 'ionic-angular';

@Component({
  selector: 'wait-time-modal',
  templateUrl: 'wait-time-modal.html'
})
export class WaitTimeModal {

  // adjusted for positioning
  margin: any;

  // Whether or not we are in te window
  inWindow: boolean;

  constructor(public viewCtrl: ViewController,
              private params: NavParams,
              private alertCtrl: AlertController) {
    if(params.get('inWindow')){
      this.inWindow = true;
      this.margin = '83vw';
    }
    else {
      this.inWindow = false;
      this.margin = '54vw';
    }
  }

    // Presents alert displaying information on ow to scout for wait time
  public info(){

    this.alertCtrl.create({
      title: "How to Scout Wait Time",
      message: "Across the entire court complex, how many games must a new player wait before playing? If you have next game, your wait time is 1. And so on. Please enter your best estimate. Thank you.",
      buttons: [{
        text: "got it",
        role: 'cancel'
      }]
    }).present();
  }


}
