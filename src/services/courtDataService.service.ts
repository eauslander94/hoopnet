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


    // returns: Observable emitting an array of court objects
    // Param: Array of id pointers to court objects that will be fetched
    // isAuthenticated: yes
    // isCourtside:     no
    getCourtsById(court_ids: Array<String>){
      let params = new URLSearchParams();
      params.set('court_ids', JSON.stringify(court_ids));
      return this.http.get(this.route + '/getCourtsById',
        new RequestOptions({search: params})
      );
    }


    // Returns observable emitting an array of courts and a response code
      // 1 - Found only one court within courtside distance
      // 2 - Found more than one court within courtside distance
      // 3 - Found no courts w/in courtside distance, sending back courts w/in 10 miles
      // 4 - No courts w/in 10 miles.  sends back only response code
    // Param: location array of the following form [lng, lat]
    // isAuthenticated: yes
    // isCourtside:     no
    public courtside(location: Array<number>){
      let params = new URLSearchParams();
      params.set('location', JSON.stringify(location));
      return this.http.get(this.route + '/courtside',
        new RequestOptions({search: params})
      )
    }


    // Returns: observable emitting array of user objects associated with the paramater ids
    // Param:   Array of user ids requested
    getUsers(user_ids: Array<String>){
      let params = new  URLSearchParams();
      // Stringify the array and send it as a parameter
      params.set('user_ids', JSON.stringify(user_ids));
      return this.http.get(this.route + '/getUsers',
        new RequestOptions({search: params})
      );
    }


    // Post: db is queried for names that contain the searchTerm
    // Param: searchterm - string to search for
    // Returns: Observable emitting array of users whose names match the searchterm
    // isAuthenticated: yes
    // isCourtside:     no
    public getUsersByName(searchterm: string){
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


    // Post: Current User is added to windowData's currently playing of provided court
    // Param: Court to add current user to
    // res: {court: court, user: user}
    // isAuthenticated: yes
    // isCourtside:     no
    courtsidePut(court_id: string){
      return this.http.put(this.route + '/courtsidePut',
        {court_id: court_id, user_id: this.currentUser})
    }

    // Post: Current User is added to windowData's currently playing of provided court
    // Param: Court to add current user to
    // res: {court: court, user: user}
    // isAuthenticated: yes
    // isCourtside:     no
    public courtsideDelete(court_id: string){

      let params = new URLSearchParams()
      params.set('court_id', court_id);
      params.set('user_id', this.currentUser);
      return this.http.delete(this.route + '/courtsideDelete',
        new RequestOptions({search: params})).subscribe(
          res => {
            console.log(res.json().court.windowData.pNow.length + '\n' + res.json().user.courtside)
          }
        );
    }


    // Post: user provided replaces corresponding user in the db
    // Param: User to be sent to the server
    // isAuthenticated: yes
    // isCourtside:     no
    putUser(user: any){
      this.http.put(this.route + '/putUser', {'user': user})
      .subscribe();
    }


    // Post: provided court_id is added to current user's homecourts array
    // Param: id of court to be added
    putHomecourt(court_id: string){
      this.http.put(this.route + '/putHomecourt',
        {'user_id': this.currentUser, 'court_id': court_id}).subscribe();
    }


    // Post: user provided is added to the db
    // Param: User to be added
    // isAuthenticated: yes
    // isCourtside:     no
    newUser(user: any){
      this.http.post(this.route + '/newUser', {'user': user}).subscribe();
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
    public requestFriend(requestedUser){
      let params = {
        'requestedUser': requestedUser._id,
        'currentUser': this.currentUser
      };
      this.http.put(this.route + '/requestFriend', params).subscribe();
    }

    // Post: both users removed from friends[] of the other
    // Param: The users who will no longer be friends. Sad, I know
    // Returns: observable emitting an array of the uppdated users - user1 in position 0
    public removeFriend(user1){
      let params = {
        'user1': user1._id,
        'user2': this.currentUser
      };
      return this.http.put(this.route + '/removeFriend', params);
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


    // Post: new closure is added to closures of provided court
    // Param: the closure to be added and the court to wich it will be added
    public postClosure(closure: any, court_id: string){

      return this.http.post(this.route + '/postClosure',
        {'closure': closure, 'court_id': court_id}
      )
    }

    // Post: closure provided updates the version of it currently in db
    // Param: closure - The closure to be updated
    // Param: identifier - string identifier so we know whic closure to update
    public putClosure(closure: any, identifier: string){
      return this.http.put(this.route + '/putClosure',
        {'closure': closure, 'court_id': identifier})
    }

    // Post: Closure whose id is provided is removed from the db
    // Param: _id of the closure to be deleted
    public deleteClosure(closure_id: string, court_id: string){
      let params = new URLSearchParams;
      params.set('closure_id', closure_id);
      params.set('court_id', court_id);
      return this.http.delete(this.route + '/deleteClosure',
        new RequestOptions({search: params})
      )
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
