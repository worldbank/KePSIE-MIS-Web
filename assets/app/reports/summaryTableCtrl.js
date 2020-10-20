var srModule = angular.module("summaryTableModule", []);
var headerData = [];
var subHeaderData = [];
var summaryData = [];
var scope;
var http = null;
var oTables = [];
var data4excel=[];

srModule.controller("summaryTableController", function ($scope, $http) {
    http = $http;
    scope = $scope;
    onFilterChange();
    
});

function onFilterChange() {
    http({
        method: "POST",
        url: routesPrefix+"/summaryjhic/table/getData",
        data: {
            hfUnit: $("#hfUnitDropdown").val(),
            hfType: $("#hfTypeDropdown").val(),
            hfRegion: $("#hfRegionDropdown").val()
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

       
        data4excel=response.data.SummaryReportResponse;
        scope.dataExcel={excelData:data4excel};

        if($("#hfTypeDropdown").val()!="All" && 
            $("#hfRegionDropdown").val()!="All") {




            headerData = response.data.SummaryReportResponse[0].headerData;
        subHeaderData = response.data.SummaryReportResponse[0].subHeaderData;
        summaryData = response.data.SummaryReportResponse[0].summaryData;
        footData = response.data.SummaryReportResponse[0].footData;




        for(i in oTables) {
            var oTable = oTables[i];
            if (oTable != null) {
                oTable.fnClearTable();
                oTable.fnDestroy();
                oTable = null;
            }
        }

        if($("#hfRegionDropdown").val()=="By County") {

           console.log("response.SummaryReportResponse[1]");
        console.log(response.data.SummaryReportResponse[1]);


          headerData1 = response.data.SummaryReportResponse[1].headerData;
          subHeaderData1 = response.data.SummaryReportResponse[1].subHeaderData;
          summaryData1 = response.data.SummaryReportResponse[1].summaryData;
          footData1 = response.data.SummaryReportResponse[1].footData;


          headerData2 = response.data.SummaryReportResponse[2].headerData;
          subHeaderData2 = response.data.SummaryReportResponse[2].subHeaderData;
          summaryData2 = response.data.SummaryReportResponse[2].summaryData;
          footData2 = response.data.SummaryReportResponse[2].footData;


          headerData3 = response.data.SummaryReportResponse[3].headerData;
          subHeaderData3 = response.data.SummaryReportResponse[3].subHeaderData;
          summaryData3 = response.data.SummaryReportResponse[3].summaryData;
          footData3 = response.data.SummaryReportResponse[3].footData;


          $("#countyHeader1").show();
          $("#countyHeader2").show();
          $("#countyHeader3").show();
          $("#countyHeader4").show();
          $("#summaryReportTable1").show();
          $("#summaryReportTable2").show();
          $("#summaryReportTable3").show();
          $("#summaryReportTable4").show();

          if($("#hfUnitDropdown").val()!=1){
            prepareHeader(headerData, subHeaderData, "summaryReportTable1");
            prepareBody(summaryData, subHeaderData, "summaryReportTable1",function(){ prepareFooter(footData, "summaryReportTable1")});
       //  prepareFooter(footData, "summaryReportTable1");



       prepareHeader(headerData1, subHeaderData1, "summaryReportTable2");
       prepareBody(summaryData1, subHeaderData1, "summaryReportTable2",function(){ prepareFooter(footData1, "summaryReportTable2")});
        //  prepareFooter(footData, "summaryReportTable2");



        prepareHeader(headerData2, subHeaderData2, "summaryReportTable3");
        prepareBody(summaryData2, subHeaderData2, "summaryReportTable3",function(){ prepareFooter(footData2, "summaryReportTable3")});
      //  prepareFooter(footData, "summaryReportTable3");


      prepareHeader(headerData3, subHeaderData3, "summaryReportTable4");
      prepareBody(summaryData3, subHeaderData3, "summaryReportTable4",function(){ prepareFooter(footData3, "summaryReportTable4")});
                 //   prepareFooter(footData, "summaryReportTable4");
             } else{
                $('body > a:first').remove();
                prepareHeader(headerData, subHeaderData, "summaryReportTable1");
                prepareFooter(footData, "summaryReportTable1");
                prepareHeader(headerData1, subHeaderData1, "summaryReportTable2");
                prepareFooter(footData1, "summaryReportTable2");
                prepareHeader(headerData2, subHeaderData2, "summaryReportTable3");
                prepareFooter(footData2, "summaryReportTable3");
                prepareHeader(headerData3, subHeaderData3, "summaryReportTable4");
                prepareFooter(footData3, "summaryReportTable4");
            }

        } else if($("#hfRegionDropdown").val()=="1") {
            $("#countyHeader2").show();
            $("#summaryReportTable2").show();

            prepareHeader(headerData, subHeaderData, "summaryReportTable2");

            if($("#hfUnitDropdown").val()!=1){
                prepareBody(summaryData, subHeaderData, "summaryReportTable2",function(){ prepareFooter(footData, "summaryReportTable2")});
            } else{
               prepareFooter(footData, "summaryReportTable2");
               $('body > a:first').remove();
           }
            //     prepareFooter(footData, "summaryReportTable2");
        } else if($("#hfRegionDropdown").val()=="2") {
            $("#countyHeader3").show();
            $("#summaryReportTable3").show();

            prepareHeader(headerData, subHeaderData, "summaryReportTable3");
              //  prepareFooter(footData, "summaryReportTable3");
              if($("#hfUnitDropdown").val()!=1){
                prepareBody(summaryData, subHeaderData, "summaryReportTable3",function(){ prepareFooter(footData, "summaryReportTable3")});
            } else{
                prepareFooter(footData, "summaryReportTable3");
                $('body > a:first').remove();
            }
        } else if($("#hfRegionDropdown").val()=="3") {
            $("#countyHeader4").show();
            $("#summaryReportTable4").show();
            prepareHeader(headerData, subHeaderData, "summaryReportTable4");
            if($("#hfUnitDropdown").val()!=1){

                prepareBody(summaryData, subHeaderData, "summaryReportTable4",function(){ prepareFooter(footData, "summaryReportTable4")});

            } else{
                prepareFooter(footData, "summaryReportTable4");
                $('body > a:first').remove();
            }
        }
        scope.tableHTML = $("#summaryReportDiv").html();
    } else {
            //single table
            $("#summaryReportTable1").show();
            headerData = response.data.SummaryReportResponse[0].headerData;
            subHeaderData = response.data.SummaryReportResponse[0].subHeaderData;
            summaryData = response.data.SummaryReportResponse[0].summaryData;
            footData = response.data.SummaryReportResponse[0].footData;
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
                prepareBody(summaryData, subHeaderData, "summaryReportTable1",function(){ prepareFooter(footData, "summaryReportTable1")});
            } else{
               prepareFooter(footData, "summaryReportTable1");
               $('body > a:first').remove();
           }
          //   prepareFooter(footData, "summaryReportTable1");

      }




      

      scope.selectedCounty = $("#hfRegionDropdown option:selected").text();
      scope.selectedFacilityType = $("#hfTypeDropdown option:selected").text();
      scope.selectedUnit = $("#hfUnitDropdown option:selected").text();

        if($("#hfTypeDropdown").val()=="All" &&
    $("#hfRegionDropdown").val()!="By County"){
   
    $(".table-scrollable").removeClass("table-scrollable");
    $("#summaryReportTable1").css("width","60%");
      $("#summaryReportTable1").css("margin","auto");
    
   }else if($("#hfTypeDropdown").val()==3 ){
     
      $(".table-scrollable").removeClass("table-scrollable");
      $(".table").css("width","80%");
      $(".table").css("margin","auto");
      $(".countyHeader").css("margin-right","30%");
   }
   else{
     $("#summaryReportTable1").css("width","100%");
      $(".table").css("width","100%");
   }

      if ($(".table-scrollable")[0]){
        $(".countyHeader").addClass("countyHeaderMargin");
    } else {
        $(".countyHeader").removeClass("countyHeaderMargin");
    }

    scope.tableHTML = $("#summaryReportDiv").html();

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
        headerHTML = headerHTML ;
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

function prepareFooter(footData, tableId) {
    var footerHTML = '</div><tfoot>';
    footerHTML = footerHTML + '<tr>';
    footerHTML = footerHTML + '<th style="text-align: center;">Mean Score</th>';
    for (i in footData) {

      if(footData[i].score.indexOf("%")==-1){
        if(isNaN(footData[i].score)){
        footerHTML = footerHTML + '<th style="text-align: center;">N/A' ;

      }else{
        footerHTML = footerHTML + '<th style="text-align: center;">' + Math.round(footData[i].score);
      }
    }else{
       var score= footData[i].score.split("%");
       if(isNaN(score[0])){
        footerHTML = footerHTML + '<th style="text-align: center;">N/A' ;

      }else{
       footerHTML = footerHTML + '<th style="text-align: center;">' + Math.round(score[0]).toString() +"%";
}
       
   }
 
} + '</th>';

footerHTML = footerHTML + '<tr class="sectionNote "><td colspan="12" style="font-weight: normal;font-size: 10px !important;">Note: N/A is used to indicate when information is not available, because health facilities inspected may not have that particular unit/service. </td></tr></tfoot>';
$("#"+tableId).append(footerHTML);
}

