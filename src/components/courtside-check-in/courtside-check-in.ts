import { Component } from '@angular/core';
import { ViewController} from 'ionic-angular';
import { TheWindow } from '../components/the-window/the-window';
// geolocation
import { Geolocation } from '@ionic-native/geolocation';
@Component({
  selector: 'courtside-check-in',
  templateUrl: 'courtside-check-in.html'
})
export class CourtsideCheckIn {

  // State - allows view to change based on state of the check in process
  state: String;
  court: any;
  courts: any;

  // user's current location
  location: any;

  constructor(public viewCtrl: ViewController, private geolocation: Geolocation) {
    this.state = "search";
    this.buildData();

    // Get the user's location
    this.location = {};
    this.geolocation.getCurrentPosition().then((position) => {
      this.location.lat = position.coords.latitude;
      this.location.long = position.coords.longitude;
    })
    // During polishing, add an error screen to the html here with appropriate error message
    .catch((error) => {
      console.log(error);
    })
  }



  // param: court: any - the court which was courtChosen
  // post: 1) this.court becomes the court passed in
  //       2) data sent to court - this user has checked in
  //       3) state = checkedIn
  private checkedIn(court){
    this.court = court;

    // TO DO: send this user to the court's list of players

    // TO DO: set user.courtside to be the court passed in

    this.state = "checkedIn";
  }

  // post: modal is dismiss and the location of the court to move to is sent to the map
  private moveMapDismiss(location){
    this.viewCtrl.dismiss({moveMap: "true", location: location})
  }



private buildData(){
  this.court = {
    "name": "Tompkins Square Park",
    "type": "indoor",
    // a latLng location
    "location": {
      lat: 40.726429,
      lng: -73.981784,
    },
    "baskets": 4,
    "windowData": {
      "baskets": 4,
      "games": ["5", "4", "2"],
      "gLastValidated": new Date(),
      "action": "Active",
      "actionDescriptor": "continuous runs",
      "aLastValidated": new Date(),
      "pNow": []
    },
    "hours": {},
    "closures": {},
  }

  let court2 = {
    name: "Tompkins Square Park Skatepark",
    location: {
      lat: 40.726429,
      lng: -73.981784
    }
  }
      this.courts = [this.court, court2, this.court];
}


}
