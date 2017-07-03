import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Geolocation } from '@ionic-native/geolocation';
import { CoolLocalStorage } from 'angular2-cool-storage';

// TO DO: clean up once auth is working
// For auth0 authintication
//import {App, Platform} from 'ionic-angular';
//import {provide} from 'angular-provide';
import {Http} from '@angular/http'
import {AuthHttp, AuthConfig} from 'angular2-jwt';
//import {Type} from '@angular/core';

// pages
import { AboutPage }          from '../pages/about/about';
import { ContactPage }        from '../pages/contact/contact';
import { HomePage }           from '../pages/home/home';
import { ProfilePage }        from '../pages/profile/profile';
import { TabsPage }           from '../pages/tabs/tabs';
import { EnterBasicInfoPage }     from '../pages/enter-basic-info/enter-basic-info';
import { EnterDetailedInfoPage }  from '../pages/enter-detailed-info/enter-detailed-info';
import { OneCourtPage } from '../pages/one-court/one-court';
// components
import { BasketListComponent } from '../components/basket-list/basket-list';
import { DetailedGameInfoComponent } from '../components/detailed-game-info/detailed-game-info';
import { EnterBasketInfoComponent }     from '../components/enter-basket-info/enter-basket-info';
import { MapSearchPopoverComponent }    from '../components/map-search-popover/map-search-popover';
// services
import { CourtDataService } from '../services/courtDataService.service.ts';
import {AuthService} from '../services/auth/auth';



@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    ProfilePage,
    TabsPage,
    EnterBasicInfoPage,
    EnterDetailedInfoPage,
    OneCourtPage,
    BasketListComponent,
    DetailedGameInfoComponent,
    EnterBasketInfoComponent,
    MapSearchPopoverComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ProfilePage,
    EnterBasicInfoPage,
    EnterDetailedInfoPage,
    OneCourtPage,
    BasketListComponent,
    DetailedGameInfoComponent,
    EnterBasketInfoComponent,
    MapSearchPopoverComponent,
  ],
  providers: [
  {provide: ErrorHandler, useClass: IonicErrorHandler},
  CourtDataService,
  Geolocation,
    // auth0 providider
    { provide: AuthHttp,
      useFactory: (http) => {
        return new AuthHttp(new AuthConfig(), http);
      },
      deps: [Http]
    },
    AuthService
]
})
export class AppModule {}
