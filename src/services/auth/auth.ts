import {Injectable, NgZone} from '@angular/core';
import {Observable, Subscription} from 'rxjs/Rx';

import Auth0Cordova from '@auth0/cordova';
import Auth0 from 'auth0-js';

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


@Injectable()
export class AuthService {
  auth0 = new Auth0.WebAuth(auth0Config);
  accessToken: String;
  idToken: String;
  user: any;

  dummy: String;

  constructor(public zone: NgZone) {
    this.user = this.getStorageVariable('profile');
    this.idToken = this.getStorageVariable('id_token');
  }

  // from local storage, returns data value tied to 'name'
  private getStorageVariable(name){
    return JSON.parse(window.localStorage.getItem(name));
  }

  // puts name/data pair into local sotrage as key/value pair
  private setStorageVariable(name, data){
    window.localStorage.setItem(name, JSON.stringify(data));
  }

  private setIdToken(token){
    this.idToken = token;
    this.setStorageVariable('id_token', token);
  }

  private setAccessToken(token){
    this.accessToken = token;
    this.setStorageVariable('access_token', token);
  }

  public isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return Date.now() < expiresAt;
  }

  public login() {
    this.dummy = "in auth.login()";
    const client = new Auth0Cordova(auth0Config);

    const options = {
      scope: 'open profile offline_access'
    };

    client.authorize(options, (err, authResult) => {
      if(err) throw err;

      // set id and access tokens
      this.setIdToken(authResult.idToken);
      this.setAccessToken(authResult.accessToken);

      // get and set new expiresAt
      const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      this.setStorageVariable('expires_at', expiresAt)

      // upon getting user info
      this.auth0.client.userInfo(this.accessToken, (err, profile) => {
        if (err) {throw err}
        // When we succesfully recieve the user's profile
        profile.user_metadata = profile.user_metadata || {};
        this.setStorageVariable('profile', profile);
        this.zone.run(() => {
          this.user = profile;
        })
      })
    }); //end of client.authorize
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
}
