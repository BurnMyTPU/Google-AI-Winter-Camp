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



    // var blob = new Blob(byteArrays, { type: contentType });
    // var file = new File([blob], filename, {type: contentType, lastModified: Date.now()});


    $http({
    method  : 'POST',
    url     : 'http://127.0.0.1:8001/post/',
    processData: false,
    transformRequest: function (data) {
        var formData = new FormData();
        formData.append("image", $scope.form.image);  
        return formData;  
    },  
        data : $scope.form,
        headers: {
               'Content-Type': 'multipart/form-data'
        }
        }).success(function(data){
            //alert(data);
        });

    };

    // src is under the url/
    function srcToFile(src, fileName, mimeType){
      return (fetch(src)
          .then(function(res){return res.arrayBuffer();})
          .then(function(buf){return new File([buf], fileName, {type:mimeType});})
      );
    }

    //Test Button
    $scope.TestButn = function(){

      // 0-fecth img
      // 1-convert img to a file
      // 2-tranform to formData
      srcToFile("./test.jpg", 'new.png', 'image/png')
      .then(function(file){
          var fd = new FormData();
          fd.append('image', file);
          return fetch('http://127.0.0.1:8001/post/', {method:'POST', body:fd});
      })
      .then(function(res){
          return res.text();
      })
      .then(console.log)
      .catch(console.error); 

      $scope.PostData = function(){
        $http.get('http://127.0.0.1:8001/post/').then(function(response) {
            self.fashions = response.data;
        });
      }

    };


    // preview data
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
 

  $scope.h_1 = "I guess you will ❤️...";

  }

  // $scope.PostData = function(){
  //   $http.get('http://34.80.200.205/post/').then(function(response) {
  //       self.fashions = response.data;
  //     });
  // }

  // sidebar
  $scope.openNav = function(){
    document.getElementById("mySidenav").style.width = "250px";
  }

  $scope.closeNav = function(){
    document.getElementById("mySidenav").style.width = "0px";
  }

  }

  });


