import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import  moment  from 'moment';

import { CourtDataService } from '../../services/courtDataService.service';
import { RealtimeProvider } from '../../providers/realtime/realtime';


@IonicPage()
@Component({
  selector: 'page-send-invite',
  templateUrl: 'send-invite.html',
  providers: [DatePicker]
})
export class SendInvitePage {

  // When the user wants to invite their friends
  dateDate: Date = new Date();
  dateString: string;
  timeString: string = '';

  // message to e sent to other user
  message: string;

  // users who ave been invited
  invited: Array<any>

  // User currently logged in
  currentUser: any;

  // Wheter or not to sow te error message;
  error: boolean = false;

  constructor(public navCtrl: NavController,
              public params: NavParams,
              public datePicker: DatePicker,
              public courtDataService: CourtDataService,
              public events: Events,
              public realtime: RealtimeProvider)
  {
    // set Datestring to be today's date, formatted sexily
    this.dateString = moment(new Date()).format('dddd MMM D')

    this.invited = params.get('invited');

    this.getCurrentUser();
  }


  // Post1: Date picker is displayed
  // Post2: dateString and dateDate set to te date received
  public pickDate(){

    let min = new Date().getDate();
    let max = new Date().getMonth() + 1;

    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      minDate: new Date().setDate(min),
      maxDate: new Date().setMonth(max),
      okText: 'Select',
      androidTheme: 5
    }).then(
      date => {
        this.dateDate = date;
        this.dateString = moment(date).format("dddd MMM D")
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }


  // Post: Invitation notification is sent to the friends selected
  public send(){

    // TODO: Ensure User has inputed all relevent info

    if(this.timeString === ''){
      this.error = true;
      return;
    }

    // combine timeString & dateDate into one date object
    this.dateDate.setHours(+this.timeString.substring(0,2))
    this.dateDate.setMinutes(+this.timeString.substring(3))

    if(!this.currentUser)
      this.currentUser = JSON.parse(window.localStorage.getItem('currentUser'))

    let channels: Array<string> = []
    for(let friend of this.invited)
      channels.push(friend._id);
    let userName = this.currentUser.fName + ' ' + this.currentUser.lName

    let payload = {
      messageType: 'invitation',
      userName: userName,
      user_id: this.currentUser._id,
      courtName: this.params.get('court').name,
      court_id: this.params.get('court')._id,
      dateTime: this.dateDate,
    }

    this.realtime.notify(channels, payload, userName + ' invites you to hoop!');
    this.navCtrl.popToRoot()
  }

  // Post: this.user is set to the current user
  public getCurrentUser(){
    this.courtDataService.getCurrentUser().subscribe(
      res => this.currentUser = res.json()[0],
      err => this.courtDataService.notify('ERROR', err)
    )
  }


}
