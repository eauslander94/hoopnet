import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';


@Injectable()
export class CourtDataService{

    observable: Observable<any>
    observer: any;
    dummy: any;
    counter: number = 0;

    constructor (private http: Http) {
      this.http.get('http://localhost:3000/')
      .subscribe(
        res => {this.dummy = res.text(); this.counter += 100},
        error => {this.dummy = error; this.counter += 50},
        () => { this.counter++}
      );
    }


    getRequest() {


      // set observable to that returned from this http.get request
      this.observable = this.http.get('http://localhost:3000/')
      this.observer = this.observable.subscribe(
        res => {this.dummy = res.text(); this.counter += 100},
        error => {this.dummy = error; this.counter += 50},
        () => { this.counter ++;}
      );


      return this.dummy + " " + this.counter;
    }




    putRequest() {

      let test = {
        "eli": "awesome",
        "hello": "world"
      }

      return this.http.put('http://localhost:3000/', test)
        .map((res:Response) => res.json());
    }

    postRequest() {
      let dummy = "eli";

      let test = {
        "eli": "awesome",
        "hello": "world"
      }

      this.http.post('http://localhost:3000/', test)
        .subscribe(res => {dummy = res.text()});
      return dummy;
    }

    deleteRequest() {
      let dummy = "eli";

      this.http.delete('http://localhost:3000/')
        .subscribe(res => {dummy = res.text()});
      return dummy;
    }


}
