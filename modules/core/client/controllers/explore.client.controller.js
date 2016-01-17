/**
 * Created by lardtiste on 19/09/15.
 */
'use strict';

angular.module('core')
    .controller('ExploreController', ['$scope', 'Authentication', 'PlaylistService', 'DailymotionSearch', 'DeezerSearch', 'SoundcloudSearch', 'SpotifySearch', 'VimeoSearch', 'YoutubeSearch',
    function($scope, Authentication, PlaylistService, DailymotionSearch, DeezerSearch, SoundcloudSearch, SpotifySearch, VimeoSearch, YoutubeSearch) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.results = {};

        $scope.Math = window.Math;

        $scope.getSearch = function(){

            $scope.currentTab.title = angular.copy($scope.query);

            //DailymotionSearch.search({q : $scope.query}, function(result){
            //    console.log(result);
            //    $scope.dailymotionResult = result.dailymotion.items;
            //    $scope.currentTab.dailymotionResult = angular.copy($scope.dailymotionResult);
            //});
            //DeezerSearch.search({q : $scope.query}, function(result){
            //    console.log(result);
            //    $scope.deezerResult = result.deezer.items;
            //    $scope.currentTab.deezerResult = angular.copy($scope.deezerResult);
            //});
            //SoundcloudSearch.search({q : $scope.query}, function(result){
            //    console.log(result);
            //    $scope.soundcloudResult = result.soundcloud.items;
            //    $scope.currentTab.soundcloudResult = angular.copy($scope.soundcloudResult);
            //});
            //SpotifySearch.search({q : $scope.query}, function(result){
            //    console.log(result);
            //    $scope.spotifyResult = result.spotify.items;
            //    $scope.currentTab.spotifyResult = angular.copy($scope.spotifyResult);
            //});
            //VimeoSearch.search({q : $scope.query}, function(result){
            //    console.log(result);
            //    $scope.vimeoResult = result.vimeo.items;
            //    $scope.currentTab.vimeoResult = angular.copy($scope.vimeoResult);
            //});
            YoutubeSearch.search({q : $scope.query}, function(result){
                console.log(result);
                $scope.youtubeResult = result.youtube.items;
                $scope.currentTab.youtubeResult = angular.copy($scope.youtubeResult);
            });
            $scope.currentTab.isOk = true;
            //$scope.tabs.push(tab);
        };

        $scope.addToList = function(soundToAdd){
            console.log(soundToAdd);
            PlaylistService.sendCommand({name: 'addSounds', sounds :[soundToAdd]});
        };

        var tabs = [],
            selected = null,
            previous = null;
        $scope.tabs = tabs;
        $scope.selectedIndex = 1;

        $scope.addTab = function(){
            $scope.currentTab = {
                isOk: false,
                title: "..."
            };
            $scope.tabs.push($scope.currentTab);
        };
        $scope.addTab();

        $scope.$watch('selectedIndex', function(current, old){
            previous = selected;
            selected = tabs[current];
            $scope.currentTab = selected;
            if ( old + 1 && (old !== current)) ;//$log.debug('Goodbye ' + previous.title + '!');
            if ( current + 1 )                ;//$log.debug('Hello ' + selected.title + '!');
        });
        $scope.removeTab = function (tab) {
            var index = tabs.indexOf(tab);
            tabs.splice(index, 1);
        };

    }
]);
