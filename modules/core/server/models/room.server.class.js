'use strict';

module.exports.Room = function(name, owner){

    this.name = name;

    this.conf = {
        name : name,
        owner : owner,
        users : [
            owner
        ],
        isOpen : true,
        allowedUsers : [],
        bannedUsers : [],
    };
    this.playlist = {
        sounds : [],
    };
    this.policies = [
        {
            name : 'vip',
            users : [owner],
            allowedCommands : [
                {commandName : 'room.quit'},
                {commandName : 'room.ban'},
                {commandName : 'room.invit'},
                {commandName : 'playlist.addSound'},
                {commandName : 'playlist.newPlaylist'},
                {commandName : 'playlist.ChangeOrder'},
                {commandName : 'playlist.removeSound'},
                {commandName : 'chat.message'},
                {commandName : 'chat.message2'}
            ]
        },
        {
            name : 'guest',
            users : [],
            allowedCommands : [
                {commandName : 'chat.message2'}
            ]
        }
    ];
};

module.exports.Room.prototype.copyModele = function(room) {

    this.name = room.name;

    this.conf.name = room.name;
    this.conf.isOpen = room.conf.isOpen;
    this.conf.allowedUsers = room.conf.allowedUsers;
    this.conf.bannedUsers = room.conf.bannedUsers;

    this.playlist.sounds = room.playlist.sounds;
    this.policies = room.policies;
};


module.exports.Room.prototype.allowJoin = function(user) {
    if(this.conf.isOpen){
        for(var k = 0 ; k < this.conf.bannedUsers.length ; k++){
            if(this.conf.bannedUsers[k]._id === user._id){
                return false;
            }
        }
        return true;
    }else{
        for(var j = 0 ; j < this.conf.allowedUsers.length ; j++){
            if(this.conf.allowedUsers[j]._id === user._id){
                return true;
            }
        }
        return false;
    }
};

module.exports.Room.prototype.allowEvent = function(eventName, user) {
    console.log("#################################");
    console.log("allowEvent");
    console.log(eventName);
    console.log(user);
    console.log("#################################");
    //TODO optimise
    for(var i = 0 ; i < this.policies.length ; i++){
        for(var j = 0 ; j < this.policies[i].users.length ; j++){
            if(this.policies[i].users[j]._id === user._id){
                for(var k = 0 ; k < this.policies[i].allowedCommands.length ; k++){
                    if(this.policies[i].allowedCommands[k] === eventName){
                        return true;
                    }
                }
            }
        }
    }
    return false;
};

module.exports.Room.prototype.addUser = function(user) {
    this.conf.users.push(user);
    this.policies[1].users.push(user);
};




