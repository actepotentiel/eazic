'use strict';

module.exports.Room = function(name, owner){

    this.conf = {
        name : name,
        owner : owner,
        users : [
            owner
        ],
        isOpen : true,
        allowedUser : [],
        bannedUsers : [],
        messageTypes : ['room.join', 'room.quit']
    };
    this.chat = {
        messages : [],
        messageTypes : ['chat.message']
    };
    this.playlist = {
        sounds : [],
        messageTypes : ['playlist.addSound', 'playlist.newPlaylist', 'playlist.ChangeOrder', 'playlist.removeSound']
    };
    this.policies = [
        {
            name : 'vip',
            users : [owner],
            allowedCommands : [
                'room.quit',
                'room.ban',
                'room.invit',
                'playlist.addSound',
                'playlist.newPlaylist',
                'playlist.ChangeOrder',
                'playlist.removeSound',
                'chat.message',
                'chat.message2'
            ]
        },
        {
            name : 'guest',
            users : [],
            allowedCommands : [
                'chat.message'
            ]
        }
    ];

};

module.exports.Room.prototype.allowJoin = function(user) {
    console.log("#################################");
    console.log("allowJoin");
    console.log(user);
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
    console.log("#################################");
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
    console.log("#################################");
    console.log("addUser");
    console.log(user);
    console.log("#################################");

    this.conf.users.push(user);
    this.policies[1].users.push(user);

};




