import { Component, ViewChild } from '@angular/core';
import { ViewController, NavParams, Slides, AlertController, NavController, Tabs } from 'ionic-angular';
import { HoopMapPage } from '../../pages/hoop-map-page/hoop-map-page';

@Component({
  selector: 'home-court-display',
  templateUrl: 'home-court-display.html'
})
export class HomeCourtDisplay {

  courts: Array<any>

  // Whether or not the current user is looking at their profile
  myProfile: boolean;
  @ViewChild(Slides) slides: Slides;

  constructor(public viewCtrl: ViewController,
              public params: NavParams,
              public alertCtrl: AlertController,
              private navCtrl: NavController)
  {
    // TO DO: get courts from the court pointers we are passed in
    this.courts = params.get('homecourts');
    if(params.get('myProfile')) this.myProfile = true;
  }

  //
  public addHomeCourtPressed(){
     let alert = this.alertCtrl.create({
      subTitle: 'Home Courts can be added from the map page',
      buttons: [
        { text: 'Cancel',
          role: 'cancel'
        },
        { text: 'nav to map',
          handler: () =>{
            // allow alert to dismiss before navigating
            alert.dismiss().then(() => {
              // Dismiss the modal, tell the profile page to navigate to map tab
              this.viewCtrl.dismiss({toMap: true});
            })
            // allows us to control when the alert transitions out
            return false;
          }
        }
      ]
    })

    //alert.present();

    this.viewCtrl.dismiss({toMap: true});
  }

  // Post:  Delete court alert presented
  presentDeleteConfirmation(){
    // Get the court currently displaying
    let court = this.courts[this.slides.getActiveIndex()];
    this.alertCtrl.create({
      subTitle: 'Remove ' + court.name + ' from your Home Courts?',
      buttons: [
        { text: 'Cancel',
          role: 'cancel'
        },
        { text: 'Remove',
          handler: () => {
            console.log(court.name + 'removed from homecourts');
            // TO DO: Server logic for removing this court from home courts
          }
        }
      ]
    }
  ).present();
  }

  test(){
    console.log(this.slides.getActiveIndex())
  }

  // Post:  Slide component slides to previous
  public slideBack(){
    this.slides.slidePrev();
  }

  // Post:  Slide component advances
  public slideForward(){
    this.slides.slideNext();
  }

  private generateCourts(){
    let court1 = {

      name: "Tompkins Square Park",
      type: "outdoor",
      baskets: 4,

      // a latLng location
      location: {
        lat: 40.726429,
        lng: -73.981784,
      },

      // monday(0) - sunday(6) based arrays, representing the time that the court
      // My own formatted strings
      openTimes: ['6:00a', '6:00a', '6:00a', '6:00a', '6:00a', '8:00a', '8:00a'],
      closeTimes: ['11:00p','7:00p','11:00p','11:00p','11:00p','10:30p','8:00p'],

      windowData: {
        baskets: 4,
        games: ["5", "4", "2"],
        gLastValidated: new Date(),
        action: "Active",
        actionDescriptor: "continuous runs",
        aLastValidated: new Date(),
        pNow: []
      },

      closures: [],
    }//court paren;

    let court2 = {

        name: "Forsyth Park - Houston Street Courts",
        type: "outdoor",
        baskets: 4,

        // a latLng location
        location: {},

        // monday(0) - sunday(6) based arrays, representing the time that the court
        // My own formatted strings
        openTimes: ['6:00a', '6:00a', '6:00a', '6:00a', '6:00a', '8:00a', '8:00a'],
        closeTimes: ['11:00p','7:00p','11:00p','11:00p','11:00p','10:30p','8:00p'],

        windowData: {
          baskets: 4,
          games: ["5"],
          gLastValidated: new Date(),
          action: "Active",
          actionDescriptor: "continuous runs",
          aLastValidated: new Date(),
          pNow: []
        },

        closures: [],
      }//court paren
      return[court1, court2];
    }
  }// class paren
