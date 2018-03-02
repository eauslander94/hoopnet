import { Component } from '@angular/core';
import { HoopMapPage } from '../hoop-map-page/hoop-map-page';
import { CourtPage } from '../court-page/court-page';

// So that we can test the profile page
import { Profile }   from '../profile/profile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HoopMapPage;
  tab2Root: any = Profile;

  constructor() {}
}
