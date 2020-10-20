var srModule = angular.module("completeJHICIndividualModule",[]);

srModule.controller("completeJHICIndividualController", function($scope,$http){
	initHfReport();

	$scope.emailDetailView=function(){

		$("#emailPopup").attr("href", "#emailForm");

	/*	$http.post(routesPrefix+'/completejhic/individual/emailReceiverList',
				{inspID:inspID}).success(function (response) {
					console.log("response.userList.email");
					console.log(response.userList);
					var userList=response.userList;
					var ccUserList=response.ccUserList;*/
		$scope.emailDetail={};

		var inspDate=formateDate(info._date).split("_")[0]

		$scope.emailDetail.subject="Complete JHIC Report for "+info._hfname+" - inspection done on "+inspDate
		
		var receiver="";

			if(info.s1a_3a==undefined || info.s1a_3a==null){
				receiver="facility in-charge";
			}else{
				receiver=info.s1a_3a;
			}

		$scope.emailDetail.content="<div><!--block-->Dear "+receiver+",<br><br></div>"+
		"<div><!--block-->Please kindly find attached a summary of the complete Joint Health Inspection Checklist Report for your facility."+
		" The inspection was done by "+info._inspectorname+" on "+inspDate+". The full inspection report is also available at the sub-county office. In case of any questions, you may contact Mr. John Kabanya (0722825934, <a href='mailto:johnaniam@gmail.com'>johnaniam@gmail.com</a>) at the Ministry of Health. Thank you very much."+
		" &nbsp;<br><br></div><div><!--block-->Best,&nbsp;</div><div><!--block-->"+info._inspectorname+"&nbsp;</div><div>"+formateDate().split("_")[0]+"</div>";

		$scope.emailDetail.toReceiver=[];
		
		$scope.emailDetail.toReceiver.push(ownerEmail);

		/*$scope.emailDetail.ccReceiver=[];

		if(ccUserList!=undefined){

			for (var i = 0; i < ccUserList.length; i++) {
				$scope.emailDetail.ccReceiver.push(ccUserList[i].email);
			}

		}*/

	}

	$scope.sendPDF=function(form){
		showAll();
		var reportHTML = $("#reportRow").html();
		$scope.emailDetail.reportHTML = reportHTML.replace(/\n|\t/g, ' ');
		$scope.emailDetail.mailReportHeader=$("#mailReportHeader").val();

		initHfReport();

		if(form.$invalid )
		{

			$scope.submitted = true;
			return;
		}else{
			
           	 $('#emailForm').modal('hide');
			$.showLoading({allowHide: true});    

			$http.post(routesPrefix+'/completejhic/individual/emailPdf',
				{emailDetail:$scope.emailDetail}).success(function (response) {

					 $('#emailForm').modal('hide');
              $('#successMsg').show();
               $('#successMsg').delay(1000).fadeOut(3000); 
               location.reload();

					
				});
			}
		}


	});

function initHfReport() {
	if(document.getElementById("s2Body")==null) {
		hideAll();
		hideShow("s14Body");

	} else {
		$("#s1Body").show();
		for (i = 1; i < 14; i++) {
			$("#s" + i + "" + "Body").hide();
		}
		$("#ratingTable").hide();
		$("#summaryReport").hide();
	}

}

function showAll() {
	for (i = 1; i < 15; i++) {
		$("#s" + i + "" + "Body").show();
	}
	$("#ratingTable").show();
	$("#summaryReport").show();
}

function hideAll() {
	for (i = 1; i < 15; i++) {
		$("#s" + i + "" + "Body").hide();
	}
	$("#ratingTable").hide();
	$("#summaryReport").hide();
}

function hideShow(id) {
	if ($("#" + id).is(":visible")) {
		$("#" + id).hide();
	} else {
		$("#" + id).show();
	}
}

function changeSize(cssClass) {
	$("#reportContainer").removeClass();
	$("#reportContainer").addClass(cssClass);
}

function createPDF() {
	showAll();
	var reportHTML = $("#reportRow").html();
	reportHTML = reportHTML.replace(/\n|\t/g, ' ');
	$("#reportHTML").val(reportHTML);
	$("#reportForm").submit();
	initHfReport();
}




