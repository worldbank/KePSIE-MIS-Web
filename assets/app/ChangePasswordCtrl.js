var app = angular.module('changePasswordApp',['ngMessages']);

app.controller('changePasswordCtrl', function($scope, $http) {

$scope.changePassword = function(changePasswordForm) {
 
  if(changePasswordForm.$invalid)
  {

    $scope.submitted = true;
    return;
  }else{
    if($scope.newPassword!=$scope.confirmPassword){
      $scope.invalidPassword=true;
    }else{
      var data = {username : $scope.email, password : $scope.oldPassword};
    var config = "";
    console.log("inside myctrl");
    $http.post(routesPrefix+'/authenticate', data, config)
    .success(function (data) {
      console.log("in changePassword");
      console.log(data);
      if(data.Auth[0].valid=="Yes"){
        var id=data.Auth[1].id;
        var user=data.Auth[1];
        user.password=$scope.newPassword;

       // var user={id:data.Auth[1].id,password:$scope.newPassword};
       $http.post(routesPrefix+'/user/updatePassword',user)
      .success(function(response) {
        console.log("changed");
        console.log(response);
        window.location.href = routesPrefix+"/user/all";
      });
      
        //  $.cookie("username",data.Auth[1].name);
        //    $.cookie("id",data.Auth[1].id);
        //window.location.href = "/dashboard";
      }
      else{

        $scope.invalid = true;
        $scope.submitted = false;
        
        $scope.oldPassword=null;
        
        $scope.loginForm.password.$touched = false;

        
      }
    });
    }
  }
}


});

