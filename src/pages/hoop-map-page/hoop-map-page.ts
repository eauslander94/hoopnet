// ionic imports
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, PopoverController, AlertController, ModalController } from 'ionic-angular';
// Map imports
import { Geolocation } from '@ionic-native/geolocation';
// communication with server
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
// court report imports
import { CourtDataService } from '../../services/courtDataService.service';
import { MapSearchPopoverComponent } from '../../components/map-search-popover/map-search-popover';
import { CourtPage }  from '../../pages/court-page/court-page';
import { CourtsideCheckIn } from '../../components/courtside-check-in/courtside-check-in';
import { Closures } from '../../components/closures/closures';
import { HoursDisplay } from '../../components/hours-display/hours-display';

declare var google: any;

@Component({
  selector: 'page-hoop-map',
  templateUrl: 'hoop-map-page.html'
})
export class HoopMapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  test: any;
  dummy: any;
  court: any;

  allCourtsObservable: Observable<Response>;


  constructor(public navCtrl: NavController,
              public geolocation: Geolocation,
              public courtDataService: CourtDataService,
              public popoverCtrl: PopoverController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController) {

    this.court = {
      baskets: 4,
      closures: [{
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
      {clStart: new Date(16),
      clEnd: new Date(18),
      reason: "Mens Basketball Practice",
      baskets: 4,
      days: [1, 0, 0, 0, 0, 0, 1],
      repeat: true
    },
    {clStart: new Date(16),
    clEnd: new Date(18),
    reason: "Girls Soccer Practice3",
    baskets: 4,
    days: [2, 0, 0, 0, 0, 0, 1],
    repeat: true
  }],

  // monday(0) - sunday(6) based arrays, representing the time that the court
  //  opens and closes
  openTimes: ['6:00a', '6:00a', '6:00a', '6:00a', '6:00a', '8:00a', '8:00a'],
  closeTimes: ['11:00p','7:00p','11:00p','11:00p','11:00p','10:30p','8:00p']
    }
  }


  // load the map when the page has loaded
  ionViewDidLoad(){
    this.loadMap();
    this.getCourts();
  }


  // load the map around the user's current location
  loadMap() {
    // get the location, upon success the callback pulls up the map
    this.geolocation.getCurrentPosition().then((position) => {
      //let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let latLng = new google.maps.LatLng(40.723697, -73.988818);

      let mapOptions = {
        center: latLng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [

          //hide points of attraction
          { featureType: 'poi',
          stylers: [{"visibility": 'off'}]  },
          //   // Hide highways
          // { featureType: 'road.highway',
          // stylers: [{visibility: 'off'}]},
          // Hide highways
          { featureType: 'landscape.man_made',
          stylers: [{visibility: 'off'}]},

          // Set water to be our primary color;
          {featureType: 'water',
          stylers: [{color: '#387ef5'}]},
          // styling natural landscapes
          {featureType: 'landscape',
          stylers: [{color: "#131313"}]},

          // remove road icons
          {'featureType': 'road',
          elementType: 'label.icon',
          'stylers': [{visibility: 'off'}]},
          // simplify the roads
          {'featureType': 'road',
          elementType: 'geometry',
          'stylers': [
            {visibility: 'simplified'}
          ]},
          // color the roads
          {featureType: 'road',
          elementType: 'geometry',
          stylers:  [{color: '#050505'}]},
          // simlify transit
          {'featureType': 'transit',
          stylers: [{visibility: 'simplified'}]},
          // hide transit lines
          {'featureType': 'transit',
          'elementType': 'geometry',
          'stylers': [{visibility: 'off'}]},

          // set all text to be simple and off white
          {'elementType': 'labels.text',
          stylers: [
            {color: '#fffff0'},
            {visibility: 'simplified'}
          ]},


            {'featureType': 'poi.park',
            'elementType': 'labels.text',
            stylers: [{visibility: 'simplified'}]},

            // Sports complexes to look like parks
            {'featureType': 'poi.sports_complex',
            stylers: [
              {visibility: 'simplified'},
              {color: '#131313'}
            ]},

            {featureType: 'poi.sports_complex',
            elementType: 'labels.text',
            stylers:  [{color: '#fffff0'}]},

            {featureType: 'administrative.neighborhood',
            "elementType": "labels",
            stylers: [{visibility: "none"}]},

            // set all text to be simple and off white
            {'elementType': 'labels.text',
            stylers: [
              {color: '#fffff0'},
              {visibility: 'simplified'}
            ]},

        ]

      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      }, (err) => { console.log(err) });
  }


  // post: courtsideCheckIn modal is presented, starting courtside behavior
  // pre: User is authenticated
  presentCourtsideCheckIn(){
    let cci = this.modalCtrl.create(CourtsideCheckIn, {showBackdrop: false});

    // handle the response
    cci.onDidDismiss(data =>{
      // Move map if that is what data returned said to do
      if(data.moveMap){
        this.map.setCenter(new google.maps.LatLng(data.location.lat, data.location.lng))
        this.map.setZoom(15);
      }
    })

    cci.present();
  }

  // Post: 1) allCourtsObservable is set to the new observable returned bycourtDataService
  //       2)processResponse is called upon successful reception of res
   getCourts(){
     this.courtDataService.getAllCourts()
       .subscribe(
         // here we extract the array of courts and call populate map
         res => { this.processResponse(res) },
         error => {this.dummy += error},
         () => {}
       );
   }

  // post: Closures component is presented
  presentClosures(){
    this.modalCtrl.create(Closures,
    {"closures": this.court.closures, "courtBaskets": this.court.baskets})
    .present();
  }

  // post: Hours display is presented
  presentHours(){
    this.modalCtrl.create
      (HoursDisplay,{"ot": this.court.openTimes, "ct":this.court.closeTimes})
      .present();
  }

 // Param: a response object containing an array of courts
 // Post: Each court is added to the map
  processResponse(res: Response){
    //let courtArray = res.json();
    for (let court of res.json())
      this.addCourtMarker(court);
  }

// Param: court - a court object as defined in the model
// post: a marker corresponding to that court is added to the map
 addCourtMarker(court){
   let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: {lat: court.location.lat, lng: court.location.long},
    // Each marker has a court object attached to it.
    // This is the object that will be passed into other parts of the app.
    court: court
  })
  google.maps.event.addListener(marker, 'click', (court) => {
    this.markerClicked(marker.court);
  })
 }

 // method markerClicked()
 // Param: court - the court object corresponding to the clicked marker
 // Post: Alert is presented
 markerClicked(court){
   let alert = this.alertCtrl.create({
     title: court.name,
     subTitle: court.totalBaskets + " baskets",
     buttons: [
       { text: 'Cancel',
       handler: data => {}
      },
       { text: 'View Court',
       handler: () => {
         // dismiss the alert before navigating
         alert.dismiss().then(() => { this.navCtrl.push(CourtPage, {
           court: court
         }) });
         return false;
       }
     }]
   });
   alert.present();
 }


 // center the map to the around the given address
 moveMap(address){
   this.map.setCenter(new google.maps.LatLng(40.723697, -73.988818))
 }


 presentPopover(myEvent){
   let popover = this.popoverCtrl.create(MapSearchPopoverComponent);
   popover.present({
     ev: myEvent
   });
 }

 }
