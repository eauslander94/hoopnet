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
import { NavController, NavParams } from 'ionic-angular';
var EnterDetailedInfoPage = (function () {
    function EnterDetailedInfoPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.physicality = 75;
        this.ballMovement = 75;
        this.wait = 2.7;
    }
    // post: TEMPORARY: pops twice, retuening to basket list
    EnterDetailedInfoPage.prototype.submit = function () {
        this.navCtrl.pop();
    };
    return EnterDetailedInfoPage;
}()); // EnterDetailedInfo paren
EnterDetailedInfoPage = __decorate([
    Component({
        selector: 'page-enter-detailed-info',
        templateUrl: 'enter-detailed-info.html'
    }),
    __metadata("design:paramtypes", [NavController, NavParams])
], EnterDetailedInfoPage);
export { EnterDetailedInfoPage };
//# sourceMappingURL=enter-detailed-info.js.map