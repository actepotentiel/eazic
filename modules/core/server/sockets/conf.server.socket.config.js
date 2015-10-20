'use strict';


function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

// Create the chat configuration
module.exports = function (io, socket, sockets) {
    var roomManager = require('../models/room.server.class'),
        mongoose = require('mongoose'),
        Room = mongoose.model('Room'),
        Rooms = require('../../../rooms/server/controllers/rooms.server.controller');



    socket.on('conf.join', function(data) {
        console.log("");
        console.log("############# conf.join #############");
        console.log("Room desired : " +data);
        var roomName = data;
        if(roomName === ""){
            console.log("Room is blank, abort");
            socket.emit('conf.join.ack', {isOk : false, message : 'Room name must not be null'});
            console.log("##########################");
        }else{
            var room = null;
            console.log("Nombre de room initiale : " + global.roomManager.rooms.length);
            if(!global.roomManager.isRoomNameRunning(roomName)){
                console.log("Room is not running, looking for this room in BDD...");

                Room.find({name : roomName}).populate('conf.owner').exec(function(err, rooms) {
                    if (err) {
                        console.log("Erreur BDD " + err);
                        socket.emit('conf.join.ack', {isOk : false, message : 'server.error'});
                        console.log("##########################");
                    }else{
                        var newRoom = null;
                        if(rooms.length !== 1){
                            console.log("Room doesn't exist in BDD, creation of new instance...");
                            global.roomManager.deleteUserFromAllRooms(socket);
                            newRoom = new roomManager.Room(roomName, socket.request.user);
                            global.roomManager.rooms.push(newRoom);
                            if(socket.room){
                                //TODO TOTEST ET AJOUTER LA SAUVEGARDE DE L4ANCIENNE ROOM SI ELLE ETAIT PERSISTABLE
                                console.log("Leaving from room " + socket.room.name);
                                socket.leave(socket.room.name);
                            }else{
                                console.log("Leaving from initial room " + socket.id);
                                socket.leave(socket.id);
                            }
                            console.log("Joining room " + roomName + " and callback isOk");
                            socket.emit('conf.join.ack', {isOk : true, room : newRoom});
                            socket.join(roomName);
                            socket.room = newRoom;
                            console.log("Nombre de room post join : " + global.roomManager.rooms.length);
                            console.log("##########################");
                        }else{
                            console.log("Room exist in BDD, check for user rights");
                            if(socket.request.user._id + "" !== rooms[0].conf.owner._id + ""){
                                console.log("User is not the owner of the room, aborting...");
                                socket.emit('conf.join.ack', {isOk : false, message : 'acces.denied'});
                                console.log("##########################");
                            }else{
                                console.log("User is the owner of the room, instanciation...");
                                global.roomManager.deleteUserFromAllRooms(socket);
                                newRoom = new roomManager.Room(roomName, socket.request.user);
                                newRoom.copyModele(rooms[0]);
                                global.roomManager.rooms.push(newRoom);
                                if(socket.room){
                                    //TODO TOTEST ET AJOUTER LA SAUVEGARDE DE L4ANCIENNE ROOM SI ELLE ETAIT PERSISTABLE
                                    console.log("Leaving from room " + socket.room.name);
                                    socket.leave(socket.room.name);
                                }else{
                                    console.log("Leaving from initial room " + socket.id);
                                    socket.leave(socket.id);
                                }
                                console.log("Joining room " + roomName + " and callback isOk");
                                socket.emit('conf.join.ack', {isOk : true, room : newRoom});
                                socket.join(roomName);
                                socket.room = newRoom;
                                console.log("Nombre de room post join : " + global.roomManager.rooms.length);
                                console.log("##########################");
                            }

                        }
                    }
                });
            }else{
                console.log("Room exist, checking for user right...");
                room = global.roomManager.getRoomByName(roomName);
                if(room.allowJoin(socket.request.user)){
                    //ON REJOINT LA ROOM
                    console.log("User is authorized to join the room");
                    room.addUser(socket.request.user);

                    if(socket.room){
                        //TODO TOTEST ET AJOUTER LA SAUVEGARDE DE L4ANCIENNE ROOM SI ELLE ETAIT PERSISTABLE
                        console.log("Leaving from room " + socket.room.name);
                        socket.leave(socket.room.name);
                    }else{
                        console.log("Leaving from initial room " + socket.id);
                        socket.leave(socket.id);
                    }
                    console.log("Joining room " + roomName + " and callback isOk");
                    socket.join(roomName);
                    socket.room = room;
                    socket.to(room.conf.name).emit('chat.message', {
                        type: 'status',
                        text: 'Is now connected to ' + socket.request.user.username + '\'s room',
                        room: socket.request.user.username,
                        rooms: global.chatRooms,
                        created: Date.now(),
                        profileImageURL: socket.request.user.profileImageURL,
                        username: socket.request.user.username
                    });
                    socket.emit('conf.join.ack', {isOk : true, room : room});
                    console.log("##########################");
                }else{
                    //ON RETOURNE A L'UTILISATEUR QUE LA ROOM NEST PAS ACCESSIBLE
                    console.log("User is NOT authorized to join the room, aborting...");
                    socket.emit('conf.join.ack', {isOk : false, message : 'acces.denied'});
                    console.log("##########################");
                }
            }
        }




        //console.log(global.roomManager.rooms);
        //console.log("##########################");


        //if (global.chatRooms.hasOwnProperty(roomName) && global.chatRooms[roomName].indexOf(roomName)===-1)
        //    global.chatRooms[roomName].push(roomName);
        //else {
        //    global.chatRooms[roomName] = [roomName];
        //    io.emit('chat.message', {
        //      type: 'status',
        //      text: 'Is now connected to ' + socket.request.user.username + '\'s room',
        //      room: socket.request.user.username,
        //      rooms: global.chatRooms,
        //      created: Date.now(),
        //      profileImageURL: socket.request.user.profileImageURL,
        //      username: socket.request.user.username
        //    });
        //}


    });

    // Emit the status event when a socket client is disconnected
    socket.on('disconnect', function() {
        console.log("");
        console.log("############# DECONNECTION #############");
        if(socket.room){
            console.log("User : " + socket.request.user.username + " has disconnected from room : " + socket.room.name);

        }else{
            console.log("User : " + socket.request.user.username + " has disconnected");

        }
        console.log("Nombre de room pre delete : " + global.roomManager.rooms.length);
        global.roomManager.deleteUserFromAllRooms(socket);
        console.log("Nombre de room post delete : " + global.roomManager.rooms.length);
        console.log("#######################################");


    });
};
