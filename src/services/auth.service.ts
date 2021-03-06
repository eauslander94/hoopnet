import { Events } from 'ionic-angular';
import { Injectable, NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import Auth0Cordova from '@auth0/cordova';
import Auth0 from 'auth0-js';

import { normalizeURL } from 'ionic-angular';

import { CourtDataService } from '../services/courtDataService.service'
import { RealtimeProvider } from '../providers/realtime/realtime'
import { LoadingPage      } from '../pages/loading/loading';

// configuration options
const auth0Config = {
  // needed for auth0
  clientID: 'pu0puMWvKB1XANUkPh0sygZwdGGR_oE1',

  // needed for auth0cordova
  clientId: 'pu0puMWvKB1XANUkPh0sygZwdGGR_oE1',
  domain: 'eauslander94-dev.auth0.com',
  // Below is from config.xml
  packageIdentifier: 'com.eauslander94.kodo',
  callbackURL: location.href,
};


@Injectable()
export class AuthService {
  auth0 = new Auth0.WebAuth(auth0Config);
  accessToken: string;
  idToken: string;
  user: any;

  testJWT: string;
  allowEntry: boolean = false;

  constructor(public zone: NgZone,
              public events: Events,
              public realtime: RealtimeProvider)
  {
    this.user = this.getStorageVariable('profile');
    this.idToken = this.getStorageVariable('id_token');
  }

  //
  public getStorageVariable(name) {
    return JSON.parse(window.localStorage.getItem(name));
  }

  private setStorageVariable(name, data) {
    window.localStorage.setItem(name, JSON.stringify(data));
  }

  private setIdToken(token) {
    this.idToken = token;
    this.setStorageVariable('id_token', token);
  }

  private setAccessToken(token) {
    this.accessToken = token;
    this.setStorageVariable('access_token', token);
  }

  public isAuthenticated() {
    if(this.allowEntry)
      return true;
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return Date.now() < expiresAt;
  }

  public login() {
    const client = new Auth0Cordova(auth0Config);

    const options = {
      scope: 'openid profile offline_access',
      audience: 'https://courtlife.server.com'
    };

    client.authorize(options, (err, authResult) => {
      if (err) {
        throw err;
      }

      // this.navCtrl.push(LoadingPage, {loadingMessage: 'retrieving user data'})

      this.testJWT = authResult.idToken;
      this.setIdToken(authResult.idToken);
      this.setAccessToken(authResult.accessToken);


      const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      this.setStorageVariable('expires_at', expiresAt);

      this.auth0.client.userInfo(this.accessToken, (err, profile) => {
        if(err) {
          throw err;
        }

        profile.user_metadata = profile.user_metadata || {};
        this.setStorageVariable('profile', profile);

        this.zone.run(() => {
          this.user = profile;
        });
      });

      // Tell other pages we have logged in
      this.events.publish('loggedIn');
    });
  }

  public logout() {

    window.localStorage.removeItem('profile');
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('id_token');
    window.localStorage.removeItem('expires_at');
    window.localStorage.removeItem('currentUser');

    this.idToken = null;
    this.accessToken = null;
    this.user = null;

    this.events.publish("loggedOut");
  }
}
