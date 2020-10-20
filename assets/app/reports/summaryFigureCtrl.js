var srModule = angular.module("summaryFigureModule", []);
var facilities = [];
var http;
var scope;

srModule.controller("summaryFigureController", function ($scope, $http) {
 http = $http;
 scope = $scope;
 $("#summaryReportFigure1").hide();
 $("#summaryReportFigure2").hide();
 $("#summaryReportFigure3").hide();
 $("#summaryReportFigure4").hide();
 $("#summaryReportFigure5").hide();
 $scope.seriesData = [{"key" : "1", "value" : "% of Facilities by Compliance Category"},
 {"key" : "2", "value" : "Mean Scores"}];
 $scope.typeData = [{"key" : "1", "value" : "All"},{"key" : "2", "value" : "By Level"},
 {"key" : "3", "value" : "By Ownership"}
    // ,{"key" : "4", "value" : "By Risk Category"}
    ];
    $scope.selectedSeries = $scope.seriesData[0];
    $scope.selectedType = $scope.typeData[0];

    populateFilterValues();
  

    //populate all the filter values
    function populateFilterValues() {
      $http({
        method: "GET",
        url: routesPrefix+"/summaryjhic/figure/getFilterValues",
      }).then(function mySucces(response) {
        $scope.counties = response.data.countyList;
        console.log("check here");
        console.log(loggedInUserRole);

        
        $scope.selectedCounty = $scope.counties[0];
        
        $scope.selectedUnit = "All";
        bindListeners();
      }, function myError(response) {
        console.log(response.statusText);
      });
    }

    function bindListeners() {
      $scope.filterChanged = function() {

        if($("#seriesDropdown").val()==2){

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

       }else{

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

       }

       console.log("filterChanged...");

       prepareFigureReport();
     };
     prepareFigureReport();
   }

   function prepareFigureReport() {
    $(".figure").empty();
    $(".figure").removeAttr('data-highcharts-chart');
    console.log("prepareFigureReport...");
    $http({
      method: "POST",
      url: routesPrefix+"/summaryjhic/figure/getData",
      data: {
        series: $scope.selectedSeries.key,
        hfType: $scope.selectedType.key,
        county: $scope.selectedCounty.key,
        unit:   $scope.selectedUnit
      }
    }).then(function mySucces(response) {
      facilities = response.data.seriesArray;
      console.log("seriesArray : "+JSON.stringify(response.data.seriesArray[0]));
      prepareChart(response.data.categoryArray, response.data.seriesArray, response.data.drilldownArray);
    }, function myError(response) {
      console.log(response.statusText);
    });
  }

  function prepareChart(categoryArray, seriesArray, drillDownArray) {
    var unit = "%";

    if($("#seriesDropdown").val()=="1" && $("#countyDropdown").val() != "By County" && ( $("#hfTypeDropdown").val()=="2" || $("#hfTypeDropdown").val()=="3") ){

     $("#summaryReportFigure3").hide();
     $("#summaryReportFigure2").hide();
     $("#summaryReportFigure1").hide();
     $("#summaryReportFigure4").hide();
     $("#summaryReportFigure5").hide();
     $("#summaryReportFigure25").show();
     populateDataInChart("figure251", $('#countyDropdown option:selected').html(), categoryArray, seriesArray[0],drillDownArray, unit);
     populateDataInChart("figure252", $('#countyDropdown option:selected').html(), categoryArray, seriesArray[1],drillDownArray, unit);
     populateDataInChart("figure253", $('#countyDropdown option:selected').html(), categoryArray, seriesArray[2],drillDownArray, unit);
     if($("#hfTypeDropdown").val()=="2") {
      populateDataInChart("figure254", $('#countyDropdown option:selected').html(), categoryArray, seriesArray[3],drillDownArray, unit);  
      $("#figure254").show();
    }else {
     $("#figure254").hide();
   }

 } else  if($("#seriesDropdown").val()=="1" && $("#countyDropdown").val() == "By County" && ( $("#hfTypeDropdown").val()=="2" || $("#hfTypeDropdown").val()=="3") ){


  console.log("graph order");
  console.log(seriesArray);





  if($("#hfTypeDropdown").val()=="2") {


    $("#summaryReportFigure3").show();
    $("#summaryReportFigure2").hide();
    $("#summaryReportFigure1").hide();
    $("#summaryReportFigure4").hide();
    $("#summaryReportFigure5").hide();
    $("#summaryReportFigure25").hide();

    var figureTitle=["All","All","All","All","Kakamega","Kakamega","Kakamega","Kakamega",
    "Kilifi","Kilifi","Kilifi","Kilifi",
    "Meru","Meru","Meru","Meru"];

    for (var i = 0; i < 16; i++) {

     var figureId="figure"+(i+11);

     console.log(figureId);

     populateDataInChart(figureId, figureTitle[i], categoryArray, seriesArray[i],drillDownArray, unit);

   }
 }else if($("#hfTypeDropdown").val()=="3") {

  $("#summaryReportFigure5").show();
  $("#summaryReportFigure3").hide();
  $("#summaryReportFigure2").hide();
  $("#summaryReportFigure1").hide();
  $("#summaryReportFigure4").hide();

  $("#summaryReportFigure25").hide();

  var figureTitle=["All","All","All","Kakamega","Kakamega","Kakamega",
  "Kilifi","Kilifi","Kilifi",
  "Meru","Meru","Meru"];

  for (var i = 0; i < 12; i++) {

   var figureId="figureOwnerShip"+(i+1);

   console.log(figureId);

   populateDataInChart(figureId, figureTitle[i], categoryArray, seriesArray[i],drillDownArray, unit);

 }
}
        //mayur added else
      } else if($("#seriesDropdown").val()=="1" ||($("#seriesDropdown").val()=="2" 
        && $("#unitDropdown").val()=="All" )){

        if ($("#countyDropdown").val() == "All") {
          $("#summaryReportFigure1").hide();
          $("#summaryReportFigure2").show();
          $("#summaryReportFigure3").hide();
          $("#summaryReportFsummaryReportFigure3igure4").hide();
          $("#summaryReportFigure5").hide();
          $("#summaryReportFigure25").hide();

          populateDataInChart("figure5", "All Counties", categoryArray, seriesArray,drillDownArray, unit);
        } else  if ($("#countyDropdown").val() == "1"){
          $("#summaryReportFigure1").hide();
          $("#summaryReportFigure2").show();
          $("#summaryReportFigure3").hide();
          $("#summaryReportFigure4").hide();
          $("#summaryReportFigure5").hide();
          $("#summaryReportFigure25").hide();
          populateDataInChart("figure5", "Kakamega", categoryArray, seriesArray,drillDownArray, unit);
        } else  if ($("#countyDropdown").val() == "2"){
          $("#summaryReportFigure1").hide();
          $("#summaryReportFigure2").show();
          $("#summaryReportFigure3").hide();
          $("#summaryReportFigure4").hide();
          $("#summaryReportFigure5").hide();
          $("#summaryReportFigure25").hide();
          populateDataInChart("figure5", "Kilifi", categoryArray, seriesArray,drillDownArray, unit);
        } else  if ($("#countyDropdown").val() == "3"){
          $("#summaryReportFigure1").hide();
          $("#summaryReportFigure2").show();
          $("#summaryReportFigure3").hide();
          $("#summaryReportFigure4").hide();
          $("#summaryReportFigure5").hide();
          $("#summaryReportFigure25").hide();
          populateDataInChart("figure5", "Meru", categoryArray, seriesArray,drillDownArray, unit);
        }  else {

         if($("#seriesDropdown").val()=="1" &&
          ($("#hfTypeDropdown").val()=="2" || $("#hfTypeDropdown").val()=="3") ) {   
          $("#summaryReportFigure1").show();
        $("#summaryReportFigure2").hide();
        $("#summaryReportFigure3").hide();
        $("#summaryReportFigure4").hide();
        $("#summaryReportFigure5").hide();
        $("#summaryReportFigure25").hide();
        populateDataInChart("figure1", "All", categoryArray[0], seriesArray[0],drillDownArray, unit);

        populateDataInChart("figure2", "Kakamega", categoryArray[1], seriesArray[1],drillDownArray, unit);
        populateDataInChart("figure3", "Kilifi", categoryArray[2], seriesArray[2],drillDownArray, unit);
        populateDataInChart("figure4", "Meru", categoryArray[3], seriesArray[3],drillDownArray, unit);
      }else if($("#seriesDropdown").val()=="1" && $("#hfTypeDropdown").val()=="1"){
       $("#summaryReportFigure1").show();
       $("#summaryReportFigure2").hide();
       $("#summaryReportFigure3").hide();
       $("#summaryReportFigure4").hide();
       $("#summaryReportFigure5").hide();
       $("#summaryReportFigure25").hide();
       populateDataInChart("figure1", "All", categoryArray, seriesArray[0],drillDownArray, unit);
       populateDataInChart("figure2", "Kakamega", categoryArray, seriesArray[1],drillDownArray, unit);
       populateDataInChart("figure3", "Kilifi", categoryArray, seriesArray[2],drillDownArray, unit);
       populateDataInChart("figure4", "Meru", categoryArray, seriesArray[3],drillDownArray, unit);

     }else  if($("#seriesDropdown").val()=="2" && $("#countyDropdown").val() == "By County") {   
      console.log("here=======");
      console.log(seriesArray[0]);

      $("#summaryReportFigure1").show();
      $("#summaryReportFigure2").hide();
      $("#summaryReportFigure3").hide();
      $("#summaryReportFigure4").hide();
      $("#summaryReportFigure5").hide();
      $("#summaryReportFigure25").hide();

      if($("#hfTypeDropdown").val()=="2"){

        populateDataInChart("figure1", "All Counties", categoryArray, seriesArray[0],drillDownArray, unit);

        populateDataInChart("figure2", "All Counties", categoryArray, seriesArray[1],drillDownArray, unit);
        populateDataInChart("figure3", "All Counties", categoryArray, seriesArray[2],drillDownArray, unit);
        populateDataInChart("figure4", "All Counties", categoryArray, seriesArray[3],drillDownArray, unit);
      }else  if($("#hfTypeDropdown").val()=="3"){
       populateDataInChart("figure1", "All Counties", categoryArray, seriesArray[0],drillDownArray, unit);

       populateDataInChart("figure2", "All Counties", categoryArray, seriesArray[1],drillDownArray, unit);
       populateDataInChart("figure3", "All Counties", categoryArray, seriesArray[2],drillDownArray, unit);

     }else{
      $("#summaryReportFigure1").hide();
      $("#summaryReportFigure2").show();
      $("#summaryReportFigure3").hide();
      $("#summaryReportFigure4").hide();
      $("#summaryReportFigure5").hide();
      $("#summaryReportFigure25").hide();
      populateDataInChart("figure5", "By County", categoryArray, seriesArray,drillDownArray, unit);
    }

  }else{
    $("#summaryReportFigure1").hide();
    $("#summaryReportFigure2").show();
    $("#summaryReportFigure3").hide();
    $("#summaryReportFigure4").hide();
    $("#summaryReportFigure5").hide();
    $("#summaryReportFigure25").hide();
    populateDataInChart("figure5", "By County", categoryArray, seriesArray,drillDownArray, unit);
  }
            // }

          }
        }else if($("#seriesDropdown").val()=="2" && $("#unitDropdown").val()=="By Unit" ){

          if($("#hfTypeDropdown").val()=="1"){

            if ($("#countyDropdown").val() == "All") {
              $("#summaryReportFigure1").hide();
              $("#summaryReportFigure2").show();
              $("#summaryReportFigure3").hide();
              $("#summaryReportFigure4").hide();
              $("#summaryReportFigure5").hide();
              $("#summaryReportFigure25").hide();
              populateDataInChart("figure5", "All Counties", categoryArray, seriesArray,drillDownArray, unit);
            } else  if ($("#countyDropdown").val() == "1"){
              $("#summaryReportFigure1").hide();
              $("#summaryReportFigure2").show();
              $("#summaryReportFigure3").hide();
              $("#summaryReportFigure4").hide();
              $("#summaryReportFigure5").hide();
              $("#summaryReportFigure25").hide();
              populateDataInChart("figure5", "Kakamega", categoryArray, seriesArray,drillDownArray, unit);
            } else  if ($("#countyDropdown").val() == "2"){
              $("#summaryReportFigure1").hide();
              $("#summaryReportFigure2").show();
              $("#summaryReportFigure3").hide();
              $("#summaryReportFigure4").hide();
              $("#summaryReportFigure5").hide();
              $("#summaryReportFigure25").hide();
              populateDataInChart("figure5", "Kilifi", categoryArray, seriesArray,drillDownArray, unit);
            } else  if ($("#countyDropdown").val() == "3"){
              $("#summaryReportFigure1").hide();
              $("#summaryReportFigure2").show();
              $("#summaryReportFigure3").hide();
              $("#summaryReportFigure4").hide();
              $("#summaryReportFigure5").hide();
              $("#summaryReportFigure25").hide();
              populateDataInChart("figure5", "Meru", categoryArray, seriesArray,drillDownArray, unit);
            }  else {

             $("#summaryReportFigure1").show();
             $("#summaryReportFigure2").hide();
             $("#summaryReportFigure3").hide();
             $("#summaryReportFigure4").hide();
             $("#summaryReportFigure5").hide();
             $("#summaryReportFigure25").hide();
             populateDataInChart("figure1", "All", categoryArray, seriesArray[0],drillDownArray, unit);
             populateDataInChart("figure2", "Kakamega", categoryArray, seriesArray[1],drillDownArray, unit);
             populateDataInChart("figure3", "Kilifi", categoryArray, seriesArray[2],drillDownArray, unit);
             populateDataInChart("figure4", "Meru", categoryArray, seriesArray[3],drillDownArray, unit);

           }
         }else if($("#hfTypeDropdown").val()=="2"){
          if ($("#countyDropdown").val() == "All") {
           $("#summaryReportFigure1").show();
           $("#summaryReportFigure2").hide();
           $("#summaryReportFigure3").hide();
           $("#summaryReportFigure4").hide();
           $("#summaryReportFigure5").hide();
           $("#summaryReportFigure25").hide();
           populateDataInChart("figure1", "All Counties", categoryArray, seriesArray[0],drillDownArray, unit);
           populateDataInChart("figure2", "All Counties", categoryArray, seriesArray[1],drillDownArray, unit);
           populateDataInChart("figure3", "All Counties", categoryArray, seriesArray[2],drillDownArray, unit);
           populateDataInChart("figure4", "All Counties", categoryArray, seriesArray[3],drillDownArray, unit);


         }else if ($("#countyDropdown").val() == "1") {
           $("#summaryReportFigure1").show();
           $("#summaryReportFigure2").hide();
           $("#summaryReportFigure3").hide();
           $("#summaryReportFigure4").hide();
           $("#summaryReportFigure5").hide();
           $("#summaryReportFigure25").hide();
           populateDataInChart("figure1", "Kakamega", categoryArray, seriesArray[0],drillDownArray, unit);
           populateDataInChart("figure2", "Kakamega", categoryArray, seriesArray[1],drillDownArray, unit);
           populateDataInChart("figure3", "Kakamegas", categoryArray, seriesArray[2],drillDownArray, unit);
           populateDataInChart("figure4", "Kakamegas", categoryArray, seriesArray[3],drillDownArray, unit);


         }else if ($("#countyDropdown").val() == "2") {
           $("#summaryReportFigure1").show();
           $("#summaryReportFigure2").hide();
           $("#summaryReportFigure3").hide();
           $("#summaryReportFigure4").hide();
           $("#summaryReportFigure5").hide();
           $("#summaryReportFigure25").hide();
           populateDataInChart("figure1", "Kilifi", categoryArray, seriesArray[0],drillDownArray, unit);
           populateDataInChart("figure2", "Kilifi", categoryArray, seriesArray[1],drillDownArray, unit);
           populateDataInChart("figure3", "Kilifi", categoryArray, seriesArray[2],drillDownArray, unit);
           populateDataInChart("figure4", "Kilifi", categoryArray, seriesArray[3],drillDownArray, unit);


         }else if ($("#countyDropdown").val() == "3") {
           $("#summaryReportFigure1").show();
           $("#summaryReportFigure2").hide();
           $("#summaryReportFigure3").hide();
           $("#summaryReportFigure4").hide();
           $("#summaryReportFigure5").hide();
           $("#summaryReportFigure25").hide();
           populateDataInChart("figure1", "Meru", categoryArray, seriesArray[0],drillDownArray, unit);
           populateDataInChart("figure2", "Meru", categoryArray, seriesArray[1],drillDownArray, unit);
           populateDataInChart("figure3", "Meru", categoryArray, seriesArray[2],drillDownArray, unit);
           populateDataInChart("figure4", "Meru", categoryArray, seriesArray[3],drillDownArray, unit);


         }else{
           $("#summaryReportFigure3").show();
           $("#summaryReportFigure2").hide();
           $("#summaryReportFigure1").hide();
           $("#summaryReportFigure4").hide();
           $("#summaryReportFigure5").hide();

           var figureTitle=["All","All","All","All","Kakamega","Kakamega","Kakamega","Kakamega",
           "Kilifi","Kilifi","Kilifi","Kilifi",
           "Meru","Meru","Meru","Meru"];

           for (var i = 0; i < 16; i++) {

             var figureId="figure"+(i+11);

             console.log(figureId);

             populateDataInChart(figureId, figureTitle[i], categoryArray, seriesArray[i],drillDownArray, unit);

           }
           $("#figure14").show();
           $("#figure18").show();
           $("#figure22").show();
           $("#figure26").show();


         }

       }else if($("#hfTypeDropdown").val()=="3"){
        if ($("#countyDropdown").val() == "All") {
         $("#summaryReportFigure1").hide();
         $("#summaryReportFigure2").hide();
         $("#summaryReportFigure3").hide();
         $("#summaryReportFigure4").show();
         $("#summaryReportFigure5").hide();
         populateDataInChart("figureA", "All Counties", categoryArray, seriesArray[0],drillDownArray, unit);
         populateDataInChart("figureB", "All Counties", categoryArray, seriesArray[1],drillDownArray, unit);
         populateDataInChart("figureC", "All Counties", categoryArray, seriesArray[2],drillDownArray, unit);
         
       }else if ($("#countyDropdown").val() == "1") {
         $("#summaryReportFigure1").hide();
         $("#summaryReportFigure2").hide();
         $("#summaryReportFigure3").hide();
         $("#summaryReportFigure4").show();
         $("#summaryReportFigure5").hide();
         populateDataInChart("figureA", "Kakamega", categoryArray, seriesArray[0],drillDownArray, unit);
         populateDataInChart("figureB", "Kakamega", categoryArray, seriesArray[1],drillDownArray, unit);
         populateDataInChart("figureC", "Kakamegas", categoryArray, seriesArray[2],drillDownArray, unit);

       }else if ($("#countyDropdown").val() == "2") {
         $("#summaryReportFigure1").hide();
         $("#summaryReportFigure2").hide();
         $("#summaryReportFigure3").hide();
         $("#summaryReportFigure4").show();
         $("#summaryReportFigure5").hide();
         populateDataInChart("figureA", "Kilifi", categoryArray, seriesArray[0],drillDownArray, unit);
         populateDataInChart("figureB", "Kilifi", categoryArray, seriesArray[1],drillDownArray, unit);
         populateDataInChart("figureC", "Kilifi", categoryArray, seriesArray[2],drillDownArray, unit);

       }else if ($("#countyDropdown").val() == "3") {
         $("#summaryReportFigure1").hide();
         $("#summaryReportFigure2").hide();
         $("#summaryReportFigure3").hide();
         $("#summaryReportFigure4").show();
         $("#summaryReportFigure5").hide();
         populateDataInChart("figureA", "Meru", categoryArray, seriesArray[0],drillDownArray, unit);
         populateDataInChart("figureB", "Meru", categoryArray, seriesArray[1],drillDownArray, unit);
         populateDataInChart("figureC", "Meru", categoryArray, seriesArray[2],drillDownArray, unit);
         
       }else{
         $("#summaryReportFigure3").hide();
         $("#summaryReportFigure2").hide();
         $("#summaryReportFigure1").hide();
         $("#summaryReportFigure4").hide();
         $("#summaryReportFigure5").show();

         var figureTitle=["All","All","All","Kakamega","Kakamega","Kakamega",
         "Kilifi","Kilifi","Kilifi",
         "Meru","Meru","Meru"];

         for (var i = 0; i < 12; i++) {

           var figureId="figureOwnerShip"+(i+1);

           console.log(figureId);

           populateDataInChart(figureId, figureTitle[i], categoryArray, seriesArray[i],drillDownArray, unit);

         }


       }

     }
   }
 }

 function populateDataInChart(container, title, categoryArray, seriesArray, drillDownArray, unit) {
  var yLabel="";
  var chartType='column';
  var footerNote="";
  if ($("#seriesDropdown").val() == "1") {
    yLabel="% of Facilities";
    chartType='column';
    footerNote='Note: due to rounding, numbers presented throughout may not add up precisely.';
  } else {
    yLabel="% of Maximum Score";
    chartType='bar';
  }
  var visible=false;
  if ($("#seriesDropdown").val() == "2" && $("#unitDropdown").val()=="All" && $("#hfTypeDropdown").val() == "1") {
    visible=true;
  }

  if ($("#hfTypeDropdown").val() != "1" && $("#seriesDropdown").val() != "2"  ) {
    xAxisTitle= "% of Facilities by Compliance Category";
  } else {
   xAxisTitle="";
 }
 if ($("#hfTypeDropdown").val() != "1" && $("#seriesDropdown").val() != "1"  ) {
 // xAxisTitle= "Mean Scores";
 xAxisTitle="";
} else {
 xAxisTitle="";
}

var chartHeight=400;

if ($("#seriesDropdown").val() == "2" && $("#unitDropdown").val()=="By Unit" ) {

  chartHeight=600;

}
 
  if (title=="All") {title="All Counties"}

    var categoryType="";
  if (scope.selectedType.value=="All") {
    categoryType="";
    if(scope.selectedSeries.value=="Mean Scores" && scope.selectedUnit=="By Unit"){
      categoryType=" of Each Unit"+categoryType;
    }
  }else{

   var ftype;

   if(seriesArray[0]!=undefined){
     ftype=seriesArray[0].name.split('(')[0];
   }

   console.log("ftype:"+ftype+"here");
   if(scope.selectedSeries.value=="Mean Scores" && scope.selectedUnit=="All"){
   
    if(ftype.trim()=="All Levels" || ftype.trim()=="All Ownerships" ){
     categoryType=" for All Facilities";
   }else{
    if($scope.selectedCounty.value!="By County"){
      categoryType=" for All Levels Facilities";
    }else{
    categoryType=" for "+ftype+" Facilities";
    } 
  }
}else{

  if(ftype.trim()=="All Levels" || ftype.trim()=="All Ownerships"){
   categoryType=" for All Facilities";
 }else{
  categoryType=" for "+ftype+" Facilities";
}
}

console.log(scope.selectedSeries.value+"=========="+scope.selectedUnit);

if(scope.selectedSeries.value=="Mean Scores" && scope.selectedUnit=="By Unit"){
  categoryType=" of Each Unit"+categoryType;
}

}

if(typeof drillDownArray == "undefined" || drillDownArray.length==0) {
  
  if(visible){

    $('#' + container).highcharts({
    chart: {
      style: {
        fontFamily: 'Open Sans, sans-serif'
      },
      type: chartType,
      height: chartHeight
    },
    gridLineWidth: 0,
    title: {

      text: 'JHIC Results' 
    },
    subtitle: {
      text: scope.selectedSeries.value+categoryType+" in  "+title
    },
    legend : {
      padding: 25,
      itemWidth : 150,
    },
    xAxis: {
      labels: {
        autoRotation: false,
        style: {
          "textOverflow": "none"
        }
      },
      title: {
        style: {

         fontWeight: 'bold', color: '#000000'
       },
       text: xAxisTitle
     },
     categories: categoryArray,
     crosshair: true
   },
   yAxis: {
    gridLineWidth: 0,
    min: 0,
    max: 100,

    labels: {
      formatter: function() {
       return this.value+"%";
     }
   },
   title: {
    text: yLabel
  }
},
credits: {
  enabled: false
},
tooltip: {
  headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
  pointFormat: '<tr>' +
  '<td style="padding:0">{point.y:.0f} ' + unit + '</td>'+
  '</tr>',
  footerFormat: '</table>',
  shared: true,
  useHTML: true,
  enabled: true
},
plotOptions: {
  series: {
    pointPadding: 0.2,
    borderWidth: 0,
    dataLabels: {
     enabled: true,
     crop: false,
     allowOverlap:true, 
     overflow: 'none',
    formatter: function () {
        return '<div style="font-weight: normal;">'+Math.round(this.point.y) + unit +'<br><div style="font-weight: normal;">(N='+ this.point.count + ')</div></div>';     
    },
  }
}
},
exporting: {
  chartOptions:{
    chart:{
      events: {
        load: function(event) { 
          this.renderer.image(logourl,0,0,50,50).add();
          this.renderer.text(footerNote, 10, 390)
          .css({
            color: '#000000',
            fontSize: '8px'
          }).add();
        }
      }
    }
  },  
  // fallbackToExportServer: false,
  filename: filename+formateDate()
},
series:seriesArray
});

  }else{

  console.log("seriesArray check here--");
  console.log(seriesArray);
 
  $('#' + container).highcharts({
    chart: {
      style: {
        fontFamily: 'Open Sans, sans-serif'
      },
      type: chartType,
      height: chartHeight
    },
    gridLineWidth: 0,
    title: {

      text: 'JHIC Results' 
    },
    subtitle: {
      text: scope.selectedSeries.value+categoryType+" in  "+title
    },
    legend : {
      padding: 25,
      itemWidth : 150,
    },
    xAxis: {
      labels: {
        autoRotation: false,
        style: {
          "textOverflow": "none"
        }
      },
      title: {
        style: {

         fontWeight: 'bold', color: '#000000'
       },
       text: xAxisTitle
     },
     categories: categoryArray,
     crosshair: true
   },
   yAxis: {
    gridLineWidth: 0,
    min: 0,
    max: 100,

    labels: {
      formatter: function() {
       return this.value+"%";
     }
   },
   title: {
    text: yLabel
  }
},
credits: {
  enabled: false
},
tooltip: {
  headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
  pointFormat: '<tr>' +
  '<td style="padding:0">{point.y:.0f} ' + unit + '</td>'+
  '</tr>',
  footerFormat: '</table>',
  shared: true,
  useHTML: true,
  enabled: true
},
plotOptions: {
  series: {
    pointPadding: 0.2,
    borderWidth: 0,
    dataLabels: {
     enabled: true,
     crop: false,
     allowOverlap:true, 
     overflow: 'none',
     formatter: function () {
      
        return '<div style="font-weight: normal;">'+Math.round(this.point.y) + unit +'</div>';
            
    },
  }
}
},
exporting: {
  chartOptions:{
    chart:{
      events: {
        load: function(event) { 
          this.renderer.image(logourl,0,0,50,50).add();
          this.renderer.text(footerNote, 10, 390)
          .css({
            color: '#000000',
            fontSize: '8px'
          })
          .add();
        }
      }
    }
  },  
  // fallbackToExportServer: false,
  filename: filename+formateDate()
},
series:seriesArray
});
}
$('#' + container).highcharts().setSize($('#' + container).width(), chartHeight);
}
}

          //tmp
            $('#export_all').click(function () {

             // alert("in");
              var reportHTML = $("#innerHTML").html();
    

        reportHTML = reportHTML.replace(/\n|\t/g, ' ');
        $("#reportHTML").val(reportHTML);
        console.log(reportHTML);
        $("#reportPDFForm").submit();



            });
            //finish

        
      });

