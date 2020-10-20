var app = angular.module('faqApp',['angularTrix']);

 app.controller('faqCtrl', function($scope, $http,$parse) {

$('.bs-select').selectpicker('val', ['All']);


var objId;

$scope.unit=$("#unit").val();

 $scope.filterChange=function(){

console.log($("#unit").val());


    var oTable=$('#queList').DataTable({

       destroy: true,
     "bServerSide": true,
     "pagingType": "numbers",
     "sDom": 'lrtip',
     "sAjaxSource":routesPrefix+"/faq/all",
     "fnServerParams": function ( aoData ) {
            aoData.push( { "name": "unit", "value": $("#unit").val() },
                       
                        { "name": "generalSearchText", "value": $("#generalSearchText").val() }
                       );
        },  
    
     "bProcessing": true,
     "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
     "iDisplayLength": 25, 
     "aaSorting": [], 
     "aoColumns": [  

     
 { "mData": "question",width:"90%",
   mRender: function ( data, type, row ) {

return '<div style="font-size: 13px;word-break: break-all">'+row.question+'</div>';

 }  

},
  {"mData":"id",  width:'10%',
   'className': 'dt-body-center',
   "visible": false,
   mRender: function ( data, type, row ) {
    return '<a class="actionDiv" href="'+routesPrefix+'/faq/edit/'+row.id+'" title="Edit"><i class="icon-pencil"></i></a>' +
    '<a  class="actionDiv deletepopupclass deleteUser" href="#"  onclick="angular.element(this).scope().delete(\''+row.id+'\',\''+row.email+'\')"  data-toggle="modal" title="Delete"><i class="icon-trash"></i></a>';

  }
 
},
 {"mData":"answer",width:"90%",
 defaultContent:"<div>No answer specified.</div>",
 mRender: function ( data, type, row ) {

return '<div style="font-size: 13px;word-break: break-all">'+row.answer+'</div>';
}
}

]

});  

    if(loggedInUserRole == "Admin") {
    oTable.column(1).visible(true);
  }
 
    //oTable.destroy();
    
}

$scope.delete=function(id,email){
       objId = id;
      $(".deleteUser").attr("href", "#deleteConfirmation");
   
  }
  $scope.deleteQuestion=function(){
   
    var data = {id : objId};
    console.log(data);
    $http.post(routesPrefix+'/faq/delete', data).success(function (data) {
      
      window.location.href = routesPrefix+"/faq";
    });
  } 
  $scope.view=function(id){

   window.location.href = routesPrefix+"/faq/view";
   
 } 


$scope.filterChange();


$scope.addQuestion = function(faqForm) {

  if(faqForm.$invalid)
  {
    $scope.submitted = true;
    return;
  }else{

  // $scope.faq.status="Pending";
  // $scope.faq.category =$('#sections option:selected').html();
   
   
   $scope.faq.createdAt= new Date();
   $scope.faq.modifiedAt= new Date();
   
   $http.post(routesPrefix+'/faq/save',$scope.faq)
   .success(function(response) {

    window.location.href = routesPrefix+"/faq";
  }); 
 }
}

});




