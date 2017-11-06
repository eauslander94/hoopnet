import { Component } from '@angular/core';
import { ViewController} from 'ionic-angular';
import { TheWindow } from '../components/the-window/the-window';
import { CourtDataService } from '../../services/courtDataService.service';
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
  location: Array<number>;

  constructor(public viewCtrl: ViewController,
              private geolocation: Geolocation,
              public courtDataService: CourtDataService) {
    this.state = "search";
    this.buildData();

    // Get the user's location
    this.location = [];
    this.geolocation.getCurrentPosition().then((position) => {
      this.location = [position.coords.longitude,  position.coords.latitude];
      // Get courts with location being my cribbb
      // this.getCourts([-73.988945, 40.723570]);
      // Tompkins
      this.getCourts([-73.981784, 40.726429])
    })
    // During polishing, add an error screen to the html here with appropriate error message
    .catch((error) => {
      console.log(error);
    })
  }


  public getCourts(location: Array<number>){
    this.courtDataService.courtside(location).subscribe(
      res => { this.gotCourts(res.json().courts, res.json().responseCode) },
      err => { console.log('err getCourtsByLocation in courtsideCheckIn\n' + err) }
    );
  }

  public gotCourts(courts: Array<any>, responseCode: number){
    console.log(courts);
    console.log(responseCode);
    switch(responseCode){
      case 1:
        this.court = courts[0];
        this.courtDataService.courtsidePut(courts[0]._id).subscribe(
          res => {console.log(res.json().court.windowData.pNow[0])}
        );
        this.state = 'checkedIn';
        break;
      case 2:
        this.courts = courts;
        this.state = 'closebyCourts';
        break;
      case 3:
        this.courts = courts.slice(0, 3);
        this.state = 'noCourts';
        break;
      default:
        this.courts = [];
        this.state = 'noCourts';
        break;
    }
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
      type: 'Point',
      coordinates: [-73.981784, 40.726429,]
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
    "location": {
      type: 'Point',
      coordinates: [-73.981784, 40.726429,]
    },
  }
      this.courts = [this.court, court2, this.court];
}


}