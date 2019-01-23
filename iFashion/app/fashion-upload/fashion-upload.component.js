'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('fashionUpload').
  component('fashionUpload', {
    templateUrl: 'fashion-upload/fashion-upload.template.html',
    controller: function FashionUploadController($scope, $http,$location) {
      var self = this;
      $http.get('fashions/fashion.json').then(function(response) {
        self.fashions = response.data;
      });

      $scope.form = [];
      $scope.files = [];
      var form = document.getElementById("uploadform");

      function sendData() {
        var XHR = new XMLHttpRequest();

        // Bind the FormData object and the form element
        var FD = new FormData(form);

        // Define what happens on successful data submission
        XHR.addEventListener("load", function(event) {
          // alert(event.target.responseText);
        });

        // Define what happens in case of error
        XHR.addEventListener("error", function(event) {
          alert('Oops! Something went wrong.');
        });

        // Set up our request
        // XHR.open("POST", "http://34.80.200.205/post/");
        XHR.open("POST", "http://127.0.0.1:8001/post/");
        
        // The data sent is what the user provided in the form
        XHR.send(FD);
  };



    $scope.uploadedFile = function(element) {
    $scope.currentFile = element.files[0];
    //$scope.currentFile.name = "image";
    var reader = new FileReader();


    reader.onload = function(event) {
      $scope.image_source = event.target.result
      $scope.$apply(function($scope) {
        $scope.files = element.files;
      });
    }
    reader.readAsDataURL(element.files[0]);
  };

  $scope.UploadImg = function(){
      sendData();
      $location.path('/fashions').replace()
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


