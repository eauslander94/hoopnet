var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
//import { EnterBasketInfoComponent  } from '../../../hoopnet/src/components/enter-basket-info/enter-basket-info';
var EnterBasicInfoPage = (function () {
    function EnterBasicInfoPage() {
        this.basketNumber = 1;
    }
    EnterBasicInfoPage.prototype.slideChanged = function () {
        this.basketNumber = this.slides.getActiveIndex();
    };
    return EnterBasicInfoPage;
}());
__decorate([
    ViewChild(Slides),
    __metadata("design:type", Slides)
], EnterBasicInfoPage.prototype, "slides", void 0);
EnterBasicInfoPage = __decorate([
    Component({
        selector: 'page-enter-basic-info',
        templateUrl: 'enter-basic-info.html'
    }),
    __metadata("design:paramtypes", [])
], EnterBasicInfoPage);
export { EnterBasicInfoPage };
//# sourceMappingURL=enter-basic-info.js.map