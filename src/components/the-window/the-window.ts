import { Component, Input } from '@angular/core';

/**
 * Generated class for the TheWindow component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'the-window',
  templateUrl: 'the-window.html'
})

export class TheWindow {

  @Input() windowData;

  constructor() {}

}
