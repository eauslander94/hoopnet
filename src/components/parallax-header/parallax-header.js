var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, ElementRef, Renderer } from '@angular/core';
var ParallaxHeader = (function () {
    function ParallaxHeader(element, renderer) {
        this.element = element;
        this.renderer = renderer;
    }
    ParallaxHeader.prototype.ngOnInit = function () {
        // set references and some initial styling
        var content = this.element.nativeElement.getElementsByClassName('scroll-content')[0];
        this.header = content.getElementsByClassName('profile-parallax')[0];
        //  let mainContent = content.getElementsByClassName('main-content')[0];
        this.headerHeight = this.header.clientHeight;
        // Use renderer so that we can alter styles regardless of platform/environment
        this.renderer.setElementStyle(this.header, 'webkitTransformOrigin', 'center bottom');
        this.renderer.setElementStyle(this.header, 'background-size', 'cover');
        //this.renderer.setElementStyle(mainContent, 'position', 'absolute');
    };
    // update the header height on a resize event
    ParallaxHeader.prototype.onWindowResize = function (ev) {
        this.headerHeight = this.header.clientHeight;
    };
    // Update the header on the ion-scroll event
    ParallaxHeader.prototype.onContentScroll = function (ev) {
        var _this = this;
        // update within ev.domWrite() is a major performance improvement.
        // It essentially tells the browser, 'update at the ideal time'
        ev.domWrite(function () {
            _this.updateParallaxHeader(ev);
        });
    };
    ParallaxHeader.prototype.updateParallaxHeader = function (ev) {
        // calculate the new values for the parallax effect
        if (ev.scrollTop >= 0) {
            this.translateAmt = ev.scrollTop / 2;
            this.scaleAmt = 1;
        }
        else {
            this.translateAmt = 0;
            this.scaleAmt = -ev.scrollTop / this.headerHeight + 1;
        }
        // apply them
        this.renderer.setElementStyle(this.header, 'webkitTransform', 'translate3d(0,' + this.translateAmt + 'px,0) scale(' + this.scaleAmt + ',' + this.scaleAmt + ')');
        // note: Above is a costly DOM manipulation, which would have caused jerkiness in the past,
        // but now runs smoothely because of ionic's improvements
    };
    return ParallaxHeader;
}());
ParallaxHeader = __decorate([
    Directive({
        selector: '[parallax-header]',
        // listens to events from the parent component
        host: {
            '(ionScroll)': 'onContentScroll($event)',
            '(window:resize)': 'onWindowResize($event)'
        }
    }),
    __metadata("design:paramtypes", [ElementRef, Renderer])
], ParallaxHeader);
export { ParallaxHeader };
//# sourceMappingURL=parallax-header.js.map