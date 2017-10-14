import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'action-modal',
  templateUrl: 'action-modal.html'
})
export class ActionModal {


  constructor(public viewCtrl: ViewController) {}

}
