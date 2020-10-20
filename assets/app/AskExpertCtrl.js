
var app = angular.module("askExpertApp", ['angularTrix']);

app.controller("askExpertCtrl", function ($scope, $http) {
 
  console.log("ask expert ctrl");
 // $scope.expert.section="Select..."
 //alert($scope.expert.section);

  $scope.otherBoardName=function(){
   
    if($scope.expert.board.indexOf("Other")>=0){
     $scope.otherBoard = true;
     $scope.expert.otherBoard=null;
     $scope.askExpertForm.otherBoard.$setUntouched();
   }else{
     $scope.otherBoard = false;
     $scope.expert.otherBoard="  ";
     $scope.askExpertForm.otherBoard.$setUntouched();
   }
 }
 $scope.sectionValue=function(){
 
  var index=$("#sections").val().substr(1);

 $scope.othersub_section = false;
  $scope.othersub_sub_section = false;
  $scope.askExpertForm.othersub_section.$setUntouched();
  $scope.askExpertForm.othersub_sub_section.$setUntouched();

 //append('<option selected value="">Select...</option>') 

 $('#sub_sections').children().slice(1).remove().end();
 $scope.expert.sub_section="";
 $scope.askExpertForm.sub_section.$setUntouched();
 $('#sub_sub_sections').children().slice(1).remove().end() ;
 $scope.expert.sub_sub_section="";
 $scope.askExpertForm.sub_sub_section.$setUntouched();
 var options = $('#all_Sub_sec option');
 $("#sub_sections").append('<option value="All">All</option>');
 var values = $.map(options ,function(option) {

  console.log(option.value)
 
  if(index==option.value.match(/\d+/g)[0]){

   $("#sub_sections").append('<option value='+option.value+'>'+option.text+'</option>');

 }

 });
 $("#sub_sections").append('<option value="Other">Other</option>');
 
 if($scope.expert.section=="Other"  ){

  $scope.otherSection = true;
  $scope.expert.otherSection=null;
   $scope.askExpertForm.otherSection.$setUntouched();
   $scope.askExpertForm.sub_sub_section.$setUntouched();
   $scope.askExpertForm.sub_section.$setUntouched();
  
}else{
 $scope.otherSection = false;
 $scope.expert.otherSection="  ";
 $scope.askExpertForm.otherSection.$setUntouched();
    $scope.askExpertForm.sub_sub_section.$setUntouched();
   $scope.askExpertForm.sub_section.$setUntouched();
}
}

$scope.SubsectionValue=function(){

 var index=$("#sub_sections").val();

  $scope.othersub_sub_section = false;
 
 $('#sub_sub_sections').children().slice(1).remove().end() ;
 $scope.expert.sub_sub_section="";
 var options = $('#all_Sub_sub_sec option');
 $("#sub_sub_sections").append('<option value="All">All</option>');
 var values = $.map(options ,function(option) {
  if(index==option.value){
   $("#sub_sub_sections").append('<option value='+option.value+'>'+option.text+'</option>');
 }

});
 $("#sub_sub_sections").append('<option value="Other">Other</option>');

  

 if($scope.expert.sub_section=="Other"){
   
   $scope.othersub_section = true;
   $scope.expert.othersub_section=null;
   $scope.askExpertForm.sub_sub_section.$setUntouched();
   $scope.askExpertForm.othersub_section.$setUntouched();
 }else{
   $scope.othersub_section = false;
   $scope.expert.othersub_section="  ";
   $scope.askExpertForm.sub_sub_section.$setUntouched();
   $scope.askExpertForm.othersub_section.$setUntouched();
 }
}

$scope.SubsubsectionValue=function(){

  if($scope.expert.sub_sub_section=="Other"){
   $scope.othersub_sub_section = true;
   $scope.expert.othersub_sub_section=null;
   $scope.askExpertForm.othersub_sub_section.$setUntouched();
 }else{
   $scope.othersub_sub_section = false;
   $scope.expert.othersub_sub_section="  ";
   $scope.askExpertForm.othersub_sub_section.$setUntouched();
 }
}

$scope.askQuery = function(askExpertForm) {

  if(askExpertForm.$invalid)
  {
    $scope.submitted = true;
    return;
  }else{
     $('.submitQuery').prop('disabled', true);
   $scope.expert.status="Pending";
   $scope.expert.section =$('#sections option:selected').html();
   $scope.expert.sub_section =$('#sub_sections option:selected').html();
   $scope.expert.sub_sub_section =$('#sub_sub_sections option:selected').html();
   
   $scope.expert.createdAt= new Date();
   $scope.expert.modifiedAt= new Date();
   
   $http.post(routesPrefix+'/ask/query',$scope.expert)
   .success(function(response) {
    
    window.location.href = routesPrefix+"/ask/askExperts";
    
  }); 
 }
}

});