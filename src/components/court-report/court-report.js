var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
/**
 * Generated class for the CourtReport component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
var CourtReport = (function () {
    function CourtReport() {
        console.log('Hello CourtReport Component');
    }
    return CourtReport;
}());
__decorate([
    Input(),
    __metadata("design:type", Object)
], CourtReport.prototype, "reportData", void 0);
CourtReport = __decorate([
    Component({
        selector: 'court-report',
        templateUrl: 'court-report.html'
    }),
    __metadata("design:paramtypes", [])
], CourtReport);
export { CourtReport };
//# sourceMappingURL=court-report.js.map