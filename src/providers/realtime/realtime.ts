import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams, Headers } from '@angular/http';

import 'rxjs/add/operator/map';



@Injectable()
export class RealtimeProvider {

  // private ortc: any = window['plugins'].OrtcPushPlugin;
  private ortc: any = '';
  constructor(private http: Http) {}

  // Post:  Connection established with realtime server if no previous connection exists
  // Post2: Subscribe to current user's channel
  public connect(currentUser: string){

    // For testing without making the connection to realtime
    if(this.ortc === '') return;

    // If connection already exists do nothing
    this.ortc.getIsConnected().then((connected) => {
      if(connected === 1){
        return;
      }
      this.ortc.connect({
        'appkey':'pLJ1wW',
        'token':'appToken',
        'metadata':'androidMetadata',
        'projectId':'979214254876',
        'url':'https://ortc-developers.realtime.co/server/ssl/2.1/'
      }).then(() => {
        this.ortc.subscribe({'channel': currentUser})
      })
    })
  }

  // Post: No connection with realtime server exists
  public disconnect(){
    this.ortc.getIsConnected().then((connected) => {
      if(connected === 0){
         return;
      }
      this.ortc.disconnect().then(() => {
        this.ortc.getIsConnected().then((connected) => {
        })
      })
    })
  }

  // Post:  Subscribe to provided channel on our existing connection
  // Pre:   Connection has already been established
  // Param: Channel to subscribe to.
  public subscribe(channel: string){
    this.ortc.getIsConnected().then((connected) => {
      if(connected === 1)
        this.ortc.subscribe({
          'channel': channel
        })
    })
  }

  // Post:  Unsubscribe from provided channel on our existing connection
  // Pre:   Connection has already been established and subscription exists
  // Param: Channel to unsubscribe from
  public unsubscribe(channel: string){
    try{
      this.ortc.unsubscribe({'channel': channel}).then(() => {
        this.disconnect();
      })
    } catch (e){ alert(e) };
  }


  // Post: sends notification to provided channels
  // Param: array of channels to send to, payload to deliver,
  //  message to display on notification itself
  public notify(channels: Array<string>, payload: any, message: string){



      this.http.post('https://ortc-mobilepush.realtime.co/mp/publishbatch', {
        applicationKey: "pLJ1wW",
        privateKey: "mHkwXRv1xbbA",
        channels : channels,
        message : message,
        payload : JSON.stringify(payload)
      }).subscribe()
  }
}
