'use strict';

module.exports.RoomsManager = function(){

    this.rooms = [];
};

module.exports.RoomsManager.prototype.getRoomByName = function(name) {

    for(var i = 0 ; i < this.rooms.length ; i++){
        if(this.rooms[i].conf.name === name){
            return this.rooms[i];
        }
    }
    return null;
};

module.exports.RoomsManager.prototype.process = function(commande, socket) {

    var room = this.getRoomByName(socket.room.conf.name);
    switch(commande.nom){
        case "playlist.newPlaylist":
            room.playlist.sounds = commande.playlist;
            break;
        case "playlist.addSound":
            if(typeof room.playlist.sounds === 'undefined'){
                room.playlist.sounds = [];
            }
            room.playlist.sounds.push(commande.sound);
            break;
        case "playlist.addSounds":
            room.playlist.sounds = room.playlist.sounds.concat(commande.playlist);
            break;
        case "playlist.deleteSound":
            for(var i = 0 ; i < room.playlist.sounds.length ; i++){
                if(room.playlist.sounds[i].sourceId + "" === commande.sound.sourceId + ""){
                    room.playlist.sounds.splice(i, 1);
                    break;
                }
            }
            break;
        default:
            break;
    }
};



module.exports.RoomsManager.prototype.isRoomNameRunning = function(name) {

    for(var i = 0 ; i < this.rooms.length ; i++){
        if(this.rooms[i].conf.name === name){
            return true;
        }
    }
    return false;
};


module.exports.RoomsManager.prototype.deleteUserFromAllRooms = function(socket) {

    var i = this.rooms.length;
    while(i--){
        var j = this.rooms[i].conf.users.length;
        while(j--){
            if(this.rooms[i].conf.users[j]._id + "" === socket.request.user._id + ""){
                this.rooms[i].conf.users.splice(j, 1);
            }
        }
        if(this.rooms[i].conf.users.length === 0){
            this.rooms.splice(i, 1);
        }
    }
};
