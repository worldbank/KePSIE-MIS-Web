
var srModule = angular.module("qcReportsTableModule", []);
var headerData = [];
var subHeaderData = [];
var summaryData = [];
var scope;
var http = null;
var oTables = [];
var data4excel=[];

srModule.controller("qcReportsTableCtrl", function ($scope, $http) {
  http = $http;
  scope = $scope;

  populateCounties(populateInspectionPeriod);

  
  $scope.countyChanged = function() {
    console.log("countyChanged...");

    populateInspectors(populateInspectionPeriod);
   

  };


  $scope.filterChanged=function(){

   console.log("check jay here4444444444444");
   console.log($("#indDropdown").val());
   onFilterChange();


 };

 $scope.indicatorChanged=function(){

  var indicatorList=$("#indDropdown").val();
  if($("#indDropdown").val()==null){
     
      $("#errorMsg1").show();
    }else{
    
      $("#errorMsg1").hide();
    }

  if( indicatorList.indexOf("JHIC Discrepancies")!=-1 && indicatorList.length==1){


   $("#countyDropdown option[value='By County']").remove();
   $("#countyDropdown").val("All");
   scope.selectedCounty.value="All";


    $scope.selectedJHICDiscrepancies=true;
    $(".col-md-3").addClass("col-md-4");
    $(".col-md-3").removeClass("col-md-3");
    $(".col-sm-3").addClass("col-sm-4");
    $(".col-sm-3").removeClass("col-sm-3");


    $(".col-md-1").addClass("col-md-2");
    $(".col-md-1").removeClass("col-md-1");
    $(".col-sm-1").addClass("col-sm-2");
    $(".col-sm-1").removeClass("col-sm-1");

    $(".newRow").addClass("row");
    $(".removeRow").removeClass("row");

    populateInspectors(onFilterChange);

  }else{
     $scope.selectedJHICDiscrepancies=false;

    
    if($("#countyDropdown").find("option[value='By County']").html()==undefined){

       $("#countyDropdown option").eq(1).before($("<option></option>").val("By County").text("By County"));


    }

    
      console.log("select value");
     console.log( $("#countyDropdown").find("option[value='By County']").html() );



     $(".col-md-4").addClass("col-md-3");
            $(".col-md-4").removeClass("col-md-4");
             $(".col-sm-4").addClass("col-sm-3");
            $(".col-sm-4").removeClass("col-sm-4");

             $(".col-md-2").addClass("col-md-1");
            $(".col-md-2").removeClass("col-md-2");
             $(".col-sm-2").addClass("col-sm-1");
            $(".col-sm-2").removeClass("col-sm-2");

            $(".newRow").removeClass("row");
            $(".removeRow").addClass("row");

  onFilterChange();
}


}

function populateCounties(callback) {
  http({
    method: "GET",
    url: routesPrefix+"/qualitychecks/figure/getFilterValues",
  }).then(function mySucces(response) {




    scope.counties = response.data.countyList;

    scope.selectedCounty = scope.counties[0];



    callback(onFilterChange);

  }, function myError(response) {
    console.log(response.statusText);
  });
}


      function populateInspectors(callback) {
        //populate inspector names dropdown
        http({
          method: "POST",
          url: routesPrefix+"/inspectionplanning/getInspectorNames",
          data: {
            county : scope.selectedCounty
          }
        }).then(function mySucces(response) {
          $scope.inspectors = null;
          $scope.selectedInspector = null;
          $scope.inspectors = response.data.inspectors;
          if($scope.inspectors.length==0) {
            $scope.inspectors.push({name:"All",_id:"All"});
            $scope.selectedInspector = $scope.inspectors[0];
          } else {
            if($scope.inspectors.length>1)
              $scope.inspectors.unshift({name:"All",_id:"All"});
            $scope.selectedInspector = $scope.inspectors[0];
          }


          callback(onFilterChange);




        }, function myError(response) {
          console.log(response.statusText);
        });
      }





function populateInspectionPeriod(callback) {
        //populate inspector names dropdown
        console.log("populateInspectionPeriod==============");
        console.log(scope.selectedCounty);
        
        http({
          method: "POST",
          url: routesPrefix+"/inspectionplanning/inspectionPeriods",
          data: {
           county : scope.selectedCounty,
           inspector : {name: "All", _id: "All"},
         }
       }).then(function mySucces(response) {
        console.log("inspection periods");

        console.log(response.data.inspectionPeriods);
        var inspPeriods = response.data.inspectionPeriods;
        var inspPeriodArr = [];
        var period = {};
        period.key = "All";
        period.value = "All";
        inspPeriodArr.push(period);
        for(i=0;i<inspPeriods.length;i++) {
          var period = {};
          period.key = inspPeriods[i];
          period.value = inspPeriods[i];
          inspPeriodArr.push(period);
        }
        scope.inspPeriods = inspPeriodArr;
        scope.selectedInspPeriod = scope.inspPeriods[0];

        callback();


      }, function myError(response) {
        console.log(response.statusText);
      });
     }



    /*  function populateIndicators(callback) {
          var indicator = {};
          var indicators = [];
          indicator.key = "All";
          indicator.value = "All";
          indicators.push(indicator);

          var ind1 = {};
          ind1.key = "JHIC Discrepancies";
          ind1.value = "JHIC Discrepancies";

          var ind2 = {};
          ind2.key = "Scorecard Non-Adherence";
          ind2.value = "Scorecard Non-Adherence";

        

          indicators.push(ind1);
          indicators.push(ind2);
          
        

         


        var ind1 = {};
        ind1.key = "Facility Closure Non-Adherence";
        ind1.value = "Facility Closure Non-Adherence";

        var ind2 = {};
        ind2.key = "Pharmacy Closure Non-Adherence";
        ind2.value = "Pharmacy Closure Non-Adherence";

        var ind3 = {};
        ind3.key = "Lab Closure Non-Adherence";
        ind3.value = "Lab Closure Non-Adherence";

        var ind4 = {};
        ind4.key = "Radiology Closure Non-Adherence";
        ind4.value = "Radiology Closure Non-Adherence";

        var ind5 = {};
        ind5.key = "Nutrition Closure Non-Adherence";
        ind5.value = "Nutrition Closure Non-Adherence";

        indicators.push(ind1);
        indicators.push(ind2);
        indicators.push(ind3);
        indicators.push(ind4);
        indicators.push(ind5);

        scope.indicators = indicators;
          scope.selectedIndicator = scope.indicators[0];
            $("#indDropdown").selectpicker('val', ['All']);
        
          callback();

      }
  
      */







      function onFilterChange() {

        console.log("inside onFilterChange-------");

        console.log($("#countyDropdown").val()+"=========="+ scope.selectedInspPeriod.value);


        var indicatorList=$("#indDropdown").val();
        console.log(indicatorList);
        console.log(scope.selectedInspector);

        http({
          method: "POST",
          url: routesPrefix+"/qualitychecks/reports/table/getData",
          data: {
            county: scope.selectedCounty.value,
            inspPeriod: scope.selectedInspPeriod.value,
            indicator: indicatorList,
            inspector: scope.selectedInspector
          }
        }).then(function mySucces(response) {

          $("#summaryReportTable1").html("");
          $("#summaryReportTable2").html("");
          $("#summaryReportTable3").html("");
          $("#summaryReportTable4").html("");
          $("#countyHeader1").hide();
          $("#countyHeader2").hide();
          $("#countyHeader3").hide();
          $("#countyHeader4").hide();
          $("#summaryReportTable1").hide();
          $("#summaryReportTable2").hide();
          $("#summaryReportTable3").hide();
          $("#summaryReportTable4").hide();

         
          data4excel=response.data.QualityReportResponse;
          scope.dataExcel={excelData:data4excel};


            //single table
            $("#summaryReportTable1").show();
            var headerData = response.data.QualityReportResponse[0].headerData;
            var subHeaderData = response.data.QualityReportResponse[0].subHeaderData;
            var summaryData = response.data.QualityReportResponse[0].summaryData;


            console.log("Table data here----------");

            console.log(headerData);
            console.log(subHeaderData);
            console.log(summaryData)





            for(i in oTables) {
              var oTable = oTables[i];
              if (oTable != null) {
                oTable.fnClearTable();
                oTable.fnDestroy();
                oTable = null;
              }
            }
            prepareHeader(headerData, subHeaderData, "summaryReportTable1");

            if($("#hfUnitDropdown").val()!=1){
              prepareBody(summaryData, subHeaderData, "summaryReportTable1",function(){ prepareFooter("summaryReportTable1")});
            } else{
             prepareFooter("summaryReportTable1");
             $('body > a:first').remove();
           }
          //   prepareFooter(footData, "summaryReportTable1");



          scope.tableHTML = $("#summaryReportDiv").html();

          if(scope.selectedCounty.value!="By County"){

            $(".table-scrollable").removeClass("table-scrollable");
            $("#summaryReportTable1").css("width","60%");
            $("#summaryReportTable1").css("margin","auto");

          }else{
           $("#summaryReportTable1").css("width","100%");
           $(".table").css("width","100%");
         }

         if ($(".table-scrollable")[0]){
          $(".countyHeader").addClass("countyHeaderMargin");
        } else {
          $(".countyHeader").removeClass("countyHeaderMargin");
        }

      }, function myError(response) {
        console.log(response.statusText);
      });

      }

      function prepareHeader(headerData, subHeaderData, tableId) {
        var headerHTML = '<thead>';
        headerHTML = headerHTML + '<tr>';
        headerHTML = headerHTML + '<th colspan="1" rowspan="2">Section</th>';

        for (j in headerData) {
          headerHTML = headerHTML + '<th colspan="2" style="text-align: center;">' + headerData[j].title + '</th>';

        }

        headerHTML = headerHTML + '</tr>';
        headerHTML = headerHTML + '<tr>';
        if( $("#hfUnitDropdown").val()!=1){
          headerHTML = headerHTML ;
        } else{
          headerHTML = headerHTML + '<th colspan="1"></th>';
        }
        for (i in subHeaderData) {
          headerHTML = headerHTML + '<th style="text-align: center;">' + subHeaderData[i].title + '</th>';
        }
        headerHTML = headerHTML + '</tr><div id="replace">';
        $("#"+tableId).html(headerHTML);
      }

      function prepareBody(summaryDataOrig, subHeaderData, tableId,callback) {
        var summaryData = summaryDataOrig;
        var centerColNums = [];
        for (j in subHeaderData) {
          centerColNums.push(parseInt(j) + 1);
        }

        var oTable = $('#'+tableId).dataTable({
          data: summaryData,
        //columns : subHeaderData,
        "paging": false,
        "ordering": false,
        "info": false,
        "bAutoWidth": false,
        "searching": false,
        "aoColumnDefs": [
        {
         className: "centerCell", "targets": centerColNums,
         "defaultContent": "",
         "mRender": function (data, type, full) {
          if(data.indexOf("%")==-1){
            if(isNaN(data)){
              return "N/A";
            }else{
             return Math.round(data);
           }
         } else{
          var score= data.split("%");
          if(isNaN(score[0])){
            return "N/A";
          }else{
           return  Math.round(score[0]).toString()+"%";
         }
       }

     }

   }],
 });
        oTables.push(oTable);

        callback();
      }

      function prepareFooter(tableId) {
        var footerHTML = '</div>';


        footerHTML = footerHTML + '<tr class="sectionNote "><td colspan="12" style="font-weight: normal;font-size: 11px !important;">Note: N/A is used to indicate when information is not available, because the health facility does not have that particular unit/service. </td></tr></tfoot>';
        $("#"+tableId).append(footerHTML);
      }

    });