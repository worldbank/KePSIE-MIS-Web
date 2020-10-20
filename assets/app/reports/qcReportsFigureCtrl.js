
var icModule = angular.module("qcReportsFigureModule", []);
var data = [];
var scope;

var oTable = null;
var http = null;
var subCountyList;
var filename;


icModule.controller("qcReportsFigureCtrl", function ($scope, $http) {
  filename="Checks_and_Quality_Reports_"+formateDate();
  $scope.inspectors = [];
  http = $http;
  scope = $scope;
  $scope.inspPeriods = [];

  scope.selectedCounty = "All";
  scope.selectedIndicator = "All";
  scope.selectedClosureSubList="";
  populateCounties(populateInspectors);
  populateIndicators();
  $scope.countyChanged = function() {
    console.log("countyChanged...");
    populateInspectors(populateInspectionPeriod)


  };

  $scope.filterChanged = function() {

    console.log("filterChanged...");




    var indicatorList=$("#indicatorDropdown1").val();
    var closureList=$("#ClosureSubListDropdown").val();

    $scope.selectedClosureNonAdherence=false;
    $scope.selectedJHICDiscrepancies=false;
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



    console.log("after if======");
    console.log(indicatorList);

    if(indicatorList!=null){
      for (var i = 0; i < indicatorList.length; i++) {
       if(indicatorList[i]=="Closure Non-Adherence"){


        $scope.selectedClosureNonAdherence=true;
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

        if (closureList) {
          $("#ClosureSubListDropdown").selectpicker('val', closureList);
        }else{
          $("#ClosureSubListDropdown").selectpicker('val', ['Facility Closure Non-Adherence']);

        }

      }

      if(indicatorList[i]=="JHIC Discrepancies" && indicatorList.length==1){
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

      }
      

      if($scope.selectedClosureNonAdherence==true && $("#ClosureSubListDropdown").val()==null){

        $("#errorMsg").show();
      }else{

        $("#errorMsg").hide();
      }
    }
  }else{
    
    if($("#indicatorDropdown1").val()==null){
      $("#indicatorDropdown1").val('All');
      $("#ClosureSubListDropdown").selectpicker('val', ['All']);
      $scope.selectedIndicator = "All";
    }else{

     // $("#errorMsg1").hide();
   }
 }

//populateInspectionPeriod(inspProgressFilterChange);


showProgrssChart();

};

$scope.inspectionPeriodChanged = function() {
  console.log("inspectionPeriodChanged...");

  inspProgressFilterChange();
  showProgrssChart();

  
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
function populateIndicators(callback) {
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

  var ind3 = {};
  ind3.key = "Closure Non-Adherence";
  ind3.value = "Closure Non-Adherence";

  indicators.push(ind1);
  indicators.push(ind2);
  indicators.push(ind3);

  $scope.indicators = indicators;
  $scope.selectedIndicator = $scope.indicators[0];

  var closure = {};
  var closures = [];
        /*closure.key = "All";
        closure.value = "All";
        closures.push(closure);*/


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

        closures.push(ind1);
        closures.push(ind2);
        closures.push(ind3);
        closures.push(ind4);
        closures.push(ind5);

        $scope.closures = closures;
        $scope.selectedClosureSubList = $scope.closures[0];
        


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



     $(".figure").html('');
     $(".figure").show();
     $(".figure").removeAttr('data-highcharts-chart');


     var indicatorList=$("#indicatorDropdown1").val();

     if(indicatorList.length==1 && indicatorList[0]=="All"){
      indicatorList=["All","JHIC Discrepancies","Scorecard Non-Adherence","Facility Closure Non-Adherence"];

    }

    var closureList=$("#ClosureSubListDropdown").val();

    var index= indicatorList.indexOf("Closure Non-Adherence");

    if(closureList && (index!=-1)){

      indicatorList.splice(index, 1);

      for (var i = 0; i < closureList.length; i++) {
        indicatorList.push(closureList[i]);
      }

    }
    console.log("check here.............");
    console.log(indicatorList);


    http({
      method: "POST",
      url: routesPrefix+"/qualitychecks/reports/getProgressDataByCounty",
      data: {
        county : scope.selectedCounty.value,
        inspector : scope.selectedInspector,
        inspPeriod : scope.selectedInspPeriod,
        indicator : indicatorList,
      }
    }).then(function mySucces(response) {

      console.log("after response here.......");

      console.log(response.data);

      var formatedDataFigure=response.data;

      var countyTitle =scope.selectedCounty.value;
      var periodTitle=scope.selectedInspPeriod.value;

      if(countyTitle=="All"){
        countyTitle="All Counties";
      }

      if(periodTitle=="All"){
        periodTitle="All Period";
      }

      var indexJHICDescr= indicatorList.indexOf("JHIC Discrepancies");

      if(indexJHICDescr!=-1 && indicatorList.length==1){

        indicatorList.splice(indexJHICDescr,1);
        indicatorList.unshift("Average Discrepancy Rate");
        indicatorList.unshift("JHIC Discrepancies");



      //if indicator is jhic Discr then get by inspector data start
      

      http({
        method: "POST",
        url: routesPrefix+"/qualitychecks/table/getProgressData",
        data: {
          county : scope.selectedCounty.value,
          inspector : scope.selectedInspector,
          inspPeriod : scope.selectedInspPeriod,
          indicator : scope.selectedIndicator.value,
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
              progress.push({y:inspProgressData[i].progress,total:inspProgressData[i].total});
            }
          }
          for(i =0 ;i <inspProgressData.length;i++) {
            if(inspProgressData[i].county=="Kilifi"){

              inspectorNameArrcounty2.push(inspProgressData[i].inspectorName);

              progress.push({y:inspProgressData[i].progress,total:inspProgressData[i].total});
            }
          }
          for(i =0 ;i <inspProgressData.length;i++) {
            if(inspProgressData[i].county=="Meru"){

              inspectorNameArrcounty3.push(inspProgressData[i].inspectorName);

              progress.push({y:inspProgressData[i].progress,total:inspProgressData[i].total});

            }
          }
        }else{



          if(scope.selectedCounty.value=="Kakamega"){
            inspectorNameArrcounty1.push(scope.selectedInspector.name);
            progress.push({y:0,total:0});
          }else if(scope.selectedCounty.value=="Kilifi"){
            inspectorNameArrcounty2.push(scope.selectedInspector.name);
            progress.push({y:0,total:0});
          }else if(scope.selectedCounty.value=="Meru"){
            inspectorNameArrcounty3.push(scope.selectedInspector.name);
            progress.push({y:0,total:0});
          }

        }

        console.log("Progresssssss");
        console.log(progress);
        var countyObj = {};
        countyObj.value = "All";
        var filterValuesInsp= "County: "+scope.selectedCounty.value+" | "+ "Indicator: "+scope.selectedIndicator.value+" | "+
        "Inspector: "+scope.selectedInspector.name+" |<br> "+
        "Inspection Period: "+scope.selectedInspPeriod.value;







      //if indicator is jhic Discr then get by inspecot data end



      console.log("here.....---");
      console.log(response);

      var filterValues= "County: "+scope.selectedCounty.value+" | "+
      "Inspection Period: "+scope.selectedInspPeriod.value+" | "+ "Indicator: "+scope.selectedIndicator.value;


      console.log("indicator multiple");

      console.log("indicatorList==========");
      console.log(indicatorList);


      var i;

      for( i = 0; i < indicatorList.length; i++) {

        console.log("inside loop========");
        console.log(formatedDataFigure[indicatorList[i]]);

        if(indicatorList[i]=="Average Discrepancy Rate"){

         $('#figure'+(i+1)).show();

         $('#figure'+(i+1)).highcharts({

          chart: {
           style: {
            fontFamily: 'Open Sans, sans-serif'
          },
          type: 'bar',
          inverted: false
        },
        gridLineWidth: 0,

        title: {
          text: 'Checks and Quality Reports'
        },
        subtitle: {
          text: "Average Discrepancy Rate in "+countyTitle+" during "+periodTitle
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
           headerFormat: '<span style="font-size:10px">{point.key}</span><table>',

           pointFormat: '<tr>' +
           '<td style="padding:0">{point.y:.0f}%  </td>'+
           '</tr>',
           footerFormat: '</table>',
           shared: true,
           useHTML: true

         },
         plotOptions: {
          bar: {
            dataLabels: {
              enabled: true,
              useHTML:true,

              formatter: function () {
                return '<div  style="font-weight: normal;" >'+Math.round(this.point.y)+'% (N='+ this.point.total + ')</div>';
              },
            }
          }
        } ,
        credits: {
          enabled: false
        },
        exporting: {
          chartOptions:{

            chart:{


              events: {
                load: function(event) { 
                  this.renderer.image(logourl,0,0,50,50).add();
                  this.renderer.text('Note: Only some facilities in each county are selected for quality checks.', 10, 390)
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
          name: 'Average Discrepancy Rate',
          data: progress,

        }]
      });




       }else{

        $('#figure'+(i+1)).show();

        $('#figure'+(i+1)).highcharts({
          chart: {
           style: {
            fontFamily: 'Open Sans, sans-serif'
          },
          type: 'column'
        },
        gridLineWidth: 0,
        title: {
          text: 'Checks and Quality Reports'
        },
        subtitle: {
         text: indicatorList[i]+" in "+countyTitle+" during "+periodTitle

       },
       xAxis: {
        type: 'category'
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
              format: '<span style="color:black;font-weight: normal;">{point.y:.0f}%</span>'+'<br><span style="color:black;font-weight: normal;">(N={point.total})</span>'
             /* useHTML : true,
              formatter: function () {
                return '<center  style="font-weight: normal;">'+Math.round(this.point.y)+'%</center>'
                +'<center  style="font-weight: normal;">(N1='+ this.point.total + ')</center>';
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
                  this.renderer.text('Note:Only some facilities in each county are selected for quality checks.', 10, 390)
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
          name: indicatorList[i],
          data: formatedDataFigure[indicatorList[i]],

        }]
      });
      }
    }

    for(var j= i; j < 8; j++) {

     $('#figure'+(j+1)).hide();

   }
 });
}else{


 console.log(response);

 var filterValues= "County: "+scope.selectedCounty.value+" | "+
 "Inspection Period: "+scope.selectedInspPeriod.value+" | "+ "Indicator: "+scope.selectedIndicator.value;


 console.log("indicator multiple");

 console.log("indicatorList==========");
 console.log(indicatorList);


 var i;

 for( i = 0; i < indicatorList.length; i++) {

  var legendName;
  if(indicatorList[i]=="All"){
    legendName="All Indicator";
  }else{
    legendName=indicatorList[i];
  }
  console.log("inside loop========");
  console.log(formatedDataFigure[indicatorList[i]]);

  $('#figure'+(i+1)).show();

  $('#figure'+(i+1)).highcharts({
    chart: {
     style: {
      fontFamily: 'Open Sans, sans-serif'
    },
    type: 'column'
  },
  gridLineWidth: 0,
  title: {
    text: 'Checks and Quality Reports'
  },
  subtitle: {
   text: legendName+" in "+countyTitle+" during "+periodTitle

 },
 xAxis: {
  type: 'category'
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

              format: '<span style="color:black;font-weight: normal;">{point.y:.0f}%</span>'+'<br><span style="color:black;font-weight: normal;">(N={point.total})</span>'
             /* useHTML : true,
              formatter: function () {
                return '<center  style="font-weight: normal;text-align:center">'+Math.round(this.point.y)+'%</center>'
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
                  this.renderer.text('Note:Only some facilities in each county are selected for quality checks.', 10, 390)
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
          name: legendName,
          data: formatedDataFigure[indicatorList[i]],

        }]
      });
}


for(var j= i; j < 8; j++) {


  $('#figure'+(j+1)).html('');
  $('#figure'+(j+1)).hide();

}



}

});





/*
*/

}
});

