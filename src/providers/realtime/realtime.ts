import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the RealtimeProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class RealtimeProvider {

  private ortc: any;

  constructor(public http: Http) {
    //alert('Hello RealtimeProvider Provider');
    //this.ortc = window['plugins'].OrtcPushPlugin;
  }

  public connect(){
    alert('realtime, bihhhh')
  }

}
