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
// components
import { BasketListComponent } from '../components/basket-list/basket-list';
import { HttpComponentComponent } from '../components/http-component/http-component';
import { DetailedGameInfoComponent } from '../components/detailed-game-info/detailed-game-info';
import { EnterBasketInfoComponent }     from '../components/enter-basket-info/enter-basket-info';
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
    BasketListComponent,
    DetailedGameInfoComponent,
    EnterBasketInfoComponent
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
    BasketListComponent,
    DetailedGameInfoComponent,
    EnterBasketInfoComponent
  ],
  providers: [
  {provide: ErrorHandler, useClass: IonicErrorHandler},
  CourtDataService,
  Geolocation
]
})
export class AppModule {}
