import { Component, Input } from '@angular/core';


@Component({
  selector: 'picture-post',
  templateUrl: 'picture-post.html'
})
export class PicturePost {

  // Data used to populate post
  @Input() postData;

  constructor() {}

}
