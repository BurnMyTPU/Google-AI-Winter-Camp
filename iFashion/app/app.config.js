'use strict';

angular.
  module('fashionApp').
  config(['$routeProvider',
    function config($routeProvider) {
      $routeProvider.
        when('/', {
          template: '<fashion-list></fashion-list>'
        }).
        when('/fashions', {
          template: '<fashion-list></fashion-list>'
        }).
        when('/upload', {
          template: '<fashion-upload></fashion-upload>'
        }).
        otherwise('/fashions');
    }
  ]);
