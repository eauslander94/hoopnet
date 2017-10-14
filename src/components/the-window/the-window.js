var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { GamesModal } from "../games-modal/games-modal";
import { ActionModal } from '../action-modal/action-modal';
import moment from 'moment';
import { Observable } from 'rxjs/Rx';
import { AnimationService } from 'css-animator';
var TheWindow = (function () {
    function TheWindow(modalCtrl, animationService) {
        var _this = this;
        this.modalCtrl = modalCtrl;
        this.animationService = animationService;
        // Update the living timestamps every minute
        Observable.interval(1000 * 60).subscribe(function (x) {
            _this.updateLivingTimestamps();
        });
        // The morning reset:
        // Check every 59 minutes if the time is between 5:00am and 6:00am
        Observable.interval(1000 * 3540).subscribe(function (x) {
            // reset window if the hour is 5
            if (new Date().getHours() === 5)
                _this.resetWindowData();
        });
        this.animator = animationService.builder();
    }
    // When windowData has been initialized, update the living timestamps
    // Post: aLivingTimestamp and gLiving timestamp updated
    TheWindow.prototype.ngOnInit = function () {
        this.updateLivingTimestamps();
    };
    // validate()
    // param: validated: String - games, action, or both
    // pre: validated is either "games", "action" or "both"
    // post: last validated and living timestamp reset for the supplied param
    TheWindow.prototype.validate = function (validated) {
        var timeNow = new Date();
        switch (validated) {
            case "both": {
                this.windowData.gLastValidated = timeNow;
                this.windowData.aLastValidated = timeNow;
                this.updateLivingTimestamps();
                break;
            }
            case "games": {
                this.flash(this.glivingTimestampRef);
                this.windowData.gLastValidated = timeNow;
                this.gLivingTimestamp = moment(timeNow).fromNow(); // update the timestamp
                if (this.gLivingTimestamp === "a few seconds ago")
                    this.gLivingTimestamp = "just now";
                break;
            }
            case "action": {
                this.flash(this.alivingTimestampRef);
                this.windowData.aLastValidated = timeNow;
                this.aLivingTimestamp = moment(timeNow).fromNow();
                if (this.aLivingTimestamp === "a few seconds ago")
                    this.aLivingTimestamp = "just now";
                break;
            }
            default: break;
        }
    };
    // Post: both living timestamps have been replaced with their current
    //       'ago' values
    TheWindow.prototype.updateLivingTimestamps = function () {
        this.aLivingTimestamp = moment(this.windowData.aLastValidated).fromNow();
        this.gLivingTimestamp = moment(this.windowData.gLastValidated).fromNow();
        // enter "just now" for a few seconds ago
        if (this.aLivingTimestamp === "a few seconds ago")
            this.aLivingTimestamp = "just now";
        if (this.gLivingTimestamp === "a few seconds ago")
            this.gLivingTimestamp = "just now";
    };
    // presentGamesModal()
    // Pre: User is authenticated and at the court
    // Post: Model which collects information about games being currently played
    //    is presented
    // Post: Data received is sent to server
    TheWindow.prototype.presentGamesModal = function () {
        var _this = this;
        // Pass in the number of baskets at the court
        var gamesModal = this.modalCtrl.create(GamesModal, { "baskets": this.windowData.baskets });
        // When the submit button is pressed, set the returned games array to windowdata
        gamesModal.onDidDismiss(function (data) {
            if (data) {
                _this.windowData.games = data;
                _this.validate("games");
            }
            // TO DO: Send new court data to the server
        });
        gamesModal.present();
    };
    // presentActionModal()
    // Pre: User is authenticated and at the court
    // Post: Modal which collects information about court action is presented
    // Post: Data received is sent to server
    TheWindow.prototype.presentActionModal = function () {
        var _this = this;
        var actionModal = this.modalCtrl.create(ActionModal, { showBackdrop: true, enableBackdropDismiss: true });
        actionModal.onDidDismiss(function (data) {
            if (data) {
                // TO DO: send this data to the server
                _this.windowData.action = data.action;
                _this.windowData.actionDescriptor = data.actionDescriptor;
                _this.validate("action");
            }
        });
        actionModal.present();
    };
    //getActionColor()
    // post: color, green, yellow, red, is returned based on the value of action
    TheWindow.prototype.getActionColor = function () {
        switch (this.windowData.action.toLowerCase()) {
            case "active": return "green";
            case "packed": return "red";
            case "empty": return "#FFB300";
            default: return "black";
        }
    };
    // resetWindowData
    // post: action is set to empty and games array is emptied
    TheWindow.prototype.resetWindowData = function () {
        this.windowData.games = [];
        this.windowData.action = "Empty";
        this.windowData.actionDescriptor = "Need more players";
        this.validate("both");
    };
    // fadeInRight(object)
    // param: object - String - the object to be faded in
    // post:  object fades in from the right
    TheWindow.prototype.flash = function (ref) {
        this.animator.setType('flash').show(ref.nativeElement);
    };
    TheWindow.prototype.wiggle = function () {
        this.animator.setType('shake').show(this.basket.nativeElement);
    };
    TheWindow.prototype.fadeOut = function (ref) {
        this.animator.setType('fadeOut').show(ref.nativeElement);
    };
    return TheWindow;
}());
__decorate([
    Input(),
    __metadata("design:type", Object)
], TheWindow.prototype, "windowData", void 0);
__decorate([
    ViewChild('alivingTimestamp'),
    __metadata("design:type", ElementRef)
], TheWindow.prototype, "alivingTimestampRef", void 0);
__decorate([
    ViewChild('glivingTimestamp'),
    __metadata("design:type", ElementRef)
], TheWindow.prototype, "glivingTimestampRef", void 0);
__decorate([
    ViewChild('basket'),
    __metadata("design:type", Object)
], TheWindow.prototype, "basket", void 0);
TheWindow = __decorate([
    Component({
        selector: 'the-window',
        templateUrl: 'the-window.html',
    }),
    __metadata("design:paramtypes", [ModalController, AnimationService])
], TheWindow);
export { TheWindow };
//# sourceMappingURL=the-window.js.map