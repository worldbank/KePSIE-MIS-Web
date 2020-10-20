 var app = angular.module('queAnsApp',[]);

 app.controller('queAnsCtrl', function($scope, $http) {

  var ids;
  var oTable;
  var username;
  $('.bs-select').selectpicker('val', ['All']);
  $scope.question="All";


  $scope.unit=[];

  $scope.export2Excel = function() {
        $("#queForm").submit();
      };

  $scope.filterChange=function(){
    var loginUSerId=$("#userid").val();
    
$('#unit :selected').each(function(i, selected){ 
  $scope.unit[i] = $(selected).text(); 
});

var showAction = false;
  if(loggedInUser.role=="Admin" || loggedInUser.role=="WB -Supervisors"){
    showAction = true;
  }


    var oTable=$('#QueAnslist').DataTable({

     destroy: true,
     "bServerSide": true,
     "pagingType": "numbers",
     "sDom": 'lrtip',
     "sAjaxSource":routesPrefix+"/ask/queAnslist",
     "fnServerParams": function ( aoData ) {
      aoData.push( { "name": "unit", "value": $scope.unit },

        { "name": "generalSearchText", "value": $("#generalSearchText").val() }
        );
    },  
    "bAutoWidth": false,
    "bProcessing": true,
    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
    "iDisplayLength": 25, 
    "aaSorting": [], 
    "aoColumns": [  

    { "mData": "section","width":"20%"},
    { "mData": "query","width":"55%",
    mRender: function ( data, type, row ) {
      var template = $.parseHTML(row.query);
      var innerHTML = $(template).first()[0].innerHTML;

      return '<div class="queryDiv"><a target="_blank" style="font-size: 13px;text-decoration: none;word-break: break-all" href="'+routesPrefix+'/ask/viewAnswer/'+row._id+'"  title="View">'+innerHTML.split("<br>")[0]+'</a></div>'

    }  
  },

  { "mData": "status", "defaultContent":"","width":"15%",
  mRender: function ( data, type, row ) {

   var grp=$scope.groupName;
   
   var board=row.board;
   var flag=0;

   var answerUserRole=['MOH Coordinator','Admin'];
   var answerUserRole1=['B&Cs - ITEG','B&Cs - Licensing decision-makers'];
   if (answerUserRole.indexOf(loggedInUser.role)!=-1) { 

    flag=1;
  }else if (answerUserRole1.indexOf(loggedInUser.role)!=-1 && 
    board.indexOf(loggedInUser.group)!=-1) { 

    flag=1;
  }
  var htmlContent = '<div  class="actionDiv" style="float:none !important">';
  if(data=="Pending"){
    if(flag==1){
      htmlContent  = htmlContent + '<a style="font-size: 18px;text-decoration: none;" href="'+routesPrefix+'/ask/answer/'+row._id+'"  title="'+data+'"><label class="btn red btn-outline btn-circle btn-sm active">Pending</label></a>&nbsp;&nbsp;';
       // return '<div  class="actionDiv"><a style="font-size: 18px;text-decoration: none;" href="'+routesPrefix+'/ask/answer/'+row._id+'"  title="'+data+', However you can answer!"><span style="color:red""><i class="fa fa-plus"> </i>  </span></a></div> '
     }else{
       //htmlContent  = htmlContent + '<a style="font-size: 18px;text-decoration: none;"  href="'+routesPrefix+'/ask/viewAnswer/'+row._id+'" title="'+data+'"><span class="red" style="color:red"><i class="fa fa-question"> </i>  </span></a>&nbsp;&nbsp;<a style="font-size: 18px;text-decoration: none;visibility:hidden;" href="'+routesPrefix+'/ask/viewanswer/'+row._id+'"  title="Add you answer!"><span><i class="fa fa-edit"  style="color:#3598dc"> </i>  </span></a>';
       //return '<div  class="actionDiv"><a style="font-size: 18px;text-decoration: none;"  href="'+routesPrefix+'/ask/viewAnswer/'+row._id+'" title="'+data+'"><span class="red" style="color:red"><i class="fa fa-question"> </i>  </span></a></div>'
       htmlContent  = htmlContent + '<a style="font-size: 18px;text-decoration: none;"  href="'+routesPrefix+'/ask/viewAnswer/'+row._id+'" title="'+data+'"><label class="btn red btn-outline btn-circle btn-sm active">Pending</label></a>&nbsp;&nbsp;';
     }
   } 

   if(data=="Resolved"){
    //return '<span class=""> '+data+' </span>'
    var flag1=0;

    if(row.response!=undefined){

      for (var i = 0; i < row.response.length; i++) {
        if(row.response[i].expert_id==loginUSerId && row.response[i].is_deleted==false){
          flag1=1;
        }
      }
    }
    if(flag1==1){
      htmlContent  = htmlContent + '<a style="font-size: 18px;text-decoration: none;" href="'+routesPrefix+'/ask/viewAnswer/'+row._id+'" title="'+data+'"><label class="btn green btn-outline btn-circle btn-sm active">Resolved</label></a>&nbsp;&nbsp;';
        //return '<div  class="actionDiv green"><a style="font-size: 18px;text-decoration: none;" href="'+routesPrefix+'/ask/viewAnswer/'+row._id+'" title="'+data+'"><span style="color:green"><i class="fa fa-check"> </i></button></a></div>'
      }else{

        if(flag==1){
         // htmlContent  = htmlContent + '<a style="font-size: 18px;text-decoration: none;" href="'+routesPrefix+'/ask/answer/'+row._id+'"  title="'+data+', However you can answer this question!"><span style="color:green"><i class="fa fa-check"> </i></span></a><a style="font-size: 18px;text-decoration: none;" href="'+routesPrefix+'/ask/answer/'+row._id+'"  title="'+data+', However you can answer this question!">&nbsp;<span style="color:#3598dc"><i class="fa fa-edit"> </i></span></a> ';
        //return '<div  class="actionDiv green"><a style="font-size: 18px;text-decoration: none;" href="'+routesPrefix+'/ask/answer/'+row._id+'"  title="'+data+', However you can answer this question!"><span style="color:green"><i class="fa fa-plus"> </i></span></a></div> '
            htmlContent  = htmlContent + '<a style="font-size: 18px;text-decoration: none;" href="'+routesPrefix+'/ask/answer/'+row._id+'"  title="'+data+', However you can answer this question!"><label class="btn green btn-outline btn-circle btn-sm active">Resolved</label></a>&nbsp;&nbsp;';
      }else{
        //htmlContent  = htmlContent + '<a style="font-size: 18px;text-decoration: none;" href="'+routesPrefix+'/ask/viewAnswer/'+row._id+'" title="'+data+'"><span class=" yellow " style="color:green"><i class="fa fa-check"> </i></span></a>&nbsp;&nbsp;<a style="font-size: 18px;text-decoration: none;visibility:hidden" href="'+routesPrefix+'/ask/viewAnswer/'+row._id+'" title="'+data+'"><span class=" yellow " style="color:green"><i class="fa fa-check"> </i></span></a>'
       //return '<div  class="actionDiv"><a style="font-size: 18px;text-decoration: none;" href="'+routesPrefix+'/ask/viewAnswer/'+row._id+'" title="'+data+'"><span class=" yellow " style="color:green"><i class="fa fa-check"> </i></span></a></div>'
        htmlContent  = htmlContent + '<a style="font-size: 18px;text-decoration: none;" href="'+routesPrefix+'/ask/viewAnswer/'+row._id+'" title="'+data+'"><label class="btn green btn-outline btn-circle btn-sm active">Resolved</label></a>&nbsp;&nbsp;'
     }
   }
 }
 
 htmlContent  = htmlContent +'</div>';
 return htmlContent;
}
},
 { "mData": "action", "defaultContent":"","width":"5%","visible": showAction,
  mRender: function ( data, type, row ) {
     var htmlContent = '<div  class="actionDiv" style="float:none !important">';
    
  if(loggedInUser.role=="Admin" || loggedInUser.role=="WB -Supervisors"){

   htmlContent  = htmlContent +'<a style="font-size: 18px;text-decoration: none;" href="'+routesPrefix+'/ask/editQuery/'+row._id+'"  title="Edit Query"><span style="color: #1d9d74;"><i class="fa fa-pencil"> </i></span></a>'
 }
 if(loggedInUser.role=="Admin"){
   //htmlContent  = htmlContent +'&nbsp;&nbsp;<a style="font-size: 18px;text-decoration: none;" class="deletepopupclass deleteQuery" href="#"  onclick="angular.element(this).scope().delete(\''+row._id+'\')"  data-toggle="modal" title="Delete Query"><span style="color:#a94442"><i class="fa fa-trash"> </i></span></a>'

 }
  htmlContent  = htmlContent +'</div>';
 return htmlContent;
}
  }
]
}); 
    //oTable.destroy();
  } 

  $scope.filterChange();

});
