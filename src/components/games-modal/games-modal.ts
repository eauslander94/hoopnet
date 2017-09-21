import { Component } from '@angular/core';
import { NavParams, ViewController} from 'ionic-angular';


@Component({
  selector: 'games-modal',
  templateUrl: 'games-modal.html'
})
export class GamesModal {

  // Our array of games, to be filled by the user
  games: Array<number>;
  // gameCount - array used to count the number of each type of game(eg 5v5)
  gamecount: Array<number>

  constructor(params: NavParams, public viewCtrl: ViewController) {

    // fill gamecount with 0s
    this.gamecount = [0, 0, 0, 0, 0, 0];

  }

  dismiss() {
    this.viewCtrl.dismiss(this.games);
  }

  //Post: Modal is dismissed without data being passed to the window
  closeModal(){
    this.viewCtrl.dismiss();
  }

  // post: gamecount is incremented at the given index
  private incrementGamecount(index: number){
    this.gamecount[index]++;
  }

  // post: gamecount is cleared at the given index
  private clearGamecount(index:number){
    // -1 because the increment event is fired when this button is clicked
    this.gamecount[index] = -1;
  }
}
