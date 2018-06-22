// ionic imports
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, PopoverController, AlertController, ModalController, Events,
        ToastController, ViewController } from 'ionic-angular';
// Map imports
import { Geolocation } from '@ionic-native/geolocation';
// communication with server
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
// court report imports
import { CourtDataService } from '../../services/courtDataService.service';
import { AuthService } from '../../services/auth.service'
import { CourtsideCheckIn } from '../../components/courtside-check-in/courtside-check-in';

import { WindowModal }  from '../../components/window-modal/window-modal';
import { GamesModal }  from "../../components/games-modal/games-modal";
import { WaitTimeModal } from '../../components/wait-time-modal/wait-time-modal';
import { NotificationResponse } from '../../components/notification-response/notification-response';

//import { RealtimeProvider } from '../../providers/realtime/realtime'

import { JwtHelper } from 'angular2-jwt'

import * as Realtime from 'realtime-messaging';

declare var google: any;

@Component({
  selector: 'page-hoop-map',
  templateUrl: 'hoop-map-page.html',
})
export class HoopMapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  test: any;

  court: any;

  // Hold a reference to all the courts we've gathered
  courts: Array<any>

  // To be used for determining if a marker was clicked or pressed
  fingerOnScreen: boolean;

  allCourtsObservable: Observable<Response>;

  // new window data to be populated as the user scouts
  nwd: any;

  // holds references to te markers on the map
  markers: Array<any>


  count: number = 0;

  constructor(public navCtrl: NavController,
              public geolocation: Geolocation,
              public courtDataService: CourtDataService,
              public popoverCtrl: PopoverController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              public events: Events,
              private toastCtrl: ToastController,
              private auth: AuthService,
              public viewCtrl: ViewController)
  {

    events.subscribe('homeCourtMessage', () => {
      this.addHomeCourtsMessage();
    })

    // When current User user updates window add marker
    events.subscribe('reloadCourt', (court) => {
      this.addCourtMarker(court);
    })

    // When splashcreen is dismissed, cascade court markers
    events.subscribe('dismissingSplashscreen', () => { this.dropCourts() })

    this.markers = [];

    // Update the markers every 5 minutes to simulate fade effect
    // Observable.interval(1000 * 60 * 5).subscribe( x => {
    //   for(let marker of this.markers){
    //     marker.setIcon( {
    //       url: '/assets/icon/markers/holdMine.png',
    //       scaledSize: new google.maps.Size(30, 50),
    //       // The anchor - halfway on x axis, all te way down on y axis
    //       anchor: new google.maps.Point(15, 30),
    //       origin: new google.maps.Point(0, 0),
    //    },)
    //   }
    // })
  }


  // Add markers to map, wait 200ms in between each one
  public async dropCourts(){
    for (let court of this.courts){
      this.addCourtMarker(court);
      await this.delay(8);
    }
  }





  // load the map when the page has loaded, liste for push-noti events
  ionViewDidLoad(){
    this.loadMap();

    document.addEventListener("push-notification", function(notification:any){

      if(notification.payload.messageType === 'hoopingNow'){
        this.presentHoopingNowAlert(notification.payload);
      }

      // Responding to the invitation sent to you
      if(notification.payload.messageType === 'invitation'){
        this.notificationResponse(notification.payload)
      }

      // Responding to the response of the invitation you sent out
      if(notification.payload.messageType === 'invitationResponse'){
        this.invitationResponse(notification.payload);
      }

    }.bind(this))// must bind this to function that responds to push-noti events
  }




  // post: Map is loaded, addCourtMarker is called when the map has finished loading
  loadMap() {

      // center around Tompkins Sq Park
      let latLng = new google.maps.LatLng(40.723697, -73.988818);

      let mapOptions = {
        center: latLng,
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: this.getStyles()
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      // Once we have loaded the map, get courts from db
      google.maps.event.addListenerOnce(this.map, 'tilesloaded', () => {
        this.courtDataService.getAllCourts().subscribe(
          res => {
            this.courts = res.json();
            this.events.publish('gotAllCourtObjects');
          },
          error => console.log(error),
          );
      })
  }

  // Param: court - a court object as defined in the model
  // Post: a marker corresponding to that court is added to the map
  // Post2 - Event listners are added to each marker to detect for clicks or presses
   public addCourtMarker(court: any){

     let latLng = new google.maps.LatLng
       (court.location.coordinates[1], court.location.coordinates[0]);

     let iconPath = 'assets/icon/courtMarker.png';

     // Get path to icon image based on the largest game being played at that court
    //  iconPath = 'assets/icon/markers/';
    //  if(court.windowData.games.length == 0)
    //   iconPath += 'x.png'
    //  else iconPath += court.windowData.games[0] + 'v.png'

     let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      icon: {
        url: iconPath,
        scaledSize: new google.maps.Size(24, 40),
        // The anchor - halfway on x axis, all te way down on y axis
        anchor: new google.maps.Point(12, 40),
        origin: new google.maps.Point(0, 0),
      },
      // Each marker has a court object attached to it.
      // This is the object that will be passed into other parts of the app.
      court: court
    })
    // Keep reference of eac marker
    this.markers.push(marker);

    google.maps.event.addListener(marker, 'mousedown', () => {
      this.fingerOnScreen = true;
      this.clickOrPress(court);
    })
    google.maps.event.addListener(marker, 'mouseup', () => {
      this.fingerOnScreen = false;
    })
   }



  // post: courtsideCheckIn modal is presented, starting courtside behavior
  // pre: User is authenticated
  presentCourtsideCheckIn(){

    // authentication check
    if(!this.courtDataService.auth.isAuthenticated()){
      // display the message, return
      this.courtDataService.toastMessage(
        "You must be logged in to check in to a court", 3000);
      return;
    }


    let cci = this.modalCtrl.create(CourtsideCheckIn, {showBackdrop: false});

    // handle the response
    cci.onDidDismiss(data =>{
      // Move map if that is what data returned said to do
      if(data.moveMap){
        this.map.setCenter(new google.maps.LatLng
          (data.location.coordinates[1], data.location.coordinates[0])
        )
        this.map.setZoom(15);
      }
      // pull up the window, prompt user to scout the court
      else if(data.scoutPrompt){
        this.scoutPrompt(data.court)
      }

    })

    cci.present();
  }

  // Post:  games and waitTime modals are presented
  // Post2: retrieved information sent to server
  // Post3: User prompted to invite friends
  // Param: Court we are currently scouting
  // Pre:   User is located at provided court.
  public scoutPrompt(court: any){

    // Copy window data
    this.nwd = JSON.parse(JSON.stringify(court.windowData));
    // present the modal
    let gamesModal = this.modalCtrl.create(GamesModal, {
     baskets: court.baskets,
     court_id: court._id
    });
    // update nwd based on data retreived
    gamesModal.onDidDismiss(data => {
      if(!data) return;  // If noting returned back, do not proceed
      // save games data returned
      this.nwd.games = data.games;
      this.nwd.gLastValidated = new Date()
      // present wait time modal
      let waitTimeModal = this.modalCtrl.create(WaitTimeModal)
      waitTimeModal.onDidDismiss(data => {
        // if we have new data, update nwd
        if(data && data.waitTime){
          this.nwd.waitTime = data.waitTime;
          this.nwd.wLastValidated = new Date();
        }
        // send data to server, thank user for scouting
        this.courtDataService.scout(this.nwd)
        this.scoutedAlert(court);
      })
      waitTimeModal.present();
    })
    // present te modal
    gamesModal.present();
  }


  // Post: Window Modal is presented, connect to realtime.co webhook
  // Param: Court which we will connect to
  presentWindowModal(court: any, scoutPrompt: boolean){



   let windowModal = this.modalCtrl.create(WindowModal,
      { 'court': court, 'scoutPrompt': scoutPrompt }
    )

    // Disconnect when dismissing theWindow
    windowModal.onDidDismiss( (data) => {
      //realtime.disconnect();

      if(data)
        if(data.invite)
          this.scoutedAlert(court)
    })

    windowModal.present();
  }


  // Post: Alert is presented wich thaks players for scouting the court
  public scoutedAlert(court: any){
    let alert = this.alertCtrl.create({
    title: 'You\'ve successfully scouted the court',
    message: 'Your fellow ballers thank you',
    buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Invite Friends?',
          handler: () => {
            // dismiss the alert, then bring up invite friends page
            alert.dismiss().then(() => {
              this.navCtrl.push('InviteFriendsPage',{
                courtName: court.name,
                location: court.location
              })
            })
            return false;
          }
        }
      ]
    });
    alert.present();
  }


  // Post: alert created that notifies current user tat their friend is currently hooping.
  presentHoopingNowAlert(payload: any){

    let alert = this.alertCtrl.create({
      title: 'Let\'s get buckets',
      message: payload.message,
      buttons: [{
        text: 'Dismiss',
        role: 'cancel',
        handler: () => {}
      },
      {
        text: 'View Court',
        handler: () => {
          // dismiss the alert, then bring up invite friends page
          alert.dismiss().then(() => {
            this.moveMap(payload.location);
          })
          return false;
        }
      }]
    })
    alert.present()
  }

  // Post:  UI displaying court invitation pulled up
  // Param: Payload of the invitation notification
  public notificationResponse(payload: any){
    this.modalCtrl.create(NotificationResponse, {
      payload: payload,
    }).present()
  }


  // Post: Alert confirming or denying hoop invitation is pulled up
  // Param: payload from notification invitation
  public invitationResponse(payload: any){

    let message = payload.userName;
    // payload.confirm comes back as a string.  So we treat it so, below
    if(payload.confirm === 'true')
      message +=  ' accepts your invitation to hoop! Have a happy session.';
    else message +=  ' cannot make this hoop session. We hope that you have a good run.';

    this.alertCtrl.create({
      title: 'Invitation Response',
      message: message,
      buttons: [{
        text: 'Dismiss',
        role: 'cancel',
      }]
    }).present()
  }


 // Param: Court object
 // Returns: pat to te correct marker icon
 // Post: returns marker icon faded based on the largest game entered last
 private getfadingNumberIcon(court: any){

  //  pathing automatically relative to www
   let path = 'assets/icon/markers/fib/'
   if(court.windowData.games.length == 0){
     return path + 'x.png'
   }
   // marker number becomes the largest game on record
   else path += court.windowData.games[0]
   if(court.windowData.games[0] === '5')
     return 'assets/icon/markers/imageedit_14_2357865370.png'
  else if(court.windowData.games[0] === '4')
     return 'assets/icon/markers/imageedit_10_8717414982.png'

   // get minutesPassed
   let minutes = new Date().getTime() - new Date(court.windowData.gLastValidated).getTime();
   let min = Math.floor(minutes / 60000);

   // get correct path based on minutes passed
   switch (true) {
     // Stay bright for 30 min, then fade by fibonacci numbers every 5 min
    case (min <= 30):   return path + "v.png";
    case (min <= 35):   return path + "v89.png";
    case (min <= 40):   return path + "v55.png";
    case (min <= 45):   return path + "v34.png";
    case (min <= 50):   return path + "v21.png";
    case (min <= 55):   return path + "v13.png";
    case (min <= 60):   return path + "v8.png";
    case (min <= 65):   return path + "v5.png";
    case (min <= 70):   return path + "v3.png";
    case (min <= 75):   return path + "v2.png";
    case (min <= 80):   return path + "v1.png";
    case (min <= 85):   return path + "v1.png";
    default:            return path + "v0.png";
  };
}

 // Determines whether the marker was clicked or pressed
 // Post1:  Marker clicked called on a click
 // Post2:  Marker Pressed called on a presse
 // Param:  the court to be passed to the callback functions
 private async clickOrPress(court: any){
   await this.delay(150);
   if(!this.fingerOnScreen)
     this.presentWindowModal(court, false);
   await this.delay(350)
   if(this.fingerOnScreen){
     this.fingerOnScreen = false;
     this.confirmAddCourt(court);
   }
 }

 // Post:  from an async function, execution is delayed for the given time
 // Param: number ms - the time to wait for
 private delay(ms: number) {
   return new Promise<void>(function(resolve) {
       setTimeout(resolve, ms);
   });
}

// Post:  Confirm add courts alert is presented
// Param: the court to be potentially added
public confirmAddCourt(court: any){

  if(!this.auth.isAuthenticated()){
    this.courtDataService.toastMessage('Log in to add homecourts', 3000)
    return;
  }

  // check if this is one of your homecourts first
  for(let homecourt of JSON.parse(window.localStorage.getItem('currentUser')).homecourts)
    if(court._id === homecourt){
      this.courtDataService.notify('Already a Homecourt', court.name + ' is already a homecourt of yours.');
      return;
    }

  let alert = this.alertCtrl.create({
    title: 'Add Homecourt',
    message: 'Add ' + court.name + ' to your homecourts?',
    buttons: [
      { text: 'Cancel',
        role: 'cancel'
      },
      { text: 'Add',
        handler: () => {

          this.courtDataService.putHomecourt(court._id).subscribe(
            res => this.events.publish('updateCurrentUser', res.json())
          );
          alert.dismiss().then(() => {
            this.courtDataService.notify('Homecourt Added',
            court.name + ' has been added to your homecourts.')
          })
          return false;
        }
      }
    ]
  })

  alert.present();
}

// Post: Add HomeCourts message is presented
public addHomeCourtsMessage(){
  this.toastCtrl.create({
    message: 'Press and hold a court marker to add it to your Home Courts.',
    position: 'top',
    showCloseButton: true,
    closeButtonText: 'Got it'
  }).present();
}


 // post: map is centered given location, zooms into court
 // paren: location object in the standard we use across the app
 moveMap(location){
   this.map.setCenter(new google.maps.LatLng(location.coordinates[1],
   location.coordinates[0]))
   this.map.setZoom(15).then(() => {
     // alert("hello")
   })
 }




//post: Styles array is returned to be used in creation of the map
private getStyles(){
  return [

    //hide points of attraction
    {
      featureType: 'poi',
      stylers: [{"visibility": 'off'}]
    },
    // Hide manmade landscapes
    {
      featureType: 'landscape.man_made',
      stylers: [{visibility: 'off'}]
    },
    // Set water to be our primary color;
    // {
    //   featureType: 'water',
    //   stylers: [{color: '#e2f8ff'}]
    // },
    // // styling natural landscapes
    // {
    //   featureType: 'landscape',
    //   stylers: [{color: "#fffff0"}]
    // },
    // simlify transit
    {
      featureType: 'transit',
      stylers: [{visibility: 'simplified'}]
    },
    // hide transit lines
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{visibility: 'off'}]
    },

    // remove road icons
    {
      featureType: 'road',
      elementType: 'label.icon',
      stylers: [{visibility: 'off'}]
    },
    // simplify the roads
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {visibility: 'simplified'},
        {color: '#ffffff'}
      ]
    },

    // set all text to be simple
    {
      elementType: 'labels.text',
      stylers: [
        {visibility: 'simplified'}
      ]
    },
    {
      featureType: 'poi.park',
      //elementType: 'labels.text',
      stylers: [{visibility: 'simplified'}]
    },
    // remove park icons
    {
      featureType: 'poi.park',
      elementType: 'label.icon',
      stylers: [{visibility: 'off'}]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [{visibility: 'on'}]
    },

    // Sports complexes to look like parks
    {
      featureType: 'poi.sports_complex',
      stylers: [
        {visibility: 'simplified'},
        //{color: '#131313'}
      ]
    },

    // {
    //   featureType: 'poi.sports_complex',
    //   elementType: 'labels.text',
    //   //stylers:  [{color: '#fffff0'}]
    // },

    // set all text to be simple and black
    {
      elementType: 'labels.text',
      stylers: [
        {color: '#131313'},
        {visibility: 'simplified'}
      ]
    },
    {
      featureType: 'administrative.neighborhood',
      elementType: "labels.text",
      stylers: [{visibility: "off"}]
    },

  ]
}


 }
