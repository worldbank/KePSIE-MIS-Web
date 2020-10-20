var srModule = angular.module("JHICDataBankModule", []);
var hfLevelData = [];
var scope;
var oTable = null;
var http = null;

srModule.controller("JHICDataBankController", function ($scope, $http) {
    var d = new Date();
  $scope.inspectors = [];
    http = $http;
    scope = $scope;
 
$('.bs-select').selectpicker('val', ['All']);
   

    scope.hfLevelCountyChanges = function() {
        jhicDataBankCountyChanged();
    }

    populateCounties(jhicDataBankCountyChanged);
    
    function populateCounties(callback) {
        http({
            method: "GET",
            url: routesPrefix+"/completejhic/individual/getFilterValues",
        }).then(function mySucces(response) {
            scope.counties = response.data.countyList;
             scope.ownerships = response.data.ownershipList;
            scope.levels = response.data.levelList;
            subCountyList = response.data.subCountyList;
            subCountyList = JSON.parse(subCountyList);
            scope.selectCounty = scope.counties[0];
              scope.selectOwnership = scope.ownerships[0];
            scope.selectLevel = scope.levels[0];
           callback();
        }, function myError(response) {
            console.log(response.statusText);
        });
    }

   function jhicDataBankCountyChanged() {
   
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


$scope.exportExcel=function(){

    $("#dataBankForm").submit();
}

});


