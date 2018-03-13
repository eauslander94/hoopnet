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
      this.margin = (document.documentElement.clientHeight - (document.documentElement.clientWidth * .63));
      this.margin += 'px'
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
      message: "Enter the average wait time across all games currently being played.\n\n We understand that this value varies from game to game, and as players come and go.  Use your best estimate.  Your fellow players thank you.",
      buttons: [{
        text: "got it",
        role: 'cancel'
      }]
    }).present();
  }


}
