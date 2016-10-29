import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Connection } from './connection';
import { HandlerService } from './handler.service';
import { MyService } from './myService';

type RoomMessage = { roomName: string }
type AvaibleRoomsMessage = { avaibleRoomsNames: string [] }

@Injectable()
export class WaitingRoomService {

    private avaibleRoomsNames: string[];
    private eeAvaibleRooms: EventEmitter;
    private eeThereIsANewRooms: EventEmitter;
    private eeThereIsAnAvaibleRoomLess: EventEmitter;

    private avaibleRoomsObserver: Subject<string[]>;

    constructor(private connection: Connection, private handler: HandlerService, private me: MyService){
        console.log("*WaitingRoomService constructor");

        this.avaibleRoomsObserver = new Subject<string[]>();

        this.eeAvaibleRooms = new EventEmitter();
        this.eeAvaibleRooms.subscribe(data => this.onSetAvaibleRooms(data));
        this.handler.attach('avaibleRooms', this.eeAvaibleRooms);

        this.eeThereIsANewRooms = new EventEmitter();
        this.eeThereIsANewRooms.subscribe(data => this.onAddAvaibleRoom(data));
        this.handler.attach('thereIsANewRoom', this.eeThereIsANewRooms);

        this.eeThereIsAnAvaibleRoomLess = new EventEmitter();
        this.eeThereIsAnAvaibleRoomLess.subscribe(data => this.onRemoveAvaibleRoom(data));
        this.handler.attach('thereIsAnAvaibleRoomLess', this.eeThereIsAnAvaibleRoomLess);
    }

    init(){
       this.enter();
    }

    private enter(): void {
        console.log("");
        console.log(`* <- WaitingRoomService.lookingForRooms ${new Date().toLocaleTimeString()}`);

        var jsonMessage = {
            id:"enterWaitingRoom",
            userName: this.me.myUserName
        };
        
        this.connection.sendMessage(jsonMessage);
        console.log(`/ WaitingRoomService.lookingForRooms ${new Date().toLocaleTimeString()}`);
        console.log("");
        
    }

    getAvaibleRooms(): Subject<string[]> {
        console.log(`* WaitingRoomService.getAvaibleRooms`);
        return this.avaibleRoomsObserver;
    }

    onSetAvaibleRooms(msg: AvaibleRoomsMessage): void{
        console.log("");
        console.log(`* WaitingRoomService.onSetAvaibleRooms ${new Date().toLocaleTimeString()}`);
        console.log(msg.avaibleRoomsNames);
        
        this.avaibleRoomsNames = msg.avaibleRoomsNames;
        this.avaibleRoomsObserver.next(this.avaibleRoomsNames);
        
        console.log(`/ WaitingRoomService.onSetAvaibleRooms ${new Date().toLocaleTimeString()}`);
        console.log("");
    }

    onAddAvaibleRoom (msg: RoomMessage){
        console.log("");
        console.log(`* <- WaitingRoomService.onAddAvaibleRoom: ${msg.roomName} to ${this.avaibleRoomsNames} ${new Date().toLocaleTimeString()}`)
        
        this.avaibleRoomsNames.push(msg.roomName);  
        
        console.log(`this.avaibleRooms: ${this.avaibleRoomsNames} `)
        console.log(`/WaitingRoomService.onAddAvaibleRoom ${new Date().toLocaleTimeString()}`);
        console.log("");
    };
    
    onRemoveAvaibleRoom (msg: RoomMessage){
        console.log("");
        console.log(`* <- WaitingRoomService.onRemoveAvaibleRoom : ${msg.roomName} ${new Date().toLocaleTimeString()}`); 
         
        let i = this.avaibleRoomsNames.indexOf(msg.roomName);
        this.avaibleRoomsNames.splice(i,1);
        
        console.log(`this.avaibleRooms: ${this.avaibleRoomsNames}`);
        console.log(`/ WaitingRoomService.onRemoveAvaibleRoom : ${msg.roomName} ${new Date().toLocaleTimeString()}`);
        console.log("");
    };

    destroy(){

        this.exit();
        this.eeAvaibleRooms.unsubscribe();
        this.eeThereIsANewRooms.unsubscribe();
        this.eeThereIsAnAvaibleRoomLess.unsubscribe();
    }

    private exit(): void {
        console.log("");
        console.log(`* <- WaitingRoomService.exit ${new Date().toLocaleTimeString()}`);

        var jsonMessage = {
            id: "exitWaitingRoom",
            userName: this.me.myUserName
        };

        this.connection.sendMessage(jsonMessage);
        console.log(`/ WaitingRoomService.exit ${new Date().toLocaleTimeString()}`);
        console.log("");

    }
    
}