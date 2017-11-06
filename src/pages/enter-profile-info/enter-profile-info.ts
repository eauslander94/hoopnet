import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events, Tabs } from 'ionic-angular';
import { CourtDataService } from '../../services/courtDataService.service';
import { PhotoLibrary } from '@ionic-native/photo-library';


@IonicPage()
@Component({
  selector: 'page-enter-profile-info',
  templateUrl: 'enter-profile-info.html',
})
export class EnterProfileInfo {

  user: any;

  // Whether or not to display the error message
  errorMessage: boolean;

  // Whether or not we are editing existing profile information
  edit: boolean;

  constructor(public navCtrl: NavController,
              public params: NavParams,
              private photoLibrary: PhotoLibrary,
              public alertCtrl: AlertController,
              public events: Events,
              private tabs: Tabs,
              private courtDataService: CourtDataService)
  {
    if(params.get('edit')){
      this.user = params.get('user');
      this.edit = true;
    }
    else this.user = this.generateUserTemplate();
  }

  submit(){

    if(this.user.fName === '' || this.user.lName === ''){
      this.errorMessage = true;
      return;
    }

    this.courtDataService.putUser(this.user);
    
    // Loading wheel  here, before presenting alert
    let alert = this.alertCtrl.create({
      subTitle: 'Got Your Info! Now we encourage you to find your homecourt on our map',
      buttons: [
        { text: 'no thanks',
          handler: () => {
            alert.dismiss().then(() => {
              this.navCtrl.pop()
            })
          return false;
          }
        },
        { text: 'Go to map',
          handler: () => {
            alert.dismiss().then(() => {
              this.events.publish('homeCourtMessage');
              this.navCtrl.pop();
              this.navCtrl.parent.select(0);
            })
            return false;
          }
        }
      ]
    })

    alert.present();
  }

  generateUserTemplate(){
    return {
      fName: "",
      nName: "",
      lName: "",
      // An array of pointers to court objects
      homecourts: [],
      // An array of pointers to user objects
      friends: [],
      // Array of pointers to user objects
      friendRequests: [{}, {}],
      // for now, string link to the image
      avatar: '',
      backgroundImage: '',
      // pointer to the court object the user is beside
      courtside: {},
    }
  }

}
