import { Component } from '@angular/core';
import { Auth0Cordova } from '@auth0/cordova';
import { Auth0 }  from 'auth0-js';
import { Events } from 'ionic-angular';

import { JwtHelper } from 'angular2-jwt'

import { AuthService } from '../../services/auth.service';
import { CourtDataService } from '../../services/courtDataService.service'


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  id_token: any = "notLoggedIn";

  constructor(public auth: AuthService,
              public courtDataService: CourtDataService,
              public events: Events) { alert('login page, no module.ts file')

    this.id_token = "notLoggedIn";

    // On login event, get user's profile or prompt to enter profle info
    events.subscribe('loggedIn', ()=> {
      // The following code extracts the sub claim from the decoded id token.
      let jwtHelper = new JwtHelper();
      let sub = jwtHelper.decodeToken(this.auth.getStorageVariable('id_token')).sub;
      this.id_token = sub;

      courtDataService.getUsersByAuth_id(sub)
        .subscribe(
          data => {
            // If we've got a first name, we've got an existing user
            if(data.json().fName)
              this.id_token = "existing user"
            else this.id_token = "new User"
          },
          err => {console.log("error getUsersByAuth_id on login page")}
        )
  })
}
}
