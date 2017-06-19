import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth';

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  constructor(private auth: AuthService) {
    auth.login();
  }

}
