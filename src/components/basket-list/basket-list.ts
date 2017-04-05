import { Component,  } from '@angular/core';
import { ModalController, NavController} from 'ionic-angular';

// detailed game info component
import { DetailedGameInfoComponent} from '../../components/detailed-game-info/detailed-game-info';
import { EnterBasicInfoPage }       from '../../pages/enter-basic-info/enter-basic-info';
import { CourtDataService } from '../../services/courtDataService.service';

@Component({
  selector: 'basket-list',
  templateUrl: 'basket-list.html',
})

export class BasketListComponent {

  court: string;
  dummy: any;

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, private courtDataService: CourtDataService) {
    this.court = JSON.parse(this.buildJSON());

  }

  // post: modal based on DetailedGameInfoComponent is presented to le view
  presentDetailedCourtPage(basket) {
    // create and present modal from the DetailedGameInfoComponent
    this.modalCtrl.create(DetailedGameInfoComponent, basket).present();
  }

  // post: navigate to enter basic info page
  // param: basket
  //    the current basket the user has clicked
  presentEnterCourtInfoPage(basket){
    this.navCtrl.push(EnterBasicInfoPage, {
      basket: basket
    });
  }

  // Returns a JSON object that was hard coded into this method
  buildJSON(){

    let basket1 = {
      "basketNo": 1,
      "game": "4v",
      "skillLevel": 88,
      "wait": 2,
      "physicality": 82,
      "ballMovement": 55,
      "gameComments": ""
    }

    let basket2 = {
      "basketNo": 2,
      "game": "3v",
      "skillLevel": 80,
      "wait": 1,
      "physicality": 75,
      "ballMovement": 85,
      "gameComments": ""
    }

    let basket3 = {
      "basketNo": 3,
      "game": "1v",
      "skillLevel": 62,
      "wait": 0,
      "physicality": 60,
      "ballMovement": 60,
      "gameComments": ""
    }

    let basket4 = {
      "basketNo": 4,
      "game": "3v",
      "skillLevel": 88,
      "wait": 2,
      "physicality": 75,
      "ballMovement": 90,
      "gameComments": ""
    }

    let obj: any = {
      "baskets": 4,
      "totalPlayers": 17,
      "name": "Test Court",
      "basketArray": [basket1, basket2, basket3, basket4]
    }
    return JSON.stringify(obj);
  }

} //Basket List Component paren
