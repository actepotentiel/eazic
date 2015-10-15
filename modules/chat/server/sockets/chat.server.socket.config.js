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

  socket.on('room.join', function(data, callback) {
    var roomName = data;
    if(roomName === ""){
      roomName = guid();
    }
    console.log("#############");
    console.log("room.join:");
    console.log(roomName);
    console.log("user:");
    console.log(socket.request.user);
    console.log("#############");
    socket.join(roomName);
    if (global.chatRooms.hasOwnProperty(roomName) && global.chatRooms[roomName].indexOf(roomName)===-1)
      global.chatRooms[roomName].push(roomName);
    else {
      //global.chatRooms[socket.request.user.username] = [socket.request.user.username];
      //io.emit('chat.message', {
      //  type: 'status',
      //  text: 'Is now connected to ' + socket.request.user.username + '\'s room',
      //  room: socket.request.user.username,
      //  rooms: global.chatRooms,
      //  created: Date.now(),
      //  profileImageURL: socket.request.user.profileImageURL,
      //  username: socket.request.user.username
      //});
    }

  });

  // Send a chat messages to all connected sockets when a message is received
  socket.on('chat.message', function(message) {
    message.created = Date.now();
    message.profileImageURL = socket.request.user.profileImageURL;
    message.username = socket.request.user.username;
    message.rooms = global.chatRooms;
    //if (message.type === 'join') {
    //  socket.leave(message.room);
    //  if (global.chatRooms[message.room].length === 1) {
    //    delete global.chatRooms[message.room];
    //  } else {
    //    global.chatRooms[message.room].splice(global.chatRooms[message.room].indexOf(socket.request.user.username), 1);
    //  }
    //  socket.join(message.join);
    //  if (global.chatRooms.hasOwnProperty(message.join))
    //    global.chatRooms[message.join].push(socket.request.user.username);
    //  else
    //    global.chatRooms[message.join] = [socket.request.user.username];
    //  message.rooms = global.chatRooms;
    //  message.text = 'Is now connected to ' + message.join + '\'s room';
    //  message.type = 'status';
    //  message.room = message.join;
    //  io.emit('chatMessage', message);
    //
    //} else {
      message.type = 'message';
      // Emit the 'chatMessage' event
      io.to(message.room).emit('chat.message', message);
    //}
  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function() {
    for (var roomindex in global.chatRooms) {
      if (global.chatRooms[roomindex].indexOf(socket.request.user.username)!==-1)
        global.chatRooms[roomindex].splice(global.chatRooms[roomindex].indexOf(socket.request.user.username), 1);
      if (!global.chatRooms[roomindex].length)
        delete global.chatRooms[roomindex];
    }

    var name = "";
    if(typeof socket.request.user === "undefined"){
      name = "inconnu";
    }else{
      name = socket.request.user.username;
    }

    io.emit('chatMessage', {
      type: 'status',
      text: 'disconnected',
      created: Date.now(),
      rooms: global.chatRooms,
      username: name
    });
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
