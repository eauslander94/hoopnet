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
  // The number of baskets this court has
  courtBaskets: number;
  errorMessageShowing: boolean;

  hackgroundStyle: string;
  margin: any;

  constructor(params: NavParams, public viewCtrl: ViewController) {

    // fill gamecount with 0s
    this.gamecount = [0, 0, 0, 0, 0, 0];
    this.courtBaskets = params.get("baskets");
    if(params.get('inWindow')){
      this.margin = (document.documentElement.clientHeight - (document.documentElement.clientWidth * .63));
      this.margin += 'px'
    }
    else {
      this.margin = '54vw';
    }
  }

  // post1: if baskets entered <= court's baskets,
  //        games[] formatted and returned to window
  // post2: if baskets entered > court's baskets, prompt user to reenter info
  submit() {
    this.games = [];
    let baskets: number = 0;

/*  Convert gamecount[] to games[], count baskets  */
    // loop through gamecount
    for(let i in this.gamecount){
      // loop for the selected number of each particular game
      while (this.gamecount[i] > 0){
        this.games.push(+i);  //add a game of that type(eg 5v, represented by i)
        // count the number of baskets
        if (i === "5")  baskets += 2;
        else baskets ++;
        this.gamecount[i]--;
    }}
    this.games.reverse();

/*  Basket number check and response  */
    if(baskets <= this.courtBaskets)    this.viewCtrl.dismiss({games: this.games});
    else{
      this.gamecount = [0, 0, 0, 0, 0, 0];  // reset gamecount
      this.errorMessageShowing = true;      // show the error message
    }
  }

  // pass back an empty array
  noGamesPressed(){
    this.viewCtrl.dismiss([]);
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
  private clearGamecount(){
    // -1 because the increment event is fired when this button is clicked
    this.gamecount = [0, 0, 0, 0, 0, 0]
  }
}
