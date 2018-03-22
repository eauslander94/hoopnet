import { Component, ViewChild, NgZone } from '@angular/core';
import { ViewController, NavParams, Slides, AlertController, NavController, Tabs } from 'ionic-angular';
import { HoopMapPage } from '../../pages/hoop-map-page/hoop-map-page';
import { CourtDataService } from '../../services/courtDataService.service';

@Component({
  selector: 'home-court-display',
  templateUrl: 'home-court-display.html'
})
export class HomeCourtDisplay {

  // Array of court objects
  courts: Array<any>
  // Boolean flag telling us we ave retreived court ojects
  gotCourts: boolean = false;

  // Whether or not the current user is looking at their profile
  myProfile: boolean;
  @ViewChild(Slides) slides: Slides;

  constructor(public viewCtrl: ViewController,
              public params: NavParams,
              public alertCtrl: AlertController,
              private navCtrl: NavController,
              public courtDataService: CourtDataService,
              public zone: NgZone)
  {
    // Get courts from server
    this.getCourts(params.get('courtPointers'));
    // Whether or not this is our profile, and have the ability to add/delete homecourts
    if(params.get('myProfile')) this.myProfile = true;
  }


  // Post: retreives courts from server, sets tis.courts to courts returned
  // Param: Array of string pointers to court objects
  public getCourts(courtPointers: Array<string>){

    this.courtDataService.getCourtsById(courtPointers).subscribe(
      res => {
        // ngZone to detect changes
        this.zone.run(() => {
          this.courts = res.json();
          this.gotCourts = true
        })
      },
      err => {alert(err)}
    )
  }


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

  $scope.swipeLeft = function () {
    this.slides.slideNext();
  };



}// class paren
