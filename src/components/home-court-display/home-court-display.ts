import { Component } from '@angular/core';

/**
 * Generated class for the HomeCourtDisplay component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'home-court-display',
  templateUrl: 'home-court-display.html'
})
export class HomeCourtDisplay {

  text: string;

  constructor() {
    console.log('Hello HomeCourtDisplay Component');
    this.text = 'Hello World';
  }

}
