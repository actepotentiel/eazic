'use strict';

// Create the chat configuration
module.exports = function (io, socket) {

  // Send a chat messages to all connected sockets when a message is received
  socket.on('chat', function(message) {
    console.log("############### chat.message ###############");
    if(socket.room){

      // Emit the 'chatMessage' event
      console.log("Emite message to room " + socket.room.conf.name);
      socket.broadcast.to(socket.room.conf.name).emit('chat', message);
      //socket.broadcast.to(socket.room.conf.name).emit('chat.message', message);
    }else{
      console.log("User is not in official room, aborting...");
    }
    console.log("###########################################");
  });

};
