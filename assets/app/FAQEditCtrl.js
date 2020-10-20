var app = angular.module('editFAQApp',['angularTrix']);

app.controller('editFAQCtrl', function($scope, $http,$location) {
  
  var url=$location.absUrl().split("/");
  var id=url.pop();
  $scope.glob=" ";
  
  $http.get(routesPrefix+'/faq/editdata/'+id).success(function (data) {
   //$scope.question=data.question;
   console.log(data);
   var faq=data;
   $scope.faq=faq;
   

});


$scope.saveQuestion = function(faqForm) {

  if(faqForm.$invalid)
  {
 $scope.submitted = true;
    return;
    
  }else{
    

       // var user={id:data.Auth[1].id,password:$scope.newPassword};
       $http.post(routesPrefix+'/faq/update',$scope.faq)
       .success(function(response) {
        console.log("changed");
        console.log(response);
        window.location.href = routesPrefix+"/faq";
      });
     

   }
 

}

  

});





