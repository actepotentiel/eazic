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
        isPersistable : false
    };
    this.playlist = {
        sounds : [],
    };
    this.policies = [
        {
            name : 'vip',
            users : [owner],
            allowedCommands : [
                {commandName : 'all'}
            ]
        },
        {
            name : 'guest',
            users : [],
            allowedCommands : [
                {commandName : 'deleteSound'},
                {commandName : 'addSounds'}
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
    this.conf.isPersistable = true;
    this.player = JSON.parse(JSON.stringify(room.player));
    if(typeof this.player.left === "undefined"){
        this.player.left = {};
    }
    if(typeof this.player.right === "undefined"){
        this.player.right = {};
    }

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

module.exports.Room.prototype.isOwner = function(user) {
    if(this.conf.owner._id + "" === user._id + "") {
        return true;
    }else{
        return false;
    }
};

module.exports.Room.prototype.update = function() {
    //TODO
    console.log("########## Update room ##############");
};

module.exports.Room.prototype.allowEvent = function(eventName, user) {

    console.log("AllowEvent : " + eventName + " " + user.username);


    if(this.conf.owner._id + "" === user._id + ""){
        console.log("User is owner of the room, return true");
        return true;
    }

    for(var i = 0 ; i < this.policies.length ; i++){
        for(var j = 0 ; j < this.policies[i].users.length ; j++){
            if(this.policies[i].users[j] + "" === user._id + ""){
                console.log("User finded");
                if(this.policies[i].name === "vip"){
                    console.log("User group is VIP, return true");
                    return true;
                }
                for(var k = 0 ; k < this.policies[i].allowedCommands.length ; k++){
                    if(this.policies[i].allowedCommands[k].commandName === eventName){
                        console.log("Command is allowed for User group");
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

module.exports.Room.prototype.processCommand = function(command, socket) {
    var _this = this;
    console.log("########## Process Commande ##############");
    switch(command.name){
        case "addSounds":
            _this.playlist.sounds = _this.playlist.sounds.concat(command.sounds);
            break;
        case "deleteSound":
            _this.playlist.sounds.forEach(function(item, index){
                if(item.sourceId === command.sound.sourceId){
                    _this.playlist.sounds.splice(index, 1);
                }
            });
            break;
        case "newPlaylist":
            _this.playlist.sounds = command.playlist;
            break;
    }
};

module.exports.Room.prototype.processInfo = function(command) {
    //TODO
    console.log("########## Process Info ##############");

    switch(command.name){
        case "playerStatus":
            console.log("playerStatus : ");
            if(command.player){
                console.log(command.player);
                this.player.isDouble = command.player.isDouble;
            }else if(command.playerStatus){
                if(command.playerStatus.player === "left"){
                    this.player.left.currentSound = command.playerStatus.currentSound;
                    this.player.left.status = command.playerStatus.status;
                    this.player.left.volume = command.playerStatus.volume;
                }else{
                    this.player.right.currentSound = command.playerStatus.currentSound;
                    this.player.right.status = command.playerStatus.status;
                    this.player.right.volume = command.playerStatus.volume;
                }
                console.log(this.player);
            }

            break;
        default:
            break;
    }
};




