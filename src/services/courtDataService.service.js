var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
var CourtDataService = (function () {
    function CourtDataService(http) {
        this.http = http;
        this.counter = 0;
    }
    //returns: Observable
    //  which emits a response containing an array of All courts in the db
    CourtDataService.prototype.getAllCourts = function () {
        return this.http.get('http://localhost:3000/getAllCourts');
    };
    // function putOneGame()
    // param: court    - The court to be updated
    //        basketNo - the basket to be updated
    //        game     - the game which will become the current game
    // postcondition: the game corresponding to basket on court is put into the db.
    CourtDataService.prototype.putOneGame = function (court, basketNo, game) {
        var putData = { "court": court, "basketNo": basketNo, "game": game };
        this.http.put('http://localhost:3000/putOneGame', putData, { headers: new Headers({ 'Content-Type': 'application/json' }) })
            .subscribe();
    };
    // function refresh()
    // param: court - the court to be refreshed
    // returns - observable omitting the latest version of that court object
    CourtDataService.prototype.refresh = function (court) {
        var params = new URLSearchParams();
        params.set('courtName', court.name);
        params.set('lat', court.location.lat);
        params.set('long', court.location.long);
        return this.http.get('http://localhost:3000/refresh', new RequestOptions({ search: params }));
    };
    return CourtDataService;
}());
CourtDataService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http])
], CourtDataService);
export { CourtDataService };
//# sourceMappingURL=courtDataService.service.js.map