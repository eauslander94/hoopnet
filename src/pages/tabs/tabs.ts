import { Component } from '@angular/core';

import { HomePage    } from '../home/home';
import { AboutPage   } from '../about/about';
import { ContactPage } from '../contact/contact';
import { LoginPage } from '../login/login';

import { CourtPage } from '../court-page/court-page';

// So that we can test the profile page
import { Profile } from '../profile/profile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = CourtPage;
  tab3Root: any = Profile;

  constructor() {

  }
}
