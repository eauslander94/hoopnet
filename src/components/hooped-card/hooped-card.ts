import { Component } from '@angular/core';

/**
 * Generated class for the HoopedCard component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'hooped-card',
  templateUrl: 'hooped-card.html'
})
export class HoopedCard {

  text: string;

  constructor() {
    console.log('Hello HoopedCard Component');
    this.text = 'Hello World';
  }

}
