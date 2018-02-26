import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { CourtDataService } from '../../services/courtDataService.service';
import { QuickCourtsideProvider } from '../../providers/quick-courtside/quick-courtside';
// geolocation
import { Geolocation } from '@ionic-native/geolocation';
@Component({
  selector: 'courtside-check-in',
  templateUrl: 'courtside-check-in.html',
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
              public courtDataService: CourtDataService,
              public quick: QuickCourtsideProvider) {
    this.state = "search";
    alert('verifying');

    // If we've got a court in local storage
    if(window.localStorage.getItem('courtside')){

      let courtside = JSON.parse(window.localStorage.getItem('courtside'))
      // check to see that we've cecked in 15 minutes ago
      if(new Date().getTime() - new Date(courtside.timestamp).getTime() < 900000)
        this.verified(courtside.court)

      // else call quickCourtside with that court
      else if(this.quick.isCourtside(courtside.court.location.coordinates))
        this.verified(courtside.court)
    }
    // quick checking fails, query our db for a court near the user
    else {

      // Get the user's location
      this.location = [];

      // this.geolocation.getCurrentPosition().then((position) => {
      //   this.location = [position.coords.longitude,  position.coords.latitude];
      //   alert(this.location);
      //   // Get courts with location being my cribbb
      //   // this.getCourts([-73.988945, 40.723570]);
      //   // Tompkins
      //   this.getCourts(this.location)
      // })
      // // During polishing, add an error screen to the html here with appropriate error message
      // .catch((error) => {
      //   alert(error.message);
      // })

      // workaround for geolocation not working wit live reload
      // location is currently tompkins
      this.getCourts([ -73.980688, 40.726429 ])
    }





    // Get the user's location
    this.location = [];

    // this.geolocation.getCurrentPosition().then((position) => {
    //   this.location = [position.coords.longitude,  position.coords.latitude];
    //   alert(this.location);
    //   // Get courts with location being my cribbb
    //   // this.getCourts([-73.988945, 40.723570]);
    //   // Tompkins
    //   this.getCourts(this.location)
    // })
    // // During polishing, add an error screen to the html here with appropriate error message
    // .catch((error) => {
    //   alert(error.message);
    // })

    // workaround for geolocation not working wit live reload
    // location is currently tompkins
    this.getCourts([ -73.980688, 40.726429 ])

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
        this.verified(courts[0]);
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

  // Performs check-in responsibilities for the provided court
  public verified(court: any){

    this.court = court;
    this.state = 'checkedIn';
    // Save court and the current time into local storage
    let courtside = {
      court: court,
      timestamp: new Date()
    }

    window.localStorage.setItem('courtside', JSON.stringify(courtside));
    this.courtDataService.checkIn(court._id).subscribe()  // data to server
    this.scoutPrompt(court);
  }

  // Wa
  private async scoutPrompt(court){
    await this.delay(1200);
    this.viewCtrl.dismiss({scoutPrompt: "true", court: court})
  }

// Post:  from an async function, execution is delayed for the given time
// Param: number ms - the time to wait for
private delay(ms: number) {
  return new Promise<void>(function(resolve) {
      setTimeout(resolve, ms);
  });
}


  // post: modal is dismiss and the location of the court to move to is sent to the map
  public moveMapDismiss(location){
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
