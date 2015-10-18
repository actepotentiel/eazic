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
    var roomManager = require('../models/room.server.class');



    socket.on('conf.join', function(data) {

        console.log("##########################");
        console.log("conf.join:");



        var roomName = data;
        if(roomName === ""){
            if(typeof socket.request.user !== "undefined"){
                roomName = socket.request.user.username;
            }else{
                roomName = socket.id;
            }
        }
        console.log(roomName);

        var room = null;
        if(global.roomManager.isRoomNameDisponible(roomName)){
            //ON CREER LA ROOM
            console.log("CREATION");
            room = new roomManager.Room(roomName, socket.request.user);
            global.roomManager.rooms.push(room);

            socket.leave(socket.id);//Ici on devrait avoir une fonction qui leave toutes les rooms ou l'user est actuellement en passant par les données dans io
            socket.join(roomName);
            socket.room = room;
            socket.emit('conf.join.ack', room);
        }else{
            room = global.roomManager.getRoomByName(roomName);
            if(room.allowJoin(socket.request.user)){
                //ON REJOINT LA ROOM
                console.log("JOIN");
                room.addUser(socket.request.user);
                socket.leave(socket.id);//Ici on devrait avoir une fonction qui leave toutes les rooms ou l'user est actuellement en passant par les données dans io
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
                socket.emit('conf.join.ack', room);
            }else{
                //ON RETOURNE A L'UTILISATEUR QUE LA ROOM NEST PAS ACCESSIBLE
                //TODO reflechir au process
                console.log("NOK");
                socket.emit('conf.join.ack', false);

            }
        }

        console.log(global.roomManager.rooms);
        console.log("##########################");


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

        console.log("##########################");
        console.log("disconnect");
        console.log(socket.request.user);
        console.log("##########################");


        global.roomManager.deleteUserFromAllRooms(socket);
    });
};
