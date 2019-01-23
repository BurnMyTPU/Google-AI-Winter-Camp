'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('fashionUpload').
  component('fashionUpload', {
    templateUrl: 'fashion-upload/fashion-upload.template.html',
    controller: function FashionUploadController($rootScope, $scope, $http, $location, svc) {
      

      $scope.form = [];
      $scope.files = [];
      var form = document.getElementById("uploadform");

      function sendData() {
        var XHR = new XMLHttpRequest();

        // Bind the FormData object and the form element
        var FD = new FormData(form);

        // Define what happens on successful data submission
        XHR.addEventListener("load", function(event) {
          
          var jsonResponse = JSON.parse(event.target.responseText);
          var newfashions= [];
          console.log(jsonResponse);
          for(var i = 0; i < jsonResponse.length; i++) {
            newfashions.push(jsonResponse[i]);
          }
          // console.log(newfashions);
          //send fashion 
          svc.setMessage(newfashions);
          console.log(svc.getMessage());
          $scope.$apply();
          return jsonResponse;

        });

        // Define what happens in case of error
        XHR.addEventListener("error", function(event) {
          alert('Sorry, too many request QAQ!.');
        });

        // Set up our request
        // XHR.open("POST", "http://34.80.200.205/post/");
        XHR.open("POST", "http://34.80.196.77/post/");
        
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
    // define json
    // updata $scope 
      sendData();
      
      
      
      $location.path('/fashions').replace();
      
  };

  // sidebar
  $scope.openNav = function(){
    document.getElementById("mySidenav").style.width = "175px";
  }

  $scope.closeNav = function(){
    document.getElementById("mySidenav").style.width = "0px";
  }

  }

  });


