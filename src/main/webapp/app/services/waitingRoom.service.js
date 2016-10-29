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
var Subject_1 = require('rxjs/Subject');
var connection_1 = require('./connection');
var handler_service_1 = require('./handler.service');
var myService_1 = require('./myService');
var WaitingRoomService = (function () {
    function WaitingRoomService(connection, handler, me) {
        var _this = this;
        this.connection = connection;
        this.handler = handler;
        this.me = me;
        console.log("*WaitingRoomService constructor");
        this.avaibleRoomsObserver = new Subject_1.Subject();
        this.eeAvaibleRooms = new core_1.EventEmitter();
        this.eeAvaibleRooms.subscribe(function (data) { return _this.onSetAvaibleRooms(data); });
        this.handler.attach('avaibleRooms', this.eeAvaibleRooms);
        this.eeThereIsANewRooms = new core_1.EventEmitter();
        this.eeThereIsANewRooms.subscribe(function (data) { return _this.onAddAvaibleRoom(data); });
        this.handler.attach('thereIsANewRoom', this.eeThereIsANewRooms);
        this.eeThereIsAnAvaibleRoomLess = new core_1.EventEmitter();
        this.eeThereIsAnAvaibleRoomLess.subscribe(function (data) { return _this.onRemoveAvaibleRoom(data); });
        this.handler.attach('thereIsAnAvaibleRoomLess', this.eeThereIsAnAvaibleRoomLess);
    }
    WaitingRoomService.prototype.init = function () {
        this.enter();
    };
    WaitingRoomService.prototype.enter = function () {
        console.log("");
        console.log("* <- WaitingRoomService.lookingForRooms " + new Date().toLocaleTimeString());
        var jsonMessage = {
            id: "enterWaitingRoom",
            userName: this.me.myUserName
        };
        this.connection.sendMessage(jsonMessage);
        console.log("/ WaitingRoomService.lookingForRooms " + new Date().toLocaleTimeString());
        console.log("");
    };
    WaitingRoomService.prototype.getAvaibleRooms = function () {
        console.log("* WaitingRoomService.getAvaibleRooms");
        return this.avaibleRoomsObserver;
    };
    WaitingRoomService.prototype.onSetAvaibleRooms = function (msg) {
        console.log("");
        console.log("* WaitingRoomService.onSetAvaibleRooms " + new Date().toLocaleTimeString());
        console.log(msg.avaibleRoomsNames);
        this.avaibleRoomsNames = msg.avaibleRoomsNames;
        this.avaibleRoomsObserver.next(this.avaibleRoomsNames);
        console.log("/ WaitingRoomService.onSetAvaibleRooms " + new Date().toLocaleTimeString());
        console.log("");
    };
    WaitingRoomService.prototype.onAddAvaibleRoom = function (msg) {
        console.log("");
        console.log("* <- WaitingRoomService.onAddAvaibleRoom: " + msg.roomName + " to " + this.avaibleRoomsNames + " " + new Date().toLocaleTimeString());
        this.avaibleRoomsNames.push(msg.roomName);
        console.log("this.avaibleRooms: " + this.avaibleRoomsNames + " ");
        console.log("/WaitingRoomService.onAddAvaibleRoom " + new Date().toLocaleTimeString());
        console.log("");
    };
    ;
    WaitingRoomService.prototype.onRemoveAvaibleRoom = function (msg) {
        console.log("");
        console.log("* <- WaitingRoomService.onRemoveAvaibleRoom : " + msg.roomName + " " + new Date().toLocaleTimeString());
        var i = this.avaibleRoomsNames.indexOf(msg.roomName);
        this.avaibleRoomsNames.splice(i, 1);
        console.log("this.avaibleRooms: " + this.avaibleRoomsNames);
        console.log("/ WaitingRoomService.onRemoveAvaibleRoom : " + msg.roomName + " " + new Date().toLocaleTimeString());
        console.log("");
    };
    ;
    WaitingRoomService.prototype.destroy = function () {
        this.exit();
        this.eeAvaibleRooms.unsubscribe();
        this.eeThereIsANewRooms.unsubscribe();
        this.eeThereIsAnAvaibleRoomLess.unsubscribe();
    };
    WaitingRoomService.prototype.exit = function () {
        console.log("");
        console.log("* <- WaitingRoomService.exit " + new Date().toLocaleTimeString());
        var jsonMessage = {
            id: "exitWaitingRoom",
            userName: this.me.myUserName
        };
        this.connection.sendMessage(jsonMessage);
        console.log("/ WaitingRoomService.exit " + new Date().toLocaleTimeString());
        console.log("");
    };
    WaitingRoomService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [connection_1.Connection, handler_service_1.HandlerService, myService_1.MyService])
    ], WaitingRoomService);
    return WaitingRoomService;
}());
exports.WaitingRoomService = WaitingRoomService;
//# sourceMappingURL=waitingRoom.service.js.map