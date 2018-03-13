import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'wait-time-modal',
  templateUrl: 'wait-time-modal.html'
})
export class WaitTimeModal {

  // adjusted for positioning
  margin: any;

  constructor(public viewCtrl: ViewController,
              private params: NavParams) {
    if(params.get('inWindow')){
      this.margin = (document.documentElement.clientHeight - (document.documentElement.clientWidth * .63));
      this.margin += 'px'
    }
    else {
      this.margin = '54vw';
    }
  }

}
