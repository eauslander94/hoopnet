var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// ionic imports
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, PopoverController, AlertController, ModalController } from 'ionic-angular';
// Map imports
import { Geolocation } from '@ionic-native/geolocation';
// court report imports
import { CourtDataService } from '../../services/courtDataService.service';
import { MapSearchPopoverComponent } from '../../components/map-search-popover/map-search-popover';
import { CourtPage } from '../../pages/court-page/court-page';
import { CourtsideCheckIn } from '../../components/courtside-check-in/courtside-check-in';
import { Closures } from '../../components/closures/closures';
var HoopMapPage = (function () {
    function HoopMapPage(navCtrl, geolocation, courtDataService, popoverCtrl, alertCtrl, modalCtrl) {
        this.navCtrl = navCtrl;
        this.geolocation = geolocation;
        this.courtDataService = courtDataService;
        this.popoverCtrl = popoverCtrl;
        this.alertCtrl = alertCtrl;
        this.modalCtrl = modalCtrl;
        this.court = {
            closures: [{
                    clStart: new Date(10),
                    clEnd: new Date(12),
                    reason: "3 on 3 Tournament",
                    baskets: 4,
                    // sunday(index 0) to saturday(index 6) -
                    // 1 in the index means closure is on that day
                    // 2 in the index means it repeats every week on that day
                    days: [0, 1, 1, 1, 0, 0, 0, 0],
                    repeat: false
                },
                { clStart: new Date(16),
                    clEnd: new Date(18),
                    reason: "Girls Soccer Practice",
                    baskets: 4,
                    days: [0, 0, 2, 0, 2, 0, 0],
                    repeat: true
                }]
        };
    }
    // load the map when the page has loaded
    HoopMapPage.prototype.ionViewDidLoad = function () {
        this.loadMap();
        this.getCourts();
    };
    // load the map around the user's current location
    HoopMapPage.prototype.loadMap = function () {
        var _this = this;
        // get the location, upon success the callback pulls up the map
        this.geolocation.getCurrentPosition().then(function (position) {
            //let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var latLng = new google.maps.LatLng(40.723697, -73.988818);
            var mapOptions = {
                center: latLng,
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: [
                    //hide points of attraction
                    { featureType: 'poi',
                        stylers: [{ "visibility": 'off' }] },
                    //   // Hide highways
                    // { featureType: 'road.highway',
                    // stylers: [{visibility: 'off'}]},
                    // Hide highways
                    { featureType: 'landscape.man_made',
                        stylers: [{ visibility: 'off' }] },
                    // Set water to be our primary color;
                    { featureType: 'water',
                        stylers: [{ color: '#387ef5' }] },
                    // styling natural landscapes
                    { featureType: 'landscape',
                        stylers: [{ color: "#131313" }] },
                    // remove road icons
                    { 'featureType': 'road',
                        elementType: 'label.icon',
                        'stylers': [{ visibility: 'off' }] },
                    // simplify the roads
                    { 'featureType': 'road',
                        elementType: 'geometry',
                        'stylers': [
                            { visibility: 'simplified' }
                        ] },
                    // color the roads
                    { featureType: 'road',
                        elementType: 'geometry',
                        stylers: [{ color: '#050505' }] },
                    // simlify transit
                    { 'featureType': 'transit',
                        stylers: [{ visibility: 'simplified' }] },
                    // hide transit lines
                    { 'featureType': 'transit',
                        'elementType': 'geometry',
                        'stylers': [{ visibility: 'off' }] },
                    // set all text to be simple and off white
                    { 'elementType': 'labels.text',
                        stylers: [
                            { color: '#fffff0' },
                            { visibility: 'simplified' }
                        ] },
                    { 'featureType': 'poi.park',
                        'elementType': 'labels.text',
                        stylers: [{ visibility: 'simplified' }] },
                    // Sports complexes to look like parks
                    { 'featureType': 'poi.sports_complex',
                        stylers: [
                            { visibility: 'simplified' },
                            { color: '#131313' }
                        ] },
                    { featureType: 'poi.sports_complex',
                        elementType: 'labels.text',
                        stylers: [{ color: '#fffff0' }] },
                    { featureType: 'administrative.neighborhood',
                        "elementType": "labels",
                        stylers: [{ visibility: "none" }] },
                    // set all text to be simple and off white
                    { 'elementType': 'labels.text',
                        stylers: [
                            { color: '#fffff0' },
                            { visibility: 'simplified' }
                        ] },
                ]
            };
            _this.map = new google.maps.Map(_this.mapElement.nativeElement, mapOptions);
        }, function (err) { console.log(err); });
    };
    // post: courtsideCheckIn modal is presented, starting courtside behavior
    // pre: User is authenticated
    HoopMapPage.prototype.presentCourtsideCheckIn = function () {
        var _this = this;
        var cci = this.modalCtrl.create(CourtsideCheckIn, { showBackdrop: false });
        // handle the response
        cci.onDidDismiss(function (data) {
            // Move map if that is what data returned said to do
            if (data.moveMap) {
                _this.map.setCenter(new google.maps.LatLng(data.location.lat, data.location.lng));
                _this.map.setZoom(15);
            }
        });
        cci.present();
    };
    // post: Closures component is raise
    HoopMapPage.prototype.presentClosures = function () {
        var closures = this.modalCtrl.create(Closures, { "closures": this.court.closures });
        closures.present();
    };
    // Post: 1) allCourtsObservable is set to the new observable returned bycourtDataService
    //       2)processResponse is called upon successful reception of res
    HoopMapPage.prototype.getCourts = function () {
        var _this = this;
        this.courtDataService.getAllCourts()
            .subscribe(
        // here we extract the array of courts and call populate map
        function (res) { _this.processResponse(res); }, function (error) { _this.dummy += error; }, function () { });
    };
    // Param: a response object containing an array of courts
    // Post: Each court is added to the map
    HoopMapPage.prototype.processResponse = function (res) {
        //let courtArray = res.json();
        for (var _i = 0, _a = res.json(); _i < _a.length; _i++) {
            var court = _a[_i];
            this.addCourtMarker(court);
        }
    };
    // Param: court - a court object as defined in the model
    // post: a marker corresponding to that court is added to the map
    HoopMapPage.prototype.addCourtMarker = function (court) {
        var _this = this;
        var marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: { lat: court.location.lat, lng: court.location.long },
            // Each marker has a court object attached to it.
            // This is the object that will be passed into other parts of the app.
            court: court
        });
        google.maps.event.addListener(marker, 'click', function (court) {
            _this.markerClicked(marker.court);
        });
    };
    // method markerClicked()
    // Param: court - the court object corresponding to the clicked marker
    // Post: Alert is presented
    HoopMapPage.prototype.markerClicked = function (court) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: court.name,
            subTitle: court.totalBaskets + " baskets",
            buttons: [
                { text: 'Cancel',
                    handler: function (data) { }
                },
                { text: 'View Court',
                    handler: function () {
                        // dismiss the alert before navigating
                        alert.dismiss().then(function () {
                            _this.navCtrl.push(CourtPage, {
                                court: court
                            });
                        });
                        return false;
                    }
                }
            ]
        });
        alert.present();
    };
    // center the map to the around the given address
    HoopMapPage.prototype.moveMap = function (address) {
        this.map.setCenter(new google.maps.LatLng(40.723697, -73.988818));
    };
    HoopMapPage.prototype.presentPopover = function (myEvent) {
        var popover = this.popoverCtrl.create(MapSearchPopoverComponent);
        popover.present({
            ev: myEvent
        });
    };
    return HoopMapPage;
}());
__decorate([
    ViewChild('map'),
    __metadata("design:type", ElementRef)
], HoopMapPage.prototype, "mapElement", void 0);
HoopMapPage = __decorate([
    Component({
        selector: 'page-hoop-map',
        templateUrl: 'hoop-map-page.html'
    }),
    __metadata("design:paramtypes", [NavController,
        Geolocation,
        CourtDataService,
        PopoverController,
        AlertController,
        ModalController])
], HoopMapPage);
export { HoopMapPage };
//# sourceMappingURL=hoop-map-page.js.map