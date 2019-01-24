'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('fashionList').
  component('fashionList', {
    templateUrl: 'fashion-list/fashion-list.template.html',
    controller: function FashionListController($scope, $http, svc, $window, $timeout) {
      var self = this;
      var testJson;
      // $http.get('fashions/fashion.json').then(function(response) {
      //   testJson = response.data;
      //   self.fashions= response.data;
      // });

    $scope.form = [];
    $scope.files = [];
    
    // self.fashions=svc.getMessage();
    // $scope.$apply();
    $timeout(function() { $scope.$apply(); },10);

    $scope.$watch(svc.getMessage,function(v){

      console.log("v");
      console.log(v);
      console.log(svc.getMessage());
      self.fashions= v;
      
      // $scope.$apply();
      // $window.location.reload();
      
    });

    // $scope.$watch('fashions',function(){
    //   $scope.$apply();
    // });

    // src is under the url/
    function srcToFile(src, fileName, mimeType){
      return (fetch(src)
          .then(function(res){return res.arrayBuffer();})
          .then(function(buf){return new File([buf], fileName, {type:mimeType});})
      );
    }

    // preview data
    $scope.uploadedFile = function(element) {
    $scope.currentFile = element.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
      $scope.image_source = event.target.result
      // $scope.$apply(function($scope) {
      //   $scope.files = element.files;
      // });
    }
    reader.readAsDataURL(element.files[0]);
  };


  // User choose image
  $scope.chooseimg = function(){

    // get the user choose image 
    // trans to the file
    srcToFile(this.fashion.imageUrl, this.fashion.image_id, 'image/png')
    .then(function(file){
        var fd = new FormData();
        fd.append('image', file);
        //return fetch('http://127.0.0.1:8001/post/', {method:'POST', body:fd});
        return fetch('http://34.80.196.77/post/', {method:'POST', body:fd});   
        
    })
    .then(function(response){
        var newfashions= [];
        response.json().then(function(data) {

          // do something with your data
        console.log(data.length);
        for(var i = 0; i < data.length; i++) {
          // edit the url for img
          newfashions.push(data[i]);
        }
        // self.fashions = newfashions;
        console.log(self.fashions);
        self.fashions = newfashions;
        $scope.$apply();
        console.log(self.fashions);
        console.log(data[0].imageUrl);
          // $scope.fashion.imageUrl = data[3].imageUrl;
        }); 
  
    })
    .then(console.log)
    .catch(console.error);

  // $http.get('fashions/testRecive.json').then(function(response) {
  //     self.fashions = response.data;
  //   });
 

  $scope.h_1 = "I guess you will ❤️";

  }

  // $scope.PostData = function(){
  //   $http.get('http://34.80.200.205/post/').then(function(response) {
  //       self.fashions = response.data;
  //     });
  // }

  // sidebar
  $scope.openNav = function(){
    document.getElementById("mySidenav").style.width = "175px";
  }

  $scope.closeNav = function(){
    document.getElementById("mySidenav").style.width = "0px";
  }

  }

  });


