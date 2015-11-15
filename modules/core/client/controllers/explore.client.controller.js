/**
 * Created by lardtiste on 19/09/15.
 */
'use strict';

angular.module('core').controller('ExploreController', ['$scope', 'Authentication', 'PlaylistService', 'DailymotionSearch', 'DeezerSearch', 'SoundcloudSearch', 'SpotifySearch', 'VimeoSearch', 'YoutubeSearch',
    function($scope, Authentication, PlaylistService, DailymotionSearch, DeezerSearch, SoundcloudSearch, SpotifySearch, VimeoSearch, YoutubeSearch) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        $scope.getSearch = function(){
            DailymotionSearch.search({q : $scope.query}, function(result){
                console.log(result);
                $scope.dailymotionResult = result.dailymotion.items;
            });
            DeezerSearch.search({q : $scope.query}, function(result){
                console.log(result);
                $scope.deezerResult = result.deezer.items;
            });
            SoundcloudSearch.search({q : $scope.query}, function(result){
                console.log(result);
                $scope.soundcloudResult = result.soundcloud.items;
            });
            SpotifySearch.search({q : $scope.query}, function(result){
                console.log(result);
                $scope.spotifyResult = result.spotify.items;
            });
            VimeoSearch.search({q : $scope.query}, function(result){
                console.log(result);
                $scope.vimeoResult = result.vimeo.items;
            });
            YoutubeSearch.search({q : $scope.query}, function(result){
                console.log(result);
                $scope.youtubeResult = result.youtube.items;
            });
        };

        $scope.addToList = function(soundToAdd){
            console.log(soundToAdd);
            PlaylistService.sendCommand({name: 'addSounds', sounds :[soundToAdd]});
        };
    }
]);
