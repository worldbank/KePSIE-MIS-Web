var srModule = angular.module("facilityLevelProgressModule", []);
var facilities = [];
var http;
var scope;

srModule.controller("facilityLevelProgressController", function ($scope, $http) {
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
 {"key" : "3", "value" : "By Ownership"}];
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
        
        prepareFigureReport();
      }, function myError(response) {
        console.log(response.statusText);
      });
    }

    $('#export_all').click(function () {
        var reportHTML = $("#innerHTML").html();
        reportHTML = reportHTML.replace(/\n|\t/g, ' ');
        $("#reportHTML").val(reportHTML);
        console.log(reportHTML);
        $("#reportPDFForm").submit();
    });

   $scope.filterChanged = function() {

       console.log("filterChanged...");

       prepareFigureReport();
     };

   function prepareFigureReport() {
    $(".figure").empty();
    $(".figure").removeAttr('data-highcharts-chart');
    console.log("prepareFigureReport..."+$scope.selectedSeries.key+"-----"+$scope.selectedType.key+"-------"+$scope.selectedCounty.key);
    $http({
      method: "POST",
      url: routesPrefix+"/facilityLevelProgress/figure/getData",
      data: {
        series: $scope.selectedSeries.key,
        hfType: $scope.selectedType.key,
        county: $scope.selectedCounty.key,
      }
    }).then(function mySucces(response) {
      facilities = response.data.seriesArray;
      console.log(response);
      prepareChart(response.data.categoryArray, response.data.seriesArray);
    }, function myError(response) {
      console.log(response.statusText);
    });
  }
  function prepareChart(categoryArray, seriesArray) {
    if($("#seriesDropdown").val()=='1'){
    if( $("#hfTypeDropdown").val()=="1" && $("#countyDropdown").val() != "By County" ){
      $(".figureTable").hide();
      $("#summaryReportFigure2").show();
      populateDataInChart("figure5",$('#countyDropdown option:selected').html(),categoryArray, seriesArray);   
    }else if( $("#hfTypeDropdown").val()=="1" && $("#countyDropdown").val() == "By County" ){
      $(".figureTable").hide();
      $("#summaryReportFigure1").show();
        populateDataInChart("figure1","All", categoryArray, seriesArray[0]);
        populateDataInChart("figure2","Kakamega", categoryArray, seriesArray[1]);
        populateDataInChart("figure3","Kilifi", categoryArray, seriesArray[2]);
        populateDataInChart("figure4","Meru", categoryArray, seriesArray[3]);
    }else if( $("#hfTypeDropdown").val()=="2" && $("#countyDropdown").val() != "By County" ){
      $(".figureTable").hide();
      $("#summaryReportFigure1").show();
      var title = $('#countyDropdown option:selected').html()
        populateDataInChart("figure1",title, categoryArray, seriesArray[0],"Level 2");
        populateDataInChart("figure2",title, categoryArray, seriesArray[1],"Level 3");
        populateDataInChart("figure3",title, categoryArray, seriesArray[2],"Level 4 & 5");
        populateDataInChart("figure4",title, categoryArray, seriesArray[3],"All");  
    }else if( $("#hfTypeDropdown").val()=="2" && $("#countyDropdown").val() == "By County" ){
      $(".figureTable").hide();
      $("#summaryReportFigure3").show();
      var figureTitle=[{county:"All",ftype:"Level 2"},{county:"All",ftype:"Level 3"},
      {county:"All",ftype:"Level 4 & 5"},{county:"All",ftype:"All"},
      {county:"Kakamega",ftype:"Level 2"},{county:"Kakamega",ftype:"Level 3"},
      {county:"Kakamega",ftype:"Level 4 & 5"},{county:"Kakamega",ftype:"All"},
      {county:"Kilifi",ftype:"Level 2"},{county:"Kilifi",ftype:"Level 3"},
      {county:"Kilifi",ftype:"Level 4 & 5"},{county:"Kilifi",ftype:"All"},
      {county:"Meru",ftype:"Level 2"},{county:"Meru",ftype:"Level 3"},
      {county:"Meru",ftype:"Level 4 & 5"},{county:"Meru",ftype:"All"},];
        for (var i = 0; i < 16; i++) {
          var figureId="figure"+(i+11);
          console.log(figureId);
          populateDataInChart(figureId,figureTitle[i].county, categoryArray, seriesArray[i],figureTitle[i].ftype);
        }  
      }else if( $("#hfTypeDropdown").val()=="3" && $("#countyDropdown").val() != "By County" ){
      $(".figureTable").hide();
      $("#summaryReportFigure1").show();
      var title = $('#countyDropdown option:selected').html()
        populateDataInChart("figure1",title,categoryArray, seriesArray[0],"Public");
        populateDataInChart("figure2",title,categoryArray, seriesArray[1],"Private");
        populateDataInChart("figure3",title,categoryArray, seriesArray[2],"All");  
    }else if( $("#hfTypeDropdown").val()=="3" && $("#countyDropdown").val() == "By County" ){
      $(".figureTable").hide();
      $("#summaryReportFigure4").show();
      var figureTitle=[{county:"All",ftype:"Public"},{county:"All",ftype:"Private"},
      {county:"All",ftype:"All"},
      {county:"Kakamega",ftype:"Public"},{county:"Kakamega",ftype:"Private"},
      {county:"Kakamega",ftype:"All"},
      {county:"Kilifi",ftype:"Public"},{county:"Kilifi",ftype:"Private"},
      {county:"Kilifi",ftype:"All"},
      {county:"Meru",ftype:"Public"},{county:"Meru",ftype:"Private"},
      {county:"Meru",ftype:"All"},];
        for (var i = 0; i < 12; i++) {
          var figureId="fig"+(i+11);
          console.log(figureId);
          populateDataInChart(figureId,figureTitle[i].county,categoryArray,seriesArray[i],figureTitle[i].ftype);
        }  
      }
    }else{
      //for meanscore
      if( $("#hfTypeDropdown").val()=="1" ){
        $(".figureTable").hide();
        $("#summaryReportFigure2").show();
        populateDataInChart("figure5",$('#countyDropdown option:selected').html(),categoryArray, seriesArray);   
      }else if( $("#hfTypeDropdown").val()=="2" ){
        $(".figureTable").hide();
        $("#summaryReportFigure1").show();
        var title = $('#countyDropdown option:selected').html();
        if(title=="By County"){
          title = "All";
        }

          populateDataInChart("figure1",title, categoryArray, seriesArray[0],"Level 2");
          populateDataInChart("figure2",title, categoryArray, seriesArray[1],"Level 3");
          populateDataInChart("figure3",title, categoryArray, seriesArray[2],"Level 4 & 5");
          populateDataInChart("figure4",title, categoryArray, seriesArray[3],"All");  
      }else if($("#hfTypeDropdown").val()=="3"){
        $(".figureTable").hide();
        $("#summaryReportFigure1").show();
         var title = $('#countyDropdown option:selected').html();
         if(title=="By County"){
          title = "All";
        }
        populateDataInChart("figure1",title, categoryArray, seriesArray[0],"Public");
        populateDataInChart("figure2",title, categoryArray, seriesArray[1],"Private");
        populateDataInChart("figure3",title, categoryArray, seriesArray[2],"All");  
      }
    }
  }

  function populateDataInChart(container,title, categoryArray, seriesArray,ftype) {
    var chartType = 'column';
    var footerNote='Note: due to rounding, numbers presented throughout may not add up precisely.';
  if (title=="All") {title="All Counties"}

    var categoryType="";
  if (scope.selectedType.value=="All") {
      categoryType="";
  }else{

   console.log("ftype:"+ftype+"here");
   if(scope.selectedSeries.value=="Mean Scores" ){
      categoryType=" for "+ftype+" Facilities";  
  }else{
    categoryType=" for "+ftype+" Facilities";
  }
}
    if($("#seriesDropdown").val()=='2'){
      chartType = 'bar';
      footerNote = '';
    }

    $('#' + container).highcharts({
    chart: {
      style: {
        fontFamily: 'Open Sans, sans-serif'
      },
      type: chartType,
     },
    gridLineWidth: 0,
    title: {
      text: 'Facility-Level Performance Progress ' 
    },
    subtitle: {
      text: scope.selectedSeries.value+categoryType+" in  "+title
    },
    legend : {
      itemWidth: 200,
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
       text: ''
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
    text: ''
  }
},
credits: {
  enabled: false
},
tooltip: {
  headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
  pointFormat: '<tr>' +
  '<td style="padding:0">{point.y:.0f} %</td>'+
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
        return '<div style="font-weight: normal;">'+Math.round(this.point.y) +'%</div>';       
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
  filename: "Facility_Level_Progress_Figure_"+formateDate()
},
series:seriesArray
});

    $('#' + container).highcharts().setSize($('#' + container).width(), $('#' + container).height());
  }
});
 


