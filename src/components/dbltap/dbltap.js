var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, ElementRef, Output, EventEmitter } from '@angular/core';
import { Gesture } from "ionic-angular/gestures/gesture";
// Custom double click directive.
// Can be added to any element
// To attatch a callback to a double click event.
var Dbltap = (function () {
    function Dbltap(el) {
        this.dblTap = new EventEmitter();
        this.el = el.nativeElement;
        this.lastTapTime = new Date();
    }
    Dbltap.prototype.ngOnInit = function () {
        var _this = this;
        this.dbltapGesture = new Gesture(this.el);
        // listen for tap events
        this.dbltapGesture.listen();
        this.dbltapGesture.on('tap', function (event) {
            // get current time
            var currentTime = new Date();
            //if the difference between the last tap and the current time is less than 320ms
            if (currentTime.getTime() - _this.lastTapTime.getTime() < 320)
                _this.dblTap.emit(); // emit our double tap event
            _this.lastTapTime = currentTime; // set the last tap to the current time
        });
    };
    Dbltap.prototype.ngOnDestroy = function () {
        this.dbltapGesture.destroy();
    };
    return Dbltap;
}());
__decorate([
    Output('dbltap'),
    __metadata("design:type", EventEmitter)
], Dbltap.prototype, "dblTap", void 0);
Dbltap = __decorate([
    Directive({
        selector: '[dbltap]' // Attribute selector
    }),
    __metadata("design:paramtypes", [ElementRef])
], Dbltap);
export { Dbltap };
//# sourceMappingURL=dbltap.js.map