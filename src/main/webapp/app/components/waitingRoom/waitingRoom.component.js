/**
 * @author Juan Antonio Echeverrías Aranda (juanan.echeve@gmail.com)
 *
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var waitingRoom_service_1 = require('../../services/waitingRoom.service');
var myService_1 = require('../../services/myService');
var waitingRoom_html_1 = require('./waitingRoom.html');
var WaitingRoomComponent = (function () {
    function WaitingRoomComponent(waitingRoom, router, me) {
        this.waitingRoom = waitingRoom;
        this.router = router;
        this.me = me;
        console.log("");
        console.log("% WaitingRoom constructor " + new Date().toLocaleTimeString());
        console.log("/ WaitingRoom constructor " + new Date().toLocaleTimeString());
        console.log("");
    }
    WaitingRoomComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.waitingRoom.init();
        this.waitingRoom.getAvaibleRooms().subscribe(function (avaibleRooms) { return _this.avaibleRoomsNames = avaibleRooms; });
    };
    WaitingRoomComponent.prototype.onJoinRoom = function (roomName) {
        console.log("");
        console.log("* WaitingRoom.joinRoom: " + roomName + " " + new Date().toLocaleTimeString());
        this.router.navigate(['/room', roomName]);
        console.log("/ WaitingRoom.joinRoom " + new Date().toLocaleTimeString());
        console.log("");
    };
    WaitingRoomComponent.prototype.onLogOut = function () {
        console.log("");
        console.log("* <- WaitingRoom.onLogOut " + new Date().toLocaleTimeString());
        this.router.navigate(['/login']);
    };
    WaitingRoomComponent.prototype.ngOnDestroy = function () {
        console.log("");
        console.log("* <- WaitingRoom.ngOnDestroy " + new Date().toLocaleTimeString());
        this.waitingRoom.destroy();
        console.log("/ WaitingRoom.ngOnDestroy " + new Date().toLocaleTimeString());
        console.log("");
    };
    WaitingRoomComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'ovt-waitingRoom',
            styleUrls: ["waitingRoom.css"],
            template: waitingRoom_html_1.waitingRoomTemplate,
            providers: [waitingRoom_service_1.WaitingRoomService]
        }), 
        __metadata('design:paramtypes', [waitingRoom_service_1.WaitingRoomService, router_1.Router, myService_1.MyService])
    ], WaitingRoomComponent);
    return WaitingRoomComponent;
}());
exports.WaitingRoomComponent = WaitingRoomComponent;
//# sourceMappingURL=waitingRoom.component.js.map