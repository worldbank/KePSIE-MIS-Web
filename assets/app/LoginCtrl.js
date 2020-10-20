var app = angular.module('myApp',['ngMessages']);

app.controller('myCtrl', function($scope, $http) {

	$scope.closeAlert=function(){
		$scope.invalid = false;
	}

	$scope.login = function() {
		$("#tmpfocus").focus();
		$scope.invalid = false;
		 if($scope.username== undefined || $scope.password== undefined ){  
		$scope.submitted = true;
		   }
		   else{

		var data = {username : $scope.username, password : $scope.password};
		var config = "";
		console.log("inside myctrl");
		$http.post(routesPrefix+'/authenticate', data, config)
		.success(function (data) {
			console.log(data);
			if(data.Auth[0].valid=="Yes"){
			
				//  $.cookie("username",data.Auth[1].name);
				//    $.cookie("id",data.Auth[1].id);
				window.location.href = routesPrefix+"/dashboard";
			}
			else{

				
				$scope.submitted = false;
				$scope.password=null;	
				$scope.loginForm.password.$touched = false;
				$scope.invalid = true;
			
			}
		});
	}
	}

	$scope.forgetPassword=function(emailForm){
		
  if(emailForm.$invalid)
  {

    $scope.emailsubmitted = true;
    return;
}else{

	     	 jQuery('.emailstatus-form').show();
	     	  jQuery('.forget-form').hide();
	     	   jQuery('.login-form').hide();
	    
		var data = {email : $scope.forgetEmail};
			$http.post(routesPrefix+'/sendEmail', data)
		.success(function (data) {
			
			console.log(data);
			if(data.status=="Email not found"){
				jQuery('#invalidEmail').show();
				jQuery('#validEmail').hide();
				jQuery('#tryagain-btn').show();
				 jQuery('#tryagain-btn').click(function() {
	      	 jQuery('.forget-form').show();
	      	 jQuery('#tryagain-btn').hide();
	      	jQuery('#invalidEmail').hide();
	      });
			}else{
				jQuery('#validEmail').show();
				jQuery('#invalidEmail').hide();
			}
	});
	}

}

});