var icModule = angular.module("inspectionProgressDataBankModule", []);
var data = [];
var scope;

var oTable = null;
var http = null;
var subCountyList;

icModule.controller("inspectionProgressDataBankController", function ($scope, $http) {
    http = $http;
    scope = $scope;
   
    console.log("onFilterChange..");
   
    inspectionProgressPopulateCounties();

});


function inspectionProgressPopulateCounties(callback) {
    http({
        method: "GET",
        url: routesPrefix+"/inspectionprogress/table/getFilterValues",
    }).then(function mySucces(response) {
        scope.counties = response.data.countyList;
        subCountyList = response.data.subCountyList;

        subCountyList = JSON.parse(subCountyList);
        scope.selectCounty = scope.counties[0];
        inspectionProgressCountyChnaged();
    }, function myError(response) {


    });
}

function inspectionProgressCountyChnaged() {
    scope.subCounties = [{"key":"All","value":"All"}];
    var arr = [];
    var county = $("#countyDropdown :selected").text();


    if(county=="" || county==null) {
        county = "All";
    }
    if(county=="All") {
        for (var c in subCountyList) {
                //scope.subCounties.concat(subCountyList[c]);
                var list = subCountyList[c];
                for(i in list) {
                    scope.subCounties.push(list[i]);
                }
            }
        } else {
            var list = subCountyList[county];
            for(i in list) {
                scope.subCounties.push(list[i]);
            }
        }
        scope.selectSubCounty = scope.subCounties[0];
        
        
    }

   
