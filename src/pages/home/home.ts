import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, public geolocation: Geolocation) {
    //this.map = this.initMap();
  }

  // load the map when the page has loaded
  ionViewDidLoad(){
    this.loadMap();
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

    }, (err) => {
      console.log(err);
    });

    this.addMarker();

 }


 addMarker(){
   let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: {lat: 44.660653, lng: -74.967158}
  })

  let content = "<h5>Maxcy Hall</h5>"

  this.addInfoWindow(marker, content);
 }

 addInfoWindow(marker, content){
   let infoWindow = new google.maps.InfoWindow({
      content: content
   });

   google.maps.event.addListener(marker, 'click', () => {
     infoWindow.open(this.map, marker);
   });
 }



}
