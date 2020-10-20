var app = angular.module('userViewApp',['ngMessages']);

app.controller('userViewCtrl', function($scope, $http,$location) {


 var url=$location.absUrl().split("/");
 var id=url.pop();
 $scope.glob=" ";
 var data = {id : id};
 $http.post(routesPrefix+'/user/viewdata', data).success(function (data) {
   $scope.glob=data.email;
   console.log(data);
   var user=data;
   if(user.file==undefined && (!user.file)){
    
     $("#viewImg").attr("src",routesPrefix+'/images/profilephoto.png');
   }
  if(user.contactno==undefined){
    $scope.hideContact=true;
   }
   
   if(user.organization=="other"){

    user.organization=user.otherOrganization;
    
  }else{

   user.otherOrganization=" ";
 }
 $scope.user=data;

 var nationalUser=[
 'Admin','Report Viewer(National)','B&Cs - ITEG','B&Cs - Licensing decision-makers',
 'B&Cs - Other B&Cs members','MOH Coordinator','WB -Supervisors','WB - HIA Team',
 'WB - Research team','High-level - KTF, WB','Steering Committee','Logistics Firm'];


 if(nationalUser.indexOf($scope.user.role)!=-1){

  $scope.reportViewer = true;
  $scope.user.county=" ";
}else{
 $scope.reportViewer = false;
}
if($scope.user.role=="Inspector"){
  $scope.showInspectorId = true;
}else{
 $scope.showInspectorId = false;
 $scope.user.inspectorId=" ";
}

if($scope.user.filename && $scope.user.filename!=undefined){

 // $("#removeImg").removeClass("fileinput-exists");
}


$scope.profilechangePassword = function(profilechangePasswordForm) {
  var uid=$("#uid").val();
  var uemail=$("#uemail").val();

  if(profilechangePasswordForm.$invalid)
  {

    $scope.passwordsubmitted = true;
    return;
  }else{
    if($scope.newPassword!=$scope.confirmPassword){
      $scope.invalidPassword=true;
    }else{
      var data = {username : uemail, password : $scope.oldPassword};
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

          $http.post(routesPrefix+'/user/updatePassword',user)
          .success(function(response) {
            console.log("changed");
            console.log(response);
            window.location.href = routesPrefix+"/user/profile";
          });

        }
        else{

      //  $scope.invalid = true;
      $scope.passwordsubmitted = false;

      $scope.oldPassword=null;
      $scope.invalidPassword=true;
      $scope.profilechangePasswordForm.oldPassword.$touched = false;


    }
  });
    }
  }
}


});


});
app.directive('cmprTo', function() {
  return {
    require: "ngModel",
    scope: {
      otherModelValue: "=cmprTo"
    },
    link: function(scope, element, attributes, ngModel) {

      ngModel.$validators.cmprTo = function(modelValue) {
        console.log("model");
        console.log(modelValue);

        return modelValue == scope.otherModelValue;
      };

      scope.$watch("otherModelValue", function() {
        ngModel.$validate();
      });
    }
  };
});


app.controller('viewChangeImageCtrl', function($scope, $http) {


  $scope.changePhoto=function(){

    console.log("changePhoto click");
    var file = $scope.newFile;
    console.log(file);
    console.log("file is " );
    console.dir(file);





    if(file==undefined || file.type.split('/')[0]=='image'  )

    {
     $scope.fileType = false;
   }else{
    $scope.fileType = true;
   }

 }

;
$scope.removePhoto=function(){
  
  var uid=$("#uid").val();
  var tmp={id:uid,path:"",filename:""};
    console.log("tmp");
    console.log(tmp);

 

    $http.post(routesPrefix+'/user/updateProfilePic',tmp)
    .success(function(response) {

      console.log(response);

      location.reload();

    });
  

 }




 $scope.changeImage=function(){
  var uid=$("#uid").val();

  var file = $scope.newFile;
  console.log(file);
  console.log("file is " );
  console.dir(file);
  console.log($scope.newFile.name);

  if($scope.fileType )
  {

    
    return;
  }else{

  var path=$scope.newFile.name;


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

    console.log("change image user");
    console.log(res);

    var tmp={id:uid,path:res.path,filename:res.filename};
    console.log("tmp");
    console.log(tmp);

 

    $http.post(routesPrefix+'/user/updateProfilePic',tmp)
    .success(function(response) {

      console.log(response);

      location.reload();

    });


  }); 
  }    
};
});

app.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function(){
        scope.$apply(function(){
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);