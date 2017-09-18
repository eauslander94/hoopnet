import { Directive,  ElementRef, Input, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {Gesture} from "ionic-angular/gestures/gesture";

// Custom double click directive.
// Can be added to any element
// To attatch a callback to a double click event.
@Directive({
  selector: '[dbltap]' // Attribute selector
})
export class Dbltap implements OnInit, OnDestroy {

  Hammer: any;

  el: HTMLElement;
  dbltapGesture: Gesture;
  @Output('dbltap') dblTap: EventEmitter<any> = new EventEmitter();
  lastTapTime: Date;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
    this.lastTapTime = new Date();
  }

  ngOnInit() {
    this.dbltapGesture = new Gesture(this.el);
    // listen for tap events
    this.dbltapGesture.listen();
    this.dbltapGesture.on('tap', (event) =>{
      // get current time
      let currentTime = new Date();
      //if the difference between the last tap and the current time is less than 320ms
      if (currentTime.getTime() - this.lastTapTime.getTime() < 320)
        this.dblTap.emit(); // emit our double tap event
      this.lastTapTime = currentTime; // set the last tap to the current time
    })
  }

  ngOnDestroy() {
    this.dbltapGesture.destroy();
  }
}
