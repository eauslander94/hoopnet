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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
/**
 * Generated class for the CourtPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var CourtPage = (function () {
    function CourtPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        // Generate the UI only data upon construction
        this.generateUIData();
    }
    CourtPage.prototype.generateUIData = function () {
        this.court = {
            "name": "Tompkins Square Park",
            "type": "indoor",
            // a latLng location
            "location": {
                lat: "",
                lng: "",
            },
            "baskets": 4,
            "windowData": {
                "baskets": 4,
                "games": ["5", "4", "2"],
                "gLastValidated": new Date(),
                "action": "Active",
                "actionDescriptor": "continuous runs",
                "aLastValidated": new Date(),
                "pNow": []
            },
            "hours": {},
            "closures": {},
        };
        this.windowData = this.court.windowData;
        this.windowData.gLastValidated.setMinutes(this.windowData.gLastValidated.getMinutes() - 5);
        this.windowData.aLastValidated.setMinutes(this.windowData.aLastValidated.getMinutes() - 5);
    };
    return CourtPage;
}());
CourtPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-court-page',
        templateUrl: 'court-page.html',
    }),
    __metadata("design:paramtypes", [NavController, NavParams])
], CourtPage);
export { CourtPage };
//# sourceMappingURL=court-page.js.map