var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
var TextPost = (function () {
    function TextPost() {
    }
    return TextPost;
}());
__decorate([
    Input(),
    __metadata("design:type", Object)
], TextPost.prototype, "postData", void 0);
TextPost = __decorate([
    Component({
        selector: 'text-post',
        templateUrl: 'text-post.html'
    }),
    __metadata("design:paramtypes", [])
], TextPost);
export { TextPost };
//# sourceMappingURL=text-post.js.map