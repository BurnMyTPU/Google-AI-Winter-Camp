'use strict';

// Define module
var app = angular.module('fashionApp', [
  'ngRoute',
  'fashionList',
  'fashionUpload'
]);

app.factory('svc', ['$http', function ($http) {
	var fashions;
	$http.get('./fashions/fashion.json').then(function(response) {
        fashions = response.data;
      });
    
    return {
        setMessage: function(x) {
            fashions=x;
            //msg = fashion
        },
        getMessage: function() {
            return fashions;
        }
    };
}]);



// app.controller("ctrl1",function($scope,svc,$timeout){
//   $scope.someText=svc.getMessage();
//   $scope.$watch("someText",function(v){
//     svc.setMessage(v);
//   });
// });

// app.controller("ctrl2",function($scope,svc){
//   $scope.msg=svc.getMessage();
//   $scope.$watch(svc.getMessage,function(v){
//     $scope.msg=v;
//   });
// });