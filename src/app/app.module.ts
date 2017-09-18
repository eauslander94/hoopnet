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
import {Http} from '@angular/http'
import {AuthHttp, AuthConfig} from 'angular2-jwt';
//import {Type} from '@angular/core';

// pages
import { HoopMapPage }           from '../pages/hoop-map-page/hoop-map-page';
import { LoginPage }        from '../pages/login/login';
import { TabsPage }           from '../pages/tabs/tabs';
import { EnterBasicInfoPage }     from '../pages/enter-basic-info/enter-basic-info';
import { EnterDetailedInfoPage }  from '../pages/enter-detailed-info/enter-detailed-info';
import { CourtPage }  from '../pages/court-page/court-page';
// components
import { TheWindow } from '../components/the-window/the-window';
import { DetailedGameInfoComponent } from '../components/detailed-game-info/detailed-game-info';
import { EnterBasketInfoComponent }     from '../components/enter-basket-info/enter-basket-info';
import { MapSearchPopoverComponent }    from '../components/map-search-popover/map-search-popover';
import { CourtReport } from '../components/court-report/court-report';
import { HoopedCard  } from '../components/hooped-card/hooped-card';
import { TextPost }    from '../components/text-post/text-post';
import { PicturePost } from '../components/picture-post/picture-post';
// services
import { CourtDataService } from '../services/courtDataService.service.ts';

import { Profile } from '../pages/profile/profile';
import { ParallaxHeader } from '../components/parallax-header/parallax-header';



@NgModule({
  declarations: [
    MyApp,
    HoopMapPage,
    LoginPage,
    TabsPage,
    EnterBasicInfoPage,
    EnterDetailedInfoPage,
    TheWindow,
    DetailedGameInfoComponent,
    EnterBasketInfoComponent,
    MapSearchPopoverComponent,
    CourtReport,
    HoopedCard,
    TextPost,
    PicturePost,

    Profile,
    ParallaxHeader,
    CourtPage,
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
    Profile,
    EnterBasicInfoPage,
    EnterDetailedInfoPage,
    CourtPage,
  ],
  providers: [
  {provide: ErrorHandler, useClass: IonicErrorHandler},
  CourtDataService,
  Geolocation,
  StatusBar,
  SplashScreen,
  HttpModule,
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
