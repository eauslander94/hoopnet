import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/*
  Generated class for the MapSearchPopover component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'map-search-popover',
  templateUrl: 'map-search-popover.html'
})
export class MapSearchPopoverComponent {


  constructor(public viewCtrl: ViewController) {}

  close() {
    this.viewCtrl.dismiss();
  }

}
