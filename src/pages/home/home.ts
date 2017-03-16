import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
//import { NavController } from 'ionic-angular';

import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

//import { BasketListComponent } from '/home/guest/hoopnet/hoopnet/src/components/basket-list';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  posts: any;

  // To be filled with dummy data from our database
  dummy: any;

  private data: Observable<Array<any>>;
  private values: Array<any> = [];
  private anyErrors: boolean;
  private finished: boolean;

  private serverData: Observable<any>;
  private courtRes: Response;


  constructor(public http: Http) {
    this.http = http;
    this.dummy = "dummy data";
  }


  serverRequest() {

    // urls I have tried:
    //    'https://randomuser.me/api/?results=10' - can get results
    //    'http://10.0.0.12:3000/'
    //    'http://https://localhost:3000/
    //    'text.json'

    // set serverData to observable that is returned by http.get
    this.serverData = this.http.get('http://localhost:3000/');
    // set observer to the subscription that is returned from .subscribe()
    // more importantlt, set courtRes to the the emitted response object
    let observer = this.serverData.subscribe(res => {this.courtRes = res});

    // test what happened.  See what is null.
    if(this.serverData == null)
      this.dummy = "null observable";
    else if( this.courtRes == null)
      this.dummy = "null response";
    else if(observer == null)
      this.dummy = "null subscription";
    else if (this.serverData == null && this.courtRes == null)
      this.dummy = "both null";
    // if all of the above have been initialized,
    //    set dummy to the unparsed json attached to the response
    else {
      this.dummy = this.courtRes.text();
    }

  };

  // Practice using Observables
  observerFun(){

    // Get data from observable
    this.data = new Observable(observer => {
      setTimeout(() => {
        observer.next("gang gang baby got data from observable");
      }, 1000);
      // throw an error
      setTimeout(() => {
        observer.error(new Error("something shitty on poipous"));
      }, 2000)
      // unsubscribe
      setTimeout(() => {
        subscription.unsubscribe();
      }, 3000)
      // After having unsubscribed, this will not reach the subscription
      setTimeout(() => {
        observer.next("This will not appear on screen")
      }, 4000)
    }); // Observable paren

    let subscription = this.data.subscribe(
          value => {this.values.push(value)},
          error => {this.anyErrors = true},
          () => this.finished = true
    );
  } // server fun paren



}
