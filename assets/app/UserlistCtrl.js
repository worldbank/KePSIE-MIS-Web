 var app = angular.module('userListApp',[]);

 app.controller('userListCtrl', function($scope, $http,sharedProperties,$rootScope) {

  var ids;
  var oTable;
  var username;
  oTable=$('#userlist').DataTable({

   "bServerSide": true,
   "pagingType": "numbers",
   "sAjaxSource":routesPrefix+"/user/list",
   "bAutoWidth": false,
   "bProcessing": true,
   "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
   "iDisplayLength": 25, 
  // "order": [[1, 'asc']],
   "aoColumns": [  
   { "mData": "id",'sortable':false ,'visible':false},
   { "mData": "name" },
   { "mData": "email" },
   { "mData": "role" },
   { "mData": "organization",
     mRender: function ( data, type, row ) {
        if(data=="Other"){
         return  row.otherOrganization ;
       }else {
        return data;
       }
   }
 },
   { "mData": "county", "defaultContent":"" },
   {'targets': 0,
   'searchable': false,
   'orderable': false,
   'className': 'dt-body-center',
   "mData":"id",  width:'10%',

   mRender: function ( data, type, row ) {
    return ' <a class="actionDiv" href="'+routesPrefix+'/user/view/'+row.id+'"  title="View"><i class="icon-eye"></i></a>' +
    '<a class="actionDiv" href="'+routesPrefix+'/user/edit/'+row.id+'" title="Edit"><i class="icon-pencil"></i></a>' +
    '<a  class="actionDiv deletepopupclass deleteUser" href="#"  onclick="angular.element(this).scope().delete(\''+row.id+'\',\''+row.email+'\')"  data-toggle="modal" title="Delete"><i class="icon-trash"></i></a>';

  }
}],
}); 
 
  $scope.delete=function(id,email){
    ids=id;
   username=email;
    var uid=$("#userid").val();
    if(uid==ids){
     
      $(".deleteUser").attr("href", "#logedinUser");
    }else{
     
      $(".deleteUser").attr("href", "#deleteConfirmation");
    }
  }
  $scope.deleteUser=function(){

    var data = {id : ids,username:username};
    $http.post(routesPrefix+'/user/delete', data).success(function (data) {
      
      window.location.href = routesPrefix+"/user/all";
    });
  } 
  $scope.view=function(id){

   window.location.href = routesPrefix+"/user/view";
   
 } 
});

 app.service('sharedProperties', function () {
  var property = 'First';

  return {
    getProperty: function () {
      return property;
    },
    setProperty: function(value) {
      property = value;
    }
  };
});

 