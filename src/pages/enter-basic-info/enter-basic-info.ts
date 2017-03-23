import { Component, ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

import { EnterBasketInfoComponent  } from '../../../hoopnet/src/components/enter-basket-info/enter-basket-info';

@Component({
  selector: 'page-enter-basic-info',
  templateUrl: 'enter-basic-info.html'
})
export class EnterBasicInfoPage {

  basketNumber: Number = 1;

  constructor() {

  }

  @ViewChild(Slides) slides: Slides;

  slideChanged() {
    this.basketNumber = this.slides.getActiveIndex();
  }

}
