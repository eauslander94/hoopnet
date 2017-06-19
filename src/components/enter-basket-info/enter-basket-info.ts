import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { EnterDetailedInfoPage} from '../../pages/enter-detailed-info/enter-detailed-info';

/*
  Generated class for the EnterBasketInfo component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'enter-basket-info',
  templateUrl: 'enter-basket-info.html'
})
export class EnterBasketInfoComponent {


    skillLevel: any;
    selectOptions: any;
    skillDescriptor: Array<String>;
    basket: any;
    url: any;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private alertCtrl: AlertController) {

      this.basket = navParams.get("basket");

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

    // post: data is sent to server
    // alert prompts user for navigation options
    submit(){

      this.presentSubmitMessage();  // present the prompt
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
