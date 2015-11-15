'use strict';

// Create the chat configuration
module.exports = function (io, socket) {

    // Send a chat messages to all connected sockets when a message is received
    socket.on('player', function(command) {
        console.log();
        console.log("############### player event ###############");
        if(socket.room){
            console.log("Checking for user rights..." + command.nom + " " + socket.request.user.username);
            var room = global.roomManager.getRoomByName(socket.room.name);
            if(room !== null){
                if(room.allowEvent(command.nom, socket.request.user)){
                    console.log("Emite playlist event to room " + socket.room.conf.name);
                    socket.broadcast.to(socket.room.conf.name).emit('playlist', command);
                }else{
                    //TODO alert notAuth
                    console.log("Room is not running, aborting...");
                    socket.emit("info", {name : "alert", status: "notAuth"});
                }
            }else{
                //TODO alert room is not running
                socket.emit("info", {name : "alert", status: "roomIsNotRunning"});
            }
        }else{
            //TODO alert user has no room
            console.log("User is not in official room, aborting...");
            socket.emit("info", {name : "alert", status: "userHasNoRoom"});
        }
        console.log("####################################################");
        console.log();
    });


};
