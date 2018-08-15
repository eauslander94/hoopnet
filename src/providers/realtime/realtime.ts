import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import { Platform } from 'ionic-angular'

import 'rxjs/add/operator/map';


@Injectable()
export class RealtimeProvider {

  private ortc: any = '';

  constructor(private platform: Platform, private http: Http) {
    // wait for platform to become ready and plugins to become available
    this.platform.ready().then(() => {
    // alert('declaring ortc');
      this.ortc = window['plugins'].OrtcPushPlugin
    })
  }

  // Post:  Connection established with realtime server if no previous connection exists
  // Post2: Subscribe to current user's channel
  public connect(currentUser: string){

    // If ortc has yet to be declared return
    if(this.ortc === '') return;

    // If connection already exists do nothing
    this.ortc.getIsConnected().then((connected) => {
      if(connected === 1){
        // alert('active connection exists');
        return;
      }
      // alert('no active connection, connecting to ortc');
      this.ortc.connect({
        'appkey':'pLJ1wW',
        'token':'appToken',
        'metadata':'androidMetadata',
        'projectId':'979214254876',
        'url':'https://ortc-developers.realtime.co/server/ssl/2.1/'
      }).then(() => {
        alert('connected to ortc, subscribing to our channel, this is where app breaks on iOS');
        this.ortc.subscribe({'channel': currentUser}).then(() => {alert('subscribed to channel ' + currentUser)})
      })
    })
  }

  // Post: No connection with realtime server exists
  public disconnect(){
    if(this.ortc === '') return;

    this.ortc.getIsConnected().then((connected) => {
      if(connected === 0){
        //  alert('in disconnect, no active connection exists')
         return;
      }
      this.ortc.disconnect().then(() => {
        this.ortc.getIsConnected().then((connected) => {
          if(connected === 0) alert('successfully disconnected from ortc');
        })
      })
    })
  }

  // Post:  Subscribe to provided channel on our existing connection
  // Pre:   Connection has already been established
  // Param: Channel to subscribe to.
  public subscribe(channel: String){
    if(this.ortc === '') return;

    alert('connecting to channel' + channel);

    //this.ortc.getIsConnected().then((connected) => {
      //if(connected === 1)
        this.ortc.subscribe({
          'channel': channel
        }).then(() => alert('succesfully connected. lets go'));
    //})
  }

  // Post:  Unsubscribe from provided channel on our existing connection
  // Pre:   Connection has already been established and subscription exists
  // Param: Channel to unsubscribe from
  public unsubscribe(channel: string){
    if(this.ortc === '') return;

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

    for(let channel of channels) alert('sending to channel: ' + channel)

      this.http.post('https://ortc-mobilepush.realtime.co/mp/publishbatch', {
        applicationKey: "pLJ1wW",
        privateKey: "mHkwXRv1xbbA",
        channels : channels,
        message : message,
        payload : JSON.stringify(payload)
      }).subscribe(
        err => {alert('error sending notifications\n' + err)}
      )
  }
}
