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

    currentUser: string = '59f7b8e5cf12061d37c159a5';

    route: string;

    constructor (private http: Http) {
      this.route = 'http://localhost:3000';
    }


    //  returns: Observable which emits a response containing an array of All courts in the db
    //  isAuthenticated(): no
    //  isCourtside():     no
    getAllCourts(){
      return this.http.get(this.route + '/getAllCourts');
    }


    // Returns: observable emitting array of user objects associated with the paramater ids
    // Param:   Array of user ids requested
    getUsers(user_ids: Array<String>){
      console.log('get');
      let params = new  URLSearchParams();
      // Stringify the array and send it as a parameter
      params.set('user_ids', JSON.stringify(user_ids));
      return this.http.get(this.route + '/getUsers', new RequestOptions({search: params}));
    }


    // Post: db is queried for names that contain the searchTerm
    // Param: searchterm - string to search for
    // Returns: Observable emitting array of users whose names match the searchterm
    // isAuthenticated: yes
    // isCourtside:     no
    public getUsersByName(searchterm: string){
      console.log(searchterm);
      let params = new URLSearchParams();
      params.set('searchterm', searchterm);
      // , new RequestOptions({search: params})
      return this.http.get(this.route + '/getUsersByName', new RequestOptions({search: params}));
    }


    // Returns: observable emitting array with a single object -
    //   the profile data of the user currently logged in
    getCurrentUser(){
      return this.getUsers([this.currentUser]);
    }


    // Post:  Window data provided replaces correspondin windowData in the server
    // Param: windowData: any - the data to be sent to the server
    // isAuthenticated:  yes
    // isCourtside:      yes
    putWindowData(windowData: any){
      let data = {'windowData': windowData};

      this.http.put(this.route + '/putWindowData', data)
      .subscribe();
    }


    // Post: user provided replaces corresponding user in the db
    // Param: User to be sent to the server
    // isAuthenticated: yes
    // isCourtside:     no
    putUser(user: any){
      this.http.put(this.route + '/putUser', {'user': user})
      .subscribe();
    }


    // Post: both users are added to the friends[] of the other
    // Post2:  both users are removed from friendRequests[] of the other, if present
    // Params: ids of users to be added
    // Params: If either = 'currentUser', we use the id of the current user
    // Returns: Observable emitting an array of the updated users, starting with user1
    // isAuthenticated: yes
    // isCourtside:     no
    addFriend(id1: string, id2: string){

      let params = { 'user1': id1, 'user2': id2 };
      if(id1 === 'currentUser') params.user1 = this.currentUser;
      else if(id2 === 'currentUser') params.user2 = this.currentUser;
      return this.http.put(this.route + '/addFriend', params);
    }


    // Post:  current user is added to friendRequest list of requested user
    // Param: requestedUser - user whose friend request currentUser will be added to
    // isAuthenticated: yes
    // isCourtside:     no
    requestFriend(requestedUser){
      let params = {
        'requestedUser': requestedUser._id,
        'currentUser': this.currentUser
      };
      this.http.put(this.route + '/requestFriend', params).subscribe();
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
