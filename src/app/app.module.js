var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
import { Http } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
//import {Type} from '@angular/core';
// css animation
import { AnimationService, AnimatesDirective } from 'css-animator';
// pages
import { HoopMapPage } from '../pages/hoop-map-page/hoop-map-page';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { EnterBasicInfoPage } from '../pages/enter-basic-info/enter-basic-info';
import { EnterDetailedInfoPage } from '../pages/enter-detailed-info/enter-detailed-info';
import { CourtPage } from '../pages/court-page/court-page';
import { Profile } from '../pages/profile/profile';
// components
import { TheWindow } from '../components/the-window/the-window';
import { DetailedGameInfoComponent } from '../components/detailed-game-info/detailed-game-info';
import { EnterBasketInfoComponent } from '../components/enter-basket-info/enter-basket-info';
import { MapSearchPopoverComponent } from '../components/map-search-popover/map-search-popover';
import { CourtReport } from '../components/court-report/court-report';
import { HoopedCard } from '../components/hooped-card/hooped-card';
import { TextPost } from '../components/text-post/text-post';
import { PicturePost } from '../components/picture-post/picture-post';
import { GamesModal } from '../components/games-modal/games-modal';
import { ActionModal } from '../components/action-modal/action-modal';
import { CourtsideCheckIn } from '../components/courtside-check-in/courtside-check-in';
import { Closures } from '../components/closures/closures';
// services
import { CourtDataService } from '../services/courtDataService.service.ts';
// Directives
import { Dbltap } from '../components/dbltap/dbltap';
import { ParallaxHeader } from '../components/parallax-header/parallax-header';
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    NgModule({
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
            GamesModal,
            ActionModal,
            CourtsideCheckIn,
            Closures,
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
            Profile,
            EnterBasicInfoPage,
            EnterDetailedInfoPage,
            CourtPage,
            GamesModal,
            ActionModal,
            CourtsideCheckIn,
            Closures
        ],
        providers: [
            { provide: ErrorHandler, useClass: IonicErrorHandler },
            CourtDataService,
            Geolocation,
            StatusBar,
            SplashScreen,
            HttpModule,
            AnimationService,
            // auth0 providider
            { provide: AuthHttp,
                useFactory: function (http) {
                    return new AuthHttp(new AuthConfig(), http);
                },
                deps: [Http]
            },
        ]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map