import { Component } from '@angular/core';
import { NavParams, ViewController, Events} from 'ionic-angular';
import moment from 'moment';


/**
 * Generated class for the NotificationResponseComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'notification-response',
  templateUrl: 'notification-response.html'
})
export class NotificationResponse {

  text: string;

  // Data passed in by notification
  payload: any;

  // MEssage to display
  message: string;
  // custom Message written by invitee
  customMessage: string;

  // string representation of time of invite
  when: string;

  ortc: any;


  constructor(public params: NavParams,
              public viewCtrl: ViewController,
              public events: Events) {

    this.payload = params.get('payload')

    this.message = this.payload.user.fName + ' ' + this.payload.user.lName +
    ' has invited you to hoop!';
    this.customMessage = '\"' + this.payload.message + '\"';

    //
    this.when = moment(this.payload.dateTime).format('ddd MMM D, h:mma');
    this.when = this.when.substring(0, this.when.length - 1)
  }

  // Post: Notification sent confirming user will play at provided day/time
  // Param: Boolean confirm - whether or not the current user will play
  respond(confirm: boolean){
    this.ortc = window['plugins'].OrtcPushPlugin;

    let payload = {
      messageType: 'invitationConfirm',
      user: JSON.parse(window.localStorage.getItem('currentUser')),
      confirm: confirm,
    }

    this.ortc.send({
      'applicationKey':'pLJ1wW',
      'privateKey':'mHkwXRv1xbbA',
      'channel': this.payload.user._id,
      'message': JSON.stringify(payload),
    })


    this.events.publish('invitationConfirm', payload);

    this.viewCtrl.dismiss();
  }

}
