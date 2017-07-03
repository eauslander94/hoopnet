import { Directive, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[parallax-header]',
  // listens to events from the parent component
  host: {
    '(ionScroll)': 'onContentScroll($event)',
    '(window:resize)': 'onWindowResize($event)'
  }
})
export class ParallaxHeader {

    header: any;
    headerHeight: any;
    translateAmt: any;
    scaleAmt: any;

    constructor(public element: ElementRef, public renderer: Renderer){

    }

    ngOnInit(){

        // set references and some initial styling
        let content = this.element.nativeElement.getElementsByClassName('scroll-content')[0];
        this.header = content.getElementsByClassName('header-image')[0];
        let mainContent = content.getElementsByClassName('main-content')[0];

        this.headerHeight = this.header.clientHeight;

        // Use renderer so that we can alter styles regardless of platform/environment
        this.renderer.setElementStyle(this.header, 'webkitTransformOrigin', 'center bottom');
        this.renderer.setElementStyle(this.header, 'background-size', 'cover');
        this.renderer.setElementStyle(mainContent, 'position', 'absolute');
    }

    // update the header height on a resize event
    onWindowResize(ev){
        this.headerHeight = this.header.clientHeight;
    }

    // Update the header on the ion-scroll event
    onContentScroll(ev){

        // update within ev.domWrite() is a major performance improvement.
        // It essentially tells the browser, 'update at the ideal time'
        ev.domWrite(() => {
            this.updateParallaxHeader(ev);
        });
    }

    updateParallaxHeader(ev){
        // calculate the new values for the parallax effect
        if(ev.scrollTop >= 0){
            this.translateAmt = ev.scrollTop / 2;
            this.scaleAmt = 1;
        } else {
            this.translateAmt = 0;
            this.scaleAmt = -ev.scrollTop / this.headerHeight + 1;
        }
        // apply them
        this.renderer.setElementStyle(this.header, 'webkitTransform', 'translate3d(0,'+this.translateAmt+'px,0) scale('+this.scaleAmt+','+this.scaleAmt+')');
        // note: Above is a costly DOM manipulation, which would have caused jerkiness in the past,
        // but now runs smoothely because of ionic's improvements
    }

}
