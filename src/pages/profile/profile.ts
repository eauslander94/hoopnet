import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class Profile {


  dummy: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.dummy = "hello";

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Profile');
  }

  public test(){
    this.dummy = "success";
  }

}
