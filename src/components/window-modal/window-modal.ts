import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import * as Realtime from 'realtime-messaging';

@Component({
  selector: 'window-modal',
  templateUrl: 'window-modal.html',
})
export class WindowModal {

  court: any;
  windowData: any;

  constructor(public viewCtrl: ViewController,
              private params: NavParams)
  {
    this.court = params.get('court');
    this.windowData = params.get('court').windowData;
    this.windowData.coordinates = this.court.location.coordinates;

    // pass in the realtime client
    this.windowData.realtime = params.get('realtime');
    // Prompt user to enter info
    if(params.get('scoutPrompt'))
      this.windowData.scoutPrompt = params.get('scoutPrompt')
  }


  public hackground(){
    // Unless scoutPrompt, dismiss
    if(!this.params.get('scoutPrompt'))
      // Tell map to reload if window changes have occurred
      if(this.windowData.dataChanged)
        this.viewCtrl.dismiss({'reload': true, '_id': this.court._id});
      else this.viewCtrl.dismiss({})
  }


}
