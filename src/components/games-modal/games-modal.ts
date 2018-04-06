import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController, ModalController,
         Events} from 'ionic-angular';

import { AddClosure } from '../add-closure/add-closure';
import { CourtDataService } from '../../services/courtDataService.service';


@Component({
  selector: 'games-modal',
  templateUrl: 'games-modal.html',
  providers: [AddClosure]
})
export class GamesModal {

  // Our array of games, to be filled by the user
  games: Array<number>;
  // gameCount - array used to count the number of each type of game(eg 5v5)
  gamecount: Array<number>
  // The number of baskets this court has
  courtBaskets: number;

  hackgroundStyle: string;
  margin: any;

  // To control error message
  message: string = "block";
  error: string = "none";
  messageOpacity: number = 1;
  errorOpacity: number = 1;

  inWindow: boolean;

  constructor(private params: NavParams,
              public viewCtrl: ViewController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              public addClosure: AddClosure,
              public courtDataService: CourtDataService,
              public events: Events) {

    // fill gamecount with 0s
    this.gamecount = [0, 0, 0, 0, 0, 0];
    this.courtBaskets = params.get("baskets");
    if(params.get('inWindow')){
      this.margin = '83vw';
      this.inWindow = true;
    }
    else {
      this.margin = '54vw';
      this.inWindow = false;
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
      this.changeMessage();
    }
  }

  // Presents alert displaying information on ow to scout the court
  public info(){

    this.alertCtrl.create({
      title: "How to Scout Games",
      message: "In no particular order, tap the games that you see."
      + " The number below each game value indicates the number of games of that value being played."
      + " For example, if there is a \'5 on 5\' and two \'3 on 3\'s being played at your court, "
      + " you would tap \'5 on 5\' once and \'3 on 3\' twice."
      + " Happy hooping.",
      buttons: [{
        text: "got it",
        role: 'cancel'
      }]
    }).present();
  }

  // if we are scouting from oop button, do not dismiss
  public hackground(){
    if(this.inWindow){
      this.viewCtrl.dismiss();
      return;
    }
    this.alertCtrl.create({
      title: "Before Leaving...",
      message: "Please enter the games being played at your court.  It only takes a moment."
    }).present();
  }

  // change message, wait, fade error message out, cange back
  private async changeMessage(){
    // change to error, hold for 2 seconds
    this.error = "block";
    this.message = "none";
    await this.delay(2000);
    // fade out
    this.errorOpacity = 0;
    await this.delay(600);
    // change back
    this.error = "none";
    this.message = "block";
    this.errorOpacity = 1
  }

  // Post:  from an async function, execution is delayed for the given time
  // Param: number ms - the time to wait for
  private delay(ms: number) {
    return new Promise<void>(function(resolve) {
        setTimeout(resolve, ms);
    });
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

  // Post: Add Closure Form is presented
  public courtClosed(){
    let add = this.modalCtrl.create(AddClosure, {
      edit: false,
      courtBaskets: this.courtBaskets,
      fromGamesModal: true,
    })
    add.onDidDismiss((data) => {
      if(data && data.closure){
        // send closure data to server, dismiss games modal, reload te court
        this.courtDataService.postClosure(data.closure, this.params.get('court_id')).subscribe(
          res => this.events.publish('reloadCourt', res.json()),
          err => this.courtDataService.notify('ERROR', err)
        );
      }
      this.viewCtrl.dismiss();
    })

    add.present().then(() => {
      this.addClosure.instructions()
    })
  }


}
