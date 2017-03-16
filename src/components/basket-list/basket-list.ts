import { Component } from '@angular/core';
import { ModalController, NavController} from 'ionic-angular';
// detailed game info component
import { DetailedGameInfoComponent} from '../../components/detailed-game-info/detailed-game-info';
import { EnterBasicInfoPage }       from '../../pages/enter-basic-info/enter-basic-info';

@Component({
  selector: 'basket-list',
  templateUrl: 'basket-list.html',
})

export class BasketListComponent {

  court: string;

  constructor(public modalCtrl: ModalController, public navCtrl: NavController) {
    this.court = JSON.parse(this.buildJSON());
  }

  // post: modal based on DetailedGameInfoComponent is presented to le view
  presentDetailedCourtPage() {
    // create and present modal from the DetailedGameInfoComponent
    this.modalCtrl.create(DetailedGameInfoComponent).present();
  }

  // post: navigate to enter basic info page
  // param: basket
  //    the current basket the user has clicked
  presentEnterCourtInfoPage(basket){
    this.navCtrl.push(EnterBasicInfoPage, {
      wait: 3
    });
  }

  // Returns a JSON object that was hard coded into this method
  buildJSON(){

    let basket1 = {
      "game": "4v",
      "skillLevel": 83,
      "wait": 2,
      "physicality": 3,
      "ball movement": 4,
      "gameComments": ""
    }

    let basket2 = {
      "game": "3v",
      "skillLevel": 75,
      "wait": 1,
      "physicality": 2,
      "ball movement": 4,
      "gameComments": ""
    }

    let obj: any = {
      "baskets": 4,
      "totalPlayers": 17,
      "name": "Maxcy Hall Field House",
      "basketArray": [basket1, basket2, basket1, basket2]
    }
    return JSON.stringify(obj);
  }

} //Basket List Component parenz
