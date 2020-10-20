var srModule = angular.module("facilityClosureModule", ['ngMessages']);
var http = null;
var scope;

srModule.controller("facilityClosureCtrl", function ($scope, $http) {
	http = $http;
	scope = $scope;
	$scope.inspPeriods = [];
	scope.figureCounty = "All";
	scope.figureInspPeriod= "All";


$scope.changeFacility=function(){

$scope.facilityName=$("#selectedFacility :selected").text();

} 
$scope.changeFacilityDept=function(){

$scope.facilityDept=$("#facilityDept :selected").text();

}

$scope.clsrReasonChange=function(){
			
			 $('#clsrReason').selectpicker('refresh');
			 console.log($scope.closure.reason);
		if($scope.closure.reason==undefined){
			
			$("#clsrReason").val("");
			  $('#clsrReason').selectpicker('refresh');
			
		}

} 
$scope.clsrReasonChange1=function(){
			
			 $('#clsrReason1').selectpicker('refresh');

		if($scope.closureDepartment.reason==undefined){
			
			$("#clsrReason1").val("");
			  $('#clsrReason1').selectpicker('refresh');
			
		}

} 

	function populateCounties(callback) {

		http({
			method: "GET",
			url: routesPrefix+"/completejhic/individual/getFilterValues",
		}).then(function mySucces(response) {
			scope.counties = response.data.countyList;

			scope.figureCounty = scope.counties[0];
			callback(showSummaryFigure);

		}, function myError(response) {
			console.log(response.statusText);
		});
	}

	function populateInspectionPeriod(callback) {



		http({
			method: "POST",
			url: routesPrefix+"/inspectionplanning/inspectionPeriods",
			data: {
				county : scope.figureCounty,
				inspector :{name:"All",inspectorId:"All"},
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


			$scope.figureInspPeriod = $scope.inspPeriods[0];



			callback();

		});
	}
	$scope.facilityStatus="All";
	$scope.countyChanged = function() {
		console.log("countyChanged...");
		populateInspectionPeriod(showSummaryFigure);


	};

	$scope.filterChange=function(){
		showSummaryFigure();
	}

	http = $http;
	if(loggedInUserRole!="Inspector"){
		
		
		$scope.facilityForm=false;
		$scope.departmentForm=false;
		$scope.summaryForm=true;
		$("#idNote").hide();
		populateCounties(populateInspectionPeriod);

	}else{

		$scope.currentTab=tabName;




		if($scope.currentTab=='facility'){
			
			$("#department").removeClass('active');
			
			$("#facility").addClass('active');	
			$scope.facilityForm=true;
			$scope.departmentForm=false;

			
		}else if($scope.currentTab=='department'){
			
			$("#facility").removeClass('active');
			$("#department").addClass('active');
			
			$scope.facilityForm=false;
			$scope.departmentForm=true;
			
			
		}
	}


	$(".actionList").hide();
	$scope.tabChange=function(event){

		$scope.currentTab=event.target.id;


		if($scope.currentTab=='facility'){
			
			$("#department").removeClass('active');
			$("#summary").removeClass('active');
			$("#facility").addClass('active');	
			$scope.facilityForm=true;
			$scope.departmentForm=false;
			$scope.summaryForm=false;
			$("#idNote").show();

		}else if($scope.currentTab=='department'){
			
			$("#facility").removeClass('active');
			$("#department").addClass('active');
			$("#summary").removeClass('active');
			$scope.facilityForm=false;
			$scope.departmentForm=true;
			$scope.summaryForm=false;
			$("#idNote").show();

		}else if($scope.currentTab=='summary'){
			
			$("#facility").removeClass('active');
			$("#department").removeClass('active');
			$("#summary").addClass('active');
			$scope.facilityForm=false;
			$scope.departmentForm=false;
			$scope.summaryForm=true;
			$("#idNote").hide();
			populateCounties(populateInspectionPeriod);

		}
	}

	
	$scope.checkFacility=function (facilityId) {

		var data = {facilityId : facilityId};
		$http.post(routesPrefix+'/facility/checkId',data)
		.success(function(response) {
			console.log(response);

			if(response!=""){
				$scope.facilityExist=false;

			}else{

				$scope.facilityExist=true;
			}
		});

	}


	$scope.closureFacilitySubmit = function(closureFacilityForm) {

		if(closureFacilityForm.$invalid )
		{

			$scope.submitted = true;
			return;
		}else{

			var data = {facilityId : $scope.closure.facilityId};
			$http.post(routesPrefix+'/closure/checkClosureReq',data)
			.success(function(response) {

				console.log("closed facility=======");
				console.log(response);
				
				if(response!=""){
					$scope.facilityExist=true;

				}else{

					$scope.facilityExist=false;
				}

				if(!$scope.facilityExist){

					if($scope.facilityClosureFile!=undefined)
					{

						var file = $scope.facilityClosureFile;
						console.log(file);
						console.log("file is " );
						console.dir(file);
						console.log($scope.facilityClosureFile.name);

						var path=$scope.facilityClosureFile.name;
						var uploadUrl = routesPrefix+"/user/upload";
						var pth;

						var fd = new FormData();
						fd.append('file', file);
						console.log("fd");
						console.log(fd);
						$http.post(uploadUrl, fd, {
							transformRequest: angular.identity,
							headers: {'Content-Type': undefined}
						})
						.success(function(res){

							$scope.closure.path=res.path;
							$scope.closure.filename=res.filename;

							console.log($scope.closure);
							$http.post(routesPrefix+'/closure/submit',$scope.closure).success(function(response) {
								console.log(response);
								window.location.href = routesPrefix+"/closureTab/facility";
							});
						});          
					}else{

						$http.post(routesPrefix+'/closure/submit',$scope.closure).success(function(response) {
							console.log(response);
							window.location.href = routesPrefix+"/closureTab/facility";
						});
					}
				}
			});
		}
	}



	$scope.closureDepartmentSubmit = function(closureDepartmentForm) {

		if(closureDepartmentForm.$invalid )
		{

			$scope.submittedDepartment = true;
			return;
		}else{

			var data = {facilityId : $scope.closureDepartment.facilityId,
				deptName:$scope.closureDepartment.departmentName};
				$http.post(routesPrefix+'/closure/checkClosureReqDept',data)
				.success(function(response) {

					console.log("closed facility=======");
					console.log(response);

					if(response!=""){
						$scope.facilityExist=true;

					}else{

						$scope.facilityExist=false;
					}

					if(!$scope.facilityExist){


						if($scope.departmentClosureFile!=undefined)
						{

							var file = $scope.departmentClosureFile;
							console.log(file);
							console.log("file is " );
							console.dir(file);
							console.log($scope.departmentClosureFile.name);

							var path=$scope.departmentClosureFile.name;
							var uploadUrl = routesPrefix+"/user/upload";
							var pth;

							var fd = new FormData();
							fd.append('file', file);
							console.log("fd");
							console.log(fd);
							$http.post(uploadUrl, fd, {
								transformRequest: angular.identity,
								headers: {'Content-Type': undefined}
							})
							.success(function(res){

								$scope.closureDepartment.path=res.path;
								$scope.closureDepartment.filename=res.filename;

								console.log($scope.closureDepartment);
								$http.post(routesPrefix+'/closureDepartment/submit',$scope.closureDepartment).success(function(response) {
									console.log(response);
									window.location.href = routesPrefix+"/closureTab/department";
								});
							});          
						}else{

							$http.post(routesPrefix+'/closureDepartment/submit',$scope.closureDepartment).success(function(response) {
								console.log(response);
								window.location.href = routesPrefix+"/closureTab/department";


							});
						}
					}
				});
			}
		}


		var d = new Date();
	$('#fromDate').daterangepicker({
		singleDatePicker: true,
		showDropdowns: true,
		startDate: '01-01-'+d.getFullYear(),
		locale: {format: 'DD-MM-YYYY'},
		maxDate: new Date(),
	});

	$('#toDate').daterangepicker({
		singleDatePicker: true,
		showDropdowns: true,
		locale: {format: 'DD-MM-YYYY'},
		maxDate: new Date(),
	});


	$('#fromDate').on('apply.daterangepicker', function(ev, picker) {

		var fr=$('#fromDate').val().split('-');
		var startDt=fr[2]+"/"+fr[1]+"/"+fr[0];

		var to=$('#toDate').val().split('-');
		var toDt=to[2]+"/"+to[1]+"/"+to[0];

		if(new Date(startDt).getTime() > new Date(toDt).getTime()){

			$("#dateValidation").show();
			$(".exportBtn").attr("disabled",true);
      //  $scope.dateValidation=true;
  }else{
  	$(".exportBtn").attr("disabled",false);
  	$("#dateValidation").hide();

  }

});

	$('#toDate').on('apply.daterangepicker', function(ev, picker) {

		var fr=$('#fromDate').val().split('-');
		var startDt=fr[2]+"/"+fr[1]+"/"+fr[0];

		var to=$('#toDate').val().split('-');
		var toDt=to[2]+"/"+to[1]+"/"+to[0];

		if(new Date(startDt).getTime() > new Date(toDt).getTime()){

			$("#dateValidation").show();
			$(".exportBtn").attr("disabled",true);
      //  $scope.dateValidation=true;
  }else{

  	$("#dateValidation").hide();
  	$(".exportBtn").attr("disabled",false);
  }

});
});

function showSummaryFigure() {


	http({
		method: "POST",
		url: routesPrefix+"/closure/summary/figure",
		data: {
			county : scope.figureCounty.value,
			facilityDept : $("#indicator").val(),
			inspPeriod : scope.figureInspPeriod.value,
			status: scope.facilityStatus

		}
	}).then(function mySucces(response) {

		var indicatorNameArr=response.data.indicatorNameArr;
		var seriesDataArr=response.data.seriesDataArr;
		var seriesGraceArr=response.data.seriesGraceArr;
		var seriesClosureArr=response.data.seriesClosureArr;
		var countyTitle=scope.figureCounty.value;
		var seriesArr=[];
		if (countyTitle=="All") {countyTitle="All Counties"}


			var period=scope.figureInspPeriod.value;

			if (period=="All") {period="All Inspection Periods"}

			if(scope.facilityStatus=="All"){
				
				seriesArr.push({
						name : "% of Total Facilities/Departments Reported for Closure",
						data: seriesClosureArr,
						pointWidth: 35

				});

				seriesArr.push({
					name : "% of Total Number of Facilities/Departments Closed",
					data: seriesDataArr,
					 pointWidth: 35

				});
				seriesArr.push({
					name : "% of Total Number of Facilities/Departments Graced",
					data: seriesGraceArr,
					 pointWidth: 35

				})
			}else if(scope.facilityStatus=="Graced"){
				
				seriesArr.push({
					name : "% of Total Number of Facilities/Departments Graced",
					data: seriesGraceArr,
					pointWidth: 35,
				});
			}else if(scope.facilityStatus=="Closure"){
					
				seriesArr.push({
					name : "% of Total Facilities/Departments Reported for Closure",
					data: seriesClosureArr,
					pointWidth: 35
				});

			}else{
				
				seriesArr.push({
					name : "% of Total Number of Facilities/Departments Closed",
					data: seriesDataArr,
					pointWidth: 35
				});
			}



		console.log("here.....---");
		console.log(response);
		console.log(indicatorNameArr +"   "+ seriesDataArr);
		var filterValues= "% of Total Number of Facilities/Departments Closed";

		$('#summaryFigure').highcharts({
			chart: {
				style: {
					fontFamily: 'Open Sans, sans-serif'
				},
				type: 'bar'

			},
			gridLineWidth: 0,
			title: {
				text: 'Facility/Department Closures'
			},
			 subtitle: {

      text: filterValues+" in "+countyTitle+" During "+period
     
                  },

			xAxis: {
				categories: indicatorNameArr,
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
      	bar: {
      		stacking: 'normal',
      		dataLabels: {
      			enabled: true,
      			useHTML : true,
      			formatter: function () {
      			if(this.point.y!=0){
      					return '<center  style="font-weight: normal;">'+Math.round(this.point.y)+'%</center>'
      					+'<center  style="font-weight: normal;">(N='+ this.point.count + ')</center>';
      					
      				}else{
      					return null;
      				}
      			},
      		}
      	}
      },
      credits: {
      	enabled: false
      },
      exporting: {
      	allowHTML:true,
      	chartOptions:{

      		chart:{


      			events: {
      				load: function(event) { 
      					this.renderer.image(logourl,0,0,50,50).add();
      					this.renderer.text('Note: due to rounding, numbers presented throughout may not add up precisely.', 10, 390)
      					.css({
      						color: '#000000',
      						fontSize: '8px'
      					})
      					.add();
      				}
      			}
      		}
      	},  
      	filename: "Summary_of_actions_and_status_"+formateDate()
      },
      series: seriesArr
  });

	});





}
app.directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function(){
				scope.$apply(function(){
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
}]);