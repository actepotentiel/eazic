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
};

module.exports.RoomsManager.prototype.isRoomNameDisponible = function(name) {

    for(var i = 0 ; i < this.rooms.length ; i++){
        if(this.rooms[i].conf.name === name){
            return false;
        }
    }
    return true;
};

module.exports.RoomsManager.prototype.deleteUserFromAllRooms = function(socket) {

    for(var i in this.rooms){
        for(var j in this.rooms[i].conf.users){
            if(this.rooms[i].conf.users[j]._id === socket.request.user._id){
                delete this.rooms[i].conf.users[j];
                for(var k in this.rooms[i].policies){
                    for(var l in this.rooms[i].policies[k].users){
                        if(this.rooms[i].policies[k].users[l]._id === socket.request.user._id){
                            delete this.rooms[i].policies[k].users[l];
                        }
                    }
                }
            }
        }
        if(this.rooms[i].conf.users.length === 0){
            delete this.rooms[i];
        }
    }
    console.log(this.rooms);
};
