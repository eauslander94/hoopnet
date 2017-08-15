import { Component } from '@angular/core';

/**
 * Generated class for the TextPost component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'text-post',
  templateUrl: 'text-post.html'
})
export class TextPost {

  text: string;

  constructor() {
    console.log('Hello TextPost Component');
    this.text = 'Hello World';
  }

}
