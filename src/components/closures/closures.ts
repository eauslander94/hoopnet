import { Component } from '@angular/core';
import { ViewController, NavParams, ActionSheetController, AlertController, ModalController } from 'ionic-angular';
import { CourtDataService } from '../../services/courtDataService.service';
import { AuthService }      from '../../services/auth.service'
import moment from 'moment';
import { AddClosure } from '../../components/add-closure/add-closure';

// Notes: This may end up becoming its own page.
//   If any issure arise it is not much of an adjustment

@Component({
  selector: 'closures',
  templateUrl: 'closures.html'
})
export class Closures {

  closures: Array<any>;
  dayOfWeek: number;

  // Whether or not we are displaying today's closures or the regular closures
  showing: String;

  courtBaskets: number;

  constructor(public viewCtrl: ViewController,
              private params: NavParams,
              public actionSheetCtrl: ActionSheetController,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              public courtDataService: CourtDataService,
              public auth: AuthService)
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
      cssClass: 'action-sheet',
      buttons: [
       {
         text: 'Edit Closure',
         handler: () => {
           // Present the edit form with the given closure and true for edit
           this.presentAddClosure(closure, true);
         }
       },
       {
         text: 'Delete Closure',
         handler: () => {
           let transition = flagActions.dismiss();

           transition.then(() => {
             this.confirmDelete(closure);
             //console.log(closure.reason);
           })
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
          // delete the closure
          //this.deleteClosure(closure)
          this.courtDataService.deleteClosure(closure._id, this.params.get('court_id'))
          .subscribe(
            res => {
              this.closures = res.json().closures
              for(let closure of this.closures)
                this.formatTimestrings(closure)
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
    if (days[index] > 0) return'#387ef5';
  }

  // post: AddClosure modal is presented
  // post2: Data returned is sent to the server
  // param: boolean edit - whether or not we are editing an existing closure
  // closure - the closure to be edited, undef if edit is false
  // Edit - boolean, whether or not we are editing an existing closure
  public presentAddClosure(closure, edit: boolean){

    if(!this.auth.isAuthenticated()){
      this.courtDataService.toastMessage("You must be logged in to perform this action", 3000);
      return;
    }

    let addClosure = this.modalCtrl.create(AddClosure, {"courtBaskets": this.params.get('courtBaskets'),
    'closure': closure, 'edit': edit});

    // Save the old reason as an identifier for put server requests when editing
    let oldReason = '';
    if(edit) oldReason = closure.reason;

    addClosure.onDidDismiss(data => {
      if(data.closure){
        this.formatTimestrings(data.closure);

        if(edit) {
          this.courtDataService.putClosure(data.closure, this.params.get('court_id'))
          .subscribe(
            res => {
              this.closures = res.json().closures
              for(let closure of this.closures)
                this.formatTimestrings(closure)
            },
            err => {console.log('err, putclosure ' + err)}
          );
        }
        else{
          this.closures.push(data.closure);
          this.courtDataService.postClosure(data.closure, this.params.get('court_id'))
          .subscribe(
            res => {
              this.closures = res.json().closures
              for(let closure of this.closures)
                this.formatTimestrings(closure)
            },
            err => {console.log('err, postClosure() ' + err)}
          );
        }
      }
    });

    addClosure.present();
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














}
