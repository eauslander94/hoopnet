import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Geolocation } from '@ionic-native/geolocation';

// pages
import { AboutPage }          from '../pages/about/about';
import { ContactPage }        from '../pages/contact/contact';
import { HomePage }           from '../pages/home/home';
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



@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    EnterBasicInfoPage,
    EnterDetailedInfoPage,
    OneCourtPage,
    BasketListComponent,
    DetailedGameInfoComponent,
    EnterBasketInfoComponent,
    MapSearchPopoverComponent,
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
    EnterBasicInfoPage,
    EnterDetailedInfoPage,
    OneCourtPage,
    BasketListComponent,
    DetailedGameInfoComponent,
    EnterBasketInfoComponent,
    MapSearchPopoverComponent
  ],
  providers: [
  {provide: ErrorHandler, useClass: IonicErrorHandler},
  CourtDataService,
  Geolocation
]
})
export class AppModule {}
