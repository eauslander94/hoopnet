import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';


@Injectable()
export class CourtDataService{

    observable: Observable<any>
    observer: any;
    dummy: any;
    counter: number = 0;

    constructor (private http: Http) {}

    //returns: Observable
    //  which emits a response containing an array of All courts in the db
    getAllCourts(){

      // search params to be sent with get request
      let params = new URLSearchParams();
      params.set('courtQuery', 'all');

      return this.http.get('http://localhost:3000/', new RequestOptions({search: params}));
      /*  .subscribe(
          res => {this.dummy = res; this.counter += 1},
          error => {return error;},
          () => {}
        )*/
    }

    // function putOneGame()
    // param: court    - The court to be updated
    //        basketNo - the basket to be updated
    //        game     - the game which will become the current game
    // postcondition: the game corresponding to basket on court is put into the db.
    putOneGame(court, basketNo: Number, game){

      this.http.put('http://localhost:3000/putOneCourt', {"game": game}, 
        {headers: new Headers({'Content-Type': 'application/json'})} )
          .subscribe();
    }



}
