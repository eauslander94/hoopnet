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
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { EnterDetailedInfoPage } from '../../pages/enter-detailed-info/enter-detailed-info';
/*
  Generated class for the EnterBasketInfo component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
var EnterBasketInfoComponent = (function () {
    function EnterBasketInfoComponent(navCtrl, navParams, alertCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.basket = navParams.get("basket");
        this.skillLevel = {
            "lower": 65,
            "upper": 85
        };
        this.selectOptions = {
            title: 'game'
        };
    } // constructor paren
    // post: EnterDetailedInfoPage is pushed onto nav stack
    EnterBasketInfoComponent.prototype.enterDetailedInfo = function () {
        this.navCtrl.push(EnterDetailedInfoPage);
    };
    // post: data is sent to server
    // alert prompts user for navigation options
    EnterBasketInfoComponent.prototype.submit = function () {
        this.presentSubmitMessage(); // present the prompt
    };
    //method that creates alert message
    // post: alert message is posted to screen
    EnterBasketInfoComponent.prototype.presentSubmitMessage = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: "Got your data!",
            message: "Thank you for contributing to your local court. Your fellow ballers thank you.",
            buttons: [
                { text: "Enter Detailed Information",
                    handler: function () { _this.navCtrl.push(EnterDetailedInfoPage); }
                },
                { text: "Return To Court Homepage",
                    handler: function () { _this.navCtrl.pop(); }
                }
            ]
        });
        alert.present();
    };
    return EnterBasketInfoComponent;
}());
EnterBasketInfoComponent = __decorate([
    Component({
        selector: 'enter-basket-info',
        templateUrl: 'enter-basket-info.html'
    }),
    __metadata("design:paramtypes", [NavController, NavParams,
        AlertController])
], EnterBasketInfoComponent);
export { EnterBasketInfoComponent };
//# sourceMappingURL=enter-basket-info.js.map