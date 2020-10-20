var app = angular.module('uploadDataApp',[]);

 app.controller('uploadDataCtrl', function($scope, $http) {

$scope.uploadData=function(){



 if($scope.myFile!=undefined)

    {
      
      var file = $scope.myFile;
      console.log(file);
      console.log("file is " );
      console.dir(file);
      console.log($scope.myFile.name);

      var path=$scope.myFile.name;
      var uploadUrl = routesPrefix+"/user/upload";
      var pth;
      
      var fd = new FormData();
      fd.append('file', file);
      console.log("fd");
      console.log(fd);
      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      })
      .success(function(res){

       
      });          
    }else{
    }
}
 });
