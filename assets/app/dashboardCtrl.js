var srModule = angular.module("dashboardModule", []);

function formateDate(dt){
  var date;
  if(dt==undefined){
     date = new Date();
  }else{
     date = new Date(dt);
  }

 var month = date.getMonth() + 1;
 var dt=date.getDate();
 var hours=date.getHours();
 var minutes=date.getMinutes();
 var seconds=date.getSeconds();
 return (dt > 9 ? dt : "0" + dt) + "-" + (month > 9 ? month : "0" + month) + "-" + date.getFullYear()+"_"+hours+":"+minutes+":"+seconds;

}
   /* function generatePDF(){
        var reportHTMLOld = $(".page-content-wrapper").html();
        $(".rmvClass5").removeClass("col-md-5");
        $(".rmvClass7").removeClass("col-md-7");
        $("#insp_progress").highcharts().setSize(500, 400);
        $("#next_insp").highcharts().setSize(500, 400);
        $("#summary_jhic_unit").highcharts().setSize(800, 500);

        setTimeout(function(){ 

        var reportHTMLNew = $(".page-content-wrapper").html();
        $(".rmvClass5").addClass("col-md-5");
        $(".rmvClass7").addClass("col-md-7");
        $("#insp_progress").highcharts().setSize(181, 400);
        $("#next_insp").highcharts().setSize(265, 400);
        $("#summary_jhic_unit").highcharts().setSize(476, 500);
        
        reportHTMLNew = reportHTMLNew.replace(/\n|\t/g, ' ');
        $("#reportHTML").val(reportHTMLNew);
        $("#reportForm").submit();
         }, 1000);
       
    }*/

srModule.controller("dashboardController", function ($scope, $http) {

    console.log("graph_1_data angular ctrl");
    
     var doc = new jsPDF();
var specialElementHandlers = {
    '#editor': function (element, renderer) {
        return true;
    }
};
    
    $('#summary_jhic').highcharts({
        chart: {
            style: {
                fontFamily: 'Open Sans, sans-serif'
            },
            type: 'column',
            height: 500
        },
        gridLineWidth: 0,
        title: {
            useHTML: true,
            text: 'Facilities by Compliance Category <a href="#notes" style="color: rgb(51, 51, 51);" ><sup>4</sup></a>',
            style: {"fontSize": "16px"}
        },
        subtitle: {

            text: 'Percentage of facilities per category (N='+summary_jhic_data.total_facility+')' 
        },
        legend : {
            padding: 25,
            itemWidth : 150
        },

        xAxis: {
            labels: {
                autoRotation: false,
            },
            title: {
                style: {

                    fontWeight: 'bold', color: '#000000'
                },
                text: ''
            },
            categories: summary_jhic_data.categoryArray,
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
                text: '% of Facilities'
            }
        },
        credits: {
            enabled: false
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr>' +
            '<td style="padding:0">{point.y:.0f} % </td>'+
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
                title: {
                        text:'Facilities by Compliance Category',
                        style: {"fontSize": "16px"}
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
            filename: 'Facility_ByCompliance_Report',
        },
        series:summary_jhic_data.seriesArray
    });
    $("#summary_jhic").highcharts().setSize(450, 500);

    $('#summary_jhic_unit').highcharts({
        chart: {
            style: {
                fontFamily: 'Open Sans, sans-serif'
            },
            type: 'bar',
            height: 500,
            spacingLeft: 20,
        },
        gridLineWidth: 0,
        title: {
            useHTML: true,
            text: 'Checklist Score by Unit <a href="#notes" style="color: rgb(51, 51, 51);" ><sup>5</sup></a>', 
            style: {"fontSize": "16px"}
        },
        subtitle: {
            text: 'Percentage of maximum score (N='+summary_jhic_data_unit.total_count+')'
        },
        legend : {
            padding: 25,
            itemWidth : 150,
        },
        xAxis: {
            labels: {
                /*style: {
                    "textOverflow": "none"
                }*/
            },
            title: {
                style: {

                    fontWeight: 'bold', color: '#000000'
                },
                text: ''
            },
            categories: summary_jhic_data_unit.categoryArray,
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
                text: '% of Maximum Score'
            }
        },
        credits: {
            enabled: false
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr>' +
            '<td style="padding:0">{point.y:.0f} % </td>'+
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
            sourceWidth: 1000,
            
            chartOptions:{
                title: {
                    text: 'Checklist Score by Unit', 
                    style: {"fontSize": "16px"}
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
            filename: 'Average_Checklist_ByUnit_Report',
        },
        series:summary_jhic_data_unit.seriesArray
    });
    $("#summary_jhic_unit").highcharts().setSize(450, 500);
    

    $('#checklist_county').highcharts({
        chart: {
            style: {
                fontFamily: 'Open Sans, sans-serif'
            },
            type: 'column',
            height: 400
        },
        gridLineWidth: 0,
        title: {
            text: 'Average Checklist Score by County and Ownership',
            style: {"fontSize": "16px"}
        },
        subtitle: {
            text: 'Percentage of maximum score',
        },
        legend : {
            verticalAlign: 'top',
            y: 30,
            padding: 25,
            itemWidth : 150,
            itemMarginTop: 10
        },
        xAxis: {
            categories: ['Kakamega', 'Kilifi', 'Meru'],
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
            headerFormat: '<span style="font-size:10px">{point.name}</span><table>',
            pointFormat: '<tr>' +
            '<td style="padding:0">{point.y:.0f} % </td>'+
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
                        }
                    }
                }
            },
            // fallbackToExportServer: false,  
            filename: 'Average_Checklist_ByOwnership_Report',
        },
        series:checklistByCountyByOwnership
    });

    $("#checklist_county").highcharts().setSize(450, 400);
    

 $('#graph_1').highcharts({
            chart: {
                style: {
                fontFamily: 'Open Sans, sans-serif'
            },
                type: 'column',
                height: 400
            },
            gridLineWidth: 0,
            title: {
                text: 'Average Checklist Score by County',
                style: {"fontSize": "16px"}
            },
            subtitle: {
                text: 'Percentage of maximum score'
            },
            colors: ['#E0C571'],
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'Total percent market share'
                }
            },
            legend: {
                enabled: true
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                       format:'<span style="text-align:center;color:black;font-weight: normal;">{point.y:0f}%</span>'+'<br><span style="color:black;font-weight: normal;">(N={point.count})</span>'
                    }
                }
            },
    credits: {
      enabled: false
    },
            tooltip: {
                headerFormat: '<span style="font-size:11px">{point.key}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:0f}%</b><br/>'
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
        text: ""
      }
    },
    exporting: {
        chartOptions:{
            chart:{
                events: {
                    load: function(event) { 
                        this.renderer.image(logourl,0,0,50,50).add();    
                    }
                }
            }
        },
        // fallbackToExportServer: false,  
        filename: 'Average_Checklist_ByCounty_Report',
    },
        series: [{
            showInLegend: false,
            pointWidth: 60,
            data:graph_1_data
        }]
    });
 $("#graph_1").highcharts().setSize(450, 400);

    $http.get(routesPrefix+'/getFirstInspData').success(function(data){
        console.log("getDashboardData");
        console.log(data);
       $("#loader1").hide();
        var first_insp_data= data.first_insp_data; 
   
        var insp_progress = $('#insp_progress').highcharts({
        chart: {
            style: {
                fontFamily: 'Open Sans, sans-serif'
            },
            type: 'column',
            height: 400
        },
        gridLineWidth: 0,
        title: {
            text: 'First Inspection',
            style: {"fontSize": "16px"}
        },
        subtitle: {
            text: 'Number of facilities' 
        },
        legend : {
            padding: 25,
            itemWidth : 150
        },
        xAxis: {
            labels: {
                autoRotation: false,
            },
            title: {
                style: {

                    fontWeight: 'bold', color: '#000000'
                },
                text: ''
            },
            categories: ['To be inspected','Inspected'],
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
            pointFormat: '<tr>' +
            '<td style="padding:0">{point.y:.0f} </td>'+
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
                        return '<div style="font-weight: normal;">'+Math.round(this.point.y) +'</div>';
                    },
                },
                showInLegend: false
            }
        },
        exporting: {
            chartOptions:{
                chart:{
                    events: {
                        load: function(event) { 
                            this.renderer.image(logourl,0,0,50,50).add();   
                        }
                    }
                }
            },
            // fallbackToExportServer: false,  
            filename: 'First_Inspection_Report',
        },
        series:first_insp_data
    });
       
        var first_insp_detail=first_insp_data[0].data;
        $scope.per_progress=(parseInt(first_insp_detail[1])/parseInt(first_insp_detail[0]))*100;
        $scope.per_progress=$scope.per_progress.toFixed();

    });
    $http.get(routesPrefix+'/getNextInspData').success(function(data){
        var next_insp_detail= data.next_insp_detail;
        $("#loader2").hide();

        var next_insp = $('#next_insp').highcharts({
    chart: {
        style: {
                fontFamily: 'Open Sans, sans-serif'
            },
        type: 'pie'
    },
    title: {
        useHTML: true,
        text: 'Time to Next Inspection <a href="#notes" style="color: rgb(51, 51, 51);" ><sup>7</sup></a>',
        style: {"fontSize": "16px"}
    },
    subtitle: {
        text: 'Percentage of facilities inspected'
    },
    tooltip: {
        pointFormat: '<b>{point.percentage:.0f}%</b>'
    },
    legend : {
            padding: 25,
            itemWidth : 100
        },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            size: 120,
            dataLabels: {
                distance: 6,
                overflow: "none",
                //crop: false,
                formatter: function () {
                    if(this.percentage!=0)  return  Math.round(this.percentage)  + '%';
                }
            },
            showInLegend: true
        }
    },
    credits: {
            enabled: false
    },
    exporting: {
            chartOptions:{
                title: {
                    text: 'Time to Next Inspection',
                    style: {"fontSize": "16px"}
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
            filename: 'Next_Inspection_Report',
        },
        series: [{
            data: next_insp_detail
        }]
    });
});

 $http.get(routesPrefix+'/getGraceRenewData').success(function(data){
        $("#loader3").hide();
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
            useHTML: true,
            text: '3-month Grace Period for Licensing Issues <a href="#notes" style="color: rgb(51, 51, 51);" ><sup>8</sup></a>',
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
                title: {
                    text: '3-month Grace Period for Licensing Issues',
                    style: {"fontSize": "16px"}
                },
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
            filename: 'Grace_Period_License_Report (LiceNse)',
        },
        series:gracePeriodRenew
    });
});   

                var textarray=["1289 Facilities","365 Facilities","306 Facilities","618 Facilities"];
                var dataarray = [
                                    [{
                                    name: 'Private',
                                    y: 71
                                    }, {
                                    name: 'Public',
                                    y: 29
                                    }],
                                    [{
                                    name: 'Private',
                                    y: 62
                                    }, {
                                    name: 'Public',
                                    y: 38
                                    }],
                                    [{
                                    name: 'Private',
                                    y: 69
                                    }, {
                                    name: 'Public',
                                    y: 31
                                    }],
                                    [{
                                    name: 'Private',
                                    y: 78
                                    }, {
                                    name: 'Public',
                                    y: 22
                                    }]

                                ];
                for(var i =1;i<=4;i++){

                Highcharts.setOptions({
                colors: ['rgb(237, 125, 49)', '#FFC001']
            });
                // Create the chart for completion
                

             $('#container'+i).highcharts({


                chart: {
                    renderTo: 'container'+i,
                   height:100,width:100,margin:[0,0,0,0],
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
                tooltip: {
                    enabled:true,
                       formatter: function () {
                    return this.point.name + ' (' + this.point.y +'%)';
                }
                },
                plotOptions: {
                    pie: {
                        slicedOffset: 0,
                        shadow: false,
                        allowPointSelect: true,
                        cursor: 'pointer',
                        size:'100%',
                        dataLabels: {
                            enabled: false
                        }
                    }
                }, 
              
                title: {
                    text: textarray[i-1],
                    align: 'center',
                    x:0,y:0,
                    verticalAlign: 'middle',
                    style: {
                        fontSize: '10px'
                    }
                },   
                
                credits: {
                   enabled: false
                },

                series: [{

                    data: dataarray[i-1],
                    innerSize: '55%',
                    
                //    showInLegend:false,
                   dataLabels: {
                        enabled: true,inside:true,distance:-10,fontSize:'5px',
                        format: '{point.y:0f}%',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }},
                    states:{
                        hover: {
                            enabled: false
                        }
                    }
                    
                }],
                exporting:{
                    enabled:false
                }
            });
            }

            //var textarray1 = pieChartLevelTitle;
            //var dataarray1 = pieChartLevel;

              var textarray1=["1289 Facilities","365 Facilities","306 Facilities","618 Facilities"];
                var dataarray1 = [
                                    [{
                                        name: 'Level 2',
                                        y: 85
                                    }, {
                                        name: 'Level 3',
                                        y: 11
                                    }, {
                                        name: 'Level 4 & 5',
                                        y: 4
                                    }],
                                    [{
                                        name: 'Level 2',
                                        y: 76
                                    }, {
                                        name: 'Level 3',
                                        y: 19
                                    }, {
                                        name: 'Level 4 & 5',
                                        y: 5
                                    }],
                                    [{
                                        name: 'Level 2',
                                        y: 87
                                    }, {
                                        name: 'Level 3',
                                        y: 9
                                    }, {
                                        name: 'Level 4 & 5',
                                        y: 4
                                    }],
                                    [{
                                        name: 'Level 2',
                                        y: 89
                                    }, {
                                        name: 'Level 3',
                                        y: 7
                                    }, {
                                        name: 'Level 4 & 5',
                                        y: 4
                                    }],

                                ];

       for(var x=1;x<=4;x++){
        Highcharts.setOptions({
                colors: ['#91D050', '#E07067','#FFC001']
            });

            // Create the chart for completion
            $('#container1'+x).highcharts({
                chart: {
              
                height:100,width:100,margin:[0,0,0,0],
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
               
                tooltip: {
                    enabled:true,
                       formatter: function () {
                    return this.point.name + ' (' + this.point.y +'%)';
                }
                },
                 plotOptions: {
                    pie: {
                        slicedOffset: 0,
                        shadow: false,
                        size:'100%',
                    
                    }
                }, 
                title: {
                    text: textarray1[x-1],
                     align: 'center',
                     verticalAlign: 'middle',
                     x:0,y:0,
                    style: {
                        fontSize: '10px'
                    }
                    
                },      
                credits: {
                   enabled: false
                },
                series: [{
                    
                    data: dataarray1[x-1],
                    innerSize: '55%',
                    //showInLegend:false,
                    dataLabels: {
                        enabled: true,inside:true,distance:-10,fontSize:'5px',
                        format: '{point.y:0f}%',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }},
                    states:{
                        hover: {
                            enabled: false
                        }
                    }
                }],
                exporting:{
                    enabled:false
                }
            });
        }

   
 });






