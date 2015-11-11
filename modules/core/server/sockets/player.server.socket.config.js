'use strict';

// Create the chat configuration
module.exports = function (io, socket) {

    // Send a chat messages to all connected sockets when a message is received
    socket.on('player', function(command) {
        console.log("############### player.command ###############");
        if(socket.room){

        }else{
            console.log("User is not in official room, aborting...");
        }
        console.log("###########################################");
    });


};
