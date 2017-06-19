import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { BasketListComponent } from '../../components/basket-list/basket-list'

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})


export class AboutPage {

courtName: String;
court: any;

  constructor(public navCtrl: NavController, public params: NavParams) {

      this.court = this.params.get('court');
      if(this.court)
        this.courtName = this.court.name;
      else
        this.court = this.buildJSON();

  }

  // Returns a JSON object that was hard coded into this method
  buildJSON(){

    let basket1 = {
      "basketNo": 1,
      "game": "4 v 4",
      "skillLevel": 88,
      "wait": 2,
      "physicality": 82,
      "ballMovement": 55,
      "gameComments": ""
    }

    let basket2 = {
      "basketNo": 2,
      "game": "3 v 3",
      "skillLevel": 80,
      "wait": 1,
      "physicality": 75,
      "ballMovement": 85,
      "gameComments": ""
    }

    let basket3 = {
      "basketNo": 3,
      "game": "FREE",
      "skillLevel": 62,
      "wait": 0,
      "physicality": 60,
      "ballMovement": 60,
      "gameComments": ""
    }

    let basket4 = {
      "basketNo": 4,
      "game": "free",
      "skillLevel": 88,
      "wait": 2,
      "physicality": 75,
      "ballMovement": 90,
      "gameComments": ""
    }

    let basket5 = {
      "basketNo": 5,
      "game": "5 v 5",
      "skillLevel": 88,
      "wait": 2,
      "physicality": 75,
      "ballMovement": 90,
      "gameComments": ""
    }

    let basket6 = {
      "basketNo": 6,
      "game": "5 v 5",
      "skillLevel": 88,
      "wait": 2,
      "physicality": 75,
      "ballMovement": 90,
      "gameComments": ""
    }

    let obj: any = {
      "baskets": 4,
      "totalPlayers": 17,
      "totalBaskets": 6,
      "name": "Tompkins Square Park",
      "basketArray": [basket1, basket2, basket3, basket4],
      "location": {
        "lat": 40.726526,
        "long":  -73.981737
      }
    }

    return obj;
  }



}
