import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler, Config } from 'ionic-angular';
import { MyApp } from './app.component';
import { Geolocation } from '@ionic-native/geolocation';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Keyboard } from '@ionic-native/keyboard';
import { Http } from '@angular/http'
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { authFactory } from './authFactory'

import { AppCenterCrashes } from '@ionic-native/app-center-crashes';


// pages
import { HoopMapPage }      from '../pages/hoop-map-page/hoop-map-page';
import { SplashPage  }      from '../pages/splash/splash';
import { LoadingPage }      from '../pages/loading/loading';
// components
import { TheWindow }        from '../components/the-window/the-window';
import { WindowModal }      from '../components/window-modal/window-modal';
import { GamesModal }       from '../components/games-modal/games-modal';
import { WaitTimeModal }      from '../components/wait-time-modal/wait-time-modal';
import { HoursDisplay }     from '../components/hours-display/hours-display';
import { CourtsideCheckIn } from '../components/courtside-check-in/courtside-check-in';
import { HomeCourtDisplay } from '../components/home-court-display/home-court-display';
import { ProfileModal }     from '../components/profile-modal/profile-modal';
import { NotificationResponse } from '../components/notification-response/notification-response';
import { DominoSpinner }    from '../components/domino-spinner/domino-spinner';
import { CustomSpinner }    from '../components/custom-spinner/custom-spinner';
// services
import { CourtDataService } from '../services/courtDataService.service';
import { AuthService }      from '../services/auth.service';
// Directives
import { Dbltap }           from '../components/dbltap/dbltap';
import { ParallaxHeader }   from '../components/parallax-header/parallax-header';
// Providers
import { CourtHelper } from '../providers/court-helper/court-helper';
import { RealtimeProvider } from '../providers/realtime/realtime';
// transitions
import {
    ModalEnterDirect, ModalLeaveDirect
    ,ModalEnterFadeIn, ModalLeaveFadeOut
    ,ModalEnterZoomIn, ModalLeaveZoomIn
    ,ModalEnterZoomOut, ModalLeaveZoomOut
} from '../transitions/ionic-modal-transition-pack';





@NgModule({
  declarations: [
    MyApp,
    HoopMapPage,
    SplashPage,
    LoadingPage,


    TheWindow,
    WindowModal,
    GamesModal,
    WaitTimeModal,
    CourtsideCheckIn,
    HoursDisplay,
    HomeCourtDisplay,
    ProfileModal,
    NotificationResponse,
    DominoSpinner,
    CustomSpinner,

    ParallaxHeader,
    Dbltap,
    // AnimatesDirective,
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
    SplashPage,
    LoadingPage,

    ProfileModal,
    WindowModal,
    GamesModal,
    WaitTimeModal,
    CourtsideCheckIn,
    HoursDisplay,
    HomeCourtDisplay,
    NotificationResponse,
    DominoSpinner,
    CustomSpinner,
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
  AppCenterCrashes,
  // AnimationService,
  ScreenOrientation,
  // auth0 providider
  { provide: AuthHttp,
    useFactory: authFactory,
    deps: [Http]
  },
  CourtHelper,
  RealtimeProvider,
  Keyboard
]
})
export class AppModule {

  constructor(public config: Config) {
        this.setCustomTransitions();
    }

    private setCustomTransitions() {
      this.config.setTransition('ModalEnterDirect', ModalEnterDirect);
      this.config.setTransition('ModalLeaveDirect', ModalLeaveDirect);

      this.config.setTransition('ModalEnterFadeIn', ModalEnterFadeIn);
      this.config.setTransition('ModalLeaveFadeOut', ModalLeaveFadeOut);

      this.config.setTransition('ModalEnterZoomIn', ModalEnterZoomIn);
      this.config.setTransition('ModalLeaveZoomIn', ModalLeaveZoomIn);

      this.config.setTransition('ModalEnterZoomOut', ModalEnterZoomOut);
      this.config.setTransition('ModalLeaveZoomOut', ModalLeaveZoomOut);
    }
}
