import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular'; 

@Component({
  selector: 'window-modal',
  templateUrl: 'window-modal.html'
})
export class WindowModal {

  windowData: any;

  constructor(public viewCtrl: ViewController,
              private params: NavParams)
  {
    this.windowData = params.get('windowData');
  }

}
