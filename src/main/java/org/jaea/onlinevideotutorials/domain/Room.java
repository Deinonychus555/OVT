/*
 * (C) Copyright 2014 Kurento (http://kurento.org/)
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Lesser General Public License
 * (LGPL) version 2.1 which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/lgpl-2.1.html
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 */
package org.jaea.onlinevideotutorials.domain;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import java.io.Closeable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import javax.annotation.PreDestroy;
import org.kurento.client.Continuation;
import org.kurento.client.MediaPipeline;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Collections;
import java.util.Map;
import org.jaea.onlinevideotutorials.Hour;
import org.jaea.onlinevideotutorials.Info;
import org.jaea.onlinevideotutorials.SendMessage;


/**
 * Room
 * 
 * @author Juan Antonio Echeverrías Aranda (juanan.echeve@gmail.com)
*/
public class Room implements Closeable {
    private final Logger log = LoggerFactory.getLogger(Room.class);
    
    private ParticipantSession tutor = null;
    
    // The tutor is included in the participants
    private final ConcurrentHashMap<String, ParticipantSession> participantsByUserName = new ConcurrentHashMap<>();
    private final MediaPipeline pipeline;
    private final String name;
    
    
    public Room(String name, MediaPipeline pipeline) {
        log.info("% ROOM {}", Hour.getTime());
        this.name = name;
        this.pipeline = pipeline;
        
	log.info("/ ROOM {} has been created {}", this.name, Hour.getTime());
    }
    
    public String getName() {
        return name;
    }
    
    public int getParticipantsNumber(){
        int participantsNumber = 0;
        if (participantsByUserName!=null) {
            participantsNumber = participantsByUserName.size();
        }
        return participantsNumber;
    }
    
    public List<ParticipantSession> getParticipants() {
        return Collections.list(participantsByUserName.elements());
    }

    public ParticipantSession getParticipant(String userName) {
        return participantsByUserName.get(userName);
    }

    public boolean isTheTutor(ParticipantSession user){
        return this.tutor.equals(user);
    }
    
    public boolean isTheTutor(String userName){
        log.info("* Room.isTheTutor?: {}", userName);
        
        String tutorUserName = this.tutor.getUserName();
        
        log.info("/ Room.isTheTutor? The tutor is {}", tutorUserName);
        return tutorUserName.equals(userName);
    }

    public void addParticipant(ParticipantSession user) {
        log.info("{} ROOM.addParticipant {} to {} {}", Info.START_SYMBOL, user.getUserName(), this.name, Hour.getTime());
        Info.logInfoStart2("assignRoomMedia");
        
	    user.assignRoomMedia(new TutorialMedia(this.pipeline, user.getSession(), user.getUserName())); 
	
        Info.logInfoFinish2("assignRoomMedia");
        
        participantsByUserName.put(user.getUserName(), user);
        if (user.isATutor()) {
            this.tutor = user;
        }
        
        this.makeKnowTheParticipantsOfRoom(user);
        this.makeKnowThereIsANewParticipant(user);
        
        this.printTheRoomParticipants(); //*
        log.info(participantsByUserName.keys().toString());
        log.info("{} ROOM.addParticipant {}", Info.FINISH_SYMBOL, Hour.getTime());
    }
    
    private void makeKnowTheParticipantsOfRoom (ParticipantSession newParticipant){
        log.info("{} Room.makeKnowTheParticipantsOfRoom {}", Info.START_SYMBOL, Hour.getTime());
        
        JsonObject jsonAnswer = new JsonObject();
        jsonAnswer.addProperty("id", "thereIsAParticipant");
        
        Collection<ParticipantSession> participants = new ArrayList<ParticipantSession>();
        participants.addAll(this.participantsByUserName.values());
        
        if (participants.size() != 0){
            
            for (ParticipantSession participant : participants){
                log.info("participant: {}", participant.toString());

                jsonAnswer.addProperty("userName", participant.getUserName());
                jsonAnswer.addProperty("name", participant.getName());
                jsonAnswer.addProperty("userType", participant.getUserType());

                newParticipant.sendMeAMessage(jsonAnswer);
            }
        }    
        log.info("{} Room.makeKnowTheParticipantsOfRoom - the messages have been sent", Info.FINISH_SYMBOL, Hour.getTime());
    }
    
    private void makeKnowThereIsANewParticipant(ParticipantSession newParticipant){
        log.info("{} Room.makeKnowThereIsANewParticipant ({}) to participants of room {} {}", Info.START_SYMBOL, newParticipant.toString(), this.name, Hour.getTime());
        this.printTheRoomParticipants(); //*
        JsonObject jsonAnswer = new JsonObject();
        jsonAnswer.addProperty("id", "thereIsANewParticipant");
        jsonAnswer.addProperty("userName", newParticipant.getUserName());
        jsonAnswer.addProperty("name", newParticipant.getName());
        jsonAnswer.addProperty("userType", newParticipant.getUserType());
        
       log.info("Message to send to: {}",jsonAnswer.toString());
       Collection<ParticipantSession> participants = this.participantsByUserName.values();
        
        if (participants!=null){
            
            for (ParticipantSession participant : participants){
                
                
                // The new participant already knows he's in the room
                if (!participant.equals(newParticipant)){
                    log.info("Student/Tutor: {} {}", participant.getUserName(), participant.getSession().getId());
                    participant.sendMeAMessage(jsonAnswer);
                }    
            }  
            
        }
        log.info("{} Room.makeKnowThereIsANewParticipant - the messages have been sent {}", Info.FINISH_SYMBOL, Hour.getTime());
    }
    
    public ParticipantSession leave(String userName) {
        log.info("{} Room.leave - PARTICIPANT {}: Leaving room {} {}", Info.START_SYMBOL, userName, this.name, Hour.getTime());
        
        ParticipantSession participant = participantsByUserName.remove(userName);
        
        if (participant != null) {
            log.info("-----------------------------------------------");//*
            log.info("I'M GOING TO CLOSE THEM");//*
            participant.leavesRoom();
            
            log.info("-----------------------------------------------");//*
            log.info("-----------------------------------------------");//*
             log.info("THEY'RE GOING TO CLOSE ME");//*
            makeKnowAParticipantHasLeftTheRoom(participant);
        }    
        this.printTheRoomParticipants();//*
        log.info("{} Room.leave {}", Info.FINISH_SYMBOL, Hour.getTime());
        
        return participant;
    }
    
    private void makeKnowAParticipantHasLeftTheRoom(ParticipantSession user){
        log.info("{} Room.makeKnowAParticipantHasLeftTheRoom: {} {}", Info.START_SYMBOL, user.getUserName(), Hour.getTime());
        this.printTheRoomParticipants(); //*
        String userName = user.getUserName();
        JsonObject participantLeftJson = new JsonObject();
        participantLeftJson.addProperty("id", "aParticipantHasLeftTheRoom");
        participantLeftJson.addProperty("userName", userName);
        participantLeftJson.addProperty("userType", user.getUserType());
        participantLeftJson.addProperty("roomName", this.name);
        
        final List<ParticipantSession> unnotifiedParticipants = new ArrayList<>();
	boolean hasMessageBeenSend;
        for (final ParticipantSession participant : participantsByUserName.values()) {
            participant.receivesFarewellFrom(userName);
            hasMessageBeenSend = SendMessage.toClient(participantLeftJson, participant.getSession());
            if (!hasMessageBeenSend){
                unnotifiedParticipants.add(participant);
            }
        }

	if (!unnotifiedParticipants.isEmpty()) {
            log.debug( "ROOM {}: The users {} could not be notified that {} left the room",
		this.name, unnotifiedParticipants, name);
	}
        
        log.info("{} Room.makeKnowAParticipantHasLeftTheRoom - the messages have been sent {}", Info.FINISH_SYMBOL, Hour.getTime());
       
    }

    @PreDestroy
    public void shutdown() {
        Info.logInfoStart("Room.shutdown");
        this.close();
        Info.logInfoFinish("Room.shutdown");
    }

    @Override
    public void close() {
        Info.logInfoStart("Room.close");
        this.printTheRoomParticipants(); //*    
        for (final ParticipantSession participant : this.participantsByUserName.values()) {
            participant.leavesRoom();
        }

        this.participantsByUserName.clear();

        this.pipeline.release(new Continuation<Void>() {

            @Override
            public void onSuccess(Void result) throws Exception {
                log.trace("ROOM {}: Released Pipeline", Room.this.name);
            }

            @Override
            public void onError(Throwable cause) throws Exception {
                log.warn("PARTICIPANT {}: Could not release Pipeline",
                    Room.this.name);
            }
	});

            log.debug("{} Room {} closed",Info.FINISH_SYMBOL, this.name);
            Info.logInfoFinish();
	}
        
    public void sendAMessageToParticipants(JsonObject message){
        log.info("{} Room.sendAMessageToAllStudentsOfRoom - message: {}, room: {}, to:   {}", Info.START_SYMBOL, message.get("id").getAsString(), this.name, Hour.getTime());
        this.printTheRoomParticipants(); //*
        Collection<ParticipantSession> participants = this.participantsByUserName.values();
        
        if (participants!=null){
            
            for (ParticipantSession participant : participants){
                log.info("Participant: {}", participant.getSession().getId());

                participant.sendMeAMessage(message);
            }  
            
        }
        
        log.info("the message has been sent to all participants of the '{}' room ", this.name);
        log.info("{} Room.sendAMessageToAllStudentsOfRoom {}", Info.FINISH_SYMBOL, Hour.getTime()); 
     }
    
    
    public void manageOfferVideo(String addresseeUserName, String senderUserName, JsonElement offer){
        log.info("* Room.manageOfferVideo -> {} <- {}: {}", addresseeUserName, senderUserName);
        
        ParticipantSession addressee = this.getParticipant(addresseeUserName);
        
        ParticipantSession sender = this.getParticipant(senderUserName);
        
        if (sender == null){
            log.info ("!!!!!!!!!participante nulo");
        }
                                                                                          
        addressee.receivesGreetingsFrom(sender, offer);
            
        log.info("/ Room.manageOfferVideo");    
    }
    
    public void manageAddress(String addresseeUserName, String senderUserName, JsonElement address){
        log.info("* RoomManager.manageAddress -> {} <- {}: {}", addresseeUserName, senderUserName);
        
        ParticipantSession addressee = this.getParticipant(addresseeUserName);
        
	if (addressee != null) {
            addressee.addAddress(address, senderUserName);
	}
        
        log.info("/ RoomManager.manageAddress"); 
    }

    //#
    public void printTheRoomParticipants(){
        log.info("The participants of the " + this.name + " room are: " + this.participantsByUserName.size());
        for(Map.Entry<String, ParticipantSession> entry : this.participantsByUserName.entrySet()){
            log.info("- " + entry.getKey());
        }
    }
    
    
    

       
        
}
