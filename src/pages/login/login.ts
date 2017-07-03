import { AuthService } from '../../services/auth/auth';
import {Component, Injectable, NgZone, Output, EventEmitter} from '@angular/core';
import {Observable, Subscription} from 'rxjs/Rx';

import Auth0Cordova from '@auth0/cordova';
import Auth0 from 'auth0-js';

import {AuthHttp, JwtHelper, tokenNotExpired} from 'angular2-jwt';




declare var Auth0Lock: any;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  // Creating the lock
  lock = new Auth0Lock('pu0puMWvKB1XANUkPh0sygZwdGGR_oE1', 'eauslander94-dev.auth0.com', {
    auth: {
      redirect: false,
    }
  }
  );

// Variables for testing
  dummy: String;
  dummy2: any;

  constructor(private auth: AuthService) {


    // Listening for the authenticated event
    this.lock.on("authenticated", function(authResult) {
      // Use the token in authResult to getUserInfo() and save it to localStorage
      window.localStorage.setItem('test', "authenticated event fired");
      // Set tokens to Local Storage
      window.localStorage.setItem('accessToken', authResult.accessToken);
      window.localStorage.setItem('idToken', authResult.idToken);
      window.localStorage.setItem('refreshToken', authResult.refreshToken);
    });

    this.dummy = window.localStorage.getItem('test');
    this.dummy2 = window.localStorage.getItem('idToken');
  }

  public lockLogin(){
    this.lock.show();
  }


  }
