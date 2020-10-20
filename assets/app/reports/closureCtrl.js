var srModule = angular.module("closureModule", []);


srModule.controller("closureCtrl", function ($scope, $http) {

	$scope.selectAuthority="All";
	$scope.selectStatus="Yes";

	$http({
        method: "GET",
        url: routesPrefix+"/inspectionplanning/getFilterValues",
    }).then(function mySucces(response) {
      	
        $scope.counties = response.data.countyList;
        $scope.selectedCounty = $scope.counties[0];
    });

    $scope.countyValue= "All";
    $scope.ownershipValue= "All";
    $scope.levelValue= "All";



    $scope.filterChange= function(){
        var data={};
        data.county= $scope.countyValue;
        data.ownership= $scope.ownershipValue;
        data.level= $scope.levelValue;

    $http.post(routesPrefix+'/closure/getGraceRenewData',data).success(function(data){
        var gracePeriodRenew= data.gracePeriodRenew;
        $('#grace_graph').highcharts({
            chart: {
                style: {
                    fontFamily: 'Open Sans, sans-serif'
                },
                type: 'column',
                height: 400
            },
            gridLineWidth: 0,
            title: {
                text: '3-month Grace Period for Licensing Issues',
                style: {"fontSize": "16px"}
            },
            subtitle: {
                text: 'Number of facility or department licenses'
            },
            legend : {
                verticalAlign: 'top',
                //layout: 'vertical',
                y: 45,
                itemMarginTop: 10,
                itemWidth : 300
                //padding: 25,
                //itemMarginTop: 20
            },
            xAxis: {
                categories: ['Facility', 'Laboratory', 'Pharmacy','Radiology','Nutrition'],
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
                crosshair: true
            },
            yAxis: {
                gridLineWidth: 0,
                min: 0,
                labels: {
                    formatter: function() {
                        return this.value;
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
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}:&nbsp; </td>' +
                '<td style="padding:0"><b>{point.y:.0f} </b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
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
                            return '<div style="font-weight: normal;">'+Math.round(this.point.y) +'</div>';
                        },
                    }
                }
            },
            exporting: {
                chartOptions:{
                    legend:{
                            enabled:true,
                            itemStyle: {fontSize: '10px'}
                        },
                    chart:{
                        events: {
                            load: function(event) { 
                                this.renderer.image(logourl,0,0,50,50).add();    
                            }
                        }
                    }
                },
                // fallbackToExportServer: false,  
                filename: 'Grace_Period_License_Report (LiceNse)_'+formateDate(),
            },
            series:gracePeriodRenew
        });
    });   

    $http.post(routesPrefix+'/closure/getClosureStatus',data).success(function(data){
        var closureData= data.closureData;
        $('#closure_graph').highcharts({
            chart: {
                style: {
                    fontFamily: 'Open Sans, sans-serif'
                },
                type: 'column',
                height: 400
            },
            gridLineWidth: 0,
            title: {
                text: 'Facility/Department Closure Status',
                style: {"fontSize": "16px"}
            },
            subtitle: {
                text: 'Number of closure requests or physical closures'
            },
            legend : {
                verticalAlign: 'top',
                //layout: 'vertical',
                y: 45,
                itemMarginTop: 10,
                //padding: 25,
                //itemMarginTop: 20
            },
            xAxis: {
                categories: ['Facility', 'Laboratory', 'Pharmacy','Radiology','Nutrition'],
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
                crosshair: true
            },
            yAxis: {
                gridLineWidth: 0,
                min: 0,
                labels: {
                    formatter: function() {
                        return this.value;
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
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}:&nbsp; </td>' +
                '<td style="padding:0"><b>{point.y:.0f} </b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
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
                            return '<div style="font-weight: normal;">'+Math.round(this.point.y) +'</div>';
                        },
                    }
                }
            },
            exporting: {
                chartOptions:{
                    legend:{
                            enabled:true,
                            itemStyle: {fontSize: '10px'}
                        },
                    chart:{
                        events: {
                            load: function(event) { 
                                this.renderer.image(logourl,0,0,50,50).add();    
                            }
                        }
                    }
                },
                // fallbackToExportServer: false,  
                filename: 'Closure_Report_'+formateDate(),
            },
            series:closureData
        });
    }); 
}
$scope.filterChange();
});