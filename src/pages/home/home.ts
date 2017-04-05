import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController) {
    //this.map = this.initMap();
  }

  // load the map when the page has loaded
  ionViewDidLoad(){
    this.loadMap();
  }

  // load the map
  loadMap() {
    // latlng of tompkins square park, nyc
    let latLng = new google.maps.LatLng(74.9813, 44.6698);

    // object holding map options
    let mapOptions = {
      center: latLng,
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // set map to a new google maps object
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
 }

}
