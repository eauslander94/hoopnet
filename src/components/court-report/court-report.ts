import { Component, Input } from '@angular/core';

/**
 * Generated class for the CourtReport component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'court-report',
  templateUrl: 'court-report.html'
})
export class CourtReport {

  text: string;

  @Input() reportData;

  constructor() {
    console.log('Hello CourtReport Component');

  }

}
