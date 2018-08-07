import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';



@Injectable()
export class CourtHelper {

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

// Checks if court is closed based on open/close times and court closings
// Param:   Court to be checked
// Returns: true if court is currently open for pick-up, false otherwise
public isOpenNow(court: any){
  // get te dayOfWeek
  let day = new Date().getDay();

  // If outside the court's hours for today, return false
  if(this.afterCurrentTime(court.openTimes[day]) // if currently before court's open time for today
  || this.beforeCurrentTime(court.closeTimes[day])){ // if currently after court's close time for today
    return false;
  }

  // Check for a closure curently going on right now
  let closedNow = false;
  for(let closure of court.closures){

    // if closure is not in effect today, or it does not take up all baskets
    if(closure.days[day] === 0 || closure.baskets < court.baskets)
      continue;  // move on to next closure

    // if closure is in effect right now, the court is closed
    if(this.beforeCurrentTime(closure.clStart) // If currently after te beginning of the closure
    && this.afterCurrentTime(closure.clEnd)){ // If currently before the end of the closure
      closedNow = true;
      break;
    }
  }
  if(closedNow) return false;
  // If we got here the court is open, triumphantly return true
  return true;
}



// Performs a strictly time-based comparison between provided date and current time
// Param: UTC timestring to be compared to the current time
// Returns: True if date is before current time(by milliseconds), false otherwise
public beforeCurrentTime(dateString: string){
  let now = new Date();
  let date = new Date(dateString);
  // set day, month and year to today for a strictly time comparison
  date.setFullYear(now.getFullYear(), now.getMonth(), now.getDate())
  return (date.getTime() < now.getTime())
}

// Performs a strictly time-based comparison between provided date and current time
// Param: the UTC timestring to be compared to the current time
// Returns: True if date is after current time(by milliseconds), false otherwise
public afterCurrentTime(dateString: string){
  let now = new Date();
  let date = new Date(dateString);
  // set day, month and year tyo today for a strictly time comparison
  date.setFullYear(now.getFullYear(), now.getMonth(), now.getDate())
  return (date.getTime() > now.getTime())
}


}
