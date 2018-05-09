import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';



@Injectable()
export class QuickCourtsideProvider {

  constructor(public geo: Geolocation) {}


  // Verifies user's location against provided court
  // Returns: true if user is currently at provided court, false otherwise
  // Param: the coords of the court the user is to be verified against.
  // Pre: Coordinates are in the [lng, lat] fromat we use trouhout the app
  // Post: If user at given court, court's location and a timestamp into local storage
  public courtside(court: any, userCoords: Array<number>){

      // If distance between user and court in local storage is less than 50m, return true
      if(this.distance(court.location.coordinates[0], court.location.coordinates[1], userCoords[0], userCoords[1]) < 50){
        // courtside court into local storage
        window.localStorage.setItem('courtside', JSON.stringify(court))
        return true;
      }
      return false;


       // for testing without getting user's current location
       // let position = {
       //   coords: {
       //     longitude: -83.980688,
       //     latitude: 50.726429,
       //   }
       // }
  }

  // performs time based verification based on court in local storage, if present
  // Ensures that user as been at provided court witin 30 minutes
  // Risk: User can scout provided court from anywhere within the timeframe. We take risks out here
  // public timeCheck(location: Array<number>){
  //
  //   if(JSON.parse(window.localStorage.getItem('courtside')) ){
  //     let courtside = JSON.parse(window.localStorage.getItem('courtside'));
  //
  //     if(new Date().getTime() - new Date(courtside.timestamp).getTime() < 1800000
  //      // ensure courts ave te same location
  //      && this.distance(location[0], location[1],
  //      courtside.coordinates[0],
  //      courtside.coordinates[1]) < 10){
  //        return true;
  //     }
  //   }
  //   return false;
  // }

  // returns distance in metwer between locations provided by lat lng
  private distance(lon1, lat1, lon2, lat2) {

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
