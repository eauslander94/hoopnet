import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { WindowModal } from '../components/window-modal/window-modal';

@Component({
  template: '<ion-nav [root]="root" [rootParams]="paramsPassedToModal"></ion-nav> ',
})
export class ModalWrapper {
  root: any;
  paramsPassedToModal: any;

  constructor(
    public paramsPassedToMe: NavParams,
    viewCtrl: ViewController,
  ) {
    this.root = paramsPassedToMe.get("modalContent");
    // pass modal provided params & our view controller
    this.paramsPassedToModal = Object.assign({}, paramsPassedToMe.data, {viewCtrl: viewCtrl});
  }
}

// @Component({
//   template: '<div class="hackground"></div><ion-nav [root]="root" [rootParams]="paramsPassedToModal"></ion-nav> ',
//   styles: ['ion-nav {border: 2px solid blue!important; height: 58vw;}']
// })
