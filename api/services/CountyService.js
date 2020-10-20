var subCounties = {
	"Kakamega": [
	{"key":"Butere","value":"Butere"},
	{"key":"Ikolomani","value":"Ikolomani"},
	{"key":"Khwisero","value":"Khwisero"},
	{"key":"Likuyani","value":"Likuyani"},
	{"key":"Lugari","value":"Lugari"},
	{"key":"Lurambi","value":"Lurambi"},
	{"key":"Malava","value":"Malava"},
	{"key":"Matungu","value":"Matungu"},
	{"key":"Mumias East","value":"Mumias East"},
	{"key":"Mumias West","value":"Mumias West"},
	{"key":"Navakholo","value":"Navakholo"},
	{"key":"Shinyalu","value":"Shinyalu"}
	],
	"Kilifi": [
	{"key":"Ganze","value":"Ganze"},
	{"key":"Kaloleni","value":"Kaloleni"},
	{"key":"Kilifi North","value":"Kilifi North"},
	{"key":"Kilifi South","value":"Kilifi South"},
	{"key":"Magarini","value":"Magarini"},
	{"key":"Malindi","value":"Malindi"},
	{"key":"Rabai","value":"Rabai"}
	],
	"Meru": [
	{"key":"Buuri","value":"Buuri"},
	{"key":"Igembe Central","value":"Igembe Central"},
	{"key":"Igembe North","value":"Igembe North"},
	{"key":"Igembe South","value":"Igembe South"},
	{"key":"Imenti Central","value":"Imenti Central"},
	{"key":"Imenti North","value":"Imenti North"},
	{"key":"Imenti South","value":"Imenti South"},
	{"key":"Tigania East","value":"Tigania East"},
	{"key":"Tigania West","value":"Tigania West"}
	]
};

module.exports = {

	getCounty: function(number) {
		if(number=="1") {
			return "Kakamega";
		} else if(number=="2") {
			return "Kilifi";
		} else if(number=="3") {
			return "Meru";
		} else if(number=="All") {
			return "All";
		} else {
			return "";
		}
	},

	getCountyNumber: function(county) {
		if(county=="Kakamega") {
			return "1";
		} else if(county=="Kilifi") {
			return "2";
		} else if(county=="Meru") {
			return "3";
		} else {
			return "-1";
		}
	},

	getSubCountiesByCounties: function(counties) {
		var list = "{";
		for(i in counties) {
			if(counties[i].value!="All")
				list = list + "\"" + counties[i].value + "\" : "+JSON.stringify(subCounties[counties[i].value])+",";
		}
		list = list.replace(/,(\s+)?$/, '');
		list = list + "}";
		return list;
	},

	getCountiesByRole: function(user) {
		var countyList = [];


		var countyLevelUser=UserService.getCountyUser();
		var nationalLevelUser=UserService.getNationalUser();




		if(nationalLevelUser.indexOf(user.role)!=-1) {
			countyList = [
			{"key":"All","value":"All"},
			{"key":"1","value":"Kakamega"},
			{"key":"2","value":"Kilifi"},
			{"key":"3","value":"Meru"}
			];
		}else if(countyLevelUser.indexOf(user.role)!=-1) {
			countyList = [{"key":CountyService.getCountyNumber(user.county),"value":user.county}];
		} else if(user.role=="Inspector") {
			countyList = [{"key":CountyService.getCountyNumber(user.county),"value":user.county}];
		} 
		return countyList;
	},

	getCounties: function() {
		var countyList = [];

		countyList = [
		{"key":"All","value":"All"},
		{"key":"1","value":"Kakamega"},
		{"key":"2","value":"Kilifi"},
		{"key":"3","value":"Meru"}
		];
		return countyList;
	},
	
	getCountiesInFigures: function() {
		
		countyList = [
		{"key":"All","value":"All"},
		{"key":"By County","value":"By County"},
		{"key":"1","value":"Kakamega"},
		{"key":"2","value":"Kilifi"},
		{"key":"3","value":"Meru"}
		];
		
		return countyList;
	},

	getCountiesInFiguresByRole: function(user) {
		


		if(user.role!="Inspector"){
			countyList = [
			{"key":"All","value":"All"},
			{"key":"By County","value":"By County"},
			{"key":"1","value":"Kakamega"},
			{"key":"2","value":"Kilifi"},
			{"key":"3","value":"Meru"}
			];
		} else  {
			countyList = [{"key":CountyService.getCountyNumber(user.county),"value":user.county}];
		} 
		return countyList;
	},

	getOwnershipList: function() {
		return [
		{"key":"All","value":"All"},
		{"key":"Public","value":"Public"},
		{"key":"Private","value":"Private"}
		];
	},

	getLevelList: function() {
		return [
		{"key":"All","value":"All"},
		{"key":"Level 2","value":"Level 2"},
		{"key":"Level 3","value":"Level 3"},
		{"key":"Level 4","value":"Level 4"},
		{"key":"Level 5","value":"Level 5"}
		];
	},

	getRiskList: function() {
		return [
		{"key":"All","value":"All"},
		{"key":"Minimally","value":"Minimally"},
		{"key":"Partially","value":"Partially"},
		{"key":"Substantially","value":"Substantially"},
		{"key":"Fully","value":"Fully"}
		];
	},

	getLevelNumber: function(level) {
		if(level=="Level 2") {
			return "2";
		} else if(level=="Level 3") {
			return "3";
		} else if(level=="Level 4") {
			return "4";
		} else if(level=="Level 5") {
			return "5";
		}
	},

	getAll: function() {
		return ["Kakamega","Kilifi","Meru"];
	},

	getUnit: function() {
		

		return ["Health Facility Infrastructure",
		"General Management and Recording of Information",
		"Infection Prevention and Control","Medical and Dental Consultation Services",
		"Labour Ward","Medical and Pediatric Wards","Theatre","Pharmacy","Laboratory","Radiology",
		"Nutrition and Dietetics Service Unit","Mortuary"]



	},

	allCounty: function() {
		return ["All","Kakamega","Kilifi","Meru"];
	},
	getReasonNumber: function(reason) {
		if(reason=="Facility does not have required licenses/registration/membership") {
			return 1;
		} else if(reason=="Inspection score result was non-compliance (<10%)") {
			return 2;
		} else if(reason=="Facility did not improve to next compliance category in required time") {
			return 3;
		} else if(reason=="All healthcare staff present in the facility have no licenses"){
			return 4;
		} else if(reason=="Facility visited 3 times and in-charge has not cooperated for an inspection"){
			return 5;
		}
	},
	getReasonName: function(reason) {
		if(reason==1) {
			return "Facility does not have required licenses/registration/membership";
		} else if(reason==2) {
			return "Inspection score result was non-compliance (<10%)";
		} else if(reason==3) {
			return "Facility did not improve to next compliance category in required time";
		} else if(reason==4){
			return "All healthcare staff present in the facility have no licenses";
		} else if(reason==5){
			return "Facility visited 3 times and in-charge has not cooperated for an inspection"
		}
	},
	getReasonNumberForDepartment: function(reason) {
		if(reason=="Department does not have required (or relevant) licenses/registration/membership") {
			return 1;
		} 
	},
	getReasonNameForDepartment: function(reason) {
		if(reason==1) {
			return "Department does not have required (or relevant) licenses/registration/membership";
		} 
	},
	getClosureReasonFacility:function() {

		return ["Facility does not have required licenses/registration/membership",
		"Inspection score result was non-compliance (<10%)","Facility did not improve to next compliance category in required time",
		"All healthcare staff present in the facility have no licenses"]
	},

	getClosureReasonDept:function(){


		return ["Department does not have required (or relevant) licenses/registration/membership"]
	},

	getClosureDeptName:function(){

		return ["Pharmacy","Laboratory","Radiology","Nutrition and Dietetics"]
	},
	getClosureDeptVar:function(){

		return {"Pharmacy":"ms_closed_d1",
		"Laboratory":"ms_closed_d2",
		"Radiology":"ms_closed_d3",
		"Nutrition and Dietetics":"ms_closed_d4"};
	},
	getGracedDeptVar:function(){

		return {"Pharmacy":"pharm_close",
		"Laboratory":"lab_close",
		"Radiology":"rad_close",
		"Nutrition and Dietetics":"nutri_close"};
	},
	getGracedDeptName:function(){

		return {"f_close":"Facility",
		"pharm_close":"Pharmacy",
		"lab_close":"Laboratory",
		"rad_close":"Radiology",
		"nutri_close":"Nutrition and Dietetics"};
	},
	getGracedDeptVarArr:function(){

		return ["f_close","pharm_close","lab_close","rad_close","nutri_close"];
	},


	getAppealReason:function(){

		return ["It is the only health facility in the area","It is the only health facility of that level in the area",
		"Other public health concern, please specify"]
	},

	getOtherIssues:function(){

		return ["Reclassification of Facilities","Suspected Malpractice","Absent Superintendent or In-Charge",
		"Services Offered but No Physical Department","Staff Issues","Other/specify"]
	},

	getInspectionWave:function(){

		/*var d = new Date();
		var quarter= d.getMonth() - d.getMonth() % 3;
		var year=d.getFullYear();
		var start = new Date(year,quarter,1);
		var end = new Date(year,quarter+3,0);
		var oneDay = 24*60*60*1000; 
		var diffDays = Math.round(Math.abs((end.getTime() - d.getTime())/(oneDay)));

		var currentWave = Math.floor(d.getMonth()/3) + 2;*/

		var year,start,end,currentWave;
		var d = new Date();

	/*For 3-month wave

		var wave1=[10,11,0];
		var wave2=[1,2,3];
		var wave3=[4,5,6];
		var wave4=[7,8,9];

		var m=d.getMonth();
		year=d.getFullYear();

		if(wave1.indexOf(m)!=-1){
			
			if(m!=0){
			 
			 start = new Date(year,wave1[0],1);
		 	 end = new Date(year,wave1[0]+3,0);
		 	}else{
		 	 start = new Date(year-1,wave1[0],1);
		 	 end = new Date(year-1,wave1[0]+3,0);
		 	}

		 	currentWave=1;
		}else if(wave2.indexOf(m)!=-1){

			 start = new Date(year,wave2[0],1);
		 	 end = new Date(year,wave2[0]+3,0);
			currentWave=2;
		}else if(wave3.indexOf(m)!=-1){
			
			 start = new Date(year,wave3[0],1);
		 	 end = new Date(year,wave3[0]+3,0);
		 	 currentWave=3;
		}else{

			 start = new Date(year,wave4[0],1);
		 	 end = new Date(year,wave4[0]+3,0);
		 	 currentWave=4;
		 	}*/

		 	var wave1=[10,11,0,1];
		 	var wave2=[2,3,4,5];
		 	var wave3=[6,7,8,9];

		 	var m=d.getMonth();
		 	year=d.getFullYear();

		 	if(wave1.indexOf(m)!=-1){

		 		if(m!=0 && m!=1){

		 			start = new Date(year,wave1[0],1);
		 			end = new Date(year,wave1[0]+4,0);
		 		}else{
		 			start = new Date(year-1,wave1[0],1);
		 			end = new Date(year-1,wave1[0]+4,0);
		 		}

		 		currentWave=1;
		 	}else if(wave2.indexOf(m)!=-1){

		 		start = new Date(year,wave2[0],1);
		 		end = new Date(year,wave2[0]+4,0);
		 		currentWave=2;
		 	}else if(wave3.indexOf(m)!=-1){

		 		start = new Date(year,wave3[0],1);
		 		end = new Date(year,wave3[0]+4,0);
		 		currentWave=3;
		 	}else{

		 		start = new Date(year,wave4[0],1);
		 		end = new Date(year,wave4[0]+4,0);
		 		currentWave=4;
		 	}

		 	var oneDay = 24*60*60*1000; 
		 	var diffDays = Math.round(Math.abs((end.getTime() - d.getTime())/(oneDay)));



		 	var waveDetail={
		 		start:start,
		 		end:end,
		 		diffDays:diffDays,
		 		currentWave: currentWave
			//currentWave: currentWave > 4? currentWave - 4 : currentWave
		};

		
		return waveDetail;


	},
	formateDate:function(){

		var date = new Date();
		var month = date.getMonth() + 1;
		var dt=date.getDate();
		var hours=date.getHours();
		var minutes=date.getMinutes();
		var seconds=date.getSeconds();
		return (dt > 9 ? dt : "0" + dt) + "-" + (month > 9 ? month : "0" + month) + "-" + date.getFullYear()+"_"+hours+":"+minutes+":"+seconds;

	},
	formateSpecificDate:function(date){

		
		var month = date.getMonth() + 1;
		var dt=date.getDate();
		var hours=date.getHours();
		var minutes=date.getMinutes();
		var seconds=date.getSeconds();
		return (dt > 9 ? dt : "0" + dt) + "/" + (month > 9 ? month : "0" + month) + "/" + date.getFullYear();

	},

};