var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
var GamesModal = (function () {
    function GamesModal(params, viewCtrl) {
        this.viewCtrl = viewCtrl;
        // fill gamecount with 0s
        this.gamecount = [0, 0, 0, 0, 0, 0];
        this.courtBaskets = params.get("baskets");
    }
    // post1: if baskets entered <= court's baskets,
    //        games[] formatted and returned to window
    // post2: if baskets entered > court's baskets, prompt user to reenter info
    GamesModal.prototype.submit = function () {
        this.games = [];
        var baskets = 0;
        /*  Convert gamecount[] to games[], count baskets  */
        // loop through gamecount
        for (var i in this.gamecount) {
            // loop for the selected number of each particular game
            while (this.gamecount[i] > 0) {
                this.games.push(+i); //add a game of that type(eg 5v, represented by i)
                // count the number of baskets
                if (i === "5")
                    baskets += 2;
                else
                    baskets++;
                this.gamecount[i]--;
            }
        }
        this.games.reverse();
        /*  Basket number check and response  */
        if (baskets <= this.courtBaskets)
            this.viewCtrl.dismiss(this.games);
        else {
            this.gamecount = [0, 0, 0, 0, 0, 0]; // reset gamecount
            this.errorMessageShowing = true; // show the error message
        }
    };
    // pass back an empty array
    GamesModal.prototype.noGamesPressed = function () {
        this.viewCtrl.dismiss([]);
    };
    //Post: Modal is dismissed without data being passed to the window
    GamesModal.prototype.closeModal = function () {
        this.viewCtrl.dismiss();
    };
    // post: gamecount is incremented at the given index
    GamesModal.prototype.incrementGamecount = function (index) {
        this.gamecount[index]++;
    };
    // post: gamecount is cleared at the given index
    GamesModal.prototype.clearGamecount = function () {
        // -1 because the increment event is fired when this button is clicked
        this.gamecount = [0, 0, 0, 0, 0, 0];
    };
    return GamesModal;
}());
GamesModal = __decorate([
    Component({
        selector: 'games-modal',
        templateUrl: 'games-modal.html'
    }),
    __metadata("design:paramtypes", [NavParams, ViewController])
], GamesModal);
export { GamesModal };
//# sourceMappingURL=games-modal.js.map