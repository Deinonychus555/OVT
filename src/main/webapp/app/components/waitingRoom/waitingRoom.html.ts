/*
 * @author Juan Antonio Echeverrías Aranda (juanan.echeve@gmail.com)
 */
 export const waitingRoomTemplate = `<div id="ovt-waitingRoom" class="animate join">
      
    <div class="ovt-header">Welcome <span>{{me.myName}}</span></div>
    <div class="ovt-container-col">
        <div class="header">    
            <h4 *ngIf="avaibleRoomsNames && avaibleRoomsNames.length === 0">There are no avaibles rooms yet</h4>
            <h4 *ngIf="avaibleRoomsNames && avaibleRoomsNames.length > 0">Select a room</h4>
        </div>
        <button class="btn ovt-btn" *ngFor="let room of avaibleRoomsNames" (click)="onJoinRoom(room)">{{room}}</button><br><br>
        <button class="btn ovt-btn"(click)="onLogOut()">Log out</button>
    </div>
</div>` 