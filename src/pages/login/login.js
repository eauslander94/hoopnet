var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
var LoginPage = (function () {
    function LoginPage() {
        // Creating the lock
        this.lock = new Auth0Lock('pu0puMWvKB1XANUkPh0sygZwdGGR_oE1', 'eauslander94-dev.auth0.com', {
            auth: {
                redirect: false,
            }
        });
        // Listening for the authenticated event
        this.lock.on("authenticated", function (authResult) {
            // Use the token in authResult to getUserInfo() and save it to localStorage
            window.localStorage.setItem('test', "authenticated event fired");
            // Set tokens to Local Storage
            window.localStorage.setItem('accessToken', authResult.accessToken);
            window.localStorage.setItem('idToken', authResult.idToken);
            window.localStorage.setItem('refreshToken', authResult.refreshToken);
        });
        this.dummy = window.localStorage.getItem('test');
        this.dummy2 = window.localStorage.getItem('idToken');
    }
    LoginPage.prototype.lockLogin = function () {
        this.lock.show();
    };
    return LoginPage;
}());
LoginPage = __decorate([
    Component({
        selector: 'page-login',
        templateUrl: 'login.html'
    }),
    __metadata("design:paramtypes", [])
], LoginPage);
export { LoginPage };
//# sourceMappingURL=login.js.map