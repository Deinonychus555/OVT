/**
 * @author Juan Antonio Echeverrías Aranda (juanan.echeve@gmail.com)
 * 
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Connection } from '../../services/connection';
import { MyService } from '../../services/myService';

import { UserFactory } from '../../services/userFactory';

import { loginTemplate } from './login.html';


@Component({
    moduleId: module.id,
    selector: 'ovt-login',
    styleUrls: ["login.css"],
    template: loginTemplate
    
})


export class LoginComponent implements OnInit, OnDestroy{
    
    private user: Object;
    private onLoginSubscription: Object;
    
    
    constructor(private router: Router, private connection: Connection, private appService: MyService){
        console.log(`% Login constructor `);
        
        this.user =  {
            userName: "",
            password: ""
        };
        
        console.log(`/ Login constructor ${new Date().toLocaleTimeString()}`); 
    }
    
    ngOnInit(){
        this.onLoginSubscription = this.connection.subscriptions.subscribeToLogin(this, this.onLogin);
        console.log(this.onLoginSubscription);
        this.user.password = "ZZZ";
    }
    
    doLogin() {
        console.log("");
        console.log(`* Login.doLogin ${new Date().toLocaleTimeString()}`);
        
        let jsonMessage = {
            id: "login",
            userName: this.user.userName,
            password: this.user.password,
        };
               
       this.connection.sendMessage(jsonMessage);
       
       console.log(`/ Login.doLogin ${new Date().toLocaleTimeString()}`);
       console.log("");
                
    }
  
    onLogin (jsonMessage: Object): void{
        console.log("");
        console.log(`* <- Login.onLogin ${new Date().toLocaleTimeString()}`);
        
        if (jsonMessage.validUser){
            console.log(`is a valid user?: ${jsonMessage.validUser}`);
            console.log("Type user: " + jsonMessage.userType);
                
            this.appService.addMe(UserFactory.createAnUser(jsonMessage));
            
            if (this.appService.amATutor()){
                console.log("You are a tutor");
                
                this.router.navigate(['/room', jsonMessage.roomName]);
                
                console.log("# go to room");
            }
            else{
                console.log("You are an student");
                
                this.router.navigate(['/rooms']);
                
                console.log("# go to waitingRoom");
            }
                  
        }
        else {
            alert("Invalid user name or password");
            
            console.error(jsonMessage.id);
            console.error(jsonMessage.validUser);
            console.error(jsonMessage.typeUSer);
            console.error("Invalid user");
        }
       
       console.log(`/ Login.onLogin ${new Date().toLocaleTimeString()}`);
       console.log("");
    }
    
    ngOnDestroy(){
        console.log(`* Login.onDestroy `);
        
        this.onLoginSubscription.unsubscribe();
    }
      
 }