import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// pages
import { AboutPage }          from '../pages/about/about';
import { ContactPage }        from '../pages/contact/contact';
import { HomePage }           from '../pages/home/home';
import { TabsPage }           from '../pages/tabs/tabs';
import { EnterBasicInfoPage }     from '../pages/enter-basic-info/enter-basic-info';
import { EnterDetailedInfoPage }  from '../pages/enter-detailed-info/enter-detailed-info';
// components
import { BasketListComponent } from '../components/basket-list/basket-list';
// component for the detailed info page
import{ DetailedGameInfoComponent } from '../components/detailed-game-info/detailed-game-info';



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
    DetailedGameInfoComponent
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
    DetailedGameInfoComponent
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
