import { Component, NgZone } from '@angular/core';
import { IonicPage, ViewController, NavParams, ActionSheetController,
  NavController, AlertController, ModalController, Events } from 'ionic-angular';
import { CourtDataService } from '../../services/courtDataService.service';
import { AuthService }      from '../../services/auth.service'
import moment from 'moment';
import { AddClosingPage }   from '../../pages/add-closing/add-closing';


import { AddClosure } from '../../components/add-closure/add-closure';

// Notes: This may end up becoming its own page.
//   If any issure arise it is not much of an adjustment

@IonicPage()
@Component({
  selector: 'page-court-closings',
  templateUrl: 'court-closings.html',
})
export class CourtClosingsPage {

  closures: Array<any>;
  dayOfWeek: number;

  // Whether or not we are displaying today's closures or the regular closures
  showing: String;

  // Whether or not to show load wheel
  loading: boolean = false;

  courtBaskets: number;

  constructor(public viewCtrl: ViewController,
              private params: NavParams,
              public actionSheetCtrl: ActionSheetController,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              public courtDataService: CourtDataService,
              public auth: AuthService,
              public zone: NgZone,
              public events: Events,
              public navCtrl: NavController)
  {
    this.closures = params.get('closures');

    this.courtBaskets = params.get('courtBaskets');

    // format our dates into sexy timeStrings
    for(let closure of this.closures)  this.formatTimestrings(closure);

    // Check up on this when you get internet
    this.dayOfWeek = new Date().getDay();

    this.showing = "today";
  }

  // post: Yesterday's single day closures have been removed from each closure
  // post2: If all single day closures have transpired, delete the closure
  public cleanClosures(){

    // set index and yesterday
    let index = 0;  let yesterday;
    if(this.dayOfWeek == 0) yesterday = 6; else yesterday = this.dayOfWeek - 1;

    // loop through closures
    while(index < this.closures.length){
      let closure = this.closures[index];

      // take yesterday's 1s, set them to 0s
      if(closure.days[yesterday] == 1)
        closure.days[yesterday] = 0;

      // Loop thru days looking for 1s or 2s - find one and don't kill the closure
      let killClosure : boolean = true;
      for(let dayValue of closure.days)
        if (dayValue > 0){ killClosure = false; break; }

      // only increment index when we do not kill a closure
      if(killClosure) this.closures.splice(index, 1);  else index++;
    }
  }

  // post: Flag actionsheet is presented
  // param: the closure to be edited or deleted
  public presentFlagActions(closure: any){
    let flagActions = this.actionSheetCtrl.create({
      // title: 'gfhgdgh',
      //cssClass: 'action-sheet',
      buttons: [
       {
         text: 'Edit Closing',
         handler: () => {
           // Present the edit form with the given closure and true for edit
           //this.presentAddClosure(closure, true);
           this.presentAddClosing(closure, true);
         }
       },
       {
         text: 'Delete Closing',
         handler: () => {
           flagActions.dismiss().then(() => { this.confirmDelete(closure) })
           return false;
         }
       },
       {
         text: 'Cancel',
         role: 'cancel',
         handler: () => {

         }
       }
     ],
    })

    flagActions.present();
  }

  // post: Present confirm delete alert
  // param: closure - the closure to be deleted
  private confirmDelete(closure){
    let confirmDelete = this.alertCtrl.create({
      subTitle: 'Delete this closure?',
      buttons: [
        { text: 'Cancel', handler: ()=> {} },
        { text: 'Delete', handler: ()=> {
          this.zone.run(() => { this.loading = true })
          // delete the closure
          this.courtDataService.deleteClosure(closure._id, this.params.get('court_id'))
          .subscribe(
            res => {
              this.zone.run(() => {
                this.closures = res.json().closures
                for(let closure of this.closures)
                  this.formatTimestrings(closure)
                this.loading = false;
              })
              this.events.publish('reloadCourt', res.json())
            },
            err => {console.log('err, deleteClosure ' + err)}
          );
        }}
      ]
    })

    confirmDelete.present();
  }




  // Return our primary color for days on which the closure occurs
  public getStyle(days:any, index: number){
    if (days[index] > 0) return'#33ccff';
  }

  // post: AddClosure modal is presented
  // post2: Data returned is sent to the server
  // param: boolean edit - whether or not we are editing an existing closure
  // closure - the closure to be edited, undef if edit is false
  // Edit - boolean, whether or not we are editing an existing closure
  public presentAddClosing(closure, edit: boolean){

    if(!this.auth.isAuthenticated()){
      this.courtDataService.toastMessage("You must be logged in to perform this action", 3000);
      return;
    }

    this.events.subscribe('newClosureData', (data) => {
      if(data.closure){
        this.formatTimestrings(data.closure);
        this.loading = true;
        // When editing closure, update existing closure in db with put
        if(data.edit) {
          this.courtDataService.putClosure(data.closure, this.params.get('court_id'))
          .subscribe(
            res => { this.gotData(res.json()) },
            err => { console.log('err, putclosure ' + err)}
          );
        }
        // When adding new closure, create new closure in db with post
        else{
          this.courtDataService.postClosure(data.closure, this.params.get('court_id'))
          .subscribe(
            res => { this.gotData(res.json()) },
            err => { console.log('err, postClosure() ' + err)}
          );
        }
      }
    });

    this.navCtrl.push(AddClosingPage, {
      "courtBaskets": this.params.get('courtBaskets'),
      'closure': closure,
      'edit': edit
    });
  }

  // Post1: this.closures replaced with updated value from db
  // Post2: Load wheel removed from html
  // Post3: Updated Court sent to hoop map page to reload the marker
  // Param: court object
  public gotData(court: any){
    this.zone.run(() => {
      for(let closure of court.closures)
        this.formatTimestrings(closure)
      this.closures = court.closures;
      this.loading = false;
      this.events.publish('reloadCourt', court)
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


  // Post: Removes the given closure from closures
  // Pre: given closure is in closures
  // Param: the closure to be deleted
  private deleteClosure(closure){
    let index: number = 0;
    while(index < this.closures.length){
      if (closure === this.closures[index]){
        this.closures.splice(index, 1);  break;
      }
      index++;
    }
  }


  // Post: Closures is dismissed wit current closures passed back
  public dismiss(){
    this.navCtrl.pop().then(() => {
      this.events.publish('closingsDismissed', this.closures)
    })
  }














}
