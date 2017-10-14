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
import { ViewController } from 'ionic-angular';
var CourtsideCheckIn = (function () {
    function CourtsideCheckIn(viewCtrl) {
        this.viewCtrl = viewCtrl;
        this.state = "window";
        this.court = {
            "name": "Tompkins Square Park",
            "type": "indoor",
            // a latLng location
            "location": {
                lat: 40.726429,
                lng: -73.981784,
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
        var court2 = {
            name: "Tompkins Square Park Skatepark",
            location: {
                lat: 40.726429,
                lng: -73.981784
            }
        };
        this.courts = [this.court, court2, this.court];
    }
    // param: court: any - the court which was courtChosen
    // post: 1) this.court becomes the court passed in
    //       2) data sent to court - this user has checked in
    //       3) state = checkedIn
    CourtsideCheckIn.prototype.checkedIn = function (court) {
        this.court = court;
        // TO DO: send this user to the court's list of players
        // TO DO: set user.courtside to be the court passed in
        this.state = "checkedIn";
    };
    // post: modal is dismiss and the location of the court to move to is sent to the map
    CourtsideCheckIn.prototype.moveMapDismiss = function (location) {
        this.viewCtrl.dismiss({ moveMap: "true", location: location });
    };
    return CourtsideCheckIn;
}());
CourtsideCheckIn = __decorate([
    Component({
        selector: 'courtside-check-in',
        templateUrl: 'courtside-check-in.html'
    }),
    __metadata("design:paramtypes", [ViewController])
], CourtsideCheckIn);
export { CourtsideCheckIn };
//# sourceMappingURL=courtside-check-in.js.map