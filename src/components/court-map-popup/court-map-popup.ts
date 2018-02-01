import { Component } from '@angular/core';
import { ViewController, NavParams, ModalController } from 'ionic-angular';
import { Closures } from '../../components/closures/closures';
import { HoursDisplay } from '../../components/hours-display/hours-display';
import { WindowModal }  from '../../components/window-modal/window-modal';
import * as Realtime from 'realtime-messaging';


@Component({
  selector: 'court-map-popup',
  templateUrl: 'court-map-popup.html'
})
export class CourtMapPopup {

  court: any;

  // Whether or not the court is currently open
  openNow: boolean = true;

  constructor(public viewCtrl: ViewController,
              public params: NavParams,
              public modalCtrl: ModalController)
  {
    this.court = params.get('court');
    this.openNow = true;

  }

  // Post: Window Modal is presented, connect to realtime.co webhook
  presentWindowModal(){

    // connect to realtime webhook upon presenting window, pass it in
    const realtime = Realtime.createClient();
    realtime.setClusterUrl('https://ortc-developers.realtime.co/server/ssl/2.1/');
    realtime.connect('pLJ1wW', 'testToken')

    let windowModal = this.modalCtrl.create(WindowModal,
      { 'windowData': this.court.windowData,
        'realtime': realtime }
    )

    // Disconnect when dismissing theWindow
    windowModal.onDidDismiss( () => {
      realtime.disconnect();
    })
    
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
