import { StatusBar }               from '@ionic-native/status-bar';
import { SplashScreen }            from '@ionic-native/splash-screen';
import { Geolocation }             from '@ionic-native/geolocation';
import { ScreenOrientation }       from '@ionic-native/screen-orientation';
import { HoopMapPage }             from '../pages/hoop-map-page/hoop-map-page'
import { JwtHelper }               from 'angular2-jwt'
import { CourtDataService }        from '../services/courtDataService.service'
import { Component, ViewChild, ChangeDetectorRef, NgZone }    from '@angular/core';
import { Platform, Events, MenuController, ModalController } from 'ionic-angular';

import * as RealtimeMessaging from 'realtime-messaging';

// Components for menu links
import { HomeCourtDisplay }  from '../components/home-court-display/home-court-display';
import { InviteFriendsPage } from '../pages/invite-friends/invite-friends';
import { ProfileModal }      from '../components/profile-modal/profile-modal';
import { Profile }           from '../pages/profile/profile';
import { EnterProfileInfo }  from '../pages/enter-profile-info/enter-profile-info';
import { FriendsPage }       from '../pages/friends-page/friends-page';
import { CourtSearchPage }   from '../pages/court-search/court-search';
import { AuthService }       from '../services/auth.service';

import { RealtimeProvider } from '../providers/realtime/realtime';
// Auth0Cordova
import Auth0Cordova from '@auth0/cordova';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = HoopMapPage;

  // user currently logged in
  currentUser: any;
  // whether or not we are currently logged in
  authFlag: boolean;

  applyClass: boolean = true;

  @ViewChild('nav') nav;

  constructor(platform: Platform,
              public screenOrientation: ScreenOrientation,
              public auth: AuthService,
              public courtDataService: CourtDataService,
              public events: Events,
              public menu: MenuController,
              public modalCtrl: ModalController,
              private cdr: ChangeDetectorRef,
              private zone: NgZone,
              public realtime: RealtimeProvider) {

    alert('constructor, app.component.ts')


    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //StatusBar.styleDefault();
      //SplashScreen.hide();

      // for auth0 URL redirects
      (<any>window).handleOpenURL = (url) => {
        Auth0Cordova.onRedirectUri(url);
      };

      // lock the screen to portrait
      this.screenOrientation.lock('portrait');

      // If we're autenticated on startup
      if(this.auth.isAuthenticated()){
        // get a fresh copy of the current user into local storage
        this.getCurrentUser(new JwtHelper().decodeToken(this.auth.getStorageVariable('id_token')).sub)
        this.authFlag = true;
      }
      else this.authFlag = false;

      if (!this.cdr['destroyed'])
        this.cdr.detectChanges();

        document.addEventListener("push-notification", (notification: any) => {
          alert("received notification: " + notification.type + ' ' + notification.channel)
          // alert(document.getElementById('payload'))

          // this.ortc.unsubscribe({channel: '5a7f4a103501495b9db120d2'})
        }, false);

        document.addEventListener("onException", function(exception){
          alert('Exception with underlying native ortc client: ' + JSON.stringify(exception))
        }, false);

    });

    // subscribe to te login event
    this.events.subscribe('loggedIn', () => {

      // set auth flag
      this.zone.run(() => {
        this.authFlag = true;
      })

      let id_token = new JwtHelper().decodeToken(this.auth.getStorageVariable('id_token'))
      // If it is our first time logging in - ie signup - prompt to enter profile info
      if(id_token['hoophead/firstLogin'] === "true")
        this.nav.push(EnterProfileInfo, {'edit': false, 'auth_id': id_token.sub})
      // else retreive our user from db
      else this.getCurrentUser(id_token.sub);
    })

    this.events.subscribe('loggedOut', () => {
      this.zone.run(() => {
        this.authFlag = false;
      })
    })

    // Repopulate current user in local storage and on MyApp
    this.events.subscribe('updateCurrentUser', (user) => {
      this.saveUser(user)
    })

    this.events.subscribe('removeHomecourt', (court_id) => {
      this.currentUser.homecourts.splice(court_id, 1);
      this.courtDataService.putUser(this.currentUser).subscribe(
        res => this.saveUser(res.json()),
        err => this.courtDataService.notify('Error', err)
      )
    })



    // Check if we're connected, if not connect
    // ortc.getIsConnected().then((connected) => {
    //   if(connected === 1) return;
    //   ortc.connect({
    //     'appkey':'pLJ1wW',
    //     'token':'appToken',
    //     'metadata':'androidMetadata',
    //     'projectId':'979214254876',
    //     'url':'https://ortc-developers.realtime.co/server/ssl/2.1/'
    //   }).then(() => {
    //     alert('connecting');
    //
    //     // ortc.subscribe({
    //     //   'channel': 'thinkWeFoundIt'
    //     // }).then(() => {
    //     //   alert('subscribing to channel: thinkWeFoundIt')
    //     // })
    //   });
    //})

  }


  // Post: establishes the ORTC connection to our realtime account
  // Post: subscribes to the provided channel
  // Param: Channel to listen on
  // public pushConnect(channel: string){
  //
  //   alert('in push connect, unsubscribing from 5a7f55a7d2a42c6d4142d9ad');
  //
  //   ortc.disconnect({
  //     'appkey':'pLJ1wW',
  //     'token':'appToken',
  //     'metadata':'androidMetadata',
  //     'projectId':'979214254876',
  //     'url':'https://ortc-developers.realtime.co/server/ssl/2.1/'
  //   }).then(() => {
  //     alert('disconnected');
  //   })
  //
  //   ortc.unsubscribe({
  //     'channel': '5a7f55a7d2a42c6d4142d9ad'
  //   }).then(() => {
  //     alert('unsubscribed from 5a7f55a7d2a42c6d4142d9ad')
  //   })

    // // estalish connection
    // ortc.connect({
    //   'appkey':'pLJ1wW',
    //   'token':'appToken',
    //   'metadata':'androidMetadata',
    //   'projectId':'979214254876',
    //   'url':'https://ortc-developers.realtime.co/server/ssl/2.1/'
    // }).then(() => {
    //   alert('connecting');
    //
    //   ortc.subscribe({
    //     'channel': channel
    //   }).then(() => {
    //     alert('subscribing to channel: ' + channel)
    //   })
    // });

  // }


  // Post: User is retreived from database and saved in local storage
  // Param: Unique auth0 id used to identify user
  public getCurrentUser(sub: string){

    this.courtDataService.getUsersByAuth_id(sub).subscribe(
      data => {
        // save user, let app know tat we have user
        this.saveUser(data.json())
        this.events.publish('gotCurrentUser')
      },
      err => {alert(err)}
    )
  }

  public eli(){
    alert('ello');
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
    // alert(this.currentUser.fName + ' ' + this.currentUser.avatar.data.length);
    let user = this.currentUser;
    this.nav.push(EnterProfileInfo, {'edit': true, 'user': user})
    this.menu.close();
  }


  // Post: Friends & Users page is pulled up
  public navToFriends(){
    // If we're not authenticated, do nothing
    if(!this.authFlag) return;

    let user = JSON.parse(window.localStorage.getItem('currentUser'))
    this.nav.push(FriendsPage, {
      'myProfile': true,
      'friends': user.friends,
      'friendRequests': user.friendRequests
    })
    this.menu.close();
  }

  // Post: Invite Friends Behaviorial loop begins
  public inviteFriends(){
    if(!this.authFlag) return;
    this.nav.push(CourtSearchPage, {
      role: 'inviteFriends'
    })
    this.menu.close()
  }


  // Post: saves user to this component, clone of user without images to local storage
  // Param: User to save
  public saveUser(user: any){
      // alert('saving user');
      this.currentUser = user;
      //alert(this.currentUser.avatar.data.length);
      // clone user, remove lare image data, save to local storage
      let curr = JSON.parse(JSON.stringify(user))
      curr.avatar = {};
      curr.backgroundImage = {};
      window.localStorage.setItem('currentUser', JSON.stringify(curr));
  }

  public greyOrNay(){
    return "red!important;"
    // if(this.authFlag)
    //   return "#ffffff";
    // else return "#D3D3D3"
  }


}
