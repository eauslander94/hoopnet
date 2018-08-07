import { StatusBar }               from '@ionic-native/status-bar';
import { SplashScreen }            from '@ionic-native/splash-screen';
import { Geolocation }             from '@ionic-native/geolocation';
import { ScreenOrientation }       from '@ionic-native/screen-orientation';
import { JwtHelper }               from 'angular2-jwt'
import { CourtDataService }        from '../services/courtDataService.service'
import { Component, ViewChild, ChangeDetectorRef, NgZone }    from '@angular/core';
import { Platform, Events, MenuController, ModalController } from 'ionic-angular';

import { HoopMapPage } from '../pages/hoop-map-page/hoop-map-page';
import { SplashPage  } from '../pages/splash/splash';
import { LoadingPage } from '../pages/loading/loading';
// Components for menu links
import { HomeCourtDisplay }  from '../components/home-court-display/home-court-display';
import { ProfileModal }      from '../components/profile-modal/profile-modal';
import { AuthService }       from '../services/auth.service';
import { RealtimeProvider } from '../providers/realtime/realtime';
// Auth0Cordova
import Auth0Cordova from '@auth0/cordova';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {

  rootPage = HoopMapPage;

  // user currently logged in
  currentUser: any;

  // whether or not we are currently logged in
  authFlag: boolean;

  loadScreenShowing: boolean = false;
  loadScreen: any;


  @ViewChild('nav') nav;

  constructor(public platform: Platform,
              public screenOrientation: ScreenOrientation,
              public auth: AuthService,
              public courtDataService: CourtDataService,
              public events: Events,
              public menu: MenuController,
              public modalCtrl: ModalController,
              private cdr: ChangeDetectorRef,
              private zone: NgZone,
              public realtime: RealtimeProvider,
              public statusBar: StatusBar)
  {
    this.initializeApp();
    this.initializeListeners();
  }


  // Once platform is ready, perform high level native initializations
  private initializeApp(){

    this.platform.ready().then(() => {

      this.modalCtrl.create(SplashPage).present();

      this.statusBar.styleDefault();

      // for auth0 URL redirects
      (<any>window).handleOpenURL = (url) => {
        Auth0Cordova.onRedirectUri(url);
      };

      // alert(location.href);

      // lock the screen to portrait
      this.screenOrientation.lock('portrait');

      // If we're autenticated on startup
      if(this.auth.isAuthenticated()){
        // get a fresh copy of the current user into local storage
        this.getCurrentUserByAuthId(new JwtHelper().decodeToken(this.auth.getStorageVariable('id_token')).sub)
        this.authFlag = true;
      }
      else this.authFlag = false;

      if (!this.cdr['destroyed'])
        this.cdr.detectChanges();
    });
  }

  // Post: sets up listners on various events & responds accordingly
  private initializeListeners(){

    // On login event, get user data & populate local storage. Also set auth flag
    this.events.subscribe('loggedIn', () => {
      let id_token = new JwtHelper().decodeToken(this.auth.getStorageVariable('id_token'))
      // If it is our first time logging in - ie signup - prompt to enter profile info
      if(id_token['hoophead/firstLogin'] === "true"){
        this.menu.close().then(() => {
          this.nav.push('EnterProfileInfo', {'edit': false, 'auth_id': id_token.sub})
        });
      }
      // else retreive our user from db, pull up load screen
      else {
        this.loadScreen = this.modalCtrl.create(LoadingPage, { loadingMessage: 'retrieving user data' },
        {
          enterAnimation: 'ModalEnterFadeIn',
          leaveAnimation: 'ModalLeaveFadeOut'
        })
        this.loadScreen.present();

        this.courtDataService.getUsersByAuth_id(id_token.sub).subscribe(
          res => {
            this.events.publish('gotCurrentUser');
            this.initUser(res.json())
            this.loadScreen.dismiss().then(() => { this.courtDataService.notify(
              'Login Success', 'Enjoy Courtlife, my friend')
            })
          },
          err => { this.loadScreen.dismiss().then(() => { this.courtDataService.notify(
            'Error', 'We ran into an error retrieving your profile data.');
          })}
        )
        this.getCurrentUserByAuthId(id_token.sub);
      }
    })

    // on logout, reset the auth flag. auth service depopulates local storage
    this.events.subscribe('loggedOut', () => {
      this.zone.run(() => {
        this.authFlag = false;
      })
      this.realtime.disconnect();
    })

    // When user data is refreshed, repopulate current user here and in local storage
    this.events.subscribe('updateCurrentUser', (user) => {
      this.saveUser(user)
    })

    // When homecourt is removed, remove client side and update backend.
    // Could be issues here with this.currentUser replacing the current user server side.
    // MAKE SURE we call updateCurrentUser every time user data is changed.
    this.events.subscribe('removeHomecourtStarted', (court) => {
      this.currentUser.homecourts.splice(court._id, 1);
      this.courtDataService.putUser(this.currentUser).subscribe(
        res => {
          this.saveUser(res.json())
          // Tell homecourt display that we've completed
          this.events.publish('removeHomecourtCompleted', {error: false});
        },
        err => {
          this.events.publish('removeHomecourtCompleted', {error: true})
        }
      )
    })

    this.events.subscribe('newUserInfo', (user) => {  this.initUser(user)  })
  }

  // Preforms startup responsibilities only when we first get user info
  // Post: user is saved, auth flag is set to true, connects to realtime
  // Pre: Only fires when we first get user info
  private initUser(user: any){
    this.zone.run(() => { this.authFlag = true })
    this.saveUser(user)
    this.realtime.connect(user._id)
  }


  // Post:  User is retreived from database by authID, load screen shows, init User is called
  // Param: Unique auth0 id used to identify user
  // Pre:   This event is only called when the app loads, and when a user logs in
  private getCurrentUserByAuthId(sub: string){

    this.courtDataService.getUsersByAuth_id(sub).subscribe(
      data => {
        if(this.loadScreenShowing)  this.nav.pop();
        this.events.publish('gotCurrentUser')
        this.initUser(data.json())
      },
      err => {alert('Error\n' + err)}
    )
  }


  // Post1: homecourt modal is presented if user as homecourts
  // Post2: User is instructed to enter homecourts if she does not
  // Pre:   User is authenticated
  public navToHomecourts(){

    if(!this.authFlag) return;


    // Param: Pointers to court objects
    // Param: Flag telling modal that this is te user's homecourt display
    this.modalCtrl.create(HomeCourtDisplay, {
      "courtPointers": JSON.parse(window.localStorage.getItem('currentUser')).homecourts,
      "myProfile": true
    }).present();
    this.menu.close();
  }



  public navToProfile(){
    // If we're not authenticated, do nothing
    if(!this.authFlag) return;

    this.modalCtrl.create(ProfileModal, {
      'user': this.currentUser,
      'myProfile': 'true'
    }).present()
    this.menu.close();
  }


  // Post: Enter ProfileInfo page is pulled up wit edit as true and user is current user
  // Pre:  User is currently autenticated
  public navToEnterProfileInfo(){
    // If we're not authenticated, do nothing
    if(!this.authFlag) return;
    let user = this.currentUser;
    this.nav.push('EnterProfileInfo', {'edit': true, 'user': user})
    this.menu.close();
  }


  // Post: Friends & Users page is pulled up
  public navToFriends(){
    // If we're not authenticated, do nothing
    if(!this.authFlag) return;

    let user = JSON.parse(window.localStorage.getItem('currentUser'))
    this.nav.push('FriendsPage', {
      'myProfile': true,
      'friends': user.friends,
      'friendRequests': user.friendRequests
    })
    this.menu.close();
  }

  // Post: Invite Friends Behaviorial loop begins
  public inviteFriends(){
    if(!this.authFlag) return;
    this.nav.push('CourtSearchPage', {
      role: 'inviteFriends'
    })
    this.menu.close()
  }


  // Post: saves user to this component, clone of user without images to local storage
  // Param: User to save
  public saveUser(user: any){
    this.currentUser = user;
    // clone user, remove lare image data, save to local storage
    let curr = JSON.parse(JSON.stringify(user))
    curr.avatar = {};
    curr.backgroundImage = {};
    window.localStorage.setItem('currentUser', JSON.stringify(curr));
  }


  // Present auth page and close menu
  public login(){
    this.auth.login();
    this.menu.close();
  }



  public greyOrNay(){
    return "red!important;"
    // if(this.authFlag)
    //   return "#ffffff";
    // else return "#D3D3D3"
  }


}
