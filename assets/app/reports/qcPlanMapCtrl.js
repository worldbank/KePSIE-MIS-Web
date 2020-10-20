var srModule = angular.module("qcPlanMapModule", []);

var scope;
var http = null;
var markerWinId = "markerInfoWindow";


srModule.controller("qcPlanMapCtrl", function ($scope, $http) {

     if($("#markerInfoWindow").length!=0) {
        markerWinId = "markerInfoWindow";
    } else if($("#markerProgressInfoWindow").length!=0) {
        markerWinId = "markerProgressInfoWindow";
    } else {
        markerWinId = "markerPlanningInfoWindow";
    }

    $scope.inspectors = [];
    http = $http;
    scope = $scope;
    $scope.inspPeriods = [];

    scope.selectedCounty = "All";
    $scope.selectedIndicator="All";
    populateCounties(populateQualityOfficer);

    $scope.countyChanged = function() {
        console.log("countyChanged...");
        populateQualityOfficer(populateInspectionPeriod)     
    };

    $scope.inspectorChanged = function() {
        console.log("filterChanged...");
        populateInspectionPeriod();

    };

    $scope.inspectionPeriodChanged = function() {
        console.log("inspectionPeriodChanged...");


        visitPlanMapInit();
        
    };
    $scope.indicatorChange = function() {
        console.log("indicatorChange...");


        visitPlanMapInit();
        
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


    function populateCounties(callback) {
        http({
            method: "GET",
            url: routesPrefix+"/inspectionplanning/getFilterValues",
        }).then(function mySucces(response) {
            scope.counties = response.data.countyList;
          
            scope.selectedCounty = scope.counties[0];
            callback(populateInspectionPeriod);

        }, function myError(response) {
            console.log(response.statusText);
        });
    }
    function populateQualityOfficer(callback) {

        http({
            method: "POST",
            url: routesPrefix+"/qualitychecks/getQualityOfficersNames",
            data: {
                county : scope.selectedCounty
            }
        }).then(function mySucces(response) {


            scope.officers = null;
            scope.selectedOfficer = null;
            scope.officers = response.data.Officers;
            if(scope.officers.length==0) {
                scope.officers.push({name:"All",_id:"All"});
                scope.selectedOfficer = scope.officers[0];
            } else {
                if(scope.officers.length>1){
                    scope.officers.unshift({name:"All",_id:"All"});
                }
                scope.selectedOfficer = scope.officers[0];
            }     
            callback();
            
        }, function myError(response) {
            console.log(response.statusText);
        });
    }

    function populateInspectionPeriod() {
        //populate inspector names dropdown
        console.log("populateInspectionPeriod==============");
        console.log(scope.selectedCounty);
        console.log(scope.selectedOfficer);
        http({
            method: "POST",
            url: routesPrefix+"/inspectionplanning/inspectionPeriods",
            data: {
             county : scope.selectedCounty,
             inspector : scope.selectedOfficer,
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
        visitPlanMapInit();
    }, function myError(response) {
        console.log(response.statusText);
    });
 }

 function visitPlanMapInit() {

    console.log("visitPlanMapInit--------");
    console.log(scope.selectedInspPeriod.value);
    console.log(scope.selectedOfficer._id);
    console.log(scope.selectedCounty.value);

    http({
        method: "POST",
        url: routesPrefix+"/qualitychecks/planning/mapdata",
        data: {
            county : scope.selectedCounty.value,
            inspector : scope.selectedOfficer._id,
            inspPeriod : scope.selectedInspPeriod.value
        }
    }).then(function mySucces(response) {

        var facilities=response.data;

        console.log("VisitPlan Map facilities");
        console.log(facilities);
        initVisitPlanMapQuality();

        function loadCountyBorderData(callback, filePath, map) {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");

    xobj.open('GET', filePath, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText, map);
        }
    };
    xobj.send(null);
}

function highlightRegion(data, map) {
    var borderData = JSON.parse(data).features[0].geometry.coordinates[0][0];
    var data = [];
    for (i in borderData) {
        var lng = borderData[i][0];
        var lat = borderData[i][1];
        data.push({lat: lat, lng: lng});
    }

    var region = new google.maps.Polygon({
        paths: data,
        strokeColor: '#31708f',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#31708f',
        fillOpacity: 0.35
    });
    region.setMap(map);
}

function initVisitPlanMapQuality() {
    var map = null;
    console.log("as : " + $("#countyDropdown").val());
    var mapDiv = document.getElementById('map');
    if ($("#countyDropdown").val() == "All") {
        //all
        map = new google.maps.Map(mapDiv, {
            center: {lat: -1.3047997, lng: 36.7073069},
            zoom: 7
        });
    } else if ($("#countyDropdown").val() == "1") {
        //kakamega
        map = new google.maps.Map(mapDiv, {
            center: {lat: 0.2818605, lng: 34.7286168},
            zoom: 9
        });
    } else if ($("#countyDropdown").val() == "2") {
        //kilifi
        map = new google.maps.Map(mapDiv, {
            center: {lat: -3.5372587, lng: 39.7565459},
            zoom: 8
        });
    } else {
        //meru
        map = new google.maps.Map(mapDiv, {
            center: {lat: 0.0483656, lng: 37.6260278},
            zoom: 9
        });
    }

    //add legend
    var legend = document.getElementById('legend');
    if (legend == null) {
        legend = document.createElement('div');
        legend.setAttribute("id", "legend");
        document.body.appendChild(legend);
    }
    console.log("legend : " + legend);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
    renderLegend();

    google.maps.event.addListenerOnce(map, 'idle', function () {
        $("#legend").show();
        //draw regions
        loadCountyBorderData(highlightRegion, assetURL+"/data/Kakamega.GeoJson", map);
        loadCountyBorderData(highlightRegion, assetURL+"/data/Kilifi.GeoJson", map);
        loadCountyBorderData(highlightRegion, assetURL+"/data/Meru.GeoJson", map);
    });

    var infoWindow = new google.maps.InfoWindow({
        maxWidth: "1000"
    });
    for (i in facilities) {
        var flag=0;

         var iconPath = assetURL+"/images/green_marker.png";
         if(scope.selectedIndicator=="All"){
        if(facilities[i].q_jhic==1 && facilities[i].q_scorecards==1 && facilities[i].q_closure==1 &&
        facilities[i].q_closure_rad==1 && facilities[i].q_closure_lab==1 && 
        facilities[i].q_closure_nutri==1 && facilities[i].q_closure_pharm==1  ){
            console.log("check 1");
       
        if (facilities[i].q_jhic_comp==0 && facilities[i].q_scorecards_comp==0 &&
         facilities[i].q_closure_comp==0 &&
        facilities[i].q_closure_rad_comp==0 && facilities[i].q_closure_lab_comp==0 && 
        facilities[i].q_closure_nutri_comp==0 && facilities[i].q_closure_pharm_comp==0) {

            iconPath = assetURL+"/images/light_red_marker.png";
            flag=1;
        }else if (facilities[i].q_jhic_comp==1 && facilities[i].q_scorecards_comp==1 &&
         facilities[i].q_closure_comp==1 &&
        facilities[i].q_closure_rad_comp==1 && facilities[i].q_closure_lab_comp==1 && 
        facilities[i].q_closure_nutri_comp==1 && facilities[i].q_closure_pharm_comp==1) {
            iconPath = assetURL+"/images/yellow_marker.png";
            flag=1;
        } 
    }
}else{
    var indicatorList= [ 'q_jhic', 'q_scorecards','q_closure', 'q_closure_rad',
 'q_closure_lab', 'q_closure_nutri','q_closure_pharm'];

 var indicatorListComp=[ 'q_jhic_comp', 'q_scorecards_comp','q_closure_comp',
 'q_closure_rad_comp',
 'q_closure_lab_comp', 'q_closure_nutri_comp','q_closure_pharm_comp'];

var tmpIndiactor=['JHIC Discrepancies', 'Scorecard Non-Adherence',
'Facility Closure Non-Adherence', 'Pharmacy Closure Non-Adherence',
 'Lab Closure Non-Adherence', 'Radiology Closure Non-Adherence',
 'Nutrition Closure Non-Adherence'];

var index=tmpIndiactor.indexOf(scope.selectedIndicator);

if(index!=-1){


      if(facilities[i][indicatorList[index]]==1   ){
            console.log("check here");
       
        if (facilities[i][indicatorListComp[index]]==0 ) {

            iconPath = assetURL+"/images/light_red_marker.png";
            flag=1;
        }else if (facilities[i][indicatorListComp[index]]==1 ) {
            iconPath = assetURL+"/images/yellow_marker.png";
            flag=1;
        } 
    }

}




}
    if(flag==1){
        var marker = new google.maps.Marker({
            position: {lat: parseFloat(facilities[i].p_latitude), lng: parseFloat(facilities[i].p_longitude)},
            map: map,
            title: facilities[i]._hfid,
            animation: google.maps.Animation.DROP,
            icon: iconPath
        });

        setInfoWindowData(facilities[i]);
            //Attach click event to the marker.
            (function (marker, data) {

                google.maps.event.addListener(marker, "click", function (e) {
                    //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.

                    infoWindow.setContent(data);
                    infoWindow.open(map, marker);
                });
            })(marker, $("#"+markerWinId).html());
        }

        
    }
    }

    function renderLegend() {
        var legend = document.getElementById('legend');
        legend.innerHTML = "";


        var div = document.createElement('div');
        div.innerHTML = '<img src="'+assetURL+'/images/light_red_marker.png"> ' + "Incomplete";
        legend.appendChild(div);


        var div = document.createElement('div');
        div.innerHTML = '<img src="'+assetURL+'/images/yellow_marker.png"> ' + "Completed";
        legend.appendChild(div);
    }


    function setInfoWindowData(data) {


        // var county = "Kakamega";
        // if(data.county=="1") {
        //     county = "Kakamega";
        // } else if(data.county=="2") {
        //     county = "Kilifi";
        // } else if(data.county=="3") {
        //     county = "Meru";
        // } else {
        //     county = "All";
        // }


        $("#facilityIdIW").html("<a href='javascript:;' target='_blank'>" + data._hfid + "</a>");

        $("#facilityNameIW").html(data._hfname);
        $("#countyIW").html(data._county);
        $("#subCountyIW").html(data._subcounty);
        $("#ownershipIW").html(data._ownership);
        $("#levelIW").html(data._level);

        $("#marketSizeIW").html(data.p_market_size);

        $(".markerInfoWindowTable td label").css("padding-left","10%");


    }









});
}





});
