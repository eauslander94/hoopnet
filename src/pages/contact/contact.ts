import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Http, Response } from '@angular/http';
//import { NavController } from 'ionic-angular';

import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  dummy: any;
  constructor(public http: Http, public navCtrl: NavController) {

  }

  getRequest(){
    this.dummy = "let's hoop";
    let eli = {
      "hello": "world",
      "ball?": "hell yeah!"
    }
    let eli2 = this.http.put('http://localhost:3000/', JSON.stringify(eli) )
      //.map(res => {res = res.json()})
      .subscribe(res => this.dummy = res.text);
  }

}
