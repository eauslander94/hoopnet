import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events,
         ActionSheetController } from 'ionic-angular';
import { CourtDataService } from '../../services/courtDataService.service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PhotoLibrary } from '@ionic-native/photo-library';


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

  // whether or not we have edited the avatar/background
  avatarChange: boolean = false;
  backgroundChange: boolean = false;

  constructor(public navCtrl: NavController,
              public params: NavParams,
              private photoLibrary: PhotoLibrary,
              public alertCtrl: AlertController,
              public events: Events,
              private courtDataService: CourtDataService,
              private camera: Camera,
              public actionSheetCtrl: ActionSheetController)
  {

    this.dummy = window.screen.height;

    if(params.get('edit')){
      this.user = params.get('user');
      this.edit = true;
      // If we've got pictures, show the blue camera
      if(this.user.avatar !== '') this.avatarChange = true;
      if(this.user.backgroundImage !== '') this.backgroundChange = true;
    }
    else this.user = this.generateUserTemplate();
  }

  submit(){

    // Make sure we've at least got a first and last name
    if(this.user.fName === '' || this.user.lName === ''){
      this.errorMessage = true;
      return;
    }

    // editing - update existing user.  signing up - add new user
    if(this.edit) this.courtDataService.putUser(this.user);
    else this.courtDataService.newUser(this.user);
    // Tell profile page we have new profile info
    alert(this.user.fName + ' profile info entered')
    this.events.publish('profileInfoEntered', this.user)

    // no homecourt? prompt user to enter one
    if(this.user.homecourts.length === 0){
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
              })
              return false;
            }
          }
        ]
      })

      alert.present();
  }
  // We do have a homecourt, so just pop
  else this.navCtrl.pop();
  }

  // Post: Gallery or camera pops up, populates user.backgroundImage with image uri
  public getBackground(){

    let cameraOptions: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: 0,
      encodingType: this.camera.EncodingType.JPEG,
      allowEdit: true,
      quality: 50,
      correctOrientation: true
    }
    this.camera.getPicture(cameraOptions).then(
      (data_url) => {
        this.user.backgroundImage = {
          data: data_url,
          contentType: 'image/jpeg'
        }
        this.backgroundChange = true;
      },
      (err) => {console.log(err)}
    )
  }

  // Post: Gallery or camera pops up, populates user.avatar with image uri
  // Param: gallery - True if we are fetching an image from the gallery
  public getAvatar(){

    let cameraOptions: CameraOptions = {
      destinationType: 0,
      allowEdit: true,
      quality: 50,
      targetWidth: 1000,
      targetHeight: 1000,
      correctOrientation: true
    }

    this.actionSheetCtrl.create({
      title: "Set Avatar",
      buttons: [
        { text: 'take picture',
          handler: () => {
            this.camera.getPicture(cameraOptions).then(
              (data_url) => {
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
        { text: 'choose from gallery',
          handler: () => {
            cameraOptions.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
            this.camera.getPicture(cameraOptions).then(
              (data_url) => {
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
      backgroundImage: {},
      // pointer to the court object the user is beside
      courtside: '',
      checkIns: [{}]
    }
  }

}
