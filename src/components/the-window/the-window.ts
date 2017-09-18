import { Component, Input } from '@angular/core';

/**
 * Generated class for the TheWindow component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'the-window',
  templateUrl: 'the-window.html',
})

export class TheWindow {

  @Input() windowData;

  constructor() {}

  // When games or activityBox has been pressed
  private onPress(tapped){
    if(tapped === "games"){
      this.windowData.gtime = new Date();
    }
    else if (tapped === "activity"){
      this.windowData.atime = new Date();
    }
    this.windowData.gtime = new Date();
  }

  // When games or activityBox has been double tapped
  private onDoubleTap(tapped){
    if (tapped === "games")
      this.windowData.gtime = new Date();
    else if (tapped === "activity")
      this.windowData.atime = new Date();
  }

}
