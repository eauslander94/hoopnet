import { Component } from '@angular/core';
import { ViewController, NavParams, ModalController } from 'ionic-angular';
import { Closures } from '../../components/closures/closures';
import { HoursDisplay } from '../../components/hours-display/hours-display';
import { WindowModal }  from '../../components/window-modal/window-modal';

@Component({
  selector: 'court-map-popup',
  templateUrl: 'court-map-popup.html'
})
export class CourtMapPopup {

  court: any;

  // Whether or not the court is currently open
  openNow: boolean;

  constructor(public viewCtrl: ViewController,
              public params: NavParams,
              public modalCtrl: ModalController)
  {
    this.court = params.get('court');
    this.openNow = true;
  }

  // Post: Window Modal is presented
  presentWindowModal(){
    let windowModal = this.modalCtrl.create(WindowModal, {'windowData': this.court.windowData})
    windowModal.present();
  }

  // Post: Closures component is presented
  presentClosures(){
    this.modalCtrl.create(Closures,
      {"closures": this.court.closures,
       "courtBaskets": this.court.baskets,
       "court_id": this.court._id }
    )
    .present();
  }

  // Post: Hours display is presented
  presentHours(){
    this.modalCtrl.create
      (HoursDisplay,{"ot": this.court.openTimes, "ct":this.court.closeTimes})
      .present();
  }

}
