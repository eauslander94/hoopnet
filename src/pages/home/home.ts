// ionic imports
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, PopoverController, AlertController } from 'ionic-angular';
// Map imports
import { Geolocation } from '@ionic-native/geolocation';
// communication with server
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
// court report imports
import { CourtDataService } from '../../services/courtDataService.service';
import { MapSearchPopoverComponent } from '../../components/map-search-popover/map-search-popover';
import { OneCourtPage } from '../one-court/one-court';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  test: any;
  dummy: any;

  allCourtsObservable: Observable<Response>;


  constructor(public navCtrl: NavController,
              public geolocation: Geolocation,
              public courtDataService: CourtDataService,
              public popoverCtrl: PopoverController,
              private alertCtrl: AlertController) {}


  // load the map when the page has loaded
  ionViewDidLoad(){
    this.loadMap();
    this.getCourts();
  }


  // load the map around the user's current location
  loadMap() {
    // get the location, upon success the callback pulls up the map
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      }, (err) => { console.log(err) });

      // Once the map has loaded, call getCourts
      google.maps.event.addListenerOnce(this.map, 'tilesloaded', function(){
        this.getCourts();
      });
 }


 // Post: 1) allCourtsObservable is set to the new observable returned bycourtDataService
 //       2)processResponse is called upon successful reception of res
  getCourts(){
    this.allCourtsObservable = this.courtDataService.getAllCourts();
    this.allCourtsObservable
     .subscribe(
      // here we extract the array of courts and call populate map
      res => {
        this.processResponse(res)
      }, error => {this.dummy += error},  () => {}
    )
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
     buttons: [{
       text: 'View Court',
       handler: () => {
         // dismiss the alert before navigating
         alert.dismiss().then(() => { this.navCtrl.push(OneCourtPage, {
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
