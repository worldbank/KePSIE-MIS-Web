var app = angular.module('expertAnsApp',['ngSanitize']);

 app.controller('expertAnsCtrl', function($scope, $http,$parse) {



 //	var taglist=$("#tag").html().split(",");
 	/*var tagElement="";
 	for(var i=0 ; i<taglist.length ;i++){
 tagElement +='<label id="tag" class="btn btn-transparent grey btn-circle btn-sm">'+taglist[i]+'</label>';
 	}*/
 	
 //$("#taglist").html(tagElement);

$scope.ansQuery = function(ansExpertForm) {

  if(ansExpertForm.$invalid)
  {
    $scope.submitted = true;
    return;
  }else{
  	$scope.expert={id:$("#questionid").val(),ans:$scope.answer,status:"Resolved"};
  		console.log($scope.expert);
  	 $http.post(routesPrefix+'/ask/expertAnswer',$scope.expert).success(function(response) {
  	 	window.location.href = routesPrefix+"/ask/askExperts";

  	 	console.log(response);

});
}
}

 $scope.delete=function(){
      $(".deleteAnswer").attr("href", "#deleteConfirmation");
  }




$scope.deleteAnswer=function(questionId,answerId){

	var data={
		questionId:questionId,
		answerId:answerId
	};

	$http.post(routesPrefix+'/ask/deleteAnswer',data).success(function(response) {
  	 	
		window.location.href = routesPrefix+"/ask/viewAnswer/"+questionId;
  	 	console.log(response);
  });
}

$scope.showEditor=function(editorId,editorData){

	
	var id="#ansEditor"+editorId;
	var edit_id="#answer"+editorId;
	
	if ($(id).is(":visible")) {
		$(id).hide();
	} else {
		$(id).show();
	}

	//$(edit_id).val(editorData);
var hideAnswer="#hideAnswer"+editorId;

$(hideAnswer).css("display","none");
	var the_string = 'answer'+editorId;
var model = $parse(the_string);

// Assigns a value to it
model.assign($scope, editorData);
}

$scope.updateAnswer = function(ansExpertForm,id,questionId,answerId) {

	 if(ansExpertForm.$invalid)
  {
    $scope.submitted = true;
    return;
  }else{

  	var modelId = 'answer'+id;
  	var dataAnswer={
  		questionId:questionId,
		  answerId:answerId,
  		answer:$scope[modelId]
  	};
  	$http.post(routesPrefix+'/ask/updateAnswer',dataAnswer).success(function(response) {
    	 	
  		window.location.href = routesPrefix+"/ask/viewAnswer/"+questionId;
    	 console.log(response);

    });
  }
}

});
