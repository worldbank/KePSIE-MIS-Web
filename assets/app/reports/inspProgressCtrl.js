var srModule = angular.module("inspProgressModule", []);
var progressData = [];
var scope;
var oTable = null;
var http = null;
var hideInspector = false;

srModule.controller("inspProgressController", function ($scope, $http) {
    http = $http;
    scope = $scope;
    progressFilterChange();
});


function progressFilterChange() {
    http({
        method: "POST",
        url: routesPrefix+"/report/inspprogress/getData",
        data: {
            
        }
    }).then(function mySucces(response) {
        progressData = response.data.progressData;
        hideInspector = response.data.hideInspectorColumn;

        if (oTable != null) {
            oTable.fnClearTable();
            oTable.fnDestroy();
            oTable = null;
        }
        $("#inspProgressBody").html("");
        prepareProgressBody(progressData);
        scope.tableCSS = $("#styleDiv").html();
        scope.tableHTML = $("#inspProgressReportDiv").html();
    }, function myError(response) {
        console.log(response.statusText);
    });
}

function prepareProgressBody(progressData) {
    var inspectorColumn = [0];
    var inspectorColumnClass = "centerCell";
    if(hideInspector) {
        inspectorColumnClass = "hideCell centerCell";
        $("#inspectorH").hide();
    }
    oTable = $('#inspProgressReportTable').dataTable({
        data: progressData,
        //columns : subHeaderData,
        "paging": false,
        "ordering": false,
        "info": false,
        "searching": false,
        "aoColumnDefs": [
            {className: "centerCell", "targets": [1,2,3,4]},
            {className: inspectorColumnClass, "targets": inspectorColumn},
            //"defaultContent": "",
        ]
    });
}