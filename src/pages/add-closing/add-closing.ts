import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, AlertController,
  Events, NavController, ModalController} from 'ionic-angular';
import { CourtDataService } from '../../services/courtDataService.service';
import { LoadingPage } from '../loading/loading';
import moment from 'moment';



@IonicPage()
@Component({
  selector: 'page-add-closing',
  templateUrl: 'add-closing.html',
})
export class AddClosingPage {


    closure:any;

    // Whether or not we display an error message pertaining to input time
    timeError: boolean;
    enterError: boolean;
    // String objects to capture time
    startString: string;
    endString: string;
    // String in the navbar
    navbar: string;

    constructor(public viewCtrl: ViewController,
                private params: NavParams,
                public alertCtrl: AlertController,
                public navCtrl: NavController,
                public events: Events,
                public courtDataService: CourtDataService,
                public modalCtrl: ModalController) {
      this.closure = params.get('closure');
      //this.timeError = true;
      // if we are not editing a closure and are therefore creating a new one
      if(!params.get('edit')){
        this.closure = {
          clStart: {},
          clEnd: {},
          reason: "",
          baskets:0,
          days: [0,0,0,0,0,0,0],
          repeat: false
        }
        this.navbar = "Add Closing";
      }
      else {
        this.closure = params.get('closure');

        // ISO 8601 dates were giving me all kinds of trouble, so for now we will not have prepopulated dates on the add closure form.
        // It isn't the biggest bullet to bite. We'll live.

        //this.startString = new Date().toISOString();
        //this.endString = this.closure.clEnd.toISOString();
        this.navbar = "Edit Closing";
      }

    }

    // Post: Alert presented which instructs user to add closure information
    public instructions(){
      this.alertCtrl.create({
        title: "So the court is closed..",
        message: "Please share, if you can find it, information on this court closing"
        + " with your fellow players.",
        buttons: [{
          text: "dismiss",
          role: 'cancel'
        }]
      }).present();
    }

    // Post1: Errors found with input data and error message is displayed
    // Post2: Data is collected and sent to the server
    submit(){

      // reset the error messages
      this.timeError = false; this.enterError = false;

      // Check that we have a day entered
      let dayEntered:boolean = false;
      for(let day of this.closure.days)
        if(day > 0){  dayEntered = true; break;  }

      // check that all fields have values
      if(this.startString == null || this.endString == null || this.closure.baskets === 0
      || this.closure.reason === "" || !dayEntered){
        this.enterError = true;
        return;
      }

      // parse dateStrings to date objects
      this.closure.clStart = new Date();
      this.closure.clStart.setHours(+this.startString.substring(0,2));
      this.closure.clStart.setMinutes(+this.startString.substring(3));
      this.closure.clEnd = new Date();
      this.closure.clEnd.setHours(+this.endString.substring(0,2));
      this.closure.clEnd.setMinutes(+this.endString.substring(3));

      // ensure that startTime is before endTime
       if(this.closure.clStart.getTime() >= this.closure.clEnd.getTime()){
         this.timeError = true;
         return;
       }

       // If we got here we've got a valid closure - Dismiss with data

       if(this.params.get('fromGamesModal')){
         //this.formatTimestrings(this.closure);
         // Pop this page, raise load screen, submit data to server, provide user with success/fail feedback
         this.navCtrl.pop().then(() => {
           let loadScreen = this.modalCtrl.create(LoadingPage, { loadingMessage: 'submitting court closing' },
           { enterAnimation: 'ModalEnterFadeIn', leaveAnimation: 'ModalLeaveFadeOut' })
           loadScreen.present();
           this.courtDataService.postClosure(this.closure, this.params.get('court_id')).subscribe(
             res => {
               loadScreen.dismiss().then(() => {
                 this.courtDataService.notify('Court Closing Added',
                 'Thank you for updating the current activity at your court. Your fellow ballers thank you.')
               })
             },
             err => {
               loadScreen.dismiss().then(() => {
                 this.courtDataService.notify('Error', 'Error submitting court closing. Please try again later.');
               })
             }
           )
         })
         return;
       }

       this.navCtrl.pop();
       this.events.publish('newClosureData', {
         closure: this.closure,
         edit: this.params.get('edit')
       })
    }


    // Post: date object is converted to sexy timeString, which is added to closure
    // Param: closure to be edited
    // Pre: Closure has clStart and clEnd date objects
    private formatTimestrings(closure){
      closure.tss = moment(closure.clStart).format('h:mma');
      closure.tss = closure.tss.substring(0, closure.tss.length - 1);
      closure.tse = moment(closure.clEnd).format('h:mma');
      closure.tse = closure.tse.substring(0, closure.tse.length - 1);
    }


    // post: Either adds or subtracts from baskets, with restrictions
    // param: string s - whether or not to add or subtract from baskets
    // pre: s is either 'plus' or 'minus'
    // restrictions: baskets cannot drop below 0
    //    baskets cannot be greater than total baskets at the court
    public baskets(s: string){
      if(s === 'plus' && this.closure.baskets < this.params.get('courtBaskets'))
        this.closure.baskets ++;
      else if(s === 'minus' && this.closure.baskets > 0)
        this.closure.baskets--;
    }

    // post: days is switched from a 0 to a 1 or vice versa
    // param: day - the day to be toggled
    public daytoggle(day: number){
      if(this.closure.days[day] > 0) this.closure.days[day] = 0;
      else this.closure.days[day] = 1;
    }

    getStyle(day){
      if(this.closure.days[day] > 0)
        return '#33ccff';
    }

    // Post: repeat changed from true to false or vice versa
    public toggleRepeat(){
      if(this.closure.repeat)  this.closure.repeat = false;
      else this.closure.repeat = true;
    }

  }
