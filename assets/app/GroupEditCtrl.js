var app = angular.module('groupEditApp',[]);

app.controller('groupEditCtrl', function($scope, $http) {
var grpid=$("#groupid").val();

 $http.post(routesPrefix+'/group/detail/'+grpid).success(function (data) {

  console.log("groupData");
  console.log(data);
  $scope.name=data.name;
$scope.existname=data.name;
var arr=[];
for(var i=0;i<data.purpose.length;i++){
arr.push(data.purpose[i]);
}
$('.bs-select').selectpicker('val', arr);
$scope.purpose = arr;
 $('.bs-select').selectpicker('refresh');
// $('#gift-close').trigger('click');
 });


  var oTable;
  $scope.selectUserList=[];
  oTable=$('#user_grp_edit_list').DataTable({

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
  "targets": 0, "title":  "<input name='select_all'  value='' id='select_all' type='checkbox'/>",
  'render': function (data, type,row){

    if( row.groupId!=undefined && row.groupId.indexOf(grpid)>=0){
      if($scope.selectUserList.indexOf(row.id)==-1){
      $scope.selectUserList.push(row.id);
      console.log($scope.selectUserList);
    }
    return '<input type="checkbox" class="actionDiv" name="id[]" value="' 
    + $('<div/>').text(data).html() + '" checked >';
  }else{
    return '<input type="checkbox" class="actionDiv" name="id[]" value="' 
    + $('<div/>').text(data).html() + '" >';
  }
  }
},
{ "mData": "name", "title": "Name" },
{ "mData": "email", "title": "Email" },
{ "mData": "role", "title": "Role" },
{ "mData": "county", "defaultContent":"", "title": "County" },

],

}); 
  $('#select_all').on('click', function(){
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
  $('#user_grp_edit_list').on('click', 'input[class="actionDiv" ]', function(){

      // If checkbox is not checked
      if(this.checked){
        
      
        $scope.selectUserList.push(this.value);
        console.log($scope.selectUserList);

      }else{
          $('#select_all').prop('checked', false);
        var index = $scope.selectUserList.indexOf(this.value);
        if (index > -1) {
          $scope.selectUserList.splice(index, 1);
        }
        console.log($scope.selectUserList);
      }
    
  });

$scope.checkgroup=function () {

    if($scope.existname!=$scope.name){
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
    }else{
     $scope.groupExist=false;
   }
 }


  $scope.editGroup=function(groupEditForm){
  
  $scope.checkgroup();
  if(groupEditForm.$invalid ||  $scope.groupExist)
  {

    $scope.submitted = true;
    return;
  }else{


    var len=$scope.selectUserList.length;
    console.log(len);
    console.log($scope.selectUserList);
    $scope.groupDetail={id:grpid,purpose:$scope.purpose,name:$scope.name,no_of_members:$scope.selectUserList.length,memberList:$scope.selectUserList};

      $http.post(routesPrefix+'/group/update', $scope.groupDetail).success(function (data) {
      
      window.location.href = routesPrefix+"/group/all";
    
    });

  }
}


});
