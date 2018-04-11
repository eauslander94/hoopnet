import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import { Events, AlertController, ToastController, Toast} from 'ionic-angular'
import { Observable }  from 'rxjs/Observable';
import { empty } from "rxjs/observable/empty";
import { AuthService } from '../services/auth.service'


import 'rxjs/add/operator/map';


@Injectable()
export class CourtDataService{

    observable: Observable<any>
    observer: any;
    dummy: any;
    counter: number = 0;

    currentUser: string;

    toast: Toast;

    // For connecting using goBox's private ip address - works for devices on same wifi & ionic serve
    // route: string = 'http://192.168.0.3:3000'

     // for connecting to our RESTful API hosted on AWS Lambda
     route: string = 'https://xdyhadso88.execute-api.us-east-1.amazonaws.com/latest';


      // For local connections using ionic serve
      // route: string = 'http://localhost:3000';

     // For connecting from android emulator
     // route: string = 'http://10.0.2.2:3000'

    constructor (private http: Http,
                 public auth: AuthService,
                 public toastCtrl: ToastController,
                 public events: Events,
                 public alertCtrl: AlertController)
    {}


    //  returns: Observable which emits a response containing an array of All courts in the db
    //  isAuthenticated(): no
    //  isCourtside():     no
    getAllCourts(){
      return this.http.get(this.route + '/getAllCourts');
    }


    // returns: Observable emitting an array of court objects
    // Param: Array of id pointers to court objects that will be fetched
    // isAuthenticated: no
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

      if(!this.auth.isAuthenticated()){  // if we're not authenticated
        // display the message, return an empty observable
        this.toastMessage("You must be logged in to perform this action", 3000);
        return;
      }

      let headers = new Headers();
      headers.set('Authorization', 'Bearer ' + this.auth.getStorageVariable('access_token'));
      headers.set('location', JSON.stringify(location))

      return this.http.get(this.route + '/courtside',
        {headers: headers}
      )
    }


    // Returns: observable emitting array of user objects associated with the paramater ids
    // Param:   Array of user ids requested
    // isAuthenticated: yes
    // isCourtside:     no
    getUsers(user_ids: Array<String>){

      if(!this.auth.isAuthenticated()){
        this.toastMessage("You must be logged in to perform this action", 3000);
        return
      }

      // Set the headers, make the request, return the observable
      let headers = new Headers();
      headers.set('Authorization', 'Bearer ' + this.auth.getStorageVariable('access_token'));
      headers.set('user_ids', JSON.stringify(user_ids))

      return this.http.get(this.route + '/getUsers', {headers:headers});
    }

    // Returns: observable emitting array of user objects associated with the paramater ids
    // Param:   Array of user ids requested
    // isAuthenticated: yes
    // isCourtside:     no
    windowGetUsers(user_ids: Array<String>){

      let headers = new Headers();
      headers.set('user_ids', JSON.stringify(user_ids))

      return this.http.get(this.route + '/windowGetUsers', {headers: headers})
    }


    // Returns: Observable emitting user object if user is currently in our db
    // Returns Observable emitting {} if user is not (and therefore just signed up)
    // Param: string representing unique identifier provided by auth0
    // isAuthenticated: yes
    // isCourtside:     no
    getUsersByAuth_id(auth_id: string){

      if(!this.auth.isAuthenticated()){
        this.toastMessage("You must be logged in to perform this action", 3000);
        return;
      }

      // Set the headers, make the request, return the observable
      let headers = new Headers();
      headers.set('Authorization', 'Bearer ' + this.auth.getStorageVariable('access_token'));
      headers.set('auth_id', auth_id);

      return this.http.get(this.route + '/getUsersByAuth_id', {headers: headers});
    }


    // Post: db is queried for names that contain the searchTerm
    // Param: searchterm - string to search for
    // Returns: Observable emitting array of users whose names match the searchterm
    // isAuthenticated: yes
    // isCourtside:     no
    public getUsersByName(searchterm: string){

      if(!this.auth.isAuthenticated()){
        this.toastMessage("You must be logged in to perform this action", 3000);
        return;
      }

      let headers = new Headers();
      headers.set('Authorization', 'Bearer ' + this.auth.getStorageVariable('access_token'));
      headers.set('searchterm', searchterm);

      return this.http.get(this.route + '/getUsersByName',
        {headers: headers}
      );
    }

    // Post: db is queried for courts that contain the searchterm in their name
    // Param: searchterm - term to search by
    // Returns: Observable emitting array of courts
    // isAuthenticated: yes
    // isCourtside:     no
    public getCourtsByName(searchterm:string){
      if(!this.auth.isAuthenticated()) return;

      let headers = new Headers();
      headers.set('Authorization', 'Bearer ' + this.auth.getStorageVariable('access_token'));
      headers.set('searchterm', searchterm);

      return this.http.get(this.route + '/getCourtsByName',
        {headers: headers}
      );
    }


    // Returns: observable emitting array with a single object -
    //   the profile data of the user currently logged in
    getCurrentUser(){
      return this.getUsers([JSON.parse(window.localStorage.getItem('currentUser'))._id]);
    }


    // Post:  Window data provided replaces correspondin windowData in the server
    // Param: windowData: any - the data to be sent to the server
    // isAuthenticated:  yes
    // isCourtside:      yes
     putWindowData(windowData: any){

       if(!this.auth.isAuthenticated()){
         this.toastMessage("You must be logged in to perform this action", 3000);
         return;
       }

       // Set the headers, make the request
       let headers = new Headers();
       headers.set('Authorization', 'Bearer ' + this.auth.getStorageVariable('access_token'));
       //headers.set('windowData', JSON.stringify(windowData));
       let data = {'windowData': windowData};

       return this.http.put(this.route + '/putWindowData',
         data,
         {headers: headers}
       ).subscribe(
         res => {
           this.events.publish('current-user-window-update', res.json())
         }
       );
    }


    // Post: Current User is added to windowData's currently playing of provided court
    // Param: Court to add current user to
    // res: {court: court, user: user}
    // isAuthenticated: yes
    // isCourtside:     no
    checkIn(court_id: string){

      if(!this.auth.isAuthenticated()){
        this.toastMessage("You must be logged in to perform this action", 3000);
        return;
      }
      let headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.auth.getStorageVariable('access_token'));
      return this.http.put(this.route + '/checkIn',
        {court_id: court_id, user_id: JSON.parse(window.localStorage.getItem('currentUser'))._id},
        {headers: headers}
      )
    }


    // Post: user provided replaces corresponding user in the db
    // Param: User to be sent to the server
    // isAuthenticated: yes
    // isCourtside:     no
    putUser(user: any){
      if(!this.auth.isAuthenticated()){
        this.toastMessage("You must be logged in to perform this action", 3000);
        return;
      }
      let headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.auth.getStorageVariable('access_token'));
      return this.http.put(this.route + '/putUser', {'user': user}, {headers: headers})
    }


    // Post: provided court_id is added to current user's homecourts array
    // Param: id of court to be added
    // Returns: Observable emitting updated user object
    putHomecourt(court_id: string){

      if(!this.auth.isAuthenticated()){
        this.toastMessage("You must be logged in to perform this action", 3000);
        return;
      }

      let headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.auth.getStorageVariable('access_token'));

      return this.http.put(this.route + '/putHomecourt',
        {'user_id': JSON.parse(window.localStorage.getItem('currentUser'))._id, 'court_id': court_id},
        {headers: headers}
      )
    }


    // Post: user provided is added to the db
    // Param: User to be added
    // isAuthenticated: yes
    // isCourtside:     no
    newUser(user: any){

      if(!this.auth.isAuthenticated()){
        this.toastMessage("You must be logged in to perform this action", 3000);
        return;
      }

      let headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.auth.getStorageVariable('access_token'));

      this.http.post(this.route + '/newUser',
        {'user': user},
        {headers: headers}
      ).subscribe();
    }


    // Post: both users are added to the friends[] of the other
    // Post2:  both users are removed from friendRequests[] of the other, if present
    // Params: ids of users to be added
    // Params: If either = 'currentUser', we use the id of the current user
    // Returns: Observable emitting an array of the updated users, starting with user1
    // isAuthenticated: yes
    // isCourtside:     no
    confirmFriendRequest(user1: string, user2: string){

      if(!this.auth.isAuthenticated()){
        this.toastMessage("You must be logged in to perform this action", 3000);
        return;
      }

      let body = { 'user1': user1, 'user2': user2 };
      if(user1 === 'currentUser') body.user1 = JSON.parse(window.localStorage.getItem('currentUser'))._id;
      else if(user2 === 'currentUser') body.user2 = JSON.parse(window.localStorage.getItem('currentUser'))._id;
      let headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.auth.getStorageVariable('access_token'));

      return this.http.put(this.route + '/confirmFriendRequest', body, {headers: headers});
    }


    // Post:  current user is added to friendRequest list of requested user
    // Param: requestedUser_id - string pointer to user whose friend requests array currentUser will be added to
    // isAuthenticated: yes
    // isCourtside:     no
    public requestFriend(requestedUser_id: string){

      if(!this.auth.isAuthenticated()){
        this.toastMessage("You must be logged in to perform this action", 3000);
        return;
      }

      let body = {
        'requestedUser': requestedUser_id,
        'currentUser': JSON.parse(window.localStorage.getItem('currentUser'))._id
      };
      let headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.auth.getStorageVariable('access_token'));

      this.http.put(this.route + '/requestFriend', body,
        {headers: headers}
      ).subscribe();
    }

    // Post: both users removed from friends[] of the other
    // Param: The users who will no longer be friends
    // Returns: observable emitting an array of the uppdated users - user1 in position 0
    public removeFriend(user1_id: string){

      if(!this.auth.isAuthenticated()){
        this.toastMessage("You must be logged in to perform this action", 3000);
        return;
      }

      let body = {
        'user1': user1_id,
        'user2': JSON.parse(window.localStorage.getItem('currentUser'))._id
      };
      let headers = new Headers()
      headers.set('Authorization', 'Bearer ' + this.auth.getStorageVariable('access_token'));

      return this.http.put(this.route + '/removeFriend', body,
        {headers: headers}
      );
    }



    // Post: new closure is added to closures of provided court
    // Param: the closure to be added and the court to wich it will be added
    // Returns: observable emitting updated court
    public postClosure(closure: any, court_id: string){

      if(!this.auth.isAuthenticated())
        return;

      let headers = new Headers();
      headers.set('Authorization', 'Bearer ' + this.auth.getStorageVariable('access_token'));
      let body = {'closure': closure, 'court_id': court_id};
      return this.http.post(this.route + '/postClosure', body, {headers: headers})
    }


    // Post:    closure provided updates the version of it currently in db
    // Param:   closure - The closure to be updated
    // Param:   identifier - string identifier so we know whic closure to update
    // Returns: observable emitting updated court
    public putClosure(closure: any, identifier: string){
      if(!this.auth.isAuthenticated())
        return;

      let headers = new Headers();
      headers.set('Authorization', 'Bearer ' + this.auth.getStorageVariable('access_token'));
      let body = {'closure': closure, 'court_id': identifier}
      return this.http.put(this.route + '/putClosure', body, {headers: headers})
    }

    // sends a string message to the server
    public serverLog(message: string){
      this.http.put(this.route + '/serverLog', {'message': message}).subscribe();
    }


    // Post:    Closure whose id is provided is removed from the db
    // Param:   _id of the closure to be deleted, and court to which it belongs
    // Returns: observable emitting updated court
    public deleteClosure(closure_id: string, court_id: string){

      if(!this.auth.isAuthenticated()){  // if we're not authenticated
        // display the message, return an empty observable
        this.toastMessage("You must be logged in to perform this action", 3000);
        return;
      }
      let headers = new Headers();
      headers.set('Authorization', 'Bearer ' + this.auth.getStorageVariable('access_token'));
      headers.set('closure_id', closure_id);  // pass in closure id
      headers.set('court_id', court_id);      // pass in court id
      return this.http.delete(this.route + '/deleteClosure', {headers: headers})
    }


    public realtime(){
      this.http.post('https://id8o1v79q2.execute-api.us-east-1.amazonaws.com/pubSub/realtimeTest', {})
        .subscribe()
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


    // Post: Presents toast message with provided message and duration(ms)
    public toastMessage(message: string, duration: number){

      // try to dismiss the toast if  it is currently up
      try{
        this.toast.dismiss()
      } catch(e){}

      this.toast = this.toastCtrl.create({
        message: message,
        duration: duration,
        position: 'top',
        showCloseButton: true,
        dismissOnPageChange: false
      })

      this.toast.present();
    }


    // Post: Alert presented with provided title and message
    public notify(title: string, message: string){
      let note = this.alertCtrl.create({
        title: title,
        message: message,
        buttons: ['Dismiss']
      })
      note.present()
    }





}
