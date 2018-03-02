import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { TabsPage } from '../pages/tabs/tabs';

// Auth0Cordova
import Auth0Cordova from '@auth0/cordova';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform, public screenOrientation: ScreenOrientation) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //StatusBar.styleDefault();
      //SplashScreen.hide();

      // for auth0 URL redirects
      (<any>window).handleOpenURL = (url) => {
        Auth0Cordova.onRedirectUri(url);
      };

      // lock the screen to portrait
      this.screenOrientation.lock('portrait');

    });
  }
}
