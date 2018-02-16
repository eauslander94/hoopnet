import { Injectable } from '@angular/core';
import { BackgroundFetch,
         BackgroundFetchConfig } from '@ionic-native/background-fetch';
import { BackgroundGeolocation, BackgroundGeolocationConfig,
  BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';
import { CourtDataService } from '../../services/courtDataService.service';
import { Platform } from 'ionic-angular';




@Injectable()
export class CheckOutProvider {

  court: any;

  constructor(private backgroundFetch: BackgroundFetch,
              private backgroundGeolocation: BackgroundGeolocation,
              private courtDataService: CourtDataService,
              private platform: Platform,
              private geolocation: Geolocation) {

    let checkInTime = new Date();
    this.courtDataService.serverLog(JSON.stringify(checkInTime))
    // save the check in time in local storage
    window.localStorage.setItem('checkInTime', JSON.stringify(checkInTime));

    let tompkinsLat = 40.730677;
    let tompkinsLng =  -73.985817;

    let cribLat = 40.723697;
    let cribLng = -73.988818;

    let jaspCribLat = 40.723886;
    let jaspCribLng = -73.989149;

    let jakeCribLat = 40.850673;
    let jakeCribLng = -73.942695;

    this.courtDataService.serverLog('tompkins crib distance: ' +
      this.distance(tompkinsLng, tompkinsLat, cribLng, cribLat))
    this.courtDataService.serverLog('crib to jaspers ' +
      this.distance(cribLng, cribLat, jaspCribLng, jaspCribLat))
    this.courtDataService.serverLog('crib to jakes ' +
      this.distance(cribLng, cribLat, jakeCribLng, jakeCribLat))
  }

  // Begin Incremental watch
  public checkedIn(court: any){
    //
    // // get the platform
    this.platform.ready().then(() => {

      // ANDROID
      if (this.platform.is('android')){

        // configure the backgroundGeo
        const config: BackgroundGeolocationConfig = {
          desiredAccuracy: 10,
          stationaryRadius: 30,
          distanceFilter: 30,
          debug: true,
          stopOnTerminate: false,
          // every 15 minutes get location
          locationProvider: 0,
          interval: 900000
        }

        this.backgroundGeolocation.configure(config)

          // when a location comes in
          .subscribe((location: BackgroundGeolocationResponse) => {

            // get the distance between user and court
            let distance = this.distance(location.longitude, location.latitude,
              this.court.location.coordinates[0], this.court.location.coordinates[1])

              // log distance and time
              this.courtDataService.serverLog('distance between user and court(m)\n' + distance)

            // If user is more than 100m (just over a city block) from court, checkout
            if(distance > 100)
              this.courtDataService.serverLog('I would call checkOut() here');
              // this.checkOut();

            // If user checked in 3 hours ago and we're still checking their location
            // Blanket check for users that live close to the court
            if(new Date().getTime() - JSON.parse(
            window.localStorage.getItem('checkInTime')).getTime() > 10800000 )
              this.checkOut()
          })
        // start watching
        this.backgroundGeolocation.start();
      }


      // iOS
      else if(this.platform.is('ios')){

        this.courtDataService.serverLog('iOS')

        const backgroundFetchConfig: BackgroundFetchConfig = {
          stopOnTerminate: false, // app continues to fetch when user closes the app
        };

        this.backgroundFetch.configure(backgroundFetchConfig)
          // every 30 minutes, get user's location
          .then(() => {
            this.geolocation.getCurrentPosition().then((position) => {

              // Log our location event
              this.courtDataService.serverLog('Location Event at ' +
              new Date().getHours() + ';' + new Date().getMinutes() + '\n' +
              position.coords.longitude + ', ' + position.coords.latitude)

              // get distance between user and court
              let distance = this.distance(
                position.coords.longitude, position.coords.latitude,
                this.court.location.coordinates[0], this.court.location.coordinates[1])

                // log distance and time
                this.courtDataService.serverLog('distance between user and court at ' +
                new Date().getHours() + ';' + new Date().getMinutes() + '\n' + distance)

                // If user is more than 100m (just over a city block) from court, checkout
                if(distance > 100)
                  this.checkOut();

                // If user checked in 3 hours ago and we're still checking their location
                // Blanket check for users that may not have been checked out
                if(new Date().getTime() - JSON.parse(
                window.localStorage.getItem('checkInTime')).getTime() > 10800000 )
                  this.checkOut();
            })
          })
          .catch(e => console.log('Error initializing background fetch', e))
      }
    })
  }

  // Post: User is checked out of current court, ceckInData adjusted in localStorage,
  // Post: No longer watch of user's location
  // Param (optional): Data about the court we are checked in to
  public checkOut(checkInData?: any){

    // If no ceckInData is provided, generate it here
    if(!checkInData){
      checkInData = {
        checkedIn: true,
        _id: this.court._id,
        name: this.court.name
      }
    }
    // Check Out Behavior
    this.courtDataService.checkOut(checkInData._id);
    this.backgroundGeolocation.stop();
    this.backgroundFetch.stop();

    // checkInData informs entire app tat we are no longer checked in
    window.localStorage.setItem('checkInData', JSON.stringify({
      checkedIn: false,
      _id: '',
      name: ''
    }));
  }



  // returns distance in metwer between locations provided by lat lng
  public distance(lon1, lat1, lon2, lat2) {
  	let radlat1 = Math.PI * lat1/180
  	let radlat2 = Math.PI * lat2/180
  	let theta = lon1-lon2
  	let radtheta = Math.PI * theta/180
  	let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  	dist = Math.acos(dist)
  	dist = dist * 180/Math.PI
  	dist = dist * 60 * 1.1515
    // convert to meters
     dist = dist * 1603.44;

  	return dist;
}



}
