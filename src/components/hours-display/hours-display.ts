import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'hours-display',
  templateUrl: 'hours-display.html'
})
export class HoursDisplay {

  // monday(0) - sunday(6) based arrays, representing the time that the court
  //  opens and closes
  openTimes: Array<string>;
  closeTimes: Array<string>;

  // Whether or not monday-friday have the same hours
  MFsame:boolean;

  moment:String;

  constructor(public viewCtrl: ViewController, params: NavParams) {
    this.openTimes = params.get("ot");
    this.closeTimes = params.get("ct");

    // check if monday-friday have the same hours
    let index = 1;  this.MFsame = true;
    while (index < 5){
      // If any day differs from Monday, either open or close
      if (this.openTimes[0] !== this.openTimes[index]
      ||  this.closeTimes[0] !== this.closeTimes[index]){
        this.MFsame = false;  break; //set to false and break
      }
      index++;
    }

  }

}
