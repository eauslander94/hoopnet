import {Component} from '@angular/core';
import {Auth0Cordova} from '@auth0/cordova';
import {Auth0} from 'auth0-js';

import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  location: any

  constructor(public auth: AuthService) {
    this.location = window.location;
    console.log("elimyguy");
  }
}
