import { Component, Input } from '@angular/core';
import { PopoverController, ModalController, AlertController } from 'ionic-angular';
import { DetailedGameInfoComponent } from '../../components/detailed-game-info/detailed-game-info';

// communication with server
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

import { CourtDataService } from '../../services/courtDataService.service';

@Component({
  selector: 'basket-list',
  templateUrl: 'basket-list.html',
})

export class BasketListComponent {

  dummy: any;
  @Input() court;
  oneCourtObservable: Observable<Response>;

  constructor(private courtDataService: CourtDataService,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController) { this.dummy = "dummy" }

  presentDetailedBasketInfo(basket){
    let detailedBasketInfo = this.modalCtrl.create(DetailedGameInfoComponent,
      { "basket": basket,
        "courtName": this.court.name }
    );
    detailedBasketInfo.present();
  }


    // Method presentGamePrompt
    // Postcondition: Prompt for the single game info of the corresponding
    //                  basket appears
    // Parameters: basket  - the basket for which we are entering Data
    //             counter - the number of baskets we have left to prompt for
    presentGamePrompt(basket){
      let gamePrompt = this.alertCtrl.create();
      gamePrompt.setTitle('Current Game - Basket ' + basket.basketNo);
      gamePrompt.addInput({
        type: 'radio',
        label: "5 v 5",
        value: "5 v 5",
        checked: true
      })
      // Add a radio input for each game
      let games = ["4 v 4", "3 v 3", "2 v 2", "1 v 1", "free", "shootaround", "closed", "other"];
      for(let game of games){
        gamePrompt.addInput({
          type: 'radio',
          label: game,
          value: game,
          // check the current game
          //checked: (basket.game === game)
        })
      }
      // add cancel and submit buttons
      gamePrompt.addButton('Cancel');
      gamePrompt.addButton({
        text: 'Submit', handler: data => {

          this.courtDataService.putOneGame(this.court, basket.basketNo, data);



          // Prompt for games until we have prompted all baskets
          gamePrompt.dismiss().then(() => {
            // call refreshCourt
            this.courtDataService.refresh(this.court).subscribe(
              res => {
                // reflect the updated game
                this.court.basketArray[basket.basketNo - 1].game =
                res.json().basketArray[basket.basketNo - 1].game },
              error => {this.dummy = error},
              () => {}
            );

            /*counter--;
            if(counter !== 0){
              // load the prompt with the next basket
              // REMEMBER: basket No begins at 1 but basketArray begins at 0
              let nextBasket = basket.basketNo;
              if(this.court.basketArray[nextBasket] == null)
                 nextBasket = 0;
              this.presentGamePrompt(this.court.basketArray[nextBasket], counter)
            }
            // else say thank you for your data!*/

          }

          );
        }
      })
      gamePrompt.present();
    }



} //Basket List Component paren
