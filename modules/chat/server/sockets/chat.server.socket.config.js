'use strict';

// Create the chat configuration
module.exports = function (io, socket) {
  // Emit the status event when a new socket client is connected
  //io.emit('chatMessage', {
  //  type: 'status',
  //  text: 'Is now connected',
  //  created: Date.now(),
  //  profileImageURL: socket.request.user.profileImageURL,
  //  username: socket.request.user.username
  //});
  //
  //// Send a chat messages to all connected sockets when a message is received
  //socket.on('chatMessage', function (message) {
  //  message.type = 'message';
  //  message.created = Date.now();
  //  message.profileImageURL = socket.request.user.profileImageURL;
  //  message.username = socket.request.user.username;
  //
  //  // Emit the 'chatMessage' event
  //  io.emit('chatMessage', message);
  //});
  //
  //// Emit the status event when a socket client is disconnected
  //socket.on('disconnect', function () {
  //  io.emit('chatMessage', {
  //    type: 'status',
  //    text: 'disconnected',
  //    created: Date.now(),
  //    username: socket.request.user.username
  //  });
  //});

  // Send a chat messages to all connected sockets when a message is received
  socket.on('chat.message', function(message) {
    console.log("#########################");
    console.log("chat.message");
    console.log(message);
    console.log("#########################");
    console.log("io.sockets.adapter.rooms:");
    console.log(io.sockets.adapter.rooms);
    console.log("##########################");
    console.log("socket.id:");
    console.log(socket.id);
    console.log("##########################");
    console.log("socket.roomName:");
    console.log(socket.room.conf.name);
    console.log("##########################");


    message.created = Date.now();
    message.profileImageURL = socket.request.user.profileImageURL;
    message.username = socket.request.user.username;
    message.rooms = global.chatRooms;
    message.type = 'message';

      // Emit the 'chatMessage' event
      io.to(socket.room.conf.name).emit('chat.message', message);
    //}
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
