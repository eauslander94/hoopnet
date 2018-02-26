import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';



@Injectable()
export class QuickCourtsideProvider {

  constructor(public geo: Geolocation) {
    console.log('Hello QuickCourtsideProvider Provider');
  }


  // Verifies that the user is 50 m from the provided court
  // Returns: true if user is currently at court in local storage, false otherwise
  // Param: te coords of the court the user is to be verified against.
  public isCourtside(coordinates: Array<number>){

    // verify based on user's current location
    //this.geo.getCurrentPosition().then((position) => {

     // for testing without getting user's current location
      let position = {
        coords: {
          longitude: -73.980688,
          latitude: 40.726429,
        }
      }

      // If distance between user and court in local storage is less than 50m, return true
      if(this.distance(position.coords.longitude, position.coords.latitude,
      coordinates[0], coordinates[1]) < 50)
        return true;

      return false;
    //}).catch((error) => {
    //   alert(error.message);
    // })
  }


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
