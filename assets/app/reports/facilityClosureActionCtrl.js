
var srModule = angular.module("closureActionApp", []);

srModule.controller("closureActionCtrl", function ($scope, $http) {
	http = $http;
	scope = $scope;
	$scope.otherBody={};
	$scope.otherDeptBody={};
	$scope.inspPeriods = [];
	scope.figureCounty = "All";
	scope.figureInspPeriod= "All";
	var d = new Date();
	$('#fromDate').daterangepicker({
		singleDatePicker: true,
		showDropdowns: true,
		startDate: '01-11-2016',
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

	$('#appealReason').on('hidden.bs.modal', function () {

		$scope.reasonBody.appeal_reason="";

		$("#appeal_reason  option[value='']").prop('selected', true);

		$scope.reasonBody.other_appeal_reason="";

	});


	$scope.loadFacilityClosureList=function(){

		var oTable;

		oTable=$('#facilityActionList').DataTable({

		"bServerSide": true,
		"pagingType": "numbers",
		"sAjaxSource":routesPrefix+"/closure/closureList",
		"bAutoWidth": false,
		"bProcessing": true,
		"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"iDisplayLength": 25, 
		"bAutoWidth": false,
		"bDestroy": true,
		"aoColumns": [   
		  { "mData": "_hfid",width:'10%' },
		  { "mData": "_hfname",width:'10%' },
		  { "mData": "FacilityClosureDetails.ms_close_r" ,width:'20%',
		  "render":function(reason){

		  	var reasonList="";

		  	if(reason.inspector!=undefined){
		  		reasonList+="<b>Inspector: </b>"+reason.inspector;
		  	}

		  	if(reason.admin!=undefined){
		  		reasonList+="<br><b>Admin: </b>"+reason.admin;
		  	}

		  	return reasonList;
		  }
		},
		{ "mData": "_date" ,width:'15%',
		"render": function (data) {
			console.log(data);
			var date = new Date(data);
			var month = date.getMonth() + 1;
			var dt=date.getDate();
			return (dt > 9 ? dt : "0" + dt) + "/" + (month > 9 ? month : "0" + month) + "/" + date.getFullYear();
		}
		},
		{ "mData": "FacilityClosureDetails.date_close_by",width:'15%', "defaultContent":"" },
		{ "mData": "FacilityClosureDetails.date_appeal_by",width:'15%', "defaultContent":"" },
		{'targets': 0,
		width:'20%',
		'searchable': false,
		'orderable': false,
		'className': 'dt-body-center',
		"mData":"_id",
		mRender: function ( data, type, row ) {

			console.log(row);
				if(row.FacilityClosureDetails.ms_closed==1){

					return '<div  class="actionDiv " style="padding-top: 5%"><a style="font-size: 12px;width:95%;" class="btn btn-primary button-rounder reopenConfirmation" href="#"  onclick="angular.element(this).scope().reopenConfirmation(\''+row.FacilityClosureDetails.closureId+'\',\''+row._hfid+'\')" data-toggle="modal" title="Report Re-opening">Report Re-opening</a></div>';
				}else if(row.FacilityClosureDetails.ms_close==1){

					if(row.FacilityClosureDetails.ms_appeal==1){
						return  '<div class="actionsDiv"><div  class="actionDiv"><a style="font-size: 12px;" class="btn btn-primary button-rounder clsrConfirmation" href="#" onclick="angular.element(this).scope().closedPhysicallyConfirmation(\''+row.FacilityClosureDetails.closureId+'\',\''+row._hfid+'\')" data-toggle="modal"  title="Report Physical Closure">Report Physical Closure</a></div>';
					}else{
						return  '<div class="actionsDiv"><div  class="actionDiv"><a style="font-size: 12px;" class="btn btn-primary button-rounder clsrConfirmation" href="#" onclick="angular.element(this).scope().closedPhysicallyConfirmation(\''+row.FacilityClosureDetails.closureId+'\',\''+row._hfid+'\')" data-toggle="modal" title="Report Physical Closure">Report Physical Closure</a></div>' +
						'<div  class="actionDiv " style="padding-top: 5%"><a style="font-size: 12px;width: 99%;" class="btn btn-primary writeReason button-rounder" href="#"  onclick="angular.element(this).scope().appealReason(\''+row.FacilityClosureDetails.closureId+'\')" data-toggle="modal" title="Report Appeal">Report Appeal</a></div></div>'+
						'<div  class="actionDiv " style="padding-top: 5%"><a style="font-size: 12px;width:95%;" class="btn btn-primary button-rounder reopenConfirmation" href="#"  onclick="angular.element(this).scope().reopenConfirmation(\''+row.FacilityClosureDetails.closureId+'\',\''+row._hfid+'\')" data-toggle="modal" title="Report Re-opening">Report Re-opening</a></div>'+
						'<div  class="actionDiv " style="padding-top: 5%"><a style="font-size: 12px;width: 99%;" class="btn btn-primary otherNotes button-rounder" href="#"  onclick="angular.element(this).scope().otherConfirmation(\''+row.FacilityClosureDetails.closureId+'\',\''+row.FacilityClosureDetails.ms_other_note+'\')" data-toggle="modal" title="Other">Other</a></div></div>';
					}
				}else{
					return '<div>Facility Re-opened from system on '+formateDate(row.FacilityClosureDetails.ms_date_reopened)+'</div>';
				}
			}},
			{'targets': 0,
			width:'20%',
			'searchable': false,
			'orderable': false,
			'className': 'dt-body-center',
			"mData":"_id",
			mRender: function ( data, type, row ) {
				return '<a  class="actionDiv deleteClosure" href="#"  onclick="angular.element(this).scope().delete(\''+row.FacilityClosureDetails.closureId+'\')"  data-toggle="modal" title="Delete"><i class="icon-trash"></i></a>';
			}}
			]
}); 
}
var closureReqId;
$scope.delete=function(id){
	closureReqId=id;

	$(".deleteClosure").attr("href", "#deleteConfirmation");

}
$scope.deleteClosure=function(){

	var data = {id : closureReqId};
	$http.post(routesPrefix+'/closure/delete', data).success(function (data) {

		window.location.href = routesPrefix+"/closureTab/facility";
	});
} 
$scope.view=function(id){

	window.location.href = routesPrefix+"/user/view";

} 

$('#closedDate').daterangepicker({
	singleDatePicker: true,
	showDropdowns: true,
	locale: {format: 'DD/MM/YYYY'},
	opens: 'right',

}).val(null);

$('#reopenedDate').daterangepicker({
	singleDatePicker: true,
	showDropdowns: true,
	locale: {format: 'DD/MM/YYYY'},
	opens: 'right',

}).val(null);

$('#appealDate').daterangepicker({
	singleDatePicker: true,
	showDropdowns: true,
	locale: {format: 'DD/MM/YYYY'},
	opens: 'right',

}).val(null);


$('#clsrConfirmation').on('hidden.bs.modal', function () {

	$('#closedDate').val(null);
});

$('#appealReason').on('hidden.bs.modal', function () {

	$('#appealDate').val(null);
});

$('#reopenConfirmation').on('hidden.bs.modal', function () {

	$('#reopenedDate').val(null);
});

var idReopenCnfr;
$scope.reopenConfirmation=function(id,hfid){

	idReopenCnfr=id;
	$("#reopendHFid").html(hfid);
	$(".reopenConfirmation").attr("href", "#reopenConfirmation");

}
$scope.reopenFacility=function(){

	var data={
		reopenedDate:$("#reopenedDate").val()
	};

	$http.post(routesPrefix+'/closure/reopenFacility/'+idReopenCnfr,data).success(function (data) {

		window.location.href = routesPrefix+"/closureTab/facility";
	});
}
var idClsrCnfr;

$scope.closedPhysicallyConfirmation=function(id,hfid){
	idClsrCnfr=id;
	$("#closedHFid").html(hfid);
	$(".clsrConfirmation").attr("href", "#clsrConfirmation");

}

$scope.closedPhysically=function(){

	var data={
		closedDate:$("#closedDate").val()
	}

	$http.post(routesPrefix+'/closure/closedPhysically/'+idClsrCnfr,data).success(function (data) {

		window.location.href = routesPrefix+"/closureTab/facility";
	});
}

var ids;
$scope.appealReason=function(id){

	ids=id;
	$(".writeReason").attr("href", "#appealReason");

}

$scope.otherConfirmation=function(id,ms_other_note){

	ids=id;
	if(ms_other_note=="undefined"){
		ms_other_note="";
	}
		//$http.post(routesPrefix+'/getOtherComment/'+ids).success(function(response){
			$scope.otherBody.note=ms_other_note;
			$scope.$apply();
			$(".otherNotes").attr("href", "#addOtherNote");
	//});
}

$scope.appeal=function(appealReasonForm){

	if(appealReasonForm.$invalid )
	{

		$scope.submitted = true;
		return;
	}else{

		$scope.reasonBody.facilityId=ids;
		$scope.reasonBody.appealDate=$("#appealDate").val();

		$http.post(routesPrefix+'/closure/appeal',$scope.reasonBody).success(function (data) {

			window.location.href = routesPrefix+"/closureTab/facility";
		});
	}
}

$scope.other=function(otherNoteForm){

	$scope.otherBody.facilityId=ids;
	console.log("$scope.otherBody");
	console.log($scope.otherBody);
	$http.post(routesPrefix+'/closure/other',$scope.otherBody).success(function (data) {
		window.location.href = routesPrefix+"/closureTab/facility";
	});
}


$scope.loadDepartmentClosureList=function(){

	var oTable;

	oTable=$('#departmentActionList').DataTable({

		"bServerSide": true,
		"pagingType": "numbers",
		"sAjaxSource":routesPrefix+"/closure/closureDepartmentList",
		"bAutoWidth": false,
		"bProcessing": true,
		"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"iDisplayLength": 25, 
		"bDestroy": true,
  // "order": [[1, 'asc']],
  "aoColumns": [  
  
  { "mData": "_hfid",'width':'5%' },
  { "mData": "_hfname",'width':'15%' },
  { "mData": "departmentClosureDetails.departmentName",'width':'10%' },
  { "mData": "departmentClosureDetails.ms_close_dep_r" ,'width':'25%',
  "render":function(reason){
  	/*if(reason==1) {
  		return "Department does not have required (or relevant) licenses/registration/membership";
  	} */

  	var reasonList="";

  	if(reason.inspector!=undefined){
  		reasonList+="<b>Inspector: </b>"+reason.inspector;
  	}

  	if(reason.admin!=undefined){
  		reasonList+="<br><b>Admin: </b>"+reason.admin;
  	}

  	return reasonList;
  }
},
{ "mData": "_date",'width':'5%',
"render": function (data) {
	console.log("data");
	console.log(data);
	var date = new Date(data);
	var month = date.getMonth() + 1;
	var dt=date.getDate();
	return (dt > 9 ? dt : "0" + dt) + "/" + (month > 9 ? month : "0" + month) + "/" + date.getFullYear();
}
},
{ "mData": "departmentClosureDetails.date_close_dep_by",'width':'10%', "defaultContent":"" },
{ "mData": "departmentClosureDetails.date_appeal_dep_by",'width':'10%', "defaultContent":"" },
{'targets': 0,
'width':'16%',
'searchable': false,
'orderable': false,
'className': 'dt-body-center',
"mData":"_id",
"defaultContent":"",
mRender: function ( data, type, row ) {
	console.log(row);
	if(row.departmentClosureDetails.ms_closed_dep==1){
		return '<div  class="actionDiv " style="padding-top: 5%"><a style="font-size: 12px;width: 95%" class="btn btn-primary button-rounder reopenConfirmationDept" href="#"  onclick="angular.element(this).scope().reopenConfirmationDept(\''+row.departmentClosureDetails.deptClosureId+'\',\''+row._hfid+'\',\''+row.departmentClosureDetails.departmentName+'\')" data-toggle="modal" title="Report Re-opening">Report Re-opening</a></div>';
	}else if(row.departmentClosureDetails.ms_close_dep==1){
		if(row.departmentClosureDetails.ms_appeal_dep==1){
			return  '<div class="actionsDiv"><div  class="actionDiv"><a style="font-size: 12px;" class="btn btn-primary button-rounder clsrConfirmationDept" href="#" onclick="angular.element(this).scope().closedPhysicallyDeptConfirmation(\''+row.departmentClosureDetails.deptClosureId+'\',\''+row._hfid+'\',\''+row.departmentClosureDetails.departmentName+'\')" data-toggle="modal"  title="Report Physical Closure">Report Physical Closure</a></div>';
		}else{
			return  '<div class="actionsDiv"><div  class="actionDiv"><a style="font-size: 12px;" class="btn btn-primary button-rounder clsrConfirmationDept" href="#" onclick="angular.element(this).scope().closedPhysicallyDeptConfirmation(\''+row.departmentClosureDetails.deptClosureId+'\',\''+row._hfid+'\',\''+row.departmentClosureDetails.departmentName+'\')" data-toggle="modal" title="Report Physical Closure">Report Physical Closure</a></div>' +
			'<div  class="actionDiv " style="padding-top: 5%"><a style="font-size: 12px;width: 99%" class="btn btn-primary button-rounder writeReason" href="#"  onclick="angular.element(this).scope().appealReasonDepartment(\''+row.departmentClosureDetails.deptClosureId+'\')" data-toggle="modal" title="Report Appeal">Report Appeal</a></div></div>'+
			'<div  class="actionDiv " style="padding-top: 5%"><a style="font-size: 12px;width: 95%" class="btn btn-primary button-rounder reopenConfirmationDept" href="#"  onclick="angular.element(this).scope().reopenConfirmationDept(\''+row.departmentClosureDetails.deptClosureId+'\',\''+row._hfid+'\',\''+row.departmentClosureDetails.departmentName+'\')" data-toggle="modal" title="Report Re-opening">Report Re-opening</a></div>'+
			'<div  class="actionDiv " style="padding-top: 5%"><a style="font-size: 12px;width: 99%;" class="btn btn-primary otherDeptNotes button-rounder" href="#"  onclick="angular.element(this).scope().otherDeptConfirmation(\''+row.departmentClosureDetails.deptClosureId+'\',\''+row.departmentClosureDetails.ms_other_note_dep+'\')" data-toggle="modal" title="Other">Other</a></div></div>';
		}
	}else{
		return '<div>Department Re-opened from system on '+formateDate(row.departmentClosureDetails.ms_date_reopened_dep)+'</div>';
	}
}
},
{'targets': 0,
			'width':'4%',
			'searchable': false,
			'orderable': false,
			'className': 'dt-body-center',
			"mData":"_id",
			mRender: function ( data, type, row ) {
				return '<a  class="actionDiv deleteClosureDept" href="#"  onclick="angular.element(this).scope().deleteDept(\''+row.departmentClosureDetails.deptClosureId+'\')"  data-toggle="modal" title="Delete"><i class="icon-trash"></i></a>';
			}}		]
}); 
}

var closureDepReqId;
$scope.deleteDept=function(id){
	closureDepReqId=id;

	$(".deleteClosureDept").attr("href", "#deleteConfirmationDept");

}
$scope.deleteClosureDept=function(){

	var data = {id : closureReqId};
	$http.post(routesPrefix+'/closure/deleteDept', data).success(function (data) {

		window.location.href = routesPrefix+"/closureTab/department";
	});
} 

$('#closedDateDept').daterangepicker({
	singleDatePicker: true,
	showDropdowns: true,
	locale: {format: 'DD/MM/YYYY'},
	opens: 'right',

}).val(null);

$('#reopenedDateDept').daterangepicker({
	singleDatePicker: true,
	showDropdowns: true,
	locale: {format: 'DD/MM/YYYY'},
	opens: 'right',

}).val(null);

$('#appealDateDept').daterangepicker({
	singleDatePicker: true,
	showDropdowns: true,
	locale: {format: 'DD/MM/YYYY'},
	opens: 'right',

}).val(null);

$('#clsrConfirmationDept').on('hidden.bs.modal', function () {

	$('#closedDateDept').val(null);
});

$('#reopenConfirmationDept').on('hidden.bs.modal', function () {

	$('#reopenedDateDept').val(null);
});

$('#appealReasonDepartment').on('hidden.bs.modal', function () {

	$('#appealDateDept').val(null);
});



var idReopenCnfrDept;
$scope.reopenConfirmationDept=function(id,hfid,deptName){

	idReopenCnfrDept=id;
	$("#reopendHFidDept").html(hfid);
	$("#reopendHFNameDept").html(deptName);
	$(".reopenConfirmationDept").attr("href", "#reopenConfirmationDept");
}

$scope.reopenDepartment=function(){

	var data={
		reopenedDateDept:$("#reopenedDateDept").val()
	};


	$http.post(routesPrefix+'/closure/reopenDepartment/'+idReopenCnfrDept,data).success(function (data) {

		window.location.href = routesPrefix+"/closureTab/department";
	});


}
var idClsrCnfrDept;
$scope.closedPhysicallyDeptConfirmation=function(id,hfid,deptName){

	idClsrCnfrDept=id;
	$("#closedHFidDept").html(hfid);
	$("#closedHFNameDept").html(deptName);
	$(".clsrConfirmationDept").attr("href", "#clsrConfirmationDept");

}


$scope.closedPhysicallyDepartment=function(){

	var data={
		closedDateDept:$("#closedDateDept").val()
	}
	$http.post(routesPrefix+'/closure/closedPhysicallyDepartment/'+idClsrCnfrDept,data).success(function (data) {
		window.location.href = routesPrefix+"/closureTab/department";
	});
}

var idDeptClsr;
$scope.appealReasonDepartment=function(id){
	idDeptClsr=id;
	$(".writeReason").attr("href", "#appealReasonDepartment");
}


$scope.appealDepartment=function(appealReasonDepartmentForm){

	if(appealReasonDepartmentForm.$invalid )
	{
		$scope.submittedDept = true;
		return;
	}else{

		$scope.reasonDepartmentBody.deptClosureId=idDeptClsr;
		$scope.reasonDepartmentBody.appealDateDept=$("#appealDateDept").val();

		console.log($scope.reasonDepartmentBody);

		$http.post(routesPrefix+'/closure/appealDepartment',$scope.reasonDepartmentBody).success(function (data) {

			window.location.href = routesPrefix+"/closureTab/department";
		});
	}
}

var otherDeptId;
$scope.otherDeptConfirmation=function(id,ms_other_note_dep){
	otherDeptId=id;
	if(ms_other_note_dep=="undefined"){
		ms_other_note_dep="";
	}
	$scope.otherDeptBody.note=ms_other_note_dep;
	$scope.$apply();
	$(".otherDeptNotes").attr("href", "#addOtherDeptNote");
}

$scope.otherDept=function(otherDeptNoteForm){

	$scope.otherDeptBody.facilityId=otherDeptId;
	console.log("$scope.otherDeptBody");
	console.log($scope.otherDeptBody);
	$http.post(routesPrefix+'/closure/otherDept',$scope.otherDeptBody).success(function (data) {
		window.location.href = routesPrefix+"/closureTab/department";
	});
}

$scope.currentTab=tabName;

if($scope.currentTab=='facility'){

	$("#department").removeClass('active');

	$("#facility").addClass('active');	
	$scope.facilityForm=true;
	$scope.departmentForm=false;
	$scope.loadFacilityClosureList();

}else if($scope.currentTab=='department'){

	$("#facility").removeClass('active');
	$("#department").addClass('active');

	$scope.facilityForm=false;
	$scope.departmentForm=true;
	$scope.loadDepartmentClosureList();

}else if($scope.currentTab=='summary'){

	$("#facility").removeClass('active');
	$("#department").removeClass('active');
	$("#summary").addClass('active');
	$scope.facilityForm=false;
	$scope.departmentForm=false;
	$scope.summaryForm=true;

	populateCounties(populateInspectionPeriod);

}



$scope.tabChange=function(event){

	$scope.currentTab=event.target.id;


	if($scope.currentTab=='facility'){

		$("#department").removeClass('active');

		$("#facility").addClass('active');
		$("#summary").removeClass('active');	
		$scope.facilityForm=true;
		$scope.departmentForm=false;
		$scope.summaryForm=false;
		$scope.loadFacilityClosureList();

	}else if($scope.currentTab=='department'){

		$("#facility").removeClass('active');
		$("#department").addClass('active');
		$("#summary").removeClass('active');

		$scope.facilityForm=false;
		$scope.departmentForm=true;
		$scope.summaryForm=false;
		$scope.loadDepartmentClosureList();

	}else if($scope.currentTab=='summary'){

		$("#facility").removeClass('active');
		$("#department").removeClass('active');
		$("#summary").addClass('active');
		$scope.facilityForm=false;
		$scope.departmentForm=false;
		$scope.summaryForm=true;

		populateCounties(populateInspectionPeriod);

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

function showSummaryFigure() {

	http({
		method: "POST",
		url: routesPrefix+"/closure/summary/figure",
		data: {
			county : scope.figureCounty.value,
			facilityDept : $("#indicator").val(),
			inspPeriod : scope.figureInspPeriod.value,
			status: $scope.facilityStatus
		}
	}).then(function mySucces(response) {

		var indicatorNameArr=response.data.indicatorNameArr;
		var seriesDataArr=response.data.seriesDataArr;
		var seriesGraceArr=response.data.seriesGraceArr;
		var seriesClosureArr=response.data.seriesClosureArr;
		var countyTitle=scope.figureCounty.value;
		var seriesArr=[];

		console.log(response.data);

		if (countyTitle=="All") {countyTitle="All Counties"}


			var period=scope.figureInspPeriod.value;

		if (period=="All") {period="All Inspection Periods"}

			if($scope.facilityStatus=="All"){

				seriesArr.push({
					name : "% of Total Facilities/Departments Reported for Closure",
					data: seriesClosureArr,
					pointWidth: 35

				});

				seriesArr.push({
					name : "% of Total Facilities/Departments Reported for Physical Closure",
					data: seriesDataArr,
					pointWidth: 35

				});
				seriesArr.push({
					name : "% of Total Facilities/Departments Given Grace Periods",
					data: seriesGraceArr,
					pointWidth: 35

				});
			}else if($scope.facilityStatus=="Graced"){

				seriesArr.push({
					name : "% of Total Number of Facilities/Departments Graced",
					data: seriesGraceArr,
					pointWidth: 35
				});
			}else if($scope.facilityStatus=="Closure"){
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
$scope.emailDetailView=function(){


	$scope.emailDetail={};

	$scope.emailDetail.fromDate=$("#fromDate").val();
	$scope.emailDetail.toDate=$("#toDate").val();

	var fr=$('#fromDate').val().split('-');
	var startDt=fr[2]+"/"+fr[1]+"/"+fr[0];

	var to=$('#toDate').val().split('-');
	var toDt=to[2]+"/"+to[1]+"/"+to[0];

	if(new Date(startDt).getTime() > new Date(toDt).getTime() || $("#selectedIndicator").val()==null ){
	}else{

		$scope.emailDetail.subject="[KePSIE Monitoring System] Weekly Facility/Department Closure Summary";
		$scope.emailDetail.content="<div><!--block-->Dear All,<br><br></div><div><!--block-->According to the result of the joint inspection conducted in your county during "+$scope.emailDetail.fromDate+" to "+$scope.emailDetail.toDate+", attached is a summary list of all actions taken and pending. &nbsp;<br><br></div><div><!--block-->Sincerely,&nbsp;</div><div><!--block-->KePSIE team&nbsp;</div><div>"+formateDate().split("_")[0]+"</div>";


		$("#emailPopup").attr("href", "#emailForm");
	}

}
$scope.sendMail=function(form){
	console.log($scope.emailDetail.content);
	if(form.$invalid )
	{

		$scope.submitted = true;
		return;
	}else{
		$('#emailForm').modal('hide');
		$.showLoading({allowHide: true});  

		$scope.emailDetail.fromDate=$("#fromDate").val();
		$scope.emailDetail.toDate=$("#toDate").val();
		$scope.emailDetail.county=$("#selectedCounty").val();
		$scope.emailDetail.indicator=$("#selectedIndicator").val();

		$http.post(routesPrefix+'/closure/sendMail',{emailDetail:$scope.emailDetail}).success(function (response) {
			window.location.href = routesPrefix+"/closureTab/summary";


		});
	}
}
});
