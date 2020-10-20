/**
* JhicDataBankController
*
* @description :: Server-side logic for managing Jhicdatabanks
* @author : Jay Pastagia
*/

module.exports = {

  viewall:function (req, res) {

   res.view('reports/JHICDataBank');

 },
 exportDataBankList: function(req, res) {


  var series_in=[];
  var series_array=[];

   var unit_in=[];
  var unit_array=[];

   var county=req.param("county");
   var sub_county=req.param("sub_county");

   var level=req.param("level");
   var ownership=req.param("ownership");
   var series=req.param("series");
   var unit=req.param("unit");
   var time=req.param("time");
  
   if(Array.isArray(series)){
    series_array=series;
   }else{
    series_in.push(series);
    series_array=series_in;
   }

    if(Array.isArray(unit)){
    unit_array=unit;
   }else{
    unit_in.push(unit);
    unit_array=unit_in;
   }

   var conditionArray=[];

   conditionArray.push({ is_deleted:false});
   if(county!="All"){
    conditionArray.push({_county:CountyService.getCounty(county)}); 
  }
  if(sub_county!="All"){
    conditionArray.push({_subcounty:sub_county}); 
  }
  if(level!="All"){
    conditionArray.push({_level:level});  
  }
  if(ownership!="All"){
    conditionArray.push({_ownership:ownership});  
  }

  var all_flag=adherence_flag=max_flag=observed_flag=percentage_flag=1;

  if(series_array.length>0){

    if(series_array[0]=="All"){
      all_flag=0;
      
    }else{
      for (var i = 0; i < series_array.length; i++) {

        if(series_array[i]=="Adherence"){
          adherence_flag=0;

        }else if(series_array[i]=="Max Score"){
          max_flag=0;
        }else if(series_array[i]=="Observed Score"){
          observed_flag=0;
        }else if(series_array[i]=="Percentage Score"){
          percentage_flag=0;
        }
      }
    }
  }

var section_flag = new Array(13);

if(unit_array.length>0){

    if(unit_array[0]=="All"){
     var all_sec_flag=1;
      console.log("here");

    }else{
for (var i = 0;i<13; i++) {
 section_flag[i] = 0;
}
console.log(section_flag);

 for (var i = 0; i < unit_array.length; i++) {
  for (var j =0 ; j < 13; j++){
       if(unit_array[i]=="s"+(j+1)){
        console.log("here1");
          section_flag[j]=1;
          console.log("here2");

        }
      }
    }
  }
}

  function generateExcel(){
  
   var mongo = require('mongodb');
  
    var collection = MongoService.getDB().collection('facility');
    var cursor = collection.find({
      $and :conditionArray}).sort({ _hfid: 1 });
    cursor.toArray(function(err, model) {

      if(err){
        console.log("error her.....");
        console.log(err);
      }

      console.log(model[0]._hfid);

    //Facility.find().sort({ _hfid: 1 }).exec(function(err, model) {

       if(model.length!=0){
        console.log("in");

        var keys = [];
        for(var k in req.__("dataExcel")) keys.push(k);

          var excelHeader = new Object();
        var excelBodyArray=[];
        var excelBody = new Object();

        for (var i = 0; i < keys.length; i++) {
          var key=keys[i];
          var conditionColumn;
          if(all_flag==0){
            conditionColumn= (!key.match(/_a$/));   
          }else{
            conditionColumn=(!( (key.match(/_a$/) && adherence_flag) || (key.match(/_ms$/) && max_flag)|| (key.match(/_os$/) && observed_flag) || (key.match(/_ps$/) && percentage_flag)));
          }
         
        var conditionColumn1;
        if(all_sec_flag==1){
          conditionColumn1=true;
        }else{
conditionColumn1= ( (key.match(/^s1[^\d]+/) && section_flag[0] )||
                    (key.match(/^s2[^\d]+/) && section_flag[1] )|| 
                    (key.match(/^s3[^\d]+/) && section_flag[2] )|| 
                    (key.match(/^s4[^\d]+/) && section_flag[3] )|| 
                    (key.match(/^s5[^\d]+/) && section_flag[4] )|| 
                    (key.match(/^s6[^\d]+/) && section_flag[5] )|| 
                    (key.match(/^s7[^\d]+/) && section_flag[6] )|| 
                    (key.match(/^s8[^\d]+/) && section_flag[7] )|| 
                    (key.match(/^s9[^\d]+/) && section_flag[8] )|| 
                    (key.match(/^s10[^\d]+/) && section_flag[9] )|| 
                    (key.match(/^s11[^\d]+/) && section_flag[10] )|| 
                    (key.match(/^s12[^\d]+/) && section_flag[11] )|| 
                    (key.match(/^s13[^\d]+/) && section_flag[12] )|| 
  key.match(/^_hfname/) || key.match(/^_hfid/) || key.match(/^_county/) || key.match(/^_subcounty/) || key.match(/^_ownership/) || key.match(/^_level/) || key.match(/^_date/) || key.match(/^p_insp_number/) || key.match(/^p_insp_number/)  );
          
}
      

if( key!="createdAt" && key!="updatedAt" && key!="constructor" && 
 key!="toObject" && key!="save" && key!="destroy" &&
 key!="_defineAssociations" && key!="_normalizeAssociations" &&
 key!="_cast" && key!="validate" && key!="toJSON" && key!="id" && key!="is_deleted"  ){

  if(conditionColumn && conditionColumn1){
    excelHeader[key] = key;
  }
}
}

var descriptionArray=[];
descriptionArray.push(req.__("dataExcel"));
excelBody=new Object();

for (var j = 0; j < keys.length; j++) { 
  var key=keys[j];
  excelBody[key]=descriptionArray[0][keys[j]];
}
  
excelBodyArray.push(excelBody);

for (var i = 0; i < model.length; i++) {
  excelBody=new Object();

  for (var j = 0; j < keys.length; j++) { 
    var key=keys[j];
    if(model[i][keys[j]]==-1){
      model[i][keys[j]]="";
    }
    excelBody[key]=model[i][keys[j]];
  }
  excelBodyArray.push(excelBody);
}

var jexcel=require('json2excel');
node_xj = require("xls-to-json");

node_xj({
    input: "assets/JHIC_DataBank_ReadMe_07Mar2017.xls",  // input xls 
    output: null,//"output.json", // output json 
    sheet: "ReadMe"  // specific sheetname 
    }, function(err, result) {
      if(err) {
        console.log('error in converting xlsx to json\n'+err);
      } 
      else {
        console.log('successfully converted the JHIC_DataBank_ReadMe_07Mar2017.xls to json');
        var data = {
          sheets: [{
                header: {
                  'Variable Name': 'Variable Name',
                  'Variable Lable': 'Variable Lable',
                  'Variable Type': 'Variable Type',
                  '  ':'  ',
                  ' a ':'  ',
                  'Instructions:': 'Instructions'
                },
                items: result,
                sheetName: 'ReadMe',
            },{
            header: excelHeader,
            items: excelBodyArray,
            sheetName: 'JHICDataBank',
          }],
          filepath: '.tmp/JHICDataBank.xlsx'
        } 

        jexcel.j2e(data,function(err){ 
          console.log('finish')
          var fs = require('fs');

          var xlsxFileName = ".tmp/JHICDataBank.xlsx";
          var fileName = "JHICDataBank_"+(CountyService.formateDate())+".xlsx";
          var readStream = fs.createReadStream(xlsxFileName);
          res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
           res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

          readStream.pipe(res);
          readStream.on('end', function(){
            fs.unlink(xlsxFileName, function(err){
             if (err) throw err;
             console.log('successfully deleted ');
           });
          });
        });
      }
    });
}else{
  console.log("out");
  req.flash('noDataAvailable', 'Data is not available');
  return res.redirect(sails.config.routesPrefix+'/jhicdatabank');
}

});
}

var latestInspection=[];
if(time==2){
  var mongo = require('mongodb');
  var collection = MongoService.getDB().collection('facility');

  collection.aggregate([
  {
   $group: {_id: "$_hfid", inspection: {$max: "$p_insp_number"},
   latest : {$last: '$_id'}}},
   {$project: { _id:0,latest:1}}

   ],function(err, Document) {

    for (var i = 0; i < Document.length; i++) {
      console.log( Document[i].latest);
      var ObjectId = require('mongodb').ObjectID;

      console.log("after ObjectId");

      latestInspection.push( Document[i].latest);

       console.log("Inserting mongo object in latestInspection");
    }

    conditionArray.push({ _id : { $in : latestInspection}});
    console.log("before generateExcel");
    generateExcel();
  });

}else{
  generateExcel();
}

}

};

