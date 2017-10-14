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
import { ViewController, NavParams } from 'ionic-angular';
var Closures = (function () {
    function Closures(viewCtrl, params) {
        this.viewCtrl = viewCtrl;
        this.params = params;
        this.closures = params.get('closures');
        // Check up on this when you get internet
        this.dayOfWeek = new Date().getDay();
    }
    Closures.prototype.getStyle = function (days, index) {
        if (days[index] > 0)
            return '#387ef5';
    };
    // post: Yesterday's single day closures have been removed from the list
    Closures.prototype.cleanClosures = function () {
        for (var _i = 0, _a = this.closures; _i < _a.length; _i++) {
            var closure = _a[_i];
            // take yesterday's 1s, set them to 0s
            if (closure.days[this.dayOfWeek - 1] == 1)
                closure.days[this.dayOfWeek - 1] = 0;
            // If we've got all 0s in days, kill the closure  
            var saveClosure = false;
            for (var day in closure.days) {
                if (closure.days[day] > 0)
                    saveClosure = true;
                if (!saveClosure)
                    this.closures.
                    ;
            }
        }
    };
    return Closures;
}());
Closures = __decorate([
    Component({
        selector: 'closures',
        templateUrl: 'closures.html'
    }),
    __metadata("design:paramtypes", [ViewController, NavParams])
], Closures);
export { Closures };
//# sourceMappingURL=closures.js.map