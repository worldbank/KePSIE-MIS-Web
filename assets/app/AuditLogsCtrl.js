 var app = angular.module('auditLogsApp',[]);

 app.controller('auditLogsCtrl', function($scope, $http,sharedProperties,$rootScope) {


  var ids;
  var oTable;

  oTable=$('#userlogs').DataTable({

   "bServerSide": true,
   "pagingType": "numbers",
   "sAjaxSource":routesPrefix+"/auditTrail",
   "bAutoWidth": false,
   "bProcessing": true,
   "lengthMenu": [[10, 25, 50,100, -1], [10, 25, 50,100, "All"]],
   "iDisplayLength": 100, 
  // "order": [[1, 'asc']],
   "aoColumns": [  
   { "mData": null, "searchable": false,
   "orderable": false, "sClass": "centertext",
   "targets": 0    },
   { "mData": "username" },
   { "mData": "action" },
   { "mData": "date" },
   { "mData": "ipAddress"},
 
],
 "fnRowCallback" : function(nRow, aData, iDisplayIndex){      
                           var oSettings = this.fnSettings();
                           $("td:first", nRow).html(oSettings._iDisplayStart+iDisplayIndex +1);
                           return nRow;
                },


         }); 


   $scope.body=function(dataItem){
    console.log("dataItem");
    console.log(dataItem);
     var data = {id : dataItem};

 $http.post(routesPrefix+'/user/viewlog', data).success(function (data) {
 
  console.log(data.username);
  var pls=data.body;
  console.log(pls);
  $scope.dt = JSON.parse(pls);

  if( $scope.dt.name){
  $scope.logData=true;
  $scope.logData1=false;
  }else{
    
    $scope.logData=false;
     $scope.logData1=true;
  }
  if($scope.dt.role=="Inspector"){
  $scope.showInspectorId = true;
}else{
 $scope.showInspectorId = false;
 
}
 if($scope.dt.role=="Report Viewer(National)"){

  $scope.reportViewer = true;
 
}else{
 $scope.reportViewer = false;
}
  
  if($scope.dt.organization=="other"){
    $scope.dt.organization=$scope.dt.otherOrganization;
  }
  
 });
   // console.log(dataItem.name);

  //  var tmp=JSON.parse(dataItem);
   // console.log(tmp[1].name);
  /*  var array = dataItem.split(',');
    console.log(array[0]);
     $("#auditname").text(array[0]);
    var array = dataItem.split(',');
    //var string1 = JSON.stringify(array);

    console.log(array);
   // var str="";
  
    for(var i=0;i<array.length;i++){
      var j=i+1;

      // str+= array[i]+":"+array[j]+",";
       i++;
    }
   
  //  var frmt="{"+str+"}";
    //var jsonArray = JSON.parse(string1);
    //console.log(jsonArray.name);
   var data=dataItem.split(",");
   alert(data.length);
  
   $("#auditname").text(data[1]);
  
   $("#auditemail").text(data[3]);
$("#auditcontact").text(data[5]);
  $("#auditorganization").text(data[7]);
   $("#auditrole").text(data[9]);
/*    $("#auditinspectorId").text(data[5]);
     $("#auditcounty").text(data[6]); */

 } 
});
  
  
  
  
 