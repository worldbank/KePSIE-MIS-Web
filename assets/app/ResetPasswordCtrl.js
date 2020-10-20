var app = angular.module('passwordResetApp',['ngMessages']);

app.controller('passwordResetCtrl', function($scope, $http,$location) {

    var url=$location.absUrl().split("id=");
 
    var uid=url[1];

	$scope.resetPassword = function(passwordResetForm) {

  if(passwordResetForm.$invalid)
  {
    $scope.passwordsubmitted = true;
    return;
  }else{
   
   var user={id:uid,password:$scope.newPassword};
   
       $http.post(routesPrefix+'/user/incUpdatePassword',user)
       .success(function(response) {
        console.log("changed");
        console.log(response);
        $('.resetSuccess-form').show();
        $('.passwordReset-form').hide();
        if(response.msg=="resetPassword"){
        	
        	$('#success').hide();
        	$('#fail').show();
        }else{
        	$('#success').show();
        	$('#fail').hide();
        }
       // window.location.href = "/user/all";
      });
     

   }
 }
});
app.directive('compareTo', function() {
  return {
    require: "ngModel",
    scope: {
      otherModelValue: "=compareTo"
    },
    link: function(scope, element, attributes, ngModel) {

      ngModel.$validators.compareTo = function(modelValue) {
       

        return modelValue == scope.otherModelValue;
      };

      scope.$watch("otherModelValue", function() {
        ngModel.$validate();
      });
    }
  };
});
