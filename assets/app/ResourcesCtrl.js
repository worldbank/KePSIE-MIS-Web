var app = angular.module('resourcesApp',['ngMessages']);

app.controller('resourcesCtrl', function($scope, $http) {

	$scope.addCategory=function(addResourcesForm){

		if(addResourcesForm.$invalid || $scope.categoryExist)
		{
			$scope.submitted = true;
			return;
		}else{
			
			console.log($scope.category);

			$http.post(routesPrefix+'/resources/newCategory',$scope.category).success(function(res){

				window.location.href = routesPrefix+"/resources";

			});

		}
	}


	$scope.editCategory=function(editResourcesForm){

		if(editResourcesForm.$invalid || $scope.categoryEditExist )
		{
			$scope.submitted = true;
			return;
		}else{

			console.log($scope.categoryEdit);

			$http.post(routesPrefix+'/resources/editCategory',$scope.categoryEdit).success(function(res){

				window.location.href = routesPrefix+"/resources";

			});

		}
	}



	var oTable;

	oTable=$('#categoryList').DataTable({

		"bServerSide": true,
		"pagingType": "numbers",
		"sAjaxSource":routesPrefix+"/resources/categoryList",
		"bAutoWidth": false,
		"bProcessing": true,
		"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"iDisplayLength": 25, 
		"bAutoWidth": false,
		"bDestroy": true,
  // "order": [[1, 'asc']],
  "aoColumns": [  
  
  { "mData": "name",width:'80%' },
  {'targets': 0,
  width:'20%',
  'searchable': false,
  'orderable': false,
  'className': 'dt-body-center',
  "mData":"_id",
  mRender: function ( data, type, row ) {

  	console.log(row);

  	return '<a style="margin-left: 8px !important;" href="'+routesPrefix+'/resources/include/'+row.id+'"  title="Include"><i class="fa fa-plus"></i></a>' +
  	'<a style="margin-left: 8px !important;" class=" editCategory" href="#" onclick="angular.element(this).scope().edit(\''+row.id+'\',\''+row.name+'\')" data-toggle="modal" title="Edit"><i class="icon-pencil"></i></a>' +
  	'<a style="margin-left: 8px !important;" class=" deletepopupclass deleteCategory" href="#"  onclick="angular.element(this).scope().delete(\''+row.id+'\')"  data-toggle="modal" title="Delete"><i class="icon-trash"></i></a>';

  }
}

]

}); 
	var ids;
	$scope.delete=function(id) {

		$(".deleteCategory").attr("href", "#deleteConfirmation");
	
		ids=id;
	}



	$scope.edit=function(id,name) {

		$(".editCategory").attr("href", "#editResources");
	
	
	 $("#edit_resources").val(name);
	 $("#categoryId").val(id);
	 $scope.glob=name;
	}




$scope.deleteCategory=function() {
	
	var body={id:ids};

	console.log("delete");
	console.log(body);

	$http.post(routesPrefix+'/resources/deleteCategory',body).success(function(res){

				window.location.href = routesPrefix+"/resources";

			});
}

	$scope.checkCategory=function() {

		 var data = {categoryName : $scope.category.name};
  $http.post(routesPrefix+'/resources/checkCategory',data)
  .success(function(response) {
   console.log(response);
   if(response!=""){
    $scope.categoryExist=true;
   
  }else{
   
   $scope.categoryExist=false;
 }
});

	}

	$scope.checkeditCategory=function () {

    if($scope.glob!=$scope.categoryEdit.name){
      var data = {categoryName : $scope.categoryEdit.name};
  $http.post(routesPrefix+'/resources/checkCategory',data)
  .success(function(response) {
     
       console.log(response);
       if(response!=""){
        $scope.categoryEditExist=true;

      }else{

       $scope.categoryEditExist=false;
     }
   });
    }else{
     $scope.categoryEditExist=false;
   }
 }

});