'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('fashionList').
  component('fashionList', {
    templateUrl: 'fashion-list/fashion-list.template.html',
    controller: function FashionListController($scope, $http) {
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

  // User choose image
  $scope.chooseimg = function(){
    var cimg = new Image();
    cimg.src = this.fashion.imageUrl;
    alert(cimg.src);

    // $http({
    // method  : 'POST',
    // url     : '',
    // processData: false,
    // transformRequest: function (data) {
    //     var formData = new FormData();
    //     formData.append("image",cimg);  
    //     return formData;  
    // },  
    //     data : $scope.form,
    //     headers: {
    //            'Content-Type': undefined
    //     }
    //     }).success(function(data){
    //         //alert(data);
    //     });

      $http.get('fashions/testRecive.json').then(function(response) {
          self.fashions = response.data;
        });

      $scope.h_1 = "I guess you will ❤️...";

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


