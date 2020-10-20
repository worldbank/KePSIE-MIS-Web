
var app = angular.module("editQueryApp", ['angularTrix']);

app.controller("editQueryCtrl", function ($scope, $http) {
 
$scope.expert={};
 $('#selectedExpert').selectpicker('val', queryDetail.board);

 $scope.expert.board=queryDetail.board;
 
//$('#sections option[text="Other"]').prop("selected","selected");
    $scope.delete=function(){
      $(".deleteQuery").attr("href", "#deleteConfirmation");
    }
  $scope.deleteQuery=function(){

    var data = {id : queryDetail.id};
    $http.post(routesPrefix+'/ask/delete', data).success(function (data) {

      window.location.href = routesPrefix+"/ask/askExperts";
    });
  }
 
  $scope.otherBoardName=function(){
   
    if($scope.expert.board.indexOf("Other")>=0){
     $scope.otherBoard = true;
     $scope.expert.otherBoard=null;
   //  $scope.askExpertForm.otherBoard.$setUntouched();
   }else{
     $scope.otherBoard = false;
     $scope.expert.otherBoard="  ";
    // $scope.askExpertForm.otherBoard.$setUntouched();
   }
 }
 $scope.sectionValue=function(){
 
  var index=$scope.expert.section.substr(1);

 $scope.othersub_section = false;
  $scope.othersub_sub_section = false;
  /*$scope.askExpertForm.othersub_section.$setUntouched();
  $scope.askExpertForm.othersub_sub_section.$setUntouched();*/

 //append('<option selected value="">Select...</option>') 

 $('#sub_sections').children().slice(1).remove().end();
 $scope.expert.sub_section="";
// $scope.askExpertForm.sub_section.$setUntouched();
 $('#sub_sub_sections').children().slice(1).remove().end() ;
 $scope.expert.sub_sub_section="";
// $scope.askExpertForm.sub_sub_section.$setUntouched();
 var options = $('#all_Sub_sec option');
 //$("#sub_sections").append('<option value="All">All</option>');


$scope.subSections = [ {
            subSecID : "All",
            subSecName : "All"
          }];

 var values = $.map(options ,function(option) {


 
  if(index==option.value.match(/\d+/g)[0]){
 // $("#sub_sections").append('<option value='+option.value+'>'+option.text+'</option>');
  $scope.subSections.push({subSecID : option.value,
            subSecName : option.text});
 }

 });
 $scope.subSections.push({subSecID : "Other",
            subSecName : "Other"});
 if($scope.expert.section=="Other"  ){

  $scope.otherSection = true;
  $scope.expert.otherSection=queryDetail.otherSection;
  /* $scope.askExpertForm.otherSection.$setUntouched();
   $scope.askExpertForm.sub_sub_section.$setUntouched();
   $scope.askExpertForm.sub_section.$setUntouched();*/
  
}else{
 $scope.otherSection = false;
 $scope.expert.otherSection="  ";
 /*$scope.askExpertForm.otherSection.$setUntouched();
    $scope.askExpertForm.sub_sub_section.$setUntouched();
   $scope.askExpertForm.sub_section.$setUntouched();*/
}

}

$scope.SubsectionValue=function(){

 var index= $scope.expert.sub_section;


  $scope.othersub_sub_section = false;
 
 $('#sub_sub_sections').children().slice(1).remove().end() ;
 $scope.expert.sub_sub_section="";
 var options = $('#all_Sub_sub_sec option');
 //$("#sub_sub_sections").append('<option value="All">All</option>');
 $scope.subSubSections = [ {
            subSubSecID : "All",
            subSubSecName : "All"
          }];
 var values = $.map(options ,function(option) {


  if(index==option.value){
  // $("#sub_sub_sections").append('<option value='+option.value+'>'+option.text+'</option>');
  $scope.subSubSections.push({subSubSecID : option.value,
            subSubSecName : option.text});
 }

});
 $scope.subSubSections.push({subSubSecID : "Other",
            subSubSecName : "Other"});
  

 if($scope.expert.sub_section=="Other"){
   
   $scope.othersub_section = true;
   $scope.expert.othersub_section=queryDetail.othersub_section;
   /*$scope.askExpertForm.sub_sub_section.$setUntouched();
   $scope.askExpertForm.othersub_section.$setUntouched();*/
 }else{
   $scope.othersub_section = false;
   $scope.expert.othersub_section="  ";
  /* $scope.askExpertForm.sub_sub_section.$setUntouched();
   $scope.askExpertForm.othersub_section.$setUntouched();*/
 }
}

$scope.SubsubsectionValue=function(){

  if($scope.expert.sub_sub_section=="Other"){
   $scope.othersub_sub_section = true;
   $scope.expert.othersub_sub_section=queryDetail.othersub_sub_section;
  // $scope.askExpertForm.othersub_sub_section.$setUntouched();
 }else{
   $scope.othersub_sub_section = false;
   $scope.expert.othersub_sub_section="  ";
  // $scope.askExpertForm.othersub_sub_section.$setUntouched();
 }
}

$scope.askQuery = function(askExpertForm) {

  if(askExpertForm.$invalid)
  {
   
    console.log($scope.expert);
    $scope.submitted = true;
    return;
  }else{

  
   $scope.expert.section =$('#sections option:selected').html();
   $scope.expert.sub_section =$('#sub_sections option:selected').html();
   $scope.expert.sub_sub_section =$('#sub_sub_sections option:selected').html();
   $scope.expert.id=queryDetail.id;
   $scope.expert.createdAt= new Date();
   $scope.expert.modifiedAt= new Date();
   console.log($scope.expert);
   $http.post(routesPrefix+'/ask/updateQuery',$scope.expert)
   .success(function(response) {

    window.location.href = routesPrefix+"/ask/askExperts";
  }); 
 }
}
$scope.expert.section= $('select[id="sections"] > option:contains('+queryDetail.section+')').val()

$scope.sectionValue();
var tmp;

for(var i=0;i<$scope.subSections.length;i++){

  if($scope.subSections[i].subSecName==queryDetail.sub_section){
    
   tmp=$scope.subSections[i].subSecID;
  
  }

}

$scope.expert.sub_section=tmp;

$scope.SubsectionValue();

var tmp;

for(var i=0;i<$scope.subSubSections.length;i++){

  if($scope.subSubSections[i].subSubSecName==queryDetail.sub_sub_section){
    
   tmp=$scope.subSubSections[i].subSubSecID;
  
  }

}
$scope.expert.sub_sub_section=tmp;

$scope.SubsubsectionValue();

$scope.expert.query=queryDetail.query;

$('#selectedExpert').selectpicker('refresh');



});