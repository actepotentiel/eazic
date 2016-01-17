/**
 * Created by lardtiste on 29/11/2015.
 */
'use strict';

angular.module('core').factory('DailymotionPlayerService', ['PlayerHandlerService',
    function(PlayerHandlerService) {
        var _this = this;
        _this._data = {
            sourceName : "dailymotion",
            registerService: function(){
                if(typeof PlayerHandlerService.services === "undefined"){
                    PlayerHandlerService.services = [];
                }
                PlayerHandlerService.services.push(this);
            },
            processCommand: function(command){
                switch(command.name){
                    case "play":
                        console.log("processPlayOnDailymotion");
                        break;
                    case "pause":
                        console.log("processPauseOnDailymotion");
                        break;
                    default:
                        alert("command has no handler : " + command.name);
                        break;
                }
            }
        };
        return _this._data;
    }
]);
