var app = angular.module('groupApp',[]);

app.controller('groupCtrl', function($scope, $http) {

  var	Table=$('#grouplist').DataTable({

    "bServerSide": true,
    "pagingType": "numbers",
    "sAjaxSource":routesPrefix+"/group/list",
    "bAutoWidth": false,
    "bProcessing": true,
    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
    "iDisplayLength": 25, 
    "aaSorting": [], 
  // "order": [[1, 'asc']],
  "aoColumns": [  
  
  { "mData": "name", "title": "Name" },
  { "mData": "no_of_members", "title": "No. of Members" },
  { "mData": "purpose", "title": "Purpose" },
  {'targets': 0,
  'searchable': false,
  'orderable': false,
   "title": "Actions",
  'className': 'dt-body-center',
  "mData":"id",
  mRender: function ( data, type, row ) {
    return '<a class="actionDiv" href="'+routesPrefix+'/group/edit/'+row.id+'" title="Edit"><i class="icon-pencil"></i></a>' +
    '<a  class="actionDiv deletepopupclass deleteUser" href="#"  onclick="angular.element(this).scope().delete(\''+row.id+'\',\''+row.name+'\')"  data-toggle="modal" title="Remove"><i class="icon-trash"></i></a>';

  }
}
]
}); 
  var ids,grpname;
  $scope.delete=function(id,name){
   ids=id;
   grpname=name;
   $(".deleteUser").attr("href", "#deleteConfirmation");

 }
 $scope.deleteGroup=function(){

  var data = {id : ids,name:grpname};
  $http.post(routesPrefix+'/group/delete', data).success(function (data) {

    window.location.href = routesPrefix+"/group/all";
  });
} 

$scope.checkgroup=function () {

  var data = {name : $scope.name};
  $http.post(routesPrefix+'/group/checkGroup',data)
  .success(function(response) {
   console.log(response);
   if(response!=""){
    $scope.groupExist=true;

  }else{
   $scope.groupExist=false;
 }
});

}

var oTable;
$scope.selectUserList=[];
oTable=$('#usergrplist').DataTable({

  "bServerSide": true,
  "pagingType": "numbers",
  "sAjaxSource":routesPrefix+"/user/list",
  "bAutoWidth": false,
  "bProcessing": true,
  "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
  "iDisplayLength": 25, 

  // "order": [[1, 'asc']],
  "aoColumns": [  
  { "mData": "id", "searchable": false,
  "orderable": false, "sClass": "centertext",
  "targets": 0, "title":  "<input name='select_all' value='' id='select_all_user' type='checkbox'/>",
  'render': function (data, type, full, meta){
  	return '<input type="checkbox" class="actionDiv" name="id[]" value="' 
  	+ $('<div/>').text(data).html() + '">';
  }
},
{ "mData": "name", "title": "Name" },
{ "mData": "email", "title": "Email" },
{ "mData": "role", "title": "Role" },
{ "mData": "county", "defaultContent":"", "title": "County" },

],

}); 
$('#select_all_user').on('click', function(){
      // Check/uncheck all checkboxes in the table
      var rows = oTable.rows({ 'search': 'applied' }).nodes();
      $('input[type="checkbox"]', rows).prop('checked', this.checked);

      if(this.checked){
        $scope.selectUserList=[];
        oTable.$('input[type="checkbox"]').each(function(){
          $scope.selectUserList.push(this.value);

        });
        console.log("All");
        console.log($scope.selectUserList);
      }else{
        console.log("removeAll");
        $scope.selectUserList=[];
      }

    });
$('#usergrplist').on('click', 'input[class="actionDiv" ]', function(){

      if(this.checked){
      	$scope.selectUserList.push(this.value);
      	console.log($scope.selectUserList);

      }else{
      	$('#select_all_user').prop('checked', false);
      	var index = $scope.selectUserList.indexOf(this.value);
      	if (index > -1) {
      		$scope.selectUserList.splice(index, 1);
      	}
      	console.log($scope.selectUserList);
      }
    });


$scope.createGroup=function(groupAddForm){

  $scope.checkgroup();
  if(groupAddForm.$invalid ||  $scope.groupExist  )
  {
 $scope.submitted = true;
    return;
  }else{
var len=$scope.selectUserList.length;

    $scope.groupDetail={name:$scope.name,purpose:$scope.purpose,no_of_members:$scope.selectUserList.length,memberList:$scope.selectUserList};
    $scope.groupDetail.createdAt= new Date();
    $scope.groupDetail.modifiedAt= new Date();
    $http.post(routesPrefix+'/group/create', $scope.groupDetail).success(function (data) {

      window.location.href = routesPrefix+"/group/all";

    });

  }
}
});