var srModule = angular.module("completeJHICAggregateModule", []);
var http;
var scope;
var subCountyList;

srModule.controller("completeJHICAggregateController", function ($scope, $http) {
  http = $http;
  scope = $scope;
  $scope.currentReport = "Overview";
  populateFilterValues();

    //bind angular events here
    function bindListeners() {
      $scope.filterChanged = function() {
        console.log("filterChanged...");
        populateAggregateData();
      };
      $scope.countyChanged = function() {
        console.log("countyChanged...");
        populateSubCounties();
        populateAggregateData();
      };
      $scope.changeReport = function(report) {
        if(scope.currentReport==report)
          return;
        if(report=="Overview") {
          $("#overviewBtn").addClass("selectBtnStyle");
          $("#overviewBtn").removeClass("normalBtnStyle");
          $("#completeBtn").addClass("normalBtnStyle");
          $("#completeBtn").removeClass("selectBtnStyle");
          scope.currentReport = "Overview";
          $("#sec2to13").hide();
          $("#charts").show();
        } else {
          $("#overviewBtn").addClass("normalBtnStyle");
          $("#overviewBtn").removeClass("selectBtnStyle");
          $("#completeBtn").addClass("selectBtnStyle");
          $("#completeBtn").removeClass("normalBtnStyle");
          scope.currentReport = "Complete";
          $("#sec2to13").show();
          $("#charts").hide();
        }
      };
      $scope.createJHICAggregateExcel = function() {
        /*var svg1 = $('#figure1').highcharts().getSVG();
        var svg2 = $('#figure2').highcharts().getSVG();
        console.log("svg1 : "+svg1);
        console.log("svg2 : "+svg2);
        $("#figure1SVG").val(svg1);
        $("#figure2SVG").val(svg2);*/
        $("#reportExcelForm").submit();
      };
      $scope.createJHICAggregatePDF = function() {
        showAll();
        var reportHTML = $("#reportRow").html();
        var reportCSS = $("#reportStyleDiv").html();
        reportHTML = reportHTML.replace(/\n|\t/g, ' ');
        $("#reportHTML").val(reportHTML);
        $("#reportPDFForm").submit();
      };
    };

    //populate all the filter values
    function populateFilterValues(callback) {
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

        populateSubCounties();
        bindListeners();
        populateAggregateData();
      }, function myError(response) {
        console.log(response.statusText);
      });
    }

    //populate sub counties
    function populateSubCounties() {
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

    //populate report data based on filters
    function populateAggregateData() {
      http({
        method: "POST",
        url: routesPrefix+"/completejhic/aggregate/getData",
        data: {
          county: scope.selectCounty.value,
          subCounty: scope.selectSubCounty.value,
          ownership: scope.selectOwnership.value,
          level: scope.selectLevel.value,
        }
      }).then(function mySucces(response) {
        console.log("observations : "+response.data.observations);
        scope.observations = response.data.observations;


        scope.score = response.data.score;


        console.log(scope.score);

        scope.total_ms=0;
        scope.total_os=0;


        if(scope.score!=undefined){

          $("#reportContainer").show();
          $("#noData").hide();

          for(var i=2;i<=13;i++){
           if(scope.score["s"+i+"_ms"]!=undefined){

            scope.total_ms+=scope.score["s"+i+"_ms"];
          }
          if(scope.score["s"+i+"_os"]!=undefined){

           scope.total_os+=scope.score["s"+i+"_os"];
         }
       }
       for(var i=2;i<=13;i++){
         if(scope.score["s"+i+"_ms"]==undefined) {
          scope.score["s"+i+"_ms"]="N/A";
          $("#s"+i).hide();
        }else{
          scope.score["s"+i+"_ms"]=scope.score["s"+i+"_ms"].toFixed(2);
          $("#s"+i).show();

        }
        if(scope.score["s"+i+"_os"]==undefined) {
          scope.score["s"+i+"_os"]="N/A";
        }else{
          scope.score["s"+i+"_os"]=scope.score["s"+i+"_os"].toFixed(2);

        }

        if(scope.score["s"+i+"_ps"]==undefined) {
          scope.score["s"+i+"_ps"]="N/A";
        }else{
         scope.score["s"+i+"_ps"]=scope.score["s"+i+"_ps"].toFixed(2)+"%";
       }
     }
   }else{
    $("#reportContainer").hide();
    $("#noData").show();

    scope.total_ms="N/A";
    scope.total_os="N/A";

    scope.score={};

    for(var i=2;i<=13;i++){
      scope.score["s"+i+"_ms"]="N/A";
      scope.score["s"+i+"_os"]="N/A";

    }
  }
  scope.total_ps=(scope.total_os*100)/( scope.total_ms);

          }, function myError(response) {
            console.log(response.statusText);
          });
    }
  });
