import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import * as Realtime from 'realtime-messaging';

@Component({
  selector: 'window-modal',
  templateUrl: 'window-modal.html',
})
export class WindowModal {

  windowData: any;

  constructor(public viewCtrl: ViewController,
              private params: NavParams)
  {
    this.windowData = params.get('windowData');
    // pass in the realtime client
    this.windowData.realtime = params.get('realtime');
    // Prompt user to enter info
    if(params.get('scoutPrompt'))
      this.windowData.scoutPrompt = params.get('scoutPrompt')
  }

  
  public hackground(){
    // Unless scoutPrompt, dismiss
    if(!this.params.get('scoutPrompt'))
      this.viewCtrl.dismiss({});
  }


}
