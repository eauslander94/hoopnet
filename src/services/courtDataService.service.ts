import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import  TsEventEmitter  from 'ts-eventemitter';

import 'rxjs/add/operator/map';


@Injectable()
export class CourtDataService{

    observable: Observable<any>
    observer: any;
    dummy: any;
    counter: number = 0;

    constructor (private http: Http) {

    }

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

      let putData = {"court": court, "basketNo": basketNo, "game": game};

      this.http.put('http://localhost:3000/putOneGame', putData,
        { headers: new Headers({'Content-Type': 'application/json'}) } )
          .subscribe();
    }

    // function refresh()
    // param: court - the court to be refreshed
    // returns - observable omitting the latest version of that court object
    refresh(court){

      let params = new URLSearchParams();
      params.set('courtName', court.name);
      params.set('lat', court.location.lat)
      params.set('long', court.location.long)
      return this.http.get('http://localhost:3000/refresh',
                            new RequestOptions({search: params}));

    }


}
