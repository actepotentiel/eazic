/**
 * Created by mc on 12/27/15.
 */
'use strict';

// Setting up route
angular.module('core').config(function($mdIconProvider) {
    $mdIconProvider
        .defaultIconSet('/custom-lib/mdi.svg');
});
