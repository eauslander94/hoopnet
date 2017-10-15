import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'add-closure',
  templateUrl: 'add-closure.html'
})
export class AddClosure {

  closure:any;

  constructor(public viewCtrl: ViewController, private params: NavParams) {
    this.closure = params.get('closure');
    // if we are not editing a closure and are therefore creating a new one
    if(!params.get('edit')){
      this.closure = {
        //clStart: {},
        //clEnd: {},
        reason: "",
        baskets:0,
        days: [0,0,0,0,0,0,0],
        repeat: false
      }
    }
  }

  // post: days is switched from a 0 to a 1 or vice versa
  // param: day - the day to be toggled
  public daytoggle(day: number){
    if(this.closure.days[day] > 0) this.closure.days[day] = 0;
    else this.closure.days[day] = 1;
  }

  getStyle(day){
    if(this.closure.days[day] > 0)
      return '#387ef5';
  }

  public toggleRepeat(){
    if(this.closure.repeat)  this.closure.repeat = false;
    else this.closure.repeat = true;
  }

}
