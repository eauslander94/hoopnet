import { Component, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { ViewController, NavParams, Slides, AlertController, NavController, Tabs,
          Events, ModalController} from 'ionic-angular';
import { CourtDataService } from '../../services/courtDataService.service';
import { LoadingPage }      from '../../pages/loading/loading';

@Component({
  selector: 'home-court-display',
  templateUrl: 'home-court-display.html'
})
export class HomeCourtDisplay {

  // Array of court objects
  courts: Array<any> = [];
  // Boolean flag telling us we ave retreived court ojects
  gotCourts: boolean = false;

  // Whether or not the current user is looking at their profile
  myProfile: boolean;
  @ViewChild(Slides) slides: Slides;

  // Wether or not we ave omecourts
  noHomecourts: boolean;

  // For load wheel
  loading: boolean;

  constructor(public viewCtrl: ViewController,
              public params: NavParams,
              public alertCtrl: AlertController,
              private navCtrl: NavController,
              public courtDataService: CourtDataService,
              public zone: NgZone,
              public events: Events,
              public modalCtrl: ModalController,
              public cdr: ChangeDetectorRef)
  {
    // Get courts from server
    this.getCourts(params.get('courtPointers'));
    // Whether or not this is our profile, and have the ability to add/delete homecourts
    if(params.get('myProfile')) this.myProfile = true;

    if(params.get('courtPointers').length > 0) this.noHomecourts = false;
    else this.noHomecourts = true;

    // When we've got new omecourts, update homecourts display
    this.events.subscribe('newHomecourt', (court) => {

      // Check if this is already a homecourt
      for(let homecourt of this.courts)
        if(homecourt._id === court._id) {
          this.courtDataService.notify('Already a homecourt', court.name + ' is already a homecourt of yours');
          return;
        }

      // Push load page, send court data to server
      let loadScreen = this.modalCtrl.create(LoadingPage, { loadingMessage: 'adding homecourt' },
      {
        enterAnimation: 'ModalEnterFadeIn',
        leaveAnimation: 'ModalLeaveFadeOut'
      })
      loadScreen.present();

      this.courtDataService.putHomecourt(court._id).subscribe(
        res => {
          // Pop load page, perform court updating, give user feedback/error message
          loadScreen.dismiss().then(() => {
            court.windowData.court = JSON.stringify(court); // For window scouting
            this.zone.run(() => {
              this.courts.push(court);
              this.noHomecourts = false;
            })
            this.events.publish('updateCurrentUser', res.json())
            if(this.courts.length > 1)
            this.courtDataService.notify('Homecourt Added', court.name + ' has been added to your homecourts.')
          })
        },
        err => {
          loadScreen.dismiss().then(() => {
            this.courtDataService.notify('Error', 'Error adding ' + court + ' to your homecourts. Please try again.')
          })
        }
      );
    })
  }

  ngOnDestroy(){
    this.events.unsubscribe('newHomecourt');
  }


  // Post: retreives courts from server, sets tis.courts to courts returned
  // Param: Array of string pointers to court objects
  public getCourts(courtPointers: Array<string>){

    this.courtDataService.getCourtsById(courtPointers).subscribe(
      res => {
        // ngZone to detect changes
        this.zone.run(() => {
          this.courts = res.json();
          // This is ugly but it makes for good UX, give window data a pointer to its court
          for(let court of this.courts) court.windowData.court = JSON.stringify(court);
          this.gotCourts = true;
        })
      },
      err => this.courtDataService.notify('ERROR', err)
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
    let alert = this.alertCtrl.create({
      title: 'Remove Homecourt?',
      message: 'Remove ' + court.name + ' from your Home Courts?',
      buttons: [
        { text: 'Cancel',
          role: 'cancel'
        },
        { text: 'Remove',
          handler: () => {
            alert.dismiss().then(() => {
              // present load screen
              let loadScreen = this.modalCtrl.create(LoadingPage, { loadingMessage: 'removing homecourt' },
              { enterAnimation: 'ModalEnterFadeIn', leaveAnimation: 'ModalLeaveFadeOut' })
              loadScreen.present();
              // Tell app.component.ts to remove homecourt & update current user
              this.events.publish('removeHomecourtStarted', court);
              // When that completes, dismiss load screen, provide feedback, & update homecourt display
              this.events.subscribe('removeHomecourtCompleted', (data) => {
                loadScreen.dismiss().then(() => {
                  if(data.error) this.courtDataService.notify('Error', 'Error removing homecourt. Please try again.');
                  else {
                    this.zone.run(() => {
                      this.courts.splice(this.courts.indexOf(court), 1);
                      if(this.courts.length === 0) this.noHomecourts = true;
                      else this.slides.slideTo(0);
                    })
                    this.courtDataService.notify('Homecourt Removed', court.name + ' has been removed from your homecourts.')
                  }
                })
                this.events.unsubscribe('removeHomecourtCompleted')
              })
            })
            return false;
          }
        }
      ]
    }
  )
  alert.present();
  }

  public courtSearch(){
    this.navCtrl.push('CourtSearchPage', {
      role: 'homecourts'
    })
  }


  // Post:  Slide component slides to previous
  public slideBack(){
    this.slides.slidePrev();
  }

  // Post:  Slide component advances
  public slideForward(){
    this.slides.slideNext();
  }




}// class paren
