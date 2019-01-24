'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('fashionUpload').
  component('fashionUpload', {
    templateUrl: 'fashion-upload/fashion-upload.template.html',
    controller: function FashionUploadController($rootScope, $scope, $http, $location, $window,svc) {
      
      $("#file-0d").fileinput({
        showUpload : true,
        uploadUrl: "http://34.80.196.77/post/",// 上传请求路径
        maxFileCount: 1,
        previewFileType: "image",
        browseClass: "btn btn-success",
        browseLabel: "Pick Image",
        browseIcon: "<i class=\"glyphicon glyphicon-picture\"></i> ",
        removeClass: "btn btn-danger",
        removeLabel: "Delete",
        removeIcon: "<i class=\"glyphicon glyphicon-trash\"></i> ",
        uploadClass: "btn btn-info",
        uploadLabel: "Upload",
        uploadIcon: "<i class=\"glyphicon glyphicon-upload\"></i> ",
        autoReplace : true,
        fileActionSettings:{showUpload: false,
                            showZoom: false,
                            showDrag: false,
                            showUpload: false
        },
        showRemove : false
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
        XHR.open("POST", "http://http://127.0.0.1:8001/post/");
        
        // The data sent is what the user provided in the form
        XHR.send(FD);
  };

    $("#file-0d").on("fileuploaded", function (event, data, previewId, index) {
        var obj = data.response;
        var newfashions= [];
        console.log(obj);
        for(var i = 0; i < obj.length; i++) {
            newfashions.push(obj[i]);
          }
          // console.log(newfashions);
          //send fashion 
        svc.setMessage(newfashions);
        $location.path('/fashions').replace();
        var url = $location.absUrl();//"http://" + $window.location.host + "/Account/Login";
        console.log(url);
        console.log(svc.getMessage());
        $window.location.href = url;
        // $scope.$apply();
        // $window.location.href('#!/fashions');
                
    });


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


