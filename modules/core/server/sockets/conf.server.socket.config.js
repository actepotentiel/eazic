'use strict';

// Create the chat configuration
module.exports = function (io, socket, sockets) {
    var roomManager = require('../models/room.server.class'),
        mongoose = require('mongoose'),
        Room = mongoose.model('Room');

    var self = this;

    socket.on('conf.join', function(data) {
        console.log("");
        console.log("############# conf.join #############");
        console.log("Room desired : " +data);
        var roomName = data;
        if(roomName === ""){
            console.log("Room is blank, abort");
            socket.emit('conf.join.ack', {isOk : false, status: "badRequest"});
            console.log("##########################");
        }else{
            var room = null;
            console.log("Nombre de room initiale : " + global.roomManager.rooms.length);
            if(!global.roomManager.isRoomNameRunning(roomName)){
                console.log("Room is not running, looking for this room in BDD...");

                Room.find({name : roomName}).populate('conf.owner').exec(function(err, rooms) {
                    if (err) {
                        console.log("Erreur BDD " + err);
                        socket.emit('conf.join.ack', {isOk : false, status: "errDB"});
                        console.log("##########################");
                    }else{
                        var newRoom = null;
                        if(rooms.length !== 1){
                            console.log("Room doesn't exist in BDD, creation of new instance...");

                            safeLeave(socket);
                            newRoom = new roomManager.Room(roomName, socket.request.user);
                            global.roomManager.rooms.push(newRoom);

                            console.log("Joining room " + roomName + " and callback isOk");

                            socket.emit('conf.join.ack', {isOk : true, status: "create", room : newRoom});
                            socket.join(roomName);
                            socket.room = JSON.parse(JSON.stringify(newRoom));

                            console.log("Nombre de room post join : " + global.roomManager.rooms.length);
                            console.log("##########################");
                        }else{
                            console.log("Room exist in BDD, check for user rights");
                            if(rooms[0].conf.owner._id + "" !== socket.request.user._id + ""){
                                console.log("User is not the owner of the room, aborting...");
                                console.log(typeof rooms[0].conf.owner._id);
                                console.log(typeof socket.request.user._id);
                                socket.emit('conf.join.ack', {isOk : false, status: "reservedName"});
                                console.log("##########################");
                            }else{
                                console.log("User is the owner of the room, instanciation...");
                                //console.log(socket);
                                var user = socket.request.user;
                                safeLeave(socket);
                                newRoom = new roomManager.Room(roomName, socket.request.user);
                                newRoom.copyModele(rooms[0]);
                                global.roomManager.rooms.push(newRoom);

                                console.log("Joining room " + roomName + " and callback isOk");
                                socket.emit('conf.join.ack', {isOk : true, status : "create", room : newRoom});
                                socket.join(roomName);
                                socket.room = JSON.parse(JSON.stringify(newRoom));
                                console.log("Nombre de room post join : " + global.roomManager.rooms.length);
                                console.log("##########################");
                            }

                        }
                    }
                });
            }else{
                console.log("Room is running, checking for user right...");
                room = global.roomManager.getRoomByName(roomName);
                if(room.allowJoin(socket.request.user)){
                    //ON REJOINT LA ROOM
                    console.log("User is authorized to join the room");

                    safeLeave(socket);
                    room.addUser(socket.request.user);

                    console.log("Joining room " + roomName + " and callback isOk");

                    socket.join(roomName);
                    socket.room = JSON.parse(JSON.stringify(room));

                    socket.to(room.conf.name).emit('info', {
                        name: 'joinUser',
                        created: Date.now(),
                        user: socket.request.user
                    });
                    socket.emit('conf.join.ack', {isOk : true, status : "join", room : room});
                    console.log("##########################");
                }else{
                    //ON RETOURNE A L'UTILISATEUR QUE LA ROOM NEST PAS ACCESSIBLE
                    console.log("User is NOT authorized to join the room, aborting...");
                    socket.emit('conf.join.ack', {isOk : false, status: "accesDenied"});
                    console.log("##########################");
                }
            }
        }
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
        safeLeave(socket);
        console.log("Nombre de room post delete : " + global.roomManager.rooms.length);
        console.log("#######################################");


    });

    // Emit the status event when a socket client is disconnected
    socket.on('info', function(data) {
        console.log("");
        console.log("############# INFO #############");
        if(socket.room){
            console.log("User : " + socket.request.user.username + " has send info from room : " + socket.room.name);
            var room = global.roomManager.getRoomByName(socket.room.name);
            if(room !== null){
                if(room.allowEvent(data.name, socket.request.user)){
                    room.processInfo(data);
                    socket.to(room.conf.name).emit('info', data);
                }else{
                    //TODO alert not auth
                    socket.emit('info', {name : "alert", status: "notAuth"});
                }
            }else{
                //TODO Alert emit while room is not running
                socket.emit('info', {name : "alert", status: "desynchro"});
            }
        }else{
            //TODO Alert emit while has no room
            socket.emit('info', {name : "alert", status: "dataIntegrity"});
        }
        console.log("#######################################");
    });


    function safeLeave(socket){
        if(socket.room){
            var userRoom = global.roomManager.getRoomByName(socket.room.name);
            if(userRoom.isOwner(socket.request.user) && userRoom.conf.isPersistable){
                userRoom.update();
            }
            socket.to(socket.room.name).emit('info', {
                name: 'userLeave',
                created: Date.now(),
                user : socket.request.user
            });
            socket.leave(socket.room.name);
            global.roomManager.deleteUserFromAllRooms(socket);
        }
    }

};
