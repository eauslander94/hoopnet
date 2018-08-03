import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DominoSpinner } from '../../components/domino-spinner/domino-spinner';
import { CustomSpinner } from '../../components/custom-spinner/custom-spinner';


@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {

  // Opacity of the on screen text, starts at 0 and fades in.
  yDisplay: number = 0;
  gDisplay: number = 0;
  nDisplay: number = 0;
  lDisplay: number = 0;

  canNavigate: boolean = false;
  loadingText: string = 'loading Courtlife'

  // When we've finished our animation and can navigate to the map page
  splashReady: boolean = false;
  // When hoop map page has loaded all courts and we can navigate to the map page
  gotCourts: boolean = false;

  constructor(public viewCtrl: ViewController,
              public splashScreen: SplashScreen,
              public events: Events)
  {
    events.subscribe('gotAllCourtObjects', () => {
      // GOT ALL COURTS, waiting on splashRead
      if(this.splashReady)
        this.viewCtrl.dismiss().then(() => {
          this.events.publish('dismissingSplashscreen');
        })
      else this.gotCourts = true;
    })
  }

  ionViewDidEnter() {
    this.splashScreen.hide();
    this.fadeIn();
  }

  // fade onscreen text in word by word,
  // dismiss when finished animating AND courts have loaded
  private async fadeIn(){
    this.yDisplay = 1;
    await this.delay(800);
    this.gDisplay = 1;
    await this.delay(800);
    this.nDisplay = 1;
    await this.delay(1000);
    this.lDisplay = 1;
    await this.delay(1000);

    // this.viewCtrl.dismiss().then(() => {
    //   this.events.publish('dismissingSplashscreen');
    // })


    // SPLASH READY, waiting on gotAllCourtObjects
    if(this.gotCourts)
      this.viewCtrl.dismiss().then(() => {
        this.events.publish('dismissingSplashscreen');
      })
    else {
      this.splashReady = true;
    }
    // Also pull up load wheel, here
  }

  // Post:  from an async function, execution is delayed for the given time
  // Param: number ms - the time to wait for
  private delay(ms: number) {
    return new Promise<void>(function(resolve) {
        setTimeout(resolve, ms);
    });
  }

  // Enter app if we are allowed
  private enter(){ if(this.canNavigate) this.viewCtrl.dismiss() }

}
