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
/**
 * Generated class for the HoopedCard component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
var HoopedCard = (function () {
    function HoopedCard() {
        console.log('Hello HoopedCard Component');
        this.text = 'Hello World';
    }
    return HoopedCard;
}());
HoopedCard = __decorate([
    Component({
        selector: 'hooped-card',
        templateUrl: 'hooped-card.html'
    }),
    __metadata("design:paramtypes", [])
], HoopedCard);
export { HoopedCard };
//# sourceMappingURL=hooped-card.js.map