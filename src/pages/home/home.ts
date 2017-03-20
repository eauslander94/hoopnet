import { Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

import { CourtDataService } from '../../services/courtDataService.service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // To be filled with dummy data from our database
  dummy: any;
  private serverData: Observable<any>;
  private courtRes: Response;

  constructor(public http: Http, private courtDataService: CourtDataService) {
    this.dummy = 485;
  }

  CDSget(){
    this.dummy = this.courtDataService.getRequest();
  }

  CDSput(){
    this.dummy = this.courtDataService.putRequest();
    this.dummy.subscribe(res => this.dummy = res.text());
  }

  CDSpost(){
    this.dummy = this.courtDataService.postRequest();
  }

  CDSdelete(){
    this.dummy = this.courtDataService.deleteRequest();
  }



// make get request on port 3000. Behavior to test the response object.
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
  } // server request paren

  // perform a simple put request on port 3000 using dummy data.
  putRequest(){
    let test = {
      "full": "stack",
      "eli": "awesome"
    }


    let headers = new Headers({ 'Content-Type': 'application/json' });

    this.http.delete('http://localhost:3000/');

    /*
    this.http.put('http://localhost:3000/', JSON.stringify(test), headers)
      .subscribe();*/
  } // put request paren

}
