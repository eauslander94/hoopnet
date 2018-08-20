import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events,
         ActionSheetController, ModalController } from 'ionic-angular';
import { CourtDataService } from '../../services/courtDataService.service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { LoadingPage }  from '../loading/loading';


@IonicPage()
@Component({
  selector: 'page-enter-profile-info',
  templateUrl: 'enter-profile-info.html',
  providers: [Camera]
})
export class EnterProfileInfo {

  user: any;

  dummy: any;

  // Whether or not to display the error message
  errorMessage: boolean;

  // Whether or not we are editing existing profile information
  edit: boolean;

  // whether or not we have edited the avatar
  avatarChange: boolean = false;

  constructor(public navCtrl: NavController,
              public params: NavParams,
              private photoLibrary: PhotoLibrary,
              public alertCtrl: AlertController,
              public events: Events,
              private courtDataService: CourtDataService,
              private camera: Camera,
              public actionSheetCtrl: ActionSheetController,
              public modalCtrl: ModalController)
  {

    if(params.get('edit')){
      this.user = params.get('user');
      this.edit = true;
    }
    else this.user = this.generateUserTemplate();
  }

  // Post1: Updated user data is sent to server
  // Post2: Updated User data is saved to local storage
  // Pre:   USer as entered a first and last name
  submit(){

    // Make sure we've at least got a first and last name
    if(this.user.fName === '' || this.user.lName === ''){
      this.errorMessage = true;
      return;
    }

    // Pop, present load screen, response behavior
    this.navCtrl.pop();
    let loadScreen = this.modalCtrl.create(LoadingPage, { loadingMessage: 'Submitting user info' },
    {
      enterAnimation: 'ModalEnterFadeIn',
      leaveAnimation: 'ModalLeaveFadeOut'
    })
    loadScreen.present();

    // editing - update existing user.  signing up - add new user.
    if(this.edit) {
      this.courtDataService.putUser(this.user).subscribe(
        res => {
          loadScreen.dismiss().then(() => {
            this.postSubmitPrompt();
          });
          this.events.publish('updateCurrentUser', res.json())
        },
        err => {
          loadScreen.dismiss().then(() => {
            this.postSubmitPrompt();
          });
          this.courtDataService.notify('Error', err)
        }
      );
    }
    else{
      alert('received new User info, sending to server and initializing here');
      this.courtDataService.newUser(this.user);
      this.events.publish('newUserInfo', this.user);
    }
  }

  // Post: Gallery or camera pops up, populates user.avatar with image uri
  // Param: gallery - True if we are fetching an image from the gallery
  public getAvatar(){

    let cameraOptions: CameraOptions = {
      destinationType: 0,
      allowEdit: true,
      quality: 30,
      targetWidth: 1000,
      targetHeight: 1000,
      correctOrientation: true
    }

    this.actionSheetCtrl.create({
      title: "Set Avatar",
      buttons: [
        { text: 'Take picture',
          handler: () => {
            this.camera.getPicture(cameraOptions).then((data_url) => {
              alert('got picture')
              this.user.avatar = {
                data: data_url,
                contentType: 'image/jpeg'
              }
            alert('changing avatar icon')
            this.avatarChange = true;
            },
            (err) => {this.courtDataService.notify('Picture not taken', 'Just letting you know. Please try again.')}
          )}
        },
        { text: 'Choose from gallery',
          handler: () => {
            cameraOptions.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
            this.camera.getPicture(cameraOptions).then(
              (data_url) => {
                alert('got data, image data length = ' + data_url.length)
                this.user.avatar = {
                  data: data_url,
                  contentType: 'image/jpeg'
                }
                this.avatarChange = true;
              },
              (err) => {console.log(err)}
            )
          }
        },
        { text: 'Cancel',
          role: 'cancel',
        }
      ]
    }).present();
  }

  private cameraColor(edit: boolean){
    if(edit) return '#33ccff'
    return 'grey';
  }


  private postSubmitPrompt(){
    this.alertCtrl.create({
        title: 'Profile Info Received',
        subTitle: 'Happy hooping.',
        buttons: [
          { text: 'dismiss',
            role: 'destructive',
          }
        ]
      }).present()
  }


  // Generates a blank user when edit = false
  generateUserTemplate(){
    return {
      fName: "",
      nName: "",
      lName: "",
      // get the auth_id passed in nav params.
      auth_id: this.params.get('auth_id'),
      // An array of pointers to court objects
      homecourts: [],
      // An array of pointers to user objects
      friends: [],
      // Array of pointers to user objects
      friendRequests: [],
      // for now, string link to the image
      avatar: {
        data: '',
        contentType: ''
      },
      // pointer to the court object the user is beside
      courtside: '',
      checkIns: [{}]
    }
  }




}
