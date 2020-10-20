var icModule = angular.module("aggregateProgressModule", []);
var data = [];
var scope;

var oTable = null;
var http = null;
var subCountyList;

var filename;

icModule.controller("aggregateProgressCtrl", function ($scope, $http) {
  filename="Inspection_Progress_Report_"+formateDate();
  $scope.inspectors = [];
  http = $http;
  scope = $scope;
  $scope.inspPeriods = [];

  scope.selectedCounty = "All";
  populateCounties(populateInspectors);
   // populateInspectionPeriod();
   $scope.countyChanged = function() {
    console.log("countyChanged...");
    populateInspectors(populateInspectionPeriod)
  };

  $scope.filterChanged = function() {
    console.log("filterChanged...");
    populateInspectionPeriod(inspProgressFilterChange);
  };

  $scope.inspectionPeriodChanged = function() {
    console.log("inspectionPeriodChanged...");
    inspProgressFilterChange();
     //   showProgrssChart();
   };

   $scope.exportExcel = function() {

    console.log("scope.visitPlanData : "+scope.visitPlanData);
    $("#reportExcelForm").submit();
  };

  $('#export_all').click(function () {

    var reportHTML = $("#innerHTML").html();
    

    reportHTML = reportHTML.replace(/\n|\t/g, ' ');
    $("#reportHTML").val(reportHTML);
    console.log(reportHTML);
    $("#reportPDFForm").submit();

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
    callback(populateInspectionPeriod);

  }, function myError(response) {
    console.log(response.statusText);
  });
}

function populateInspectors(callback) {
        //populate inspector names dropdown
        http({
          method: "POST",
          url: routesPrefix+"/completejhic/individual/getInspectorNames",
          data: {
            county : scope.selectedCounty
          }
        }).then(function mySucces(response) {
          $scope.inspectors = null;
          $scope.selectedInspector = null;
          $scope.inspectors = response.data.inspectors;
          if($scope.inspectors.length==0) {
            $scope.inspectors.push({name:" ",_id:" "});
            $scope.selectedInspector = $scope.inspectors[0];
          } else {
            if($scope.inspectors.length>1)
              $scope.inspectors.unshift({name:"All",_id:"All"});
            $scope.selectedInspector = $scope.inspectors[0];
          }


          callback(populateInspectionPeriod);




        }, function myError(response) {
          console.log(response.statusText);
        });
      }

      function populateInspectionPeriod(callback) {
        //populate inspector names dropdown
        console.log("populateInspectionPeriod==============");
        console.log(scope.selectedCounty);
        console.log(scope.selectedInspector);
        http({
          method: "POST",
          url: routesPrefix+"/inspectionplanning/inspectionPeriods",
          data: {
           county : scope.selectedCounty,
           inspector : scope.selectedInspector,
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
        $scope.inspPeriods = inspPeriodArr;
        $scope.selectedInspPeriod = $scope.inspPeriods[0];
        callback(inspProgressFilterChange);

      }, function myError(response) {
        console.log(response.statusText);
      });
     }


     function inspProgressFilterChange() {

      $("#inspProgressPlanBody").html("");
      showProgrssChart();
      scope.tableCSS = $("#styleDiv").html();
      scope.tableHTML = $("#inspProgressReportDiv").html();

    }

    function showProgrssChart() {


     http({
      method: "POST",
      url: routesPrefix+"/inspectionProgressAndPlanning/getInspProgressDataByCounty",
      data: {
        county : scope.selectedCounty.value,
        inspector : scope.selectedInspector,
        inspPeriod : scope.selectedInspPeriod
      }
    }).then(function mySucces(response) {

      var countyNameArr=response.data.countyNameArr;
      var seriesDataArr=response.data.seriesDataArr;

      console.log("here.....---");
      console.log(response);
      console.log( seriesDataArr);
      var filterValues= "County: "+scope.selectedCounty.value+" | "+
      "Inspector's Name: "+scope.selectedInspector.name+" |<br> "+
      "Inspection Period: "+scope.selectedInspPeriod.value;

      var InspPeriod,countyHeader;

      if(scope.selectedInspPeriod.value=="All"){
        InspPeriod="All Inspection Periods";
      }else{
        InspPeriod=scope.selectedInspPeriod.value;
      }

      if(scope.selectedCounty.value=="All"){
        countyHeader="by County";
      }else{
        countyHeader="of "+scope.selectedCounty.value;
      }

      $('#ProgressCountyFigure').highcharts({
        chart: {
         style: {
          fontFamily: 'Open Sans, sans-serif'
        },
        type: 'column',
        height: 500
      },
      gridLineWidth: 0,
      title: {
        text: 'Inspection Progress'
      },
      subtitle: {

       text:"Inspection Progress "+countyHeader+" during "+InspPeriod
       /*  text: filterValues+'<br>(By County)'*/
     },
     xAxis: {
      categories: countyNameArr,
      title: {
        text: null
      }
    },
    yAxis: {
     gridLineWidth: 0,
     min: 0,
     max: 100,
     title: {
      text: '',
              //  align: 'high'
            },
            labels: {
              overflow: 'justify', 
              formatter: function() {
               return this.value+"%";
             }

           }
         },
         tooltip: {
          valueSuffix: '',
          useHTML : true,

          formatter: function () {
            return '<div  style="font-weight: normal;" >'+Math.round(this.point.y)+'%</div>';
          },

        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true,
              format: '<span style="color:black;font-weight: normal;">{point.y:.0f}%</span>'+'<br><span style="color:black;font-weight: normal;">(N={point.complete})</span>'

           /* useHTML : true,
            formatter: function () {
                return '<center  style="font-weight: normal;">'+Math.round(this.point.y)+'%</center>'
      +'<center  style="font-weight: normal;">(N='+ this.point.total + ')</center>';
    },*/
  }
}
},
credits: {
  enabled: false
},
exporting: {

  chartOptions:{

    chart:{


      events: {
        load: function(event) { 
          this.renderer.image(logourl,0,0,50,50).add();
          this.renderer.text('Note: due to rounding, numbers presented throughout may not add up precisely.', 10, 490)
          .css({
            color: '#000000',
            fontSize: '8px'
          })
          .add();
        }
      }
    }
  },  
  filename: filename
},
series: [{
  name: '% of Inspections Completed',
  data: seriesDataArr,

}]
});

    });



    http({
      method: "POST",
      url: routesPrefix+"/inspectionplanning/table/getInspProgressData",
      data: {
        county : scope.selectedCounty.value,
        inspector : scope.selectedInspector,
        inspPeriod : scope.selectedInspPeriod
      }
    }).then(function mySucces(response) {
      inspProgressData = response.data.inspProgressData;
      console.log("inspProgressData");
      console.log(inspProgressData);
      scope.inspProgressData = JSON.stringify(inspProgressData);
      hideInspector = response.data.hideInspectorColumn;
      if (oTable2 != null) {
        oTable2.fnClearTable();
        oTable2.fnDestroy();
        oTable2 = null;
      }



      console.log("showProgrssChart");
      var inspectorNameArrcounty1 = [];
      var inspectorNameArrcounty2 = [];
      var inspectorNameArrcounty3 = [];
      var progress = [];

      if(inspProgressData.length>0){


        for(i =0 ;i <inspProgressData.length;i++) {

          if(inspProgressData[i].county=="Kakamega"){

            inspectorNameArrcounty1.push(inspProgressData[i].inspectorName);
            progress.push({y:inspProgressData[i].progress,visited:inspProgressData[i].visited,total:inspProgressData[i].total});
          }
        }
        for(i =0 ;i <inspProgressData.length;i++) {
          if(inspProgressData[i].county=="Kilifi"){

            inspectorNameArrcounty2.push(inspProgressData[i].inspectorName);

            progress.push({y:inspProgressData[i].progress,visited:inspProgressData[i].visited,total:inspProgressData[i].total});
          }
        }
        for(i =0 ;i <inspProgressData.length;i++) {
          if(inspProgressData[i].county=="Meru"){

            inspectorNameArrcounty3.push(inspProgressData[i].inspectorName);

            progress.push({y:inspProgressData[i].progress,visited:inspProgressData[i].visited,total:inspProgressData[i].total});

          }
        }
      }else{

        if(scope.selectedCounty.value=="Kakamega"){
          inspectorNameArrcounty1.push(scope.selectedInspector.name);
          progress.push({y:0,visited:0,total:0});
        }else if(scope.selectedCounty.value=="Kilifi"){
          inspectorNameArrcounty2.push(scope.selectedInspector.name);
          progress.push({y:0,visited:0,total:0});
        }else if(scope.selectedCounty.value=="Meru"){
          inspectorNameArrcounty3.push(scope.selectedInspector.name);
          progress.push({y:0,visited:0,total:0});
        }
      }

      console.log("Progresssssss");
      console.log(progress);
      var countyObj = {};
      countyObj.value = "All";
      var filterValues= "County: "+scope.selectedCounty.value+" | "+
      "Inspector's Name: "+scope.selectedInspector.name+" |<br> "+
      "Inspection Period: "+scope.selectedInspPeriod.value;

      var InspPeriod,inspectorTitle;

      if(scope.selectedInspPeriod.value=="All"){
        InspPeriod="All Inspection Periods";
      }else{
        InspPeriod=scope.selectedInspPeriod.value;
      }

      if(scope.selectedInspector.name=="All"){
        inspectorTitle="by Inspector";
      }else{
        inspectorTitle="of "+scope.selectedInspector.name;
      }

      $('#ProgressInspectorFigure').highcharts({

        chart: {
         style: {
          fontFamily: 'Open Sans, sans-serif'
        },
        type: 'bar',
        height: 500,
             // plotBackgroundColor: null,
             // plotBorderWidth: null,
             // plotShadow: false,
             inverted: false
           },
           gridLineWidth: 0,

           title: {
            text: 'Inspection Progress'
          },
          subtitle: {
           text:"Inspection Progress "+inspectorTitle+" during "+InspPeriod
           /*  text: filterValues+'<br>(By Inspector)'*/
         },
         xAxis: {
          drawHorizontalBorders: false,
          labels: {

            overflow: 'justify',
            groupedOptions: [{
              style: {
                "fontWeight":"bold",
                "border":0

              },
              rotation: -90,
              y:18,
              x:-5


            }],
      //  x:0.2,
      useHTML: true,
      formatter: function() {
       return this.value;
     }

   },
   categories: [{
    name: "Kakamega",

    categories: inspectorNameArrcounty1
  }   , {
    name: "Kilifi",
    categories: inspectorNameArrcounty2
  }, {
    name: "Meru",
    categories: inspectorNameArrcounty3
  }],
  title: {
    text: null
  }
},
yAxis: {
 gridLineWidth: 0,
 min: 0,
 max: 100,
 title: {
  text: '',
              //  align: 'high'
            },
            labels: {
              overflow: 'justify', 
              formatter: function() {
               return this.value+"%";
             }

           }
         },
         tooltip: {
           headerFormat: '<span style="font-size:10px;">{point.key}</span><table>',
           pointFormat: '<tr>' +
           '<td style="padding:0">{point.y:.0f}%  </td>'+
           '</tr>',
           footerFormat: '</table>',
           shared: false,
           useHTML: true,
           enabled:true

         },
         plotOptions: {
          bar: {
            dataLabels: {
              enabled: true,
              useHTML:true,

              formatter: function () {
                return '<div  style="font-weight: normal;" >'+Math.round(this.point.y)+'% (N='+ this.point.visited + ')</div>';
              },
            }
          }
        },
          credits: {
            enabled: false
          },
          exporting: {
            chartOptions:{

              chart:{


                events: {
                  load: function(event) { 
                    this.renderer.image(logourl,0,0,50,50).add();
                    this.renderer.text('Note: due to rounding, numbers presented throughout may not add up precisely.', 10, 490)
                    .css({
                      color: '#000000',
                      fontSize: '8px'
                    })
                    .add();
                  }
                }
              }
            },  
            filename: filename
          },
          series: [{
            name: '% of Inspections Completed',
            data: progress,

          }]
        });
    });
}
});

