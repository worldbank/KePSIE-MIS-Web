var srModule = angular.module("inspectorVisitPlanFigureModule", []);



srModule.controller("inspectorVisitPlanFigureCtrl", function ($scope, $http) {

		$scope.selectedCounty="All"

		$scope.changeCounty=function(county){

	
			$scope.selectedCounty=county;
			$scope.initChart();

		}

	
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

	var date= new Date();

	var dt= (monthNames[date.getMonth()])+" "+date.getFullYear();

	var plotLinesText=date.getDate()+" "+(monthNames[date.getMonth()])+" "+date.getFullYear();
	var year,nextYear;

	if(date.getMonth()<9 && date.getMonth()>=0){
		year=(date.getFullYear()-1);
		//year=(date.getFullYear()-1).toString().substr(2,2);
		nextYear=(date.getFullYear());
		//nextYear=(date.getFullYear()).toString().substr(2,2);


	}else{

		year=date.getFullYear();
		//year=date.getFullYear().toString().substr(2,2);
		//nextYear=(date.getFullYear()+1).toString().substr(2,2);
		nextYear=(date.getFullYear()+1);
	}

	
	var currentWave=inspWave.currentWave;

	var categoryArr=[]

	/*For 3-month wave
	if(currentWave==1){

		categoryArr=["Nov "+year,"Dec "+year,"Jan "+nextYear];

	}else if(currentWave==2){

		categoryArr=["Nov "+year,"Dec "+year,"Jan "+nextYear,
		"Feb "+nextYear,"Mar "+nextYear,"Apr "+nextYear];

	}else if(currentWave==3){

		categoryArr=["Nov "+year,"Dec "+year,"Jan "+nextYear,
		"Feb "+nextYear,"Mar "+nextYear,"Apr "+nextYear,
		"May "+nextYear,"Jun "+nextYear,"Jul "+nextYear];

	}else if(currentWave==4){

		categoryArr=["Nov "+year,"Dec "+year,"Jan "+nextYear,
		"Feb "+nextYear,"Mar "+nextYear,"Apr "+nextYear,
		"May "+nextYear,"Jun "+nextYear,"Jul "+nextYear,"Aug "+nextYear,
		"Sept "+nextYear,"Oct "+nextYear];
	}	*/

	if(currentWave==1){

		categoryArr=["Nov "+year,"Dec "+year,"Jan "+nextYear,"Feb "+nextYear];

	}else if(currentWave==2){

		categoryArr=["Nov "+year,"Dec "+year,"Jan "+nextYear,
		"Feb "+nextYear,"Mar "+nextYear,"Apr "+nextYear,
		"May "+nextYear,"Jun "+nextYear];

	}else if(currentWave==3){

		categoryArr=["Nov "+year,"Dec "+year,"Jan "+nextYear,
		"Feb "+nextYear,"Mar "+nextYear,"Apr "+nextYear,
		"May "+nextYear,"Jun "+nextYear,"Jul "+nextYear,"Aug "+nextYear,
		"Sept "+nextYear,"Oct "+nextYear];

	}
	

	var plotLinesValue;

	for (var i = 0; i < categoryArr.length; i++) {
		if(categoryArr[i]==dt){
			plotLinesValue=i;
		}
	}
	
	plotLinesValue=plotLinesValue+ (date.getDate()/30) - 0.5 ;	

	var xValue;
if (plotLinesValue>10) {
	xValue=-85;
}else{
	xValue=5;
}

$scope.initChart=function(){	

	$http.post(routesPrefix+"/visitPlan/getFigureData",{county:$scope.selectedCounty}).success(function(response) {

		console.log(response);

		var tmp=new Date(response.updateDate);
		var dt=tmp.getDate();
		var mt=monthNames[tmp.getMonth()];
		var yr=tmp.getFullYear();

		var updateDate=dt+" "+mt+","+yr;


		$('#projectionFigure').highcharts({
			chart: {
				style: {
					fontFamily: 'Open Sans, sans-serif',
					marginRight:100
				},
				type: 'column',

			},
			gridLineWidth: 0,
			title: {
				text: 'Number of Inspections Conducted/Projected'
			},
			subtitle: {
				text: '(Last updated: '+updateDate+' )'
			},
			xAxis: {
				categories: categoryArr,
				title: {
					text: null
				},
				plotLines: [{
					color: '#000000',
					width: 2,

					value: plotLinesValue,
					label: {
						rotation:0,
						x:xValue,
						text: plotLinesText,
						
					}
				}]
			},
			yAxis: {
				  visible: false,
				  minPadding: 0, 
                    
                showLastLabel:false,
                tickInterval:1,
				gridLineWidth: 0,
				
				title: {
					text: ""
				},

				labels: {
					overflow: 'justify'
				}
			},
			tooltip: {
				headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
				pointFormat: '<tr><td>{series.name}:</td>' +
				'<td style="padding:6px"> {point.y} </td>'+
				'</tr>',
				footerFormat: '</table>',
				shared: true,
				useHTML: true,
				enabled: true


			},
			plotOptions: {
				column: {
					 enabled: true,
            crop: false,
            allowOverlap:true, 
					dataLabels: {
						enabled: true,

						formatter: function () {
							return '<div  style="font-weight: normal;" >'+Math.round(this.point.y)+'</div>';
						},
					}
				}
			},
			legend: {

				layout: 'vertical',

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
				filename: "visitPlan_figure_"+formateDate()
			},

			credits: {
				enabled: false
			},
			series: [{
				name: 'Number of Inspections Projected',
				data:response.insp_projected,
				color:"#43a2ca"
				//data: [10,50,20,70,5,25,70,16,14,35,45,16]
			},
			{
				name: 'Number of Inspections Conducted',
				data:response.insp_conducted,
				color: "#a8ddb5"
				//data: [10,50,20,70,5,25,70,0,0,0,0,0]
			}]
		});
	});


}
$scope.initChart();

});
