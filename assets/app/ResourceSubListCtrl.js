var app = angular.module('resourceSubListApp',['ngMessages']);

app.controller('resourceSubListCtrl', function($scope, $http) {
	$scope.trial=false;
	$scope.roles = [
 {key: 0, value: 'All'},
 {key: 1, value: 'Admin'},
 {key: 2, value: 'Report Viewer(National)'},
 {key: 3, value: 'B&Cs - ITEG'},
 {key: 4, value: 'B&Cs - Licensing decision-makers'},
 {key: 5, value: 'B&Cs - Other B&Cs members'},
 {key: 6, value: 'MOH Coordinator'},
 {key: 7, value: ' WB -Supervisors'},
 {key: 8, value: 'WB - HIA Team'},
 {key: 9, value: 'WB - Research team'},
 {key: 10, value: 'High-level - KTF, WB'},
 {key: 11, value: 'Steering Committee'},
 {key: 12, value: 'Logistics Firm'},


 {key: 13, value: 'Counties - CEC'},
 {key: 14, value: 'Counties - CDH'},
 {key: 15, value: 'Counties - Focal points'},


 {key: 16, value: 'Report Viewer(County)'},
 {key: 17, value: 'Inspector'},
 {key: 18, value: 'Limited'}
 ];




	var oTable=$('#sublist').DataTable({

		"bServerSide": true,
		"pagingType": "numbers",
		"sAjaxSource":routesPrefix+"/resources/categorySubList",
		"fnServerParams": function ( aoData ) {
			aoData.push( { "name": "categoryId", "value": $("#categoryid").val() });
		},  
		"bAutoWidth": false,
		"bProcessing": true,
		"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"iDisplayLength": 25, 
		"bAutoWidth": false,
		"bDestroy": true,
  // "order": [[1, 'asc']],
  "aoColumns": [  
  
  { "mData": "subList.name",width:'20%' },
  { "mData": "subList.role","defaultContent":"" },
  { "mData": "subList.description",width:'40%' },
  { "mData": "subList.link","defaultContent":"",width:'20%'},
  {'targets': 0,
  width:'10%',
  'searchable': false,
  'orderable': false,
  'className': 'dt-body-center',
  "mData":"_id",
  mRender: function ( data, type, row ) {

  	console.log(row);

  	if(row.subList.path==undefined){
  		return '<a  class="actionDiv " href="#"  onclick="angular.element(this).scope().edit(\''+row.subList.subListId+'\',\''+row.subList.name+'\',\''+row.subList.filename+'\',\''+row.subList.path+'\',\''+row.subList.description+'\',\''+row.subList.link+'\',\''+row.subList.role+'\')"   title="Edit"><i class="icon-pencil"></i></a>'+

  		'<a  class="actionDiv deletepopupclass deleteSubList" href="#"  onclick="angular.element(this).scope().delete(\''+row.subList.subListId+'\')"  data-toggle="modal" title="Remove"><i class="icon-trash"></i></a>';


  	}else{

  		return '<a  class="actionDiv " href="#"  onclick="angular.element(this).scope().edit(\''+row.subList.subListId+'\',\''+row.subList.name+'\',\''+row.subList.filename+'\',\''+row.subList.path+'\',\''+row.subList.description+'\',\''+row.subList.link+'\',\''+row.subList.role+'\')"   title="Edit"><i class="icon-pencil"></i></a>'+

  		' <a class="actionDiv" target="_blank" href="'+routesPrefix+'/resource/'+row.subList.path+'"  title="View"><i class="icon-eye"></i></a>' +

  		'<a  class="actionDiv deletepopupclass deleteSubList" href="#"  onclick="angular.element(this).scope().delete(\''+row.subList.subListId+'\')"  data-toggle="modal" title="Remove"><i class="icon-trash"></i></a>' ;

  		  	}
  }
}

]

}); 

	$scope.edit=function(subListId,name,filename,path,description,link,role){




		$scope.subListIdEdit=subListId;
		$scope.glob=name;

		$scope.editSubListBody=true;
		$scope.addSubListBody=true;
		//$scope.selectedRole = role;
	
		var arr = ["All"];
		if(role != undefined && role != "") {
			arr = role.split(",");	
		}
		
		$('#roleDropdownEdit').selectpicker('val', arr);
		console.log(name);
		//$("#subListName").val(name);
		console.log(filename);

		if(filename=="undefined"){
			
			$("#fileName1").text('');

		}else{

			$("#fileName1").text(filename);
		}
		//$("#fileupload1").val(filename);
		$("#removeImg1").removeClass("fileinput-exists");

		var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;

		if (regex.test(filename.toLowerCase())) {

			$("#uploadImg1").css("display","block");

			$("#uploadImg1").attr('src', routesPrefix+'/resource/'+path);

		}else{
			$("#uploadImg1").css("display","none");

		}
		$scope.editname=name;

		if(link=="undefined"){

			$scope.editlink = "";

		}else{

			$scope.editlink = link;

		}

		
		$scope.editdescription = description;
		$scope.sval='';
		
		console.log($scope.editname);
		console.log(description);
		console.log(link);
		$scope.$apply();
	}

	$scope.removeimg=function(){

		$("#uploadImg1").css("display","none");
		$("#fileupload1").prop('required',true);
	}

	var ids;
	$scope.delete=function(id) {

		$(".deleteSubList").attr("href", "#deleteConfirmation");

		ids=id;
	}

	$scope.deleteSubList=function() {
		var categoryId=$("#categoryid").val();
		var body={subListId:ids,categoryId:categoryId};

		console.log("delete");
		console.log(body);

		$http.post(routesPrefix+'/resources/deleteSubList',body).success(function(res){

			window.location.href = routesPrefix+"/resources/include/"+categoryId;

		});
	}


	$scope.checkCategorySubList=function() {

		console.log($scope.name);

		var data = {categoryId:$("#categoryid").val(),categorySubListName:$scope.name};
		$http.post(routesPrefix+'/resources/checkCategorySubList',data)
		.success(function(response) {
			console.log(response);
			if(response!=""){
				$scope.categorySubListExist=true;
				
			}else{
				
				$scope.categorySubListExist=false;
			}
		});

	}

	$scope.checkCategorySubListEdit=function() {

		console.log("checkCategorySubListEdit");
		console.log($scope.glob);
		console.log($scope.editname);

		if($scope.glob!=$scope.editname){
			var data = {categoryId:$("#categoryid").val(),categorySubListName:$scope.editname};
			$http.post(routesPrefix+'/resources/checkCategorySubList',data)
			.success(function(response) {
				console.log(response);
				if(response!=""){
					$scope.categorySubListEditExist=true;

				}else{

					$scope.categorySubListEditExist=false;
				}
			});
		}else{
			$scope.categorySubListEditExist=false;
		}

	}



	$scope.addSubList=function(subListForm){

		

		if(subListForm.$invalid ||  $scope.categorySubListExist )
		{
			$scope.submitted = true;
			return;
		}else{
			
			if($scope.myFile!=undefined)

			{
				console.log($scope.name);
				var file = $scope.myFile;
				console.log(file);
				console.log("file is " );
				console.dir(file);
				console.log($scope.myFile.name);

				var path=$scope.myFile.name;
				var uploadUrl = routesPrefix+"/resources/upload";
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
					$scope.subList={};
					$scope.subList.name=$scope.name;
					$scope.subList.description=$scope.description;
					$scope.subList.link=$scope.link;
					$scope.subList.path=res.path;
					$scope.subList.filename=res.filename;
					$scope.subList.role= $("#roleDropdown").val();
					$scope.subList.is_deleted=false;
					var categoryId=$("#categoryid").val();
					console.log($scope.subList);
					$http.post(routesPrefix+'/resources/addSubList/'+categoryId,$scope.subList)
					.success(function(response) {
						window.location.href = routesPrefix+"/resources/include/"+categoryId;
					}); 
				});   

			}else{

				$scope.subList={};
				$scope.subList.name=$scope.name;
				$scope.subList.description=$scope.description;
				$scope.subList.link=$scope.link;
				$scope.subList.role= $("#roleDropdown").val();
				$scope.subList.is_deleted=false;
				var categoryId=$("#categoryid").val();
				console.log($scope.subList);
				$http.post(routesPrefix+'/resources/addSubList/'+categoryId,$scope.subList)
				.success(function(response) {
					window.location.href = routesPrefix+"/resources/include/"+categoryId;
				}); 
				

			}  



		}

	}

	$scope.editSubList=function(editSubListForm){

		

		if(editSubListForm.$invalid ||  $scope.categorySubListExist )
		{
			$scope.submittedEdit = true;
			$scope.trial=true;
			return;
		}else{
			
			


			if($("#fileName1").text()!=""){

				

				console.log($scope.editname);

				if($scope.myFileEdit!=undefined){

					

					var file = $scope.myFileEdit;
					console.log(file);
					console.log("file is " );
					console.dir(file);
					console.log($scope.myFileEdit.name);

					var path=$scope.myFileEdit.name;
					var uploadUrl = routesPrefix+"/resources/upload";
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
						$scope.subList={};
						$scope.subList.subListId=$scope.subListIdEdit;
						$scope.subList.name=$scope.editname;
						$scope.subList.path=res.path;
						$scope.subList.link = $scope.editlink;
						$scope.subList.description=$scope.editdescription;
						$scope.subList.filename=res.filename;
						$scope.subList.role= $("#roleDropdownEdit").val();
						$scope.subList.is_deleted=false;
						var categoryId=$("#categoryid").val();
						console.log($scope.subList);
						$http.post(routesPrefix+'/resources/editSubList/'+categoryId,$scope.subList)
						.success(function(response) {
							window.location.href = routesPrefix+"/resources/include/"+categoryId;
						}); 
					});    
				}else{
					
					$scope.subList={};
					$scope.subList.subListId=$scope.subListIdEdit;
					$scope.subList.name=$scope.editname;
					$scope.subList.link = $scope.editlink;
					$scope.subList.description=$scope.editdescription;
					$scope.subList.role= $("#roleDropdownEdit").val();
					var categoryId=$("#categoryid").val();

					$http.post(routesPrefix+'/resources/editSubListName/'+categoryId,$scope.subList)
					.success(function(response) {
						window.location.href = routesPrefix+"/resources/include/"+categoryId;
					}); 

				}

			}else if($scope.editlink!=undefined){
				
				$scope.subList={};
				$scope.subList.subListId=$scope.subListIdEdit;
				$scope.subList.name=$scope.editname;
				$scope.subList.link = $scope.editlink;
				$scope.subList.description=$scope.editdescription;

				$scope.subList.path=undefined;
				$scope.subList.filename=undefined;
				$scope.subList.role= $("#roleDropdownEdit").val();
				var categoryId=$("#categoryid").val();

				$http.post(routesPrefix+'/resources/editSubListLink/'+categoryId,$scope.subList)
				.success(function(response) {
					window.location.href = routesPrefix+"/resources/include/"+categoryId;
				}); 

				

			}
			else{

				
				$scope.trial=true;
				$scope.submittedEdit = true;

			}

		}

	}








	var oTable=$('#categorysublist').DataTable({

		"bServerSide": true,
		"pagingType": "numbers",
		"sAjaxSource":routesPrefix+"/resources/categorySubList",
		"fnServerParams": function ( aoData ) {
			aoData.push( { "name": "categoryId", "value": $("#categoryid").val() });
		},  
		"bAutoWidth": false,
		"bProcessing": true,
		"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"iDisplayLength": 25, 
		"aaSorting": [], 
		"bDestroy": true,

  // "order": [[1, 'asc']],
  "aoColumns": [  
  
  { "mData": "subList.name","width":"90%"},
  { "mData": "subList.link","defaultContent":"","width":"90%",
  mRender: function ( data, type, row ) {

  	if(row.subList.link==undefined){
  		return '';
  	}else{

  		return '<a href="'+row.subList.link+'" target="_blank">'+row.subList.link+'</a>';
  	}

  }  
},
{
	'width':'10%',
	'className': 'dt-body-center',
	"mData":"_id",
	"defaultContent":"",
	mRender: function ( data, type, row ) {
		if(row.subList.path==undefined){
			return '';
		}else{
			return ' <a class="actionDiv" target="_blank" href="'+routesPrefix+'/resource/'+row.subList.path+'"  title="View"><i class="fa fa-file-text-o"></i></a>';
		}
	}
},
{"mData":"subList.description",  width:'10%'}

]

}); 





});


app.directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		require:'ngModel',
		link: function(scope, element, attrs,ngModel) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			console.log("directive");
			console.log(element);
			console.log(attrs);

			element.bind('change', function(){
				scope.$apply(function(){
					ngModel.$setViewValue(element.val());
					ngModel.$render();
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
}]);