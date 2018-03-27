import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import moment from 'moment';

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
    this.openTimes = this.formatTimestrings(params.get("ot"));
    this.closeTimes = this.formatTimestrings(params.get("ct"));

    // loop tuesday - friday, if any one differs from monday return false
    let index = 2;  this.MFsame = true;
    while (index < 6){
      // If any day differs from Monday, either open or close
      if (this.openTimes[1] !== this.openTimes[index]
      ||  this.closeTimes[1] !== this.closeTimes[index]){
        this.MFsame = false;  break; //set to false and break
      }
      index++;
    }

  }

  // Returns: array of massaged string representations of date objects
  // Param:   array of date objects to be converted
  public formatTimestrings(rawStrings: Array<Date>){

    let sexyStrings: Array<string> = []
    for(let date of rawStrings){
      let sexyString = moment(date).format('h:mma');
      sexyStrings.push(sexyString.substring(0, sexyString.length - 1));
    }
    return sexyStrings;
  }

}
