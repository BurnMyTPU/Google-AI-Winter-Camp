'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('fashionUpload').
  component('fashionUpload', {
    templateUrl: 'fashion-upload/fashion-upload.template.html',
    controller: function FashionUploadController($scope, $http) {
      var self = this;
      $http.get('fashions/fashion.json').then(function(response) {
        self.fashions = response.data;
      });

    $scope.form = [];
    $scope.files = [];


    $scope.submit = function() {
    $scope.form.image = $scope.files[0];
    $http({
    method  : 'POST',
    url     : '',
    processData: false,
    transformRequest: function (data) {
        var formData = new FormData();
        formData.append("image", $scope.form.image);  
        return formData;  
    },  
        data : $scope.form,
        headers: {
               'Content-Type': undefined
        }
        }).success(function(data){
            //alert(data);
        });

    };

    $scope.uploadedFile = function(element) {
    $scope.currentFile = element.files[0];
    var reader = new FileReader();


    reader.onload = function(event) {
      $scope.image_source = event.target.result
      $scope.$apply(function($scope) {
        $scope.files = element.files;
      });
    }
    reader.readAsDataURL(element.files[0]);
  }

  $scope.PostData = function(){
    $http.get('fashions/testRecive.json').then(function(response) {
        self.fashions = response.data;
      });
  }

  // sidebar
  $scope.openNav = function(){
    document.getElementById("mySidenav").style.width = "250px";
  }

  $scope.closeNav = function(){
    document.getElementById("mySidenav").style.width = "0px";
  }

  }

  });


