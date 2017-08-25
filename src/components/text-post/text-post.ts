import { Component, Input } from '@angular/core';

@Component({
  selector: 'text-post',
  templateUrl: 'text-post.html'
})
export class TextPost {

  // Post data used to populate the post
  @Input() postData;

  constructor() {}



}
