import { Component, Input } from '@angular/core';


@Component({
  selector: 'domino-spinner',
  templateUrl: 'domino-spinner.html'
})


export class DominoSpinner {

  // The text to dosplay next to the spinner
  @Input() text

  constructor() {}

}
