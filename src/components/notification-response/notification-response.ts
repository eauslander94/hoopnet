import { Component, NgZone } from '@angular/core';
import { NavParams, ViewController, Events, ModalController} from 'ionic-angular';
import { ProfileModal } from '../profile-modal/profile-modal';
import { CourtDataService } from '../../services/courtDataService.service';
import { RealtimeProvider } from '../../providers/realtime/realtime';
import moment from 'moment';



@Component({
  selector: 'notification-response',
  templateUrl: 'notification-response.html'
})
export class NotificationResponse {

  text: string;

  // Data passed in by notification
  payload: any;

  // Displaying the name of he who invited you to hoop
  inviterName: string;
  // custom Message written by invitee
  customMessage: string;

  // string representation of time of invite
  when: string;

  ortc: any;

  // The inviter
  inviter: any;
  // court we have been invited to
  court: any;
  // Whether we're fetching user data
  loading: boolean = true;


  constructor(public params: NavParams,
              public viewCtrl: ViewController,
              public modalCtrl: ModalController,
              public events: Events,
              public courtDataService: CourtDataService,
              public zone: NgZone,
              public realtime: RealtimeProvider) {

    this.payload = params.get('payload')

    this.inviterName = 'Allen Iverson'

    this.when = moment(this.payload.dateTime).format('ddd MMM D, h:mma');
    this.when = this.when.substring(0, this.when.length - 1)

    this.getUserGetCourt()
  }

  // Post: User who invited us and court we've been invited to are fetched from database
  private getUserGetCourt(){
    // Get user who invited us

    this.courtDataService.getUsers([this.payload.user_id]).subscribe(
      res => {
        this.zone.run(() => {
          this.inviter = res.json()[0];
          this.loading = false;
        })
        err => {console.log(err)}
      }
    )

    // fetch court we've been invited to
    // this.courtDataService.getCourtsById([this.params.get('court_id')]).subscribe(
    //   res => this.court = res.json()[0],
    //   err => console.log(err)
    // )
  }

  // Post: Notification sent confirming user will play at provided day/time
  // Param: Boolean confirm - whether or not the current user will play
  respond(confirm: boolean){

    let user = JSON.parse(window.localStorage.getItem('currentUser'))
    this.realtime.notify([this.inviter._id], {
      messageType: 'invitationResponse',
      userName: user.fName + ' ' + user.lName,
      confirm: confirm
    }, user.fName + ' ' + user.lName + ' responded to your invitation.')

    this.viewCtrl.dismiss();
  }

  // Post: profile of inviter is presented
  public presentProfileModal(){

    if(this.loading) return;
    this.modalCtrl.create(ProfileModal, {
      myProfile: false,
      user: this.inviter
    }).present()
  }

}
