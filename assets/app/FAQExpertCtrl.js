 var app = angular.module('faqExpertApp',[]);

 app.controller('faqExpertCtrl', function($scope, $timeout, $http) {

  var ids;
  var oTable;
  var username;
$('.bs-select').selectpicker('val', ['All']);
$scope.question="All";


$scope.unit=$("#unit").val();
$scope.board=$("#board").val();


  var loginUSerId={id:$("#userid").val()};
  $http.post(routesPrefix+'/user/viewdata',loginUSerId)
  .success(function(response) {

    $scope.groupName=response.groupName;
    console.log($scope.groupName);
    console.log(response.groupId);

if(response.groupId==undefined){
  response.groupId=null;
}

 var grpId={id:response.groupId};
    $http.post(routesPrefix+'/ask/checkForExpertGroup',grpId)
  .success(function(response) {


    console.log("response of grp here");
    console.log(response);

    if(response.flag==1){
    $("#askQuestion").css("display", "none");
     $(".hiddenFilter").css("display", "block");
  }else{
     $("#askQuestion").css("display", "block");
     $(".hiddenFilter").css("display", "none");
  }
$scope.filterChange();
 
});
});

$scope.filterChange=function(){
var loginUSerId=$("#userid").val();
console.log($("#unit").val());
console.log($("#board").val());
 $scope.selectQueList=[];
    var oTable=$('#QueAnslist').DataTable({

       destroy: true,
     "bServerSide": true,
     "pagingType": "numbers",
     "sDom": 'lrtip',
     "sAjaxSource":routesPrefix+"/ask/queAnslist",
     "fnServerParams": function ( aoData ) {
            aoData.push( { "name": "unit", "value": $("#unit").val() },
                        { "name": "board", "value": $("#board").val() },
                         { "name": "question", "value": "All" },
                        { "name": "generalSearchText", "value": $("#generalSearchText").val() }
                       );
        },  
     "bAutoWidth": false,
     "bProcessing": true,
     "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
     "iDisplayLength": 25, 
     "aaSorting": [], 
     "aoColumns": [  
 { "mData": "id", "searchable": false,"sortable" : false,
  "orderable": false, "width":"3%","sClass": "centerIcon",
  "targets": 0, "title":  "<input name='select_all' value='' id='select_all_question' type='checkbox'/>",
  'mRender': function ( data, type, row){
    return '<input type="checkbox" class="actionDiv" name="id[]" value="'+row._id+'">';
  }
},
     
 { "mData": "query","width":"90%","sortable" : false,
  "defaultContent": "<i>Not answer given yet</i>",
   mRender: function ( data, type, row ) {

return '<div><a target="_blank" style="font-size: 13px;text-decoration: none;word-break: break-all" href="'+routesPrefix+'/ask/viewAnswer/'+row._id+'"  title="View">'+row.query+'</a></div>'

 }  

},
 
 { "mData": "status", "defaultContent":"","width":"5%","sortable" : false,
 mRender: function ( data, type, row ) {

   var grp=$scope.groupName;
   
     // var grp= loginUSerGrp.split(",");
     var board=row.board;
     var flag=0;


if(grp!=undefined && board!=undefined){
     if(grp.length>0 && board.length>0){
     for(var i=0;i<grp.length;i++){
      for(var j=0;j<board.length;j++){
        if(board[j]==grp[i]){
          flag=1;
          break;
        }
      }
    }
  }
}
var htmlContent = "";
    if(data=="Pending"){
      if(flag==1){
        htmlContent  = htmlContent + '<div  class="actionDiv"><a style="font-size: 18px;text-decoration: none;" href="#"  title="'+data+'"><span class="red" style="color:red"><i class="fa fa-question"> </i>  </span></a></div> ';
       // return '<div  class="actionDiv"><a style="font-size: 18px;text-decoration: none;" href="'+routesPrefix+'/ask/answer/'+row._id+'"  title="'+data+', However you can answer!"><span style="color:red""><i class="fa fa-plus"> </i>  </span></a></div> '
      }else{
         htmlContent  = htmlContent + '<div  class="actionDiv"><a style="font-size: 18px;text-decoration: none;"  href="#" title="'+data+'"><span class="red" style="color:red"><i class="fa fa-question"> </i>  </span></a></div>';
       //return '<div  class="actionDiv"><a style="font-size: 18px;text-decoration: none;"  href="'+routesPrefix+'/ask/viewAnswer/'+row._id+'" title="'+data+'"><span class="red" style="color:red"><i class="fa fa-question"> </i>  </span></a></div>'
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
      htmlContent  = htmlContent + '<div  class="actionDiv green"><a style="font-size: 18px;text-decoration: none;" href="#" title="'+data+'"><span style="color:green"><i class="fa fa-check"> </i></button></a></div>';
        //return '<div  class="actionDiv green"><a style="font-size: 18px;text-decoration: none;" href="'+routesPrefix+'/ask/viewAnswer/'+row._id+'" title="'+data+'"><span style="color:green"><i class="fa fa-check"> </i></button></a></div>'
    }else{

    if(flag==1){
      htmlContent  = htmlContent + '<div  class="actionDiv green"><a style="font-size: 18px;text-decoration: none;" href="#"  title="'+data+', However you can answer this question!"><span style="color:green"><i class="fa fa-check"> </i></span></a></div> ';
        //return '<div  class="actionDiv green"><a style="font-size: 18px;text-decoration: none;" href="'+routesPrefix+'/ask/answer/'+row._id+'"  title="'+data+', However you can answer this question!"><span style="color:green"><i class="fa fa-plus"> </i></span></a></div> '
      }else{
        htmlContent  = htmlContent + '<div  class="actionDiv"><a style="font-size: 18px;text-decoration: none;" href="#" title="'+data+'"><span class=" yellow " style="color:green"><i class="fa fa-check"> </i></span></a></div>'
       //return '<div  class="actionDiv"><a style="font-size: 18px;text-decoration: none;" href="'+routesPrefix+'/ask/viewAnswer/'+row._id+'" title="'+data+'"><span class=" yellow " style="color:green"><i class="fa fa-check"> </i></span></a></div>'
     }
     }

  }
  return htmlContent;
}
}
]
}); 
   
   $('#select_all_question').on('click', function(){
      // Check/uncheck all checkboxes in the table
      var rows = oTable.rows({ 'search': 'applied' }).nodes();
      $('input[type="checkbox"]', rows).prop('checked', this.checked);

        if(this.checked){
          $scope.selectQueList=[];
       oTable.$('input[type="checkbox"]').each(function(){
        $scope.selectQueList.push(this.value);
      
       });
          console.log("All");
        console.log($scope.selectQueList);
   }else{

    console.log("removeAll");
      $scope.selectQueList=[];
   }

  });

   $('#QueAnslist').on('change', 'input[class="actionDiv" ]', function(){

      if(this.checked){
        $scope.selectQueList.push(this.value);
        console.log($scope.selectQueList);

      }else{
        $('#select_all_question').prop('checked', false);
        var index = $scope.selectQueList.indexOf(this.value);
        if (index > -1) {
          $scope.selectQueList.splice(index, 1);
        }
        console.log($scope.selectQueList);
      }
    });
}

$scope.importFAQ=function(importFAQForm){
 
     var data = {list :$scope.selectQueList };
    $http.post(routesPrefix+'/faq/import/saveall', data).success(function (data) {

      window.location.href = routesPrefix+"/faq";

    });

}

$scope.importSingleFAQ=function(importFAQForm){
    
    var list = $scope.selectQueList;
    $scope.flag = false;
    
    if(list == undefined || list.length == 0) {
       $scope.myStyle={display:'block'};
      $scope.flag = true;
      $timeout(function () { $scope.flag = false; }, 3000);   
    
     } else  if(list.length > 1){
       $scope.myStyle={"display":'block' };
        $scope.flag = true;
         $timeout(function () { $scope.flag = false; }, 3000);   
       
     }else {
      var data = {id : list[0]};
        $http.post(routesPrefix+'/faq/import/save', data).success(function (data) {
           
            console.log(data);
             window.location.href = routesPrefix+"/faq/edit/"+data.id;

         });
      }
    }
    



});

