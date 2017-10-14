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
var Profile = (function () {
    function Profile(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    Profile.prototype.generateUser = function () {
        this.user = {
            "fName": "Eli",
            "nName": "White Iverson",
            "lName": "Auslander",
            // An array of pointers to court objects
            "homecourts": [],
            // An array of pointers to user objects
            "friends": [],
            // pointer to court object
            "lastHcourt": "",
            "lastHdate": new Date("September 17, 2017"),
            // for now, string link to the image
            "avatar": '../assets/img/sampleAvatar.jpg',
            "backgroundImage": "https://i.amz.mshcdn.com/kJsKVWzrBmN0e7A4xwcbAyGm9DI=/fit-in/1200x9600/https%3A%2F%2Fblueprint-api-production.s3.amazonaws.com%2Fuploads%2Fcard%2Fimage%2F108414%2FGettyImages-638822.jpg",
            // pointer to the court object the user is beside
            "courtside": {},
        };
    };
    Profile.prototype.test = function () {
        this.dummy = "success";
    };
    return Profile;
}());
Profile = __decorate([
    IonicPage(),
    Component({
        selector: 'page-profile',
        templateUrl: 'profile.html',
    }),
    __metadata("design:paramtypes", [NavController, NavParams])
], Profile);
export { Profile };
//# sourceMappingURL=profile.js.map