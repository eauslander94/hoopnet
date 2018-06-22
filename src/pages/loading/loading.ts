import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DominoSpinner } from '../../components/domino-spinner/domino-spinner';


@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html',
})
export class LoadingPage {

  loadingMessage: string = '';

  constructor(public navCtrl: NavController, public params: NavParams) {}

  ionViewDidLoad(){
    this.loadingMessage = this.params.get('loadingMessage');
  }


}
