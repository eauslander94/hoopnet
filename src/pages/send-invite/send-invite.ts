import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import  moment  from 'moment';

import{ CourtDataService } from '../../services/courtDataService.service';


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

  // For sedin pus notifications;
  ortc: any;

  // User currently logged in
  currentUser: any;

  // Wheter or not to sow te error message;
  error: boolean = false;

  constructor(public navCtrl: NavController,
              public params: NavParams,
              public datePicker: DatePicker,
              public courtDataService: CourtDataService,
              public events: Events)
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

    this.ortc = window['plugins'].OrtcPushPlugin;
    if(!this.currentUser)
      this.currentUser = JSON.parse(window.localStorage.getItem('currentUser'))

    // loop through invited, send invitation to each friend selected
    for(let friend of this.invited){

      let payload = {
        messageType: 'invitation',
        user: this.currentUser,
        court: this.params.get('court'),
        dateTime: this.dateDate,
        message: this.message
      }
      this.ortc.send({
        'applicationKey':'pLJ1wW',
        'privateKey':'mHkwXRv1xbbA',
        'channel': friend._id,
        'message': JSON.stringify(payload),
      })
      // alert('sending to channel: ' + friend._id);
      this.navCtrl.popToRoot().then(() => {
        this.events.publish('invitation', payload)
      });

    }
  }

  // Post: this.user is set to the current user
  public getCurrentUser(){
    this.courtDataService.getCurrentUser().subscribe(
      res => this.currentUser = res.json()[0],
      err => alert(err)
    )
  }


}
