var srModule = angular.module("inspectorVisitPlanModule", []);
var visitPlanData = [];
var inspProgressData = [];
var scope;
var oTable1 = null;
var oTable2 = null;
var http = null;
var hideInspector = false;



srModule.controller("inspectorVisitPlanCtrl", function ($scope, $http) {

  $scope.inspectors = [];
  http = $http;
  scope = $scope;
  $scope.inspPeriods = [];


  scope.selectedCounty = "All";
     //scope.selectedInspector = "All";
     populateCounties(populateInspectors);
     
     $scope.countyChanged = function() {

      populateInspectors(populateInspectionPeriod)    
    };

    $scope.filterChanged = function() {

      populateInspectionPeriod();

    };

    $scope.export2Excel = function() {


      $("#visitPlanDataBankForm").attr('action',routesPrefix+'/visitPlan/exportDatabank')
      $("#visitPlanDataBankForm").submit();
    };
    $scope.export2Pdf = function() {

      $("#visitPlanDataBankForm").attr('action',routesPrefix+'/visitPlan/exportDatabankPdfMonthlyReport')
      $("#visitPlanDataBankForm").submit();
    };



    function populateCounties(callback) {


      http({
        method: "GET",
        url: routesPrefix+"/inspectionplanning/getFilterValues",
      }).then(function mySucces(response) {
        scope.counties = response.data.countyList;
        subCountyList = response.data.subCountyList;
        subCountyList = JSON.parse(subCountyList);
        scope.selectedCounty = scope.counties[0];
        callback(populateInspectionPeriod);

      }, function myError(response) {
        console.log(response.statusText);
      });
    }

    function populateInspectors(callback) {

      http({
        method: "POST",
        url: routesPrefix+"/inspectionplanning/getInspectorNames",
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
        callback();
      });
    }

    function populateInspectionPeriod(callback) {
        //populate inspector names dropdown

        http({
          method: "POST",
          url: routesPrefix+"/inspectionplanning/inspectionPeriods",
          data: {
           county : scope.selectedCounty,
           inspector : scope.selectedInspector,
         }
       }).then(function mySucces(response) {

        var inspPeriods = response.data.inspectionPeriods;
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

    function populateInspectorsPdf(callback) {
        //populate inspector names dropdown
        http({
          method: "POST",
          url: routesPrefix+"/inspectionplanning/getInspectorNames",
          data: {
            county : scope.county_name
          }
        }).then(function mySucces(response) {
          $scope.inspectorsPdf = null;
          $scope.inspector_name = null;
          $scope.inspectorsPdf = response.data.inspectors;
          console.log("$scope.inspectorsPdf");
          console.log($scope.inspectorsPdf);

          if($scope.inspectorsPdf.length==0) {
            $scope.inspectorsPdf.push({name:"All",_id:"All"});
            $scope.inspector_name = $scope.inspectorsPdf[0];
          }else{
           $scope.inspectorsPdf.unshift({name:"All",_id:"All"});
           $scope.inspector_name = $scope.inspectorsPdf[0];
         }

         
        callback(populateInspectionPeriodPdf);


         /*$(".js-example-basic-multiple").select2({
          ajax: {
        url: routesPrefix+"/inspectionplanning/getFacilityList",
        dataType: 'json',
        type: 'POST',
        data: function(term, page) {
            return {
                county : scope.county_name,
                inspector : scope.inspector_name
            };
        },
        results: function(responseFacilityList) {
          var facilityList=responseFacilityList.data.facilityList;
          console.log(responseFacilityList);
            return {
                results: facilityList._hfid
            };
        }
    },
         });*/
                $('.bs-select').selectpicker('refresh');
        http({
          method: "POST",
          url: routesPrefix+"/inspectionplanning/getFacilityList",
          data: {
            county : scope.county_name,
            inspector : scope.inspector_name
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
           inspector : scope.inspector_name,
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
      }, function myError(response) {
        console.log(response.statusText);
      });
     }

     populateCountiesPdf(populateInspectorsPdf);
    // populateInspectionPeriodPdf();
     
     $scope.countyChangedPdf = function() {

      populateInspectorsPdf(populateInspectionPeriodPdf)    
    };

    $scope.filterChangedPdf = function() {

      $('#facilityList').find('option').remove().end();
       $("#facilityList").select2('val', '')


      http({
        method: "POST",
        url: routesPrefix+"/inspectionplanning/getFacilityList",
        data: {
          county : scope.county_name,
          inspector : scope.inspector_name
        }
      }).then(function mySucces(responseFacilityList) {

        console.log("responseFacilityList--------");

        console.log(responseFacilityList.data.facilityList);

        var facilityList=responseFacilityList.data.facilityList;

        for(var i=0;i< facilityList.length;i++){ 

          $('#facilityList').append($('<option>', {value:facilityList[i]._hfid, 
            text:facilityList[i]._hfname}));

        }
      });

    };

  });


srModule.directive('selectpicker', function($timeout)
{
  return {
    restrict: 'E',
    replace:true, 
    scope: {
      selected: '=',
      array: '=',
      class: '='
    }, 
    template: '<select class="bs-select" name="inspPeriod" multiple data-selected-text-format="count" ng-model="inspPeriod" ng-options="period.value for period in array track by period.value">' +
    '</select>',
    replace:true,
    link: function(scope, el, attrs) {

      el.addClass('form-control');
       //   $timeout(function () {

         scope.$watch('array', function (newVal) {

          $(el).selectpicker('refresh');


          $(el).selectpicker('val', ['All']);
          $(el).selectpicker('refresh');

        }, true);     
       //   });
     }           
   };      
 });

srModule.directive('selectpickerPdf', function($timeout)
{
  return {
    restrict: 'E',
    replace:true, 
    scope: {
      selected: '=',
      array: '=',
      class: '='
    }, 
    template: '<select class="bs-select" name="inspPeriod" multiple data-selected-text-format="count" ng-model="inspPeriodPdf" ng-options="period.value for period in array track by period.value">' +
    '</select>',
    replace:true,
    link: function(scope, el, attrs) {

      el.addClass('form-control');
       //   $timeout(function () {

         scope.$watch('array', function (newVal) {

          $(el).selectpicker('refresh');


          $(el).selectpicker('val', ['All']);
          $(el).selectpicker('refresh');


        }, true);     
       //   });
     }           
   };      
 });