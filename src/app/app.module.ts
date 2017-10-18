import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Geolocation } from '@ionic-native/geolocation';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// TO DO: clean up once auth is working
// For auth0 authintication
//import {App, Platform} from 'ionic-angular';
//import {provide} from 'angular-provide';
import { Http } from '@angular/http'
import { AuthHttp, AuthConfig } from 'angular2-jwt';
//import {Type} from '@angular/core';

// css animation
import { AnimationService, AnimatesDirective } from 'css-animator';

// pages
import { HoopMapPage }   from '../pages/hoop-map-page/hoop-map-page';
import { LoginPage }     from '../pages/login/login';
import { TabsPage }      from '../pages/tabs/tabs';
import { CourtPage }     from '../pages/court-page/court-page';
import { Profile }       from '../pages/profile/profile';
import { FriendsPage }   from '../pages/friends-page/friends-page';
// components
import { TheWindow }     from '../components/the-window/the-window';
import { WindowModal }   from '../components/window-modal/window-modal';
import { GamesModal }    from '../components/games-modal/games-modal';
import { ActionModal }   from '../components/action-modal/action-modal';
import { CourtsideCheckIn } from '../components/courtside-check-in/courtside-check-in';
import { Closures }      from '../components/closures/closures';
import { AddClosure }    from '../components/add-closure/add-closure';
import { HoursDisplay }  from '../components/hours-display/hours-display';
import { CourtMapPopup } from '../components/court-map-popup/court-map-popup';
// services
import { CourtDataService } from '../services/courtDataService.service.ts';
// Directives
import { Dbltap }        from '../components/dbltap/dbltap';
import { ParallaxHeader } from '../components/parallax-header/parallax-header';
// Providers
import { Data }          from '../providers/data';


@NgModule({
  declarations: [
    MyApp,
    HoopMapPage,
    LoginPage,
    TabsPage,
    FriendsPage,

    TheWindow,
    WindowModal,
    GamesModal,
    ActionModal,
    CourtsideCheckIn,
    Closures,
    AddClosure,
    HoursDisplay,
    CourtMapPopup,

    Profile,
    ParallaxHeader,
    CourtPage,
    Dbltap,
    AnimatesDirective,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HoopMapPage,
    TabsPage,
    LoginPage,
    FriendsPage,

    Profile,
    CourtPage,
    WindowModal,
    GamesModal,
    ActionModal,
    CourtsideCheckIn,
    Closures,
    AddClosure,
    HoursDisplay,
    CourtMapPopup,
  ],
  providers: [
  {provide: ErrorHandler, useClass: IonicErrorHandler},
  CourtDataService,
  Geolocation,
  StatusBar,
  SplashScreen,
  HttpModule,
  AnimationService,
  Data,
    // auth0 providider
    { provide: AuthHttp,
      useFactory: (http) => {
        return new AuthHttp(new AuthConfig(), http);
      },
      deps: [Http]
    },
]
})
export class AppModule {}
