var srModule = angular.module("inspectionProgressMapModule", []);
var facilities = [];
var markerWinId = "markerInfoWindow";

srModule.controller("inspectionProgressMapController", function ($scope, $http) {

    if($("#markerInfoWindow").length!=0) {
        markerWinId = "markerInfoWindow";
    } else if($("#markerProgressInfoWindow").length!=0) {
        markerWinId = "markerProgressInfoWindow";
    } else {
        markerWinId = "markerPlanningInfoWindow";
    }
    console.log("markerWinId : "+markerWinId);

    $scope.countyValue = $("#countyDropdown").val();
    $scope.ownershipValue = "all";
    $scope.levelValue = "all";

    $http({
        method: "GET",
        url: routesPrefix+"/summaryjhic/map/getData"
    }).then(function mySucces(response) {
        facilities = response.data.facilities;
        initMapProgress();
    }, function myError(response) {
        console.log(response.statusText);
    });

    $scope.exportAsKML = function () {
        $http({
            method: "POST",
            url: routesPrefix+"/summaryjhic/map/exportAsKML",
            date: {
                county: $("#countyDropdown").val(),
                ownership: $("#ownershipDropdown").val(),
                level: $("#levelDropdown").val(),
            }
        }).then(function mySucces(response) {

        }, function myError(response) {
            console.log(response.statusText);
        });
    }
});

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

function initMapProgress() {



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
    renderLegendProgress();

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

        if (($("#countyDropdown").val() == "All" || $("#countyDropdown").val() == facilities[i]._county)
            && ($("#ownershipDropdown").val() == "all" || $("#ownershipDropdown").val() == facilities[i]._ownership)
            && ($("#levelDropdown").val() == "all" || $("#levelDropdown").val() == facilities[i]._level)) {

            var iconPath = routesPrefix+"/images/green_marker.png";
        if (facilities[i].m_visit_completed == "No") {
                iconPath = routesPrefix+"/images/light_red_marker.png";
            }else if (facilities[i].m_visit_completed == "Yes") {
                iconPath = routesPrefix+"/images/yellow_marker.png";
            }
           

            var marker = new google.maps.Marker({
                position: {lat: parseFloat(facilities[i].p_latitude), lng: parseFloat(facilities[i].p_longitude)},
                map: map,
                title: facilities[i]._hfid,
                animation: google.maps.Animation.DROP,
                icon: iconPath
            });

            console.log(facilities[i]);
            setInfoWindowData1(facilities[i]);
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

function renderLegendProgress() {

   

    var legend = document.getElementById('legend');
    legend.innerHTML = "";

    var div = document.createElement('span');
    div.innerHTML = '';
    legend.appendChild(div);

      var div = document.createElement('div');
    div.innerHTML = '<img src="'+routesPrefix+'/images/yellow_marker.png"> ' + "Complete";
    legend.appendChild(div);

     var div = document.createElement('div');
    div.innerHTML = '<img src="'+routesPrefix+'/images/light_red_marker.png"> ' + "Incomplete";
    legend.appendChild(div);


  

   
}


function setInfoWindowData1(data) {
       
    console.log("progress data");
    console.log(data);
    console.log(data._level);

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

    if(markerWinId=="markerInfoWindow") {
        $("#facilityIdIW").html("<a href='javascript:;' target='_blank'>" + data._hfid + "</a>");
        $("#latIW").html(data.p_latitude);
        $("#lngIW").html(data.p_longitude);
        $("#hfNameIW").html(data._hfname);
        $("#subCountyIW").html(data._subcounty);
        $("#locationIW").html(data.p_location);
        $("#levelIW").html(data._level);
        $("#pubIW").html(data._ownership);
        $("#marketSizeIW").html(data.p_market_size);
        $("#patientsMonthIW").html(data.patientsMonth);
       
        $("#totalPSIW").html(data.total_ps);
        $("#riskCIW").html(data.risk_c);
        $("#thirdIW").html(data.third);
    } else if(markerWinId=="markerProgressInfoWindow") {
        $("#facilityIdIW").html("<a href='javascript:;' target='_blank'>" + data._hfid + "</a>");
        $("#facilityNameIW").html(data._hfname);
        $("#countyIW").html(data._county);
        $("#subCountyIW").html(data._subcounty);
        $("#ownershipIW").html(data._ownership);
        $("#levelIW").html(data._level);
        $("#jhicScoreIW").html("500");
        $("#marketSizeIW").html(data.p_market_size);
        $("#riskCIW").html(data.risk_c);
        $("#followUpActionIW").html(data.m_followup_action);
    } else {
        $("#facilityIdIW").html("<a href='javascript:;' target='_blank'>" + data._hfid + "</a>");
        $("#facilityNameIW").html(data._hfname);
        $("#locationIW").html(data.p_location);
        $("#ownershipIW").html(data._ownership);
        $("#levelIW").html(data._level);
        $("#patientsDayIW").html("123");
        $("#hoursIW").html("12");
        $("#marketSizeIW").html(data.p_market_size);
        $("#nearestMarketIW").html("Buuri");
        $("#inChargeNameIW").html("Oscar Kambi");
        $("#inChargeNumIW").html("715-226-389");
    }
}
