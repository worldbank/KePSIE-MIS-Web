var srModule = angular.module("inspectionPlanningTableModule", []);
var visitPlanData = [];
var inspProgressData = [];
var scope;
var oTable1 = null;
var oTable2 = null;
var http = null;
var hideInspector = false;


srModule.controller("inspectionPlanningTableController", function ($scope, $http) {

    $scope.inspectors = [];
    http = $http;
    scope = $scope;
    $scope.inspPeriods = [];

   
    scope.currentReport = "VisitPlans";
     $("#inspectorProgressChart").hide();
     scope.selectedCounty = "All";
    populateCounties(populateInspectors);
   // populateInspectionPeriod();
    
    $scope.countyChanged = function() {
        console.log("countyChanged...");
        populateInspectors(populateInspectionPeriod)

       
    };

    $scope.filterChanged = function() {
        console.log("filterChanged...");
        populateInspectionPeriod();
        if(scope.currentReport=="VisitPlans") {
            visitPlanFilterChange();
        } else {
            inspProgressFilterChange();
            showProgrssChart();

        }
    };

    $scope.inspectionPeriodChanged = function() {
        console.log("inspectionPeriodChanged...");
       
        if(scope.currentReport=="VisitPlans") {
            visitPlanFilterChange();
        } else {
            inspProgressFilterChange();
            showProgrssChart();

        }
    };


    $scope.changeTable = function(report) {
        console.log("changeTable...");
        changeTableData(report);
    };

    $scope.exportExcel = function() {

        console.log("scope.visitPlanData : "+scope.visitPlanData);
        $("#reportExcelForm").submit();
    };

    $scope.exportPDF = function() {
        var reportHTML = "";
        if(scope.currentReport=="VisitPlans") {
            reportHTML = $("#reportRow").html();
        } else {
            reportHTML = $("#reportRow").html();
        }
        var reportCSS = $("#styleDiv").html();
        reportCSS = reportCSS.replace(/\n|\t/g, ' ');
        reportHTML = reportHTML.replace(/\n|\t/g, ' ');
        $("#reportCSS").val(reportCSS);
        $("#reportHTML").val(reportHTML);
        $("#reportPDFForm").submit();
    };

    function changeTableData(report) {
        if(scope.currentReport==report)
            return;
        if(report=="VisitPlans") {
             $("#inspectorProgressChart").hide();
            $("#visitPlansBtn").addClass("selectBtnStyle");
            $("#visitPlansBtn").removeClass("normalBtnStyle");
            $("#inspProgressBtn").addClass("normalBtnStyle");
            $("#inspProgressBtn").removeClass("selectBtnStyle");
            scope.currentReport = "VisitPlans";
           
           /*$("#countyDropdown").val("All");
          $("#inspectorDropdown").val("All");
          $("#inspPeriodDropdown").val("All");*/

          console.log(scope.selectedCounty);
          console.log(scope.selectedInspector);
          console.log(scope.selectedInspPeriod);

          scope.selectedCounty.key=scope.counties[0].key;
          scope.selectedCounty.value=scope.counties[0].value;
              scope.selectedInspector._id=scope.inspectors[0]._id;
               scope.selectedInspector.name=scope.inspectors[0].name;
            scope.selectedInspPeriod.key="All";
            scope.selectedInspPeriod.value="All";

             scope.selectedCounty = "All";

            visitPlanFilterChange();

           /* scope.selectedCounty.value="All";
              scope.selectedInspector="All";
            scope.selectedInspPeriod="All";*/
            
            $("#inspProgressReport").hide();
            $("#inspVisitPlanReport").show();
        } else {
             $("#inspectorProgressChart").show();
            $("#visitPlansBtn").addClass("normalBtnStyle");
            $("#visitPlansBtn").removeClass("selectBtnStyle");
            $("#inspProgressBtn").addClass("selectBtnStyle");
            $("#inspProgressBtn").removeClass("normalBtnStyle");
            scope.currentReport = "InspectorProgress";
           

         scope.selectedCounty.key=scope.counties[0].key;
          scope.selectedCounty.value=scope.counties[0].value;
              scope.selectedInspector._id=scope.inspectors[0]._id;
               scope.selectedInspector.name=scope.inspectors[0].name;
            scope.selectedInspPeriod.key="All";
             scope.selectedInspPeriod.value="All";


            inspProgressFilterChange();
            
            $("#inspProgressReport").show();
            $("#inspVisitPlanReport").hide();
        }
    }

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
           
           
         
            callback(visitPlanFilterChange);
       

            
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
                period.key = i;
                period.value = inspPeriods[i];
                inspPeriodArr.push(period);
            }

            $scope.inspPeriods = inspPeriodArr;
           
            console.log("insp.....");
            console.log($scope.inspPeriods);
           
           $scope.selectedInspPeriod = $scope.inspPeriods[0];
            callback();
        }, function myError(response) {
            console.log(response.statusText);
        });
    }

    function visitPlanFilterChange() {

        console.log("visitPlanFilterChange--------");
        console.log(scope.selectedInspPeriod);
      

        http({
            method: "POST",
            url: routesPrefix+"/inspectionplanning/table/getVisitPlanData",
            data: {
                county : scope.selectedCounty.value,
                inspector : scope.selectedInspector,
                inspPeriod : scope.selectedInspPeriod
            }
        }).then(function mySucces(response) {
            visitPlanData = response.data.visitPlanData;
            scope.visitPlanData = JSON.stringify(visitPlanData);
            console.log("visitPlanData");
            console.log(visitPlanData);

            hideInspector = response.data.hideInspectorColumn;
          
            $("#inspVisitPlanBody").html("");
            prepareVisitPlanTableBody(visitPlanData);
            scope.tableCSS = $("#styleDiv").html();
            scope.tableHTML = $("#inspVisitPlanReportDiv").html();
        }, function myError(response) {
            console.log(response.statusText);
        });
    }

    function inspProgressFilterChange() {

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
            $("#inspProgressPlanBody").html("");
            prepareInspProgressTableBody(inspProgressData);
            scope.tableCSS = $("#styleDiv").html();
            scope.tableHTML = $("#inspProgressReportDiv").html();
        }, function myError(response) {
            console.log(response.statusText);
        });
    }

    function prepareVisitPlanTableBody(visitPlanData) {
        var inspectorColumn = [2];
        var inspectorColumnClass = "centerCell";
        var descColumn = [3,7,8,9,10,11,14];
        var descColumnClass = "hideCell";
       /* if(hideInspector) {
            inspectorColumnClass = "hideCell centerCell";
            $("#inspectorH").hide();
        }*/
        console.log("visitPlanData");
        console.log(visitPlanData);


        function format ( d ) {
    return 'Nearest Market: '+ d.p_nearest_market+'<br>'+
        'SCHMT Office: '+d.p_schmt+' <br>'+
        'Distance from  County Office (km): '+d.p_distance_county+'<br>'+
        'Transportation Mode: '+d.p_transtype+'<br>'+
        'Detailed Dscription of Location: '+d.p_description+'<br>';
        
    }




        oTable1 = $('#inspVisitPlanReportTable').DataTable({
            destroy: true,
            data: visitPlanData,

            //columns : subHeaderData,
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,

            


            /*"aoColumnDefs": [
            {className: "centerCell", "targets": [4,5,6,12,13]},
            {className: inspectorColumnClass, "targets": inspectorColumn},
            {className: descColumnClass, "targets": descColumn},
                //"defaultContent": "",
                ],*/
                "columns": [
               
                { "data": "_county" },
                { "data": "_subcounty" },
                { "data": "_inspectorname" },
                 { "data": "_hfid" },
                { "data": "_hfname" },
                { "data": "_ownership" },
                { "data": "_level" },                
                { "data": "p_incharge" },
                { "data": "p_incharge_no" },
                 {
                "class":          "details-control",
                "orderable":      false,
                "data":           null,
                "defaultContent": "",
                mRender: function ( data, type, row ) {
                 return  '<div  class="actionDiv"><a style="font-size: 12px;" class="btn btn-primary"  title="Details">Details</a></div></div>';

            }
        }
               
                ]
            });



         var detailRows = [];
 
    $('#inspVisitPlanReportTable tbody').on( 'click', 'tr td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = oTable1.row( tr );
        var idx = $.inArray( tr.attr('id'), detailRows );
 
        if ( row.child.isShown() ) {
            tr.removeClass( 'details' );
            row.child.hide();
 
            // Remove from the 'open' array
            detailRows.splice( idx, 1 );
        }
        else {
            tr.addClass( 'details' );
            row.child( format( row.data() ) ).show();
 
            // Add to the 'open' array
            if ( idx === -1 ) {
                detailRows.push( tr.attr('id') );
            }
        }
    } );
 
    // On each draw, loop over the `detailRows` array and show any child rows
    oTable1.on( 'draw', function () {
        $.each( detailRows, function ( i, id ) {
            $('#'+id+' td.details-control').trigger( 'click' );
        } );
    
} );


    }

    function prepareInspProgressTableBody(inspProgressData) {
        var inspectorColumn = [0];
        var inspectorColumnClass = "centerCell";
        if(hideInspector) {
            inspectorColumnClass = "hideCell centerCell";
            $("#inspectorH").hide();
        }
        oTable2 = $('#inspProgressReportTable').dataTable({
            data: inspProgressData,
            //columns : subHeaderData,
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "aoColumnDefs": [
            {className: "centerCell", "targets": [1,2,3,4]},
            {className: inspectorColumnClass, "targets": inspectorColumn},
            ],
            "columns": [
            { "data": "inspectorName" },
            { "data": "visited" },
            { "data": "pending" },
            { "data": "total" },
            { "mData": "progress",
             "mRender": function ( data, type, row ) {
                   // return  '<div class="actionsDiv"><div  class="actionDiv"><a style="font-size: 12px;" class="btn btn-primary" href="#deleteConfirmation" title="Delete">Delete</a></div></div>';
                  return Math.round(data)+"%";
          

                }},
            ]
        });

        showProgrssChart(inspProgressData);
    }

    function showProgrssChart(inspProgressData) {

      console.log("showProgrssChart");
       var inspectorNameArr = [];
       var progress = [];

       for(i =0 ;i <inspProgressData.length;i++) {
            inspectorNameArr.push(inspProgressData[i].inspectorName);
       }
       for(i =0 ;i <inspProgressData.length;i++) {
            progress.push(inspProgressData[i].progress);
       }
       var countyObj = {};
       countyObj.value = "All";
    
    $('#inspectorProgressChart').highcharts({
        chart: {
             style: {
            fontFamily: 'Open Sans, sans-serif'
        },
            type: 'bar'
        },
        title: {
            text: 'Inspector Progress Report'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: inspectorNameArr,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Progress Percentage (%)',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: '',

                
                formatter: function () {
                    return ''+Math.round(this.point.y)+'%';
                },
           
        },
        plotOptions: {
            bar: {
                dataLabels: {
                enabled: true,
                
                formatter: function () {
                    return '<div  style="font-weight: normal;" >'+Math.round(this.point.y)+'%</div>';
                },
            }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,   
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Progress',
            data: progress,
            pointWidth: 10
        }]
    });
       
}

});
