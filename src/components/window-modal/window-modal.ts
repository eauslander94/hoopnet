import { Component, NgZone, ElementRef, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ViewController, NavParams, Content } from 'ionic-angular';
import { ParallaxHeader }   from '../../components/parallax-header/parallax-header';

import * as Realtime from 'realtime-messaging';

@Component({
  selector: 'window-modal',
  templateUrl: 'window-modal.html',
})
export class WindowModal {

  court: any;
  windowData: any;

  marginNumber: number;
  marginMin: number;
  marginMax: number;
  margin: string;

  expanded: boolean;

  @ViewChild(Content) content: Content;


  constructor(public viewCtrl: ViewController,
              private params: NavParams,
              public zone: NgZone,
              public renderer: Renderer2,
              public cdr: ChangeDetectorRef)
  {
    this.court = params.get('court');
    this.windowData = params.get('court').windowData;
    this.windowData.coordinates = this.court.location.coordinates;

    // pass in the realtime client
    this.windowData.realtime = params.get('realtime');
    // Prompt user to enter info
    if(params.get('scoutPrompt'))
      this.windowData.scoutPrompt = params.get('scoutPrompt')

    // set MarginMax(least modal showing) and marginMin(most showing) using our converters
    // marginMax = screen height - (name height + header height)
    this.marginMax = this.marginNumber = this.vh2px(100) - this.vw2px(51);
    // marginMin = screen height - (name height + content height)
    this.marginMin = this.vh2px(100) - this.vw2px(78);
    this.margin = this.marginNumber + 'px';
    this.expanded = false;
  }


  // Handle rapidly fired scroll events in batches using domWrite
  scrollHandler(event) {
    event.domWrite(() => {
        this.adjustShowing(event);
    })
  }


  // Moves the entire modal up or down based off scroll values
  adjustShowing(event){
    // this.zone.run(()=>{
      if(event.directionY == "down"){
        if (this.expanded)
          return;
        // if we've scrolled more tan te eader height, expand

        if(event.scrollTop > this.vw2px(34))
          this.expand()

        // this.marginNumber -= 8;
        // if(this.marginMin > this.marginNumber)
        //   this.marginNumber = this.marginMin;

      }
      else{
        if(!this.expanded) return;
        // alert(event.scrollTop)

        if(event.scrollTop < 5){

          // alert(event.scrollTop)
          this.contract()
        }
          //this.contract();
        // this.marginNumber += 8;
        // if(this.marginMax < this.marginNumber)
        //   this.marginNumber = this.marginMax;
      }
      // this.margin = this.marginNumber + 'px';
      // this.cdr.detectChanges();
    // })
  }


  // dismiss logic
  public hackground(){
    // Unless scoutPrompt, dismiss
    if(!this.params.get('scoutPrompt'))
      // Tell map to reload if window changes have occurred
      if(this.windowData.dataChanged)
        this.viewCtrl.dismiss({'reload': true, '_id': this.court._id});
      else this.viewCtrl.dismiss({})
  }


  // returns value in px of vh value passed in
  public vh2px(val: number){
    return val * document.documentElement.clientHeight / 100;
  }
  // returns value in px of vw value passed in
  public vw2px(val: number){
    return val * document.documentElement.clientWidth / 100;
  }


  public expand(){
    this.margin = this.marginMin + 'px';
    this.cdr.detectChanges();
    this.expanded = true;
  }

  public contract(){
    this.margin = this.marginMax + 'px';
    this.cdr.detectChanges();
    this.expanded = false;
  }
}
