
var srModule = angular.module("qcPlanTableModule", []);
var visitPlanData = [];
var inspProgressData = [];
var scope;
var oTable1 = null;
var oTable2 = null;
var http = null;
var hideInspector = false;



srModule.controller("qcPlanTableCtrl", function ($scope, $http) {

    $scope.inspectors = [];
    http = $http;
    scope = $scope;
    $scope.inspPeriods = [];

    
    scope.selectedCounty = "All";
     //scope.selectedInspector = "All";
     populateCounties(populateQualityOfficer);
     
     $scope.countyChanged = function() {
        
        populateQualityOfficer(populateInspectionPeriod)    
    };

    $scope.filterChanged = function() {
        
        populateInspectionPeriod();
        
    };

    $scope.exportExcel = function() {

        $("#visitPlanDataBankForm").submit();
    };

    

    function populateCounties(callback) {


        http({
            method: "GET",
            url: routesPrefix+"/inspectionplanning/getFilterValues",
        }).then(function mySucces(response) {
            scope.counties = response.data.countyList;
            
            scope.selectedCounty = scope.counties[0];
            callback(populateInspectionPeriod);
            
        }, function myError(response) {
            console.log(response.statusText);
        });
    }

    function populateQualityOfficer(callback) {

        http({
            method: "POST",
            url: routesPrefix+"/qualitychecks/getQualityOfficersNames",
            data: {
                county : scope.selectedCounty
            }
        }).then(function mySucces(response) {

         
            scope.officers = null;
            scope.selectedOfficer = null;
            scope.officers = response.data.Officers;
            if(scope.officers.length==0) {
                scope.officers.push({name:"All",_id:"All"});
                scope.selectedOfficer = scope.officers[0];
            } else {
             
                scope.officers.unshift({name:"All",_id:"All"});
                
                scope.selectedOfficer = scope.officers[0];
            }
            
            
            
            callback();
            

            
        }, function myError(response) {
            console.log(response.statusText);
        });
    }

    function populateInspectionPeriod(callback) {
        //populate inspector names dropdown

          console.log("test Here.....")


        console.log(scope.selectedCounty);
        console.log(scope.selectedOfficer);
        
        http({
            method: "POST",
            url: routesPrefix+"/inspectionplanning/inspectionPeriods",
            data: {
             county : scope.selectedCounty,
             inspector : scope.selectedOfficer,
         }
     }).then(function mySucces(response) {
         
        var inspPeriods = response.data.inspectionPeriods;


        console.log(inspPeriods);


        var inspPeriodArr = [];
        var period = {};
        period.key = "All";
        period.value = "All";
        inspPeriodArr.push(period);
        for(i=0;i<inspPeriods.length;i++) {
            var period = {};
            period.key = i;
            period.value = inspPeriods[i];
            inspPeriodArr.push(period);
        }

        $scope.inspPeriods = inspPeriodArr;
        $('.bs-select').selectpicker('refresh');
        
        
    }, function myError(response) {
        console.log(response.statusText);
    });
 }

    //pdf filter


    scope.county_name ="All";
    


    function populateCountiesPdf(callback) {
        http({
            method: "GET",
            url: routesPrefix+"/inspectionplanning/getFilterValues",
        }).then(function mySucces(response) {
            scope.countiesPdf = response.data.countyList;

            

            scope.county_name = scope.countiesPdf[0];
            
            callback(populateInspectionPeriodPdf);
            
        }, function myError(response) {
            console.log(response.statusText);
        });
    }


    function populateQualityOfficerPdf(callback) {


        http({
            method: "POST",
            url: routesPrefix+"/qualitychecks/getQualityOfficersNames",
            data: {
                county : scope.county_name
            }
        }).then(function mySucces(response) {

         
            scope.officersPdf = null;
            scope.selectedOfficerPdf = null;
            scope.officersPdf = response.data.Officers;
            if(scope.officersPdf.length==0) {
                scope.officersPdf.push({name:"All",_id:"All"});
                scope.selectedOfficerPdf = scope.officersPdf[0];
            } else {
             
                scope.officersPdf.unshift({name:"All",_id:"All"});
                
                scope.selectedOfficerPdf = scope.officersPdf[0];
            }
            
            http({
              method: "POST",
              url: routesPrefix+"/qualitychecks/getFacilityList",
              data: {
                county : scope.county_name,
                officer : scope.selectedOfficerPdf
            }
        }).then(function mySucces(responseFacilityList) {

          console.log("responseFacilityList");

          $("#facilityList").select2('val', '')

          $('#facilityList').find('option').remove().end();


          console.log(responseFacilityList.data.facilityList);

          var facilityList=responseFacilityList.data.facilityList;

          for(var i=0;i< facilityList.length;i++){ 



            $('#facilityList').append($('<option>', {value:facilityList[i]._hfid, 
              text:facilityList[i]._hfname}));

        }
        
        
        callback();

    });
        

        
    }, function myError(response) {
        console.log(response.statusText);
    });
    }


    function populateInspectionPeriodPdf(callback) {
        //populate inspector names dropdown
        
        http({
            method: "POST",
            url: routesPrefix+"/inspectionplanning/inspectionPeriods",
            data: {
             county : scope.county_name,
             inspector : scope.selectedOfficerPdf,
         }
     }).then(function mySucces(response) {
        
        var inspPeriodsPdf = response.data.inspectionPeriods;
        var inspPeriodArr = [];
        var period = {};
        period.key = "All";
        period.value = "All";
        inspPeriodArr.push(period);
        for(i=0;i<inspPeriodsPdf.length;i++) {
            var period = {};
            period.key = i;
            period.value = inspPeriodsPdf[i];
            inspPeriodArr.push(period);
        }

        scope.inspPeriodsPdf = inspPeriodArr;
        $('.bs-select').selectpicker('refresh');
        
        
    }, function myError(response) {
        console.log(response.statusText);
    });
 }

 populateCountiesPdf(populateQualityOfficerPdf);
 
 $scope.countyChangedPdf = function() {
   
    populateQualityOfficerPdf(populateInspectionPeriodPdf)    
};

$scope.filterChangedPdf = function() {
  
  http({
      method: "POST",
      url: routesPrefix+"/qualitychecks/getFacilityList",
      data: {
        county : scope.county_name,
        officer : scope.selectedOfficerPdf
    }
}).then(function mySucces(responseFacilityList) {

  console.log("responseFacilityList");

  $("#facilityList").select2('val', '')

  $('#facilityList').find('option').remove().end();


  console.log(responseFacilityList.data.facilityList);

  var facilityList=responseFacilityList.data.facilityList;

  for(var i=0;i< facilityList.length;i++){ 



    $('#facilityList').append($('<option>', {value:facilityList[i]._hfid, 
      text:facilityList[i]._hfname}));

}


populateInspectionPeriodPdf();

});

};


});


