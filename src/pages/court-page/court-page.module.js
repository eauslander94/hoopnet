var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CourtPage } from './court-page';
import { TheWindow } from './the-window/the-window';
import { CourtReport } from '../court-report/court-report';
import { TextPost } from '../text-post/text-post';
import { PicturePost } from '../picture-post/picture-post';
var CourtPageModule = (function () {
    function CourtPageModule() {
    }
    return CourtPageModule;
}());
CourtPageModule = __decorate([
    NgModule({
        declarations: [
            CourtPage,
            CourtReport,
            TheWindow,
            TextPost,
            PicturePost,
        ],
        imports: [
            IonicPageModule.forChild(CourtPage),
        ],
        exports: [
            CourtPage
        ]
    })
], CourtPageModule);
export { CourtPageModule };
//# sourceMappingURL=court-page.module.js.map