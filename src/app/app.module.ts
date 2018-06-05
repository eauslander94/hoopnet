import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Geolocation } from '@ionic-native/geolocation';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Keyboard } from '@ionic-native/keyboard';



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
import { HoopMapPage }      from '../pages/hoop-map-page/hoop-map-page';
import { LoginPage }        from '../pages/login/login';
import { CourtPage }        from '../pages/court-page/court-page';
import { FriendsPage }      from '../pages/friends-page/friends-page';
import { EnterProfileInfo } from '../pages/enter-profile-info/enter-profile-info';
import { InviteFriendsPage }from '../pages/invite-friends/invite-friends';
import { SelectFriendsPage }from '../pages/select-friends/select-friends';
import { CourtSearchPage }  from '../pages/court-search/court-search';
import { SendInvitePage }   from '../pages/send-invite/send-invite';
import { CourtClosingsPage }from '../pages/court-closings/court-closings';
import { AddClosingPage }   from '../pages/add-closing/add-closing';
// components
import { TheWindow }        from '../components/the-window/the-window';
import { WindowModal }      from '../components/window-modal/window-modal';
import { GamesModal }       from '../components/games-modal/games-modal';
import { WaitTimeModal }      from '../components/wait-time-modal/wait-time-modal';
import { Closures }         from '../components/closures/closures';
import { AddClosure }       from '../components/add-closure/add-closure';
import { HoursDisplay }     from '../components/hours-display/hours-display';
import { CourtsideCheckIn } from '../components/courtside-check-in/courtside-check-in';
import { HomeCourtDisplay } from '../components/home-court-display/home-court-display';
import { ProfileModal }     from '../components/profile-modal/profile-modal';
import { NotificationResponse } from '../components/notification-response/notification-response';
// services
import { CourtDataService } from '../services/courtDataService.service';
import { AuthService }      from '../services/auth.service';
// Directives
import { Dbltap }           from '../components/dbltap/dbltap';
import { ParallaxHeader }   from '../components/parallax-header/parallax-header';
// Providers
import { QuickCourtsideProvider } from '../providers/quick-courtside/quick-courtside';
import { RealtimeProvider } from '../providers/realtime/realtime';




@NgModule({
  declarations: [
    MyApp,
    HoopMapPage,
    LoginPage,
    FriendsPage,
    EnterProfileInfo,
    InviteFriendsPage,
    SelectFriendsPage,
    CourtSearchPage,
    SendInvitePage,
    CourtClosingsPage,
    AddClosingPage,

    TheWindow,
    WindowModal,
    GamesModal,
    WaitTimeModal,
    CourtsideCheckIn,
    Closures,
    AddClosure,
    HoursDisplay,
    HomeCourtDisplay,
    ProfileModal,
    NotificationResponse,

    ParallaxHeader,
    CourtPage,
    Dbltap,
    AnimatesDirective,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      platforms: {
        ios: {
          statusbarPadding: true
        }
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HoopMapPage,
    LoginPage,
    FriendsPage,
    EnterProfileInfo,
    CourtSearchPage,
    InviteFriendsPage,
    SelectFriendsPage,
    SendInvitePage,
    CourtClosingsPage,
    AddClosingPage,

    ProfileModal,
    CourtPage,
    WindowModal,
    GamesModal,
    WaitTimeModal,
    CourtsideCheckIn,
    Closures,
    AddClosure,
    HoursDisplay,
    HomeCourtDisplay,
    NotificationResponse,
  ],
  providers: [
  {provide: ErrorHandler, useClass: IonicErrorHandler},
  CourtDataService,
  AuthService,
  Geolocation,
  PhotoLibrary,
  StatusBar,
  SplashScreen,
  HttpModule,
  AnimationService,
  ScreenOrientation,
    // auth0 providider
    { provide: AuthHttp,
      useFactory: (http) => {
        return new AuthHttp(new AuthConfig(), http);
      },
      deps: [Http]
    },
    QuickCourtsideProvider,
    RealtimeProvider,
    Keyboard
]
})
export class AppModule {}
