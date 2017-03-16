import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';
import {EnterDetailedInfoPage} from '../../pages/enter-detailed-info/enter-detailed-info'

@Component({
  selector: 'page-enter-basic-info',
  templateUrl: 'enter-basic-info.html'
})
export class EnterBasicInfoPage {

  skillLevel: any;
  selectOptions: any;
  skillDescriptor: Array<String>;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl: AlertController) {
    this.skillLevel = {
      "lower": 65,
      "upper": 85
    }

    this.selectOptions = {
      title: 'game'
    }

  }// constructor paren

  // post: EnterDetailedInfoPage is pushed onto nav stack
  enterDetailedInfo(){
    this.navCtrl.push(EnterDetailedInfoPage);
  }

  // post: TEMPORARY pops, retuening to basket list page
  submit(){
    this.presentSubmitMessage();
  }

  //method that creates alert message
  // post: alert message is posted to screen
  presentSubmitMessage(){
    let alert = this.alertCtrl.create({
      title: "Got your data!",
      message: "Thank you for contributing to your local court. Your fellow ballers thank you.",
      buttons: [
      {   text: "Enter Detailed Information",
          handler: () => { this.navCtrl.push(EnterDetailedInfoPage); }
      },
      {   text: "Return To Court Homepage",
          handler: () => {this.navCtrl.pop();}
      }
      ]
    })

    alert.present();
  }

}
