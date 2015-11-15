'use strict';

// Create the playlist configuration
module.exports = function (io, socket) {

    // Send a chat messages to all connected sockets when a message is received
    socket.on('playlist', function(command) {
        console.log();
        console.log("############### playlist event ###############");
        if(socket.room){
            console.log("Checking for user rights..." + command.nom + " " + socket.request.user.username);
            var room = global.roomManager.getRoomByName(socket.room.name);
            if(room !== null){
                if(room.allowEvent(command.nom, socket.request.user)){
                    console.log("Emite playlist event to room " + socket.room.conf.name);
                    room.processCommand(command, socket);
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



    //socket.on('room.event', function(event) {
    //  var room = null;
    //  if(event.message && event.roomTitle && event.roomTitle!==''){
    //    room = getRoomByName(event.roomTitle);
    //    // event.message.date = guid();
    //    addMessageToRoomChat(room, event.message);
    //    io.to(event.roomTitle).emit('room.event', event);
    //  }else{
    //    if(event.commande){
    //      room = getRoomByName(event.roomTitle);
    //      switch(event.commande.nom){
    //        case 'addSound':
    //          console.log('ADD SOUND');
    //          room.playlist.push(event.commande.sound);
    //          break;
    //        case 'changeOrder':
    //          break;
    //        case 'newStatut':
    //          room.playerLeft.status = event.commande.status;
    //          break;
    //        case 'newPlaylist':
    //          room.playlist = event.commande.playlist;
    //          break;
    //        case 'deleteSound':
    //          console.log('DELETE SOUND');
    //          deleteSoundInRoomPlaylist(room, event.commande.sound);
    //          break;
    //        default:
    //          break;
    //      }
    //    }
    //    io.to(event.roomTitle).emit('room.event', event);
    //  }
    //
    //});
    //
    //socket.on('playlist.event', function(event) {
    //  var room = null;
    //  if((typeof event.commande !== 'undefined') && typeof event.commande !== 'undefined'){
    //    room = getRoomByName(event.roomTitle);
    //    switch(event.commande.nom){
    //      case 'addSound':
    //        console.log('ADD SOUND');
    //        room.playlist.push(event.commande.sound);
    //        break;
    //      case 'changeOrder':
    //        break;
    //      case 'newPlaylist':
    //        console.log('NEW PLAYLIST');
    //        room.playlist = event.commande.playlist;
    //        break;
    //      case 'deleteSound':
    //        console.log('DELETE SOUND');
    //        deleteSoundInRoomPlaylist(room, event.commande.sound);
    //        break;
    //      default:
    //        break;
    //    }
    //  }
    //  io.to(event.roomTitle).emit('playlist.event', event);
    //});
    //
    //socket.on('lecteur.left.event', function(event) {
    //  var room = null;
    //  if((typeof event.commande !== 'undefined') && typeof event.commande !== 'undefined'){
    //    room = getRoomByName(event.roomTitle);
    //    switch(event.commande.nom){
    //      case 'newStatut':
    //        room.playerLeft.status = event.commande.status;
    //        if((typeof event.commande.status !== 'undefined') && (event.commande.status !== '')){
    //          room.playerLeft.isLaunched = true;
    //        }
    //        break;
    //      default:
    //        break;
    //    }
    //  }
    //  io.to(event.roomTitle).emit('lecteur.left.event', event);
    //});
    //
    //socket.on('lecteur.right.event', function(event) {
    //  var room = null;
    //  if((typeof event.commande !== 'undefined') && typeof event.commande !== 'undefined'){
    //    room = getRoomByName(event.roomTitle);
    //    switch(event.commande.nom){
    //      case 'newStatut':
    //        room.playerRight.status = event.commande.status;
    //        break;
    //      default:
    //        break;
    //    }
    //  }
    //  io.to(event.roomTitle).emit('lecteur.right.event', event);
    //});
    //
    //socket.on('room.create', function(salon, callback) {
    //  socket.user = salon.creator;
    //  if(isNameDisponible(salon.title)){
    //    var roomToCreate = salon;
    //    salons.push(roomToCreate);
    //    socket.join(roomToCreate.title);
    //    callback({isOk: true, room: roomToCreate});
    //    socket.broadcast.emit('nouveauSalon', {room: roomToCreate});
    //    socket.user.isInRoom = true;
    //  }else{
    //    callback({isOk: false, message: 'Ce nom est déjà pris'});
    //  }
    //});
    //
    //socket.on('room.join', function(data, callback) {
    //  socket.user = data.user;
    //  if(!isNameDisponible(data.room.title)){
    //    var roomToJoin = {};
    //    var i = 0;
    //    for(i = 0 ; i < salons.length ; i++){
    //      if(salons[i].title === data.room.title){
    //        roomToJoin = salons[i];
    //        roomToJoin.users.push(data.user);
    //
    //        callback({isOk: true, room: roomToJoin});
    //        socket.user.isInRoom = true;
    //        io.to(roomToJoin.title).emit('room.event', {roomTitle: roomToJoin.title, message: {pseudo: 'server', date: Date(), corps: socket.user.displayName+' s\'est connecté à la room!'}, action:{type: 'addUser', user: socket.user}});
    //        socket.join(roomToJoin.title);
    //      }
    //    }
    //  }else{
    //    callback({isOk: false, message: 'Ce salon n existe pas'});
    //  }
    //});

    //socket.on('room.quit', function(roomTitle, callback) {
    //  if(!isNameDisponible(roomTitle)){
    //    var roomToQuit = getRoomByName(roomTitle);
    //    //deleteUserFromRoom(roomToQuit, socket.user);
    //    deleteUserFromAllRoom(socket.user, io);
    //    socket.leave(roomToQuit.title);
    //    callback({isOk: true});
    //    if(roomToQuit.users.length === 0){
    //      //deleteRoom(roomToQuit);
    //    }else{
    //      //io.to(roomToQuit.title).emit('room.event', {roomTitle: roomToQuit.title, message: {pseudo: 'server', corps: socket.user.displayName+' s\'est déconnecté à la room!'}, action:{type: 'deleteUser', user: socket.user}});
    //    }
    //  }else{
    //    callback({isOk: false, message: 'Ce salon n\'existe pas'});
    //  }
    //});

    //socket.on('disconnect', function (message) {
    //  if(socket.user && socket.user.isInRoom){
    //    deleteUserFromAllRoom(socket.user, io);
    //  }
    //});


};
