import {Injectable, NgZone } from '@angular/core';
import {Observable, Subscription} from 'rxjs/Rx';

import Auth0Cordova from '@auth0/cordova';
import Auth0 from 'auth0-js';

import {AuthHttp, JwtHelper, tokenNotExpired} from 'angular2-jwt';


// Configuration object
const auth0Config = {
  // for auth0
  clientID: 'pu0puMWvKB1XANUkPh0sygZwdGGR_oE1',
  // for auth0cordova
  clientId: 'pu0puMWvKB1XANUkPh0sygZwdGGR_oE1',
  domain: 'eauslander94-dev.auth0.com',
  callbackURL: location.href,
  packageIdentifier: 'com.ionicframework.hoopnet164917'
};

//
declare var Auth0Lock: any;

@Injectable()
export class AuthService {

  lock = new Auth0Lock('pu0puMWvKB1XANUkPh0sygZwdGGR_oE1', 'eauslander94-dev.auth0.com', {
    auth: {
      redirectUrl: location.href,
    }
  });

  @Output() test: EventEmitter<String> = new EventEmitter<String>();


  accessToken: String;
  idToken: String;
  user: any;

  dummy: String;

  constructor(public zone: NgZone) {
    this.user = this.getStorageVariable('profile');
    this.idToken = this.getStorageVariable('id_token');
    //this.lockLogin();

    this.dummy = "no token";
  }

  // Method: lockLogin()
  // authenticates users via the lock widget

  public lockLogin() {
    // show the lock, upon recieving access token set it to local storage
      this.lock.show(
        (err, accessToken) => {
          if(err) alert (err);

        }
      );

      // When we're authenticated show me the access token;
      this.lock.on("authenticated", function(authResult) {

        // set the tokens
        this.setStorageVariable('access_token', authResult.accessToken);
        this.setStorageVariable('id_token', authResult.idToken);
        this.setStorageVariable('refresh_token', authResult.refreshToken);

        // Give profile the access token
        this.test.emit(authResult.accesstoken);
      })
  }

  // postcondition: User's current data is removed from local storage
  public logout() {
    window.localStorage.removeItem('profile');
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('id_token');
    window.localStorage.removeItem('expires_at');

    this.idToken = null;
    this.accessToken = null;
    this.user = null;
  }


  public authenticated() {
    // Check if there's an unexpired JWT
    return tokenNotExpired();
  }


///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

  // from local storage, returns data value tied to 'name'
  private getStorageVariable(name){
    return JSON.parse(window.localStorage.getItem(name));
  }

  // puts name/data pair into local sotrage as key/value pair
  private setStorageVariable(name, data){
    window.localStorage.setItem(name, JSON.stringify(data));
  }


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
}
