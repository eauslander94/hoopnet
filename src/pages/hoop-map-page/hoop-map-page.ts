// ionic imports
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, PopoverController, AlertController, ModalController, Events,
        ToastController } from 'ionic-angular';
// Map imports
import { Geolocation } from '@ionic-native/geolocation';
// communication with server
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
// court report imports
import { CourtDataService } from '../../services/courtDataService.service';
import { AuthService } from '../../services/auth.service'
import { CourtsideCheckIn } from '../../components/courtside-check-in/courtside-check-in';
import { CourtMapPopup } from '../../components/court-map-popup/court-map-popup';

import { WindowModal }  from '../../components/window-modal/window-modal';
import { InviteFriendsPage } from '../invite-friends/invite-friends';

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
  dummy: any;
  court: any;

  ortc: any;

  // To be used for determining if a marker was clicked or pressed
  fingerOnScreen: boolean;

  allCourtsObservable: Observable<Response>;


  constructor(public navCtrl: NavController,
              public geolocation: Geolocation,
              public courtDataService: CourtDataService,
              public popoverCtrl: PopoverController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              public events: Events,
              private toastCtrl: ToastController,
              private auth: AuthService)
  {
    this.court = this.generateCourt();

    events.subscribe('homeCourtMessage', () => {
      this.addHomeCourtsMessage();
    })


    // Subscriing to push notifications. First check for current User, if not wait
    // if(window.localStorage.getItem('currentUser'))
    //   this.pushConnect(JSON.parse(window.localStorage.getItem('currentUser'))._id)
    // else events.subscribe('gotCurrentUser', () => {
    //   this.pushConnect(JSON.parse(window.localStorage.getItem('currentUser'))._id)
    // })

        this.dummy = "eli"
  }

  // testing our first push notification
  public pushTest(){

    this.navCtrl.push(InviteFriendsPage);
  }

  // load the map when the page has loaded, liste for push-noti events
  ionViewDidLoad(){
    this.loadMap();

    // listen for push notification events
    document.addEventListener("push-notification", function(notification:any){

      // Receiver side tere is no need to parse the payload object. Use it as below
      if(notification.payload.messageType === 'hoopingNow'){
        this.presentHoopingNowAlert(notification.payload);
      }
    }.bind(this))// must bind this to function that responds to push-noti events
  }


  // post: Map is loaded, addCourtMarker is called when the map has finished loading
  loadMap() {

      // center around Tompkins Sq Park
      let latLng = new google.maps.LatLng(40.723697, -73.988818);

      let mapOptions = {
        center: latLng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: this.getStyles()
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      // Once we have loaded the map, get courts from db
      google.maps.event.addListenerOnce(this.map, 'tilesloaded', () => {
        this.getCourts();
      })
  }

  // Post1:  Courts are requested from the server
  // Post2:  A marker is added to the map for every court returned
   getCourts(){
     this.courtDataService.getAllCourts().subscribe(
       res => {
         for (let court of res.json()){
           this.addCourtMarker(court);
           console.log(court.windowData.court_id);
        }
       },
       error => {this.dummy += error},
         () => {}
       );
   }

   // Post1:  Courts are requested from the server
   // Post2:  A marker is added to the map for every court returned
    getCourtsById(_ids: Array<string>){
      this.courtDataService.getCourtsById(_ids).subscribe(
        res => {
          for (let court of res.json()){
            this.addCourtMarker(court);
         }
        },
        error => {alert(error)},
        );
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
        this.presentWindowModal(data.court, true)
      }

    })

    cci.present();
  }

  // Post: Window Modal is presented, connect to realtime.co webhook
  // Param: Court which we will connect to
  presentWindowModal(court: any, scoutPrompt: boolean){

    // connect to realtime webhook upon presenting window, pass it in
    const realtime = Realtime.createClient();
    realtime.setClusterUrl('https://ortc-developers.realtime.co/server/ssl/2.1/');
    realtime.connect('pLJ1wW', 'testToken')

    let windowModal = this.modalCtrl.create(WindowModal,
      { 'court': court,
        'realtime': realtime,
        'scoutPrompt': scoutPrompt }
    )

    // Disconnect when dismissing theWindow
    windowModal.onDidDismiss( (data) => {
      // if told to, refresh te court that was just changed
      if(data.reload)
        this.getCourtsById([data._id]);
      realtime.disconnect();

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
              this.navCtrl.push(InviteFriendsPage,
              {courtName: court.name, location: court.location})
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


// Param: court - a court object as defined in the model
// Post: a marker corresponding to that court is added to the map
// Post2 - Event listners are added to each marker to detect for clicks or presses
 addCourtMarker(court: any){

   let latLng = new google.maps.LatLng
     (court.location.coordinates[1], court.location.coordinates[0]);
   let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: latLng,
    // icon: {
    //   url: 'assets/img/hoopMarkerBlue.png',  // pathing automatically relative to www
    //   scaledSize: new google.maps.Size(40, 40),
    //   // The anchor - halfway on x axis, all te way down on y axis
    //   anchor: new google.maps.Point(20, 40),
    //   origin: new google.maps.Point(0, 0),
    // },
    // Each marker has a court object attached to it.
    // This is the object that will be passed into other parts of the app.
    court: court
  })
  //marker.setIcon('../../www/assets/img/hoopPin.png');

  google.maps.event.addListener(marker, 'mousedown', () => {
    this.fingerOnScreen = true;
    this.clickOrPress(court);
  })
  google.maps.event.addListener(marker, 'mouseup', () => {
    this.fingerOnScreen = false;
  })
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
  let alert = this.alertCtrl.create({
    subTitle: 'Add ' + court.name + ' to your Home Courts?',
    buttons: [
      { text: 'Cancel',
        role: 'cancel'
      },
      { text: 'Add',
        handler: () => {
          console.log('added ' + court.name);
          // TO DO: Server logic for adding this court to current user
          this.courtDataService.putHomecourt(court._id);
        }
      }
    ]
  }).present();
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


public testAuth(){
  console.log('testingAuth');
  // Log the nickname of the user returnes
  this.courtDataService.getUsers(['59f77e89da1d9f295b577f0f']).subscribe(
    res => {
      console.log(res.json()[0].nName);
    }
  )
}

// Post: Connects to recieve push notifications provided channel
// Param: Channel to listen on
public pushConnect(channel: string){

  let ortc = window['plugins'].OrtcPushPlugin;
  // estalish connection
  ortc.connect({
    'appkey':'pLJ1wW',
    'token':'appToken',
    'metadata':'androidMetadata',
    'projectId':'979214254876',
    'url':'https://ortc-developers.realtime.co/server/ssl/2.1/'
  }).then(() => {
    window['plugins'].OrtcPushPlugin.subscribe({
      'channel': channel
    })
  });
}

private generateCourt(){
  return {

    name: "Tompkins Square Park",
    type: "outdoor",
    baskets: 4,

    // a latLng location
    location: {
      type: 'Point',
      coordinates: [-73.981784, 40.726429,]
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

    closures: [
      {
        clStart: new Date(10),
        clEnd: new Date(12),
        reason: "3 on 3 Tournament",
        baskets: 4,
        // sunday(index 0) to saturday(index 6) -
        // 1 in the index means closure is on that day
        // 2 in the index means it repeats every week on that day
        days: [1, 0, 0, 0, 0, 0, 2],
        repeat: false
      },
        {clStart: new Date(16),
        clEnd: new Date(18),
        reason: "Mens Soccer Practice",
        baskets: 4,
        days: [2, 0, 0, 0, 0, 2, 0],
        repeat: true
      },
      {
        clStart: new Date(16),
        clEnd: new Date(18),
        reason: "Mens Basketball Practice",
        baskets: 4,
        days: [1, 0, 0, 0, 0, 0, 1],
        repeat: true
      },
      {
        clStart: new Date(16),
        clEnd: new Date(18),
        reason: "Girls Soccer Practice",
        baskets: 4,
        days: [2, 0, 0, 0, 0, 0, 1],
        repeat: true
      }
    ],
  }//court paren
}//


public tester(){

  this.courtDataService.checkIn("5a78817d5b0b83251d7c2eb7").subscribe();
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
