var srModule = angular.module("otherIssuesModule", []);

var scope;

var http = null;



srModule.controller("otherIssuesCtrl", function ($scope, $http) {

	$scope.currentTab="notify";

    $scope.changeFacility=function(){

        $scope.facilityName=$("#selectedFacility :selected").text();

    } 

    $scope.otherIssuesSubmit = function(otherIssuesForm) {

      if(otherIssuesForm.$invalid )
      {

         $scope.submitted = true;
         return;
     }else{

         console.log("closureFacility---------");
         var closureFacility;
         
         var data = {facilityId : $scope.otherIssues.facilityId};
         $http.post(routesPrefix+'/otherIssues/checkId',data)
         .success(function(response) {
            console.log(response);
            closureFacility=response;

            
            
            
            console.log(closureFacility[0]._hfname);

            $scope.otherIssues._hfname=closureFacility[0]._hfname;
            $scope.otherIssues.county=closureFacility[0]._county;

            

            $http.post(routesPrefix+'/otherIssues/submit',$scope.otherIssues).success(function(response) {
                console.log(response);
                window.location.href = routesPrefix+"/otherIssue";
            });
        });
     }
 }


 $scope.checkFacility=function (facilityId) {

    var data = {facilityId : facilityId};
    $http.post(routesPrefix+'/otherIssues/checkId',data)
    .success(function(response) {
     console.log(response);
     closureFacility=response;

     return closureFacility;
			
		});

}

http = $http;
scope = $scope;


populateCounties(populateInspectors);

$scope.countyChanged = function() {
  console.log("countyChanged...");
  populateInspectors();    
};

$scope.inspectorChanged = function() {
  console.log("inspectorChanged...");
  
};

});


function populateCounties(callback) {
	http({
		method: "GET",
		url: routesPrefix+"/completejhic/individual/getFilterValues",
	}).then(function mySucces(response) {
		scope.counties = response.data.countyList;
		subCountyList = response.data.subCountyList;
		subCountyList = JSON.parse(subCountyList);
		scope.selectedCounty = scope.counties[0];
		callback();

	}, function myError(response) {
		console.log(response.statusText);
	});
}

function populateInspectors() {
        //populate inspector names dropdown
        http({
        	method: "POST",
        	url: routesPrefix+"/completejhic/individual/getInspectorNames",
        	data: {
        		county : scope.selectedCounty
        	}
        }).then(function mySucces(response) {
        	scope.inspectors = null;
        	scope.selectedInspector = null;
        	scope.inspectors = response.data.inspectors;
        	if(scope.inspectors.length==0) {
        		scope.inspectors.push({name:"All",_id:"All"});
        		scope.selectedInspector = scope.inspectors[0];
        	} else {
        			scope.inspectors.unshift({name:"All",_id:"All"});
        		scope.selectedInspector = scope.inspectors[0];
        	}
        	

        }, function myError(response) {
        	console.log(response.statusText);
        });
    }

