/**
 * InspectorReportController
 *
 * @description : Server-side logic for managing the inspector's reports workplan/monitoring/progress
 * @author : Abhishek Upadhyay,Jay Pastagia
 */

 module.exports = {

  inspectionPlannngTable: function (req, res) {
    res.view('reports/inspectionPlanningReportTable');
  },
  getFilterValues: function (req, res) {
    var loggedInUser = req.session.loggedInUser;
    var countyList = CountyService.getCountiesByRole(loggedInUser);
    var subCountyList = CountyService.getSubCountiesByCounties(countyList);
    var ownershipList = CountyService.getOwnershipList(loggedInUser);
    var levelList = CountyService.getLevelList(loggedInUser);
    res.send({
      countyList : countyList,
      subCountyList : subCountyList,
      ownershipList : ownershipList,
      levelList : levelList,
    });
  },
  getInspectorNames: function(req, res) {
    var county = req.param("county");

    var loggedInUser = req.session.loggedInUser;
    UserService.getInspectorNamesByCounty(loggedInUser, county, sendResponse);

    function sendResponse(inspectors) {

      res.send({
        "inspectors":inspectors,
      });
    }
  },

  getFacilityList: function (req, res) {

   var loggedInUser=req.session.loggedInUser;

   var condObj={};
   console.log("inside get facilityList");

   if(loggedInUser.role=="Inspector"){

     condObj={
      m_insp_completed:"Yes",
      is_deleted: false,
      _county:loggedInUser.county,
      _inspectorid:loggedInUser.inspectorId
    };
  }else{

    var county = req.param("county").value;
    var inspectorId = req.param("inspector")._id;

    console.log(county+"!!!!!!!!!!!!"+inspectorId);

    condObj={
      m_insp_completed:"Yes",
      is_deleted: false
    };

    if(county!="All"){
      condObj._county=county;
    }
    if(inspectorId!="All"){
      condObj._inspectorid=inspectorId;

    }
  }

  Facility.find(condObj,{_hfid:1,_hfname:1}).sort('_hfid ASC').exec(function(err, facilityId) {
    
    console.log("start");
    res.json({facilityList:facilityId});
    console.log("end");
  });

},

visitPlanDatabank: function (req, res) {

  res.view('reports/visitPlanDatabank');
},

visitPlanFigure:function(req,res){
  res.view('reports/visitPlanFigure');
},

aggregateProgressDatabank:function(req,res){
  res.view('reports/inspectionProgressDataBank');

},

inspectionPlanningMap: function(req, res) {
  res.view('reports/inspectionPlanningReportMap');
},


aggregateProgressExportDatabank:function(req,res){


  var county = req.param("county");
  var inspectorId = req.param("inspId");
  var period = req.param("inspPeriod");
  var inspectorName = req.param("inspName");
  var periodArr=[];
  var resultArr = [];
  county=CountyService.getCounty(county);

  if (Array.isArray(period)) {
   periodArr=period;
 }else{
  periodArr.push(period);
}

var obj=new Object();
obj.is_deleted=false;

if(county!="All"){
 obj._county=county;
}
if(inspectorId!="All"){
  inspectorId=parseInt(inspectorId);
  obj._inspectorid=inspectorId;  
}
if(period!="All"){

 obj.p_period={$in:periodArr};
}  

var mongo = require('mongodb');
var collection = MongoService.getDB().collection('facility');
var cursor1 = collection.aggregate([  { $match :obj },
  {"$group":{_id:{insp:"$_inspectorid",complete:"$m_visit_completed"},_inspectorname:{$last: '$_inspectorname'},_county:{$last: '$_county'},p_period:{$last: '$p_period'}, count:{$sum:1}}}, 
  { "$group": {"_id": "$_id.insp", "inspections": { "$push": { "status": "$_id.complete", "count": "$count" },}, name: {"$last": "$_inspectorname"},county:{"$last": "$_county"},period:{"$last": "$p_period"}, "count": { "$sum": "$count" } }} ]);
cursor1.toArray(function(err, result) {
  var visited = 0;
  var pending = 0;
  var total = 0;

  if(result.length>0){

    for(j=0;j<result.length;j++) {
     var objInsp = {};

     objInsp.inspectorId = result[j]._id;
     objInsp.inspectorName = result[j].name;
     objInsp.county = result[j].county;
     objInsp.period = result[j].period;
     objInsp.total = result[j].count;
     var inspections = result[j].inspections;
     var flag="";

     if(objInsp.period==undefined || objInsp.period==null){

      objInsp.period="";

     }

     if(inspections != undefined && inspections.length > 0 ) {
      var inspection1 = inspections[0];

      if(inspection1 != undefined && inspection1.status=="Yes") {
       objInsp.visited =  inspection1.count;
       flag="Yes";
     }else if(inspection1 != undefined && inspection1.status=="No") {
      objInsp.pending =  inspection1.count;
      flag="No";
    }
    var inspection2 = inspections[1]; 

    if(inspection2 != undefined ){

      if( inspection2.status=="Yes") {
       objInsp.visited =  inspection2.count;
     }else if( inspection2.status=="No") {
      objInsp.pending =  inspection2.count;
    }
  }else{
    if(flag=="Yes"){
     objInsp.pending =0;
   }else{
     objInsp.visited = 0;
   }
 }
}else{
 objInsp.visited = 0;
 objInsp.pending =0;
}
objInsp.progress = Math.round((objInsp.visited / objInsp.total ) * 100);
if(objInsp.inspectorId != undefined && objInsp.inspectorId != null) {
  resultArr.push(objInsp); 
}

}

}

var data=resultArr;

var xl = require('excel4node');
var wb = new xl.Workbook();
var ws;

ws = wb.addWorksheet('Inspection_Progress ');

var http = require('http');
var fs = require('fs');
var xlsxFileName = ".tmp/excelFile_"+new Date()+".xlsx";
var sheetRow = 1;

        //styles
        var normalCenterStyle = wb.createStyle({
          alignment: {
            vertical: ['center'],
            horizontal:['center']
          },
          font: {
            color: 'black',
            size: 11,
          },
          wrapText: true
        });

        var headerCenterStyle = wb.createStyle({
          alignment: {
            vertical: ['center'],
            horizontal:['center']
          },
          font: {
            color: 'black',
            size: 11,
            bold: true,
          }
        });

        var noteStyle = wb.createStyle({
          alignment: {
            horizontal:['center'],
            vertical: ['center']
          },
          font: {
            color: 'black',
            size: 11,
            bold: true,
          },
          fill: {
            type: "pattern",
            patternType : "solid",
            fgColor: "#CCCCCC",
            bgColor: "#CCCCCC"
          }
        });

        ws.row(sheetRow).setHeight(70);

        ws.cell(sheetRow,1,sheetRow++,7,true).string('KePSIE Monitoring System, Ministry of Health')
        .style({alignment : {horizontal:['center'],vertical:['center']}, font: {color: 'black',size: 13,bold: true}});


        ws.cell(sheetRow,1,sheetRow++,7,true).string('Inspection Progress ')
        .style({alignment : {horizontal:['center']}, font: {color: 'white',size: 13,bold: true}, fill: {
          type: "pattern",
          patternType : "solid",
          fgColor: "#31708f",
          bgColor: "#31708f"
        }});
        ws.cell(sheetRow,1,sheetRow++,7,true).string(' County: '+county+' | Inspector: '+inspectorName+' | Inspection Period: '+periodArr+' ')
        .style({alignment : {horizontal:['center']}, font: {color: 'white',size: 12,bold: true}, fill: {
          type: "pattern",
          patternType : "solid",
          fgColor: "#31708f",
          bgColor: "#31708f"
        }});


        ws.cell(sheetRow,1).string("County").style(headerCenterStyle);
        ws.cell(sheetRow,2).string("Planning Period").style(headerCenterStyle);
        ws.cell(sheetRow,3).string("Inspector").style(headerCenterStyle);
        ws.cell(sheetRow,4).string("Visited").style(headerCenterStyle);
        ws.cell(sheetRow,5).string("Pending").style(headerCenterStyle);
        ws.cell(sheetRow,6).string("Total").style(headerCenterStyle);
        ws.cell(sheetRow,7).string("Progress").style(headerCenterStyle);

        sheetRow++;

        for(i in data) {

          var obj = data[i];

          ws.cell(sheetRow,1).string(obj['county']).style(normalCenterStyle);

          ws.cell(sheetRow,2).string(obj['period']+"").style(normalCenterStyle);

          ws.cell(sheetRow,3).string(obj['inspectorName']).style(normalCenterStyle);

          ws.cell(sheetRow,4).number(obj['visited']).style(normalCenterStyle);

          ws.cell(sheetRow,5).number(obj['pending']).style(normalCenterStyle);

          ws.cell(sheetRow,6).number(obj['total']).style(normalCenterStyle);

          ws.cell(sheetRow,7).string(obj['progress']+"%").style(normalCenterStyle);

          sheetRow++;
        }

        ws.column(1).setWidth(15);
        ws.column(2).setWidth(20);
        ws.column(3).setWidth(20);
        ws.column(4).setWidth(10);
        ws.column(5).setWidth(10);
        ws.column(6).setWidth(10);
        ws.column(7).setWidth(10);


        setTimeout(sendExcelFile,1000);



        function sendExcelFile() {
          wb.write(xlsxFileName, function (err, stats) {
            if (err) {
              console.error(err);
            }

            var fileName = "";

            fileName = 'Inspection_Progress_'+(CountyService.formateDate())+".xlsx";

            var readStream = fs.createReadStream(xlsxFileName);
            res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
            res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

            readStream.pipe(res);
            readStream.on('end', function(){
              fs.unlink(xlsxFileName, function(err){
                if (err) throw err;
                
              });
            });
          });
        }
      });
},

exportDatabank:function(req, res){

  var county = req.param("county");
  var inspectorId = req.param("inspId");
  var period = req.param("inspPeriod");
  var inspectorName = req.param("inspName");
  var periodArr=[];
  county=CountyService.getCounty(county);

  if (Array.isArray(period)) {

    periodArr=period;

  }else{
    periodArr.push(period);
  }

  var conditionArray=[];

  conditionArray.push({ is_deleted:false,p_date: { $exists: true}});
  if(county!="All"){
    conditionArray.push({_county:county}); 
  }
  if(inspectorId!="All"){
    inspectorId=parseInt(inspectorId);
    conditionArray.push({_inspectorid:inspectorId});   
  }
  if(period!="All"){
    conditionArray.push({p_period:{$in:periodArr}});   
  }
  console.log(county+" "+inspectorId+" "+period);
  var mongo = require('mongodb');
  var collection = MongoService.getDB().collection('facility');
  var cursor=collection.find({
    $and :conditionArray},{_county:1,_subcounty:1,_inspectorname:1,_hfid:1,_hfname:1,
      _ownership:1,_level:1,p_incharge:1,p_incharge_no:1,p_nearest_market:1,p_schmt:1,
      p_period:1,p_insp_number:1,p_latitude:1,p_longitude:1,p_date:1,p_market_id:1,
      p_market_size:1,p_treatment:1,p_insp_type:1,p_camp:1,p_landmark:1,p_alternatecontact:1,
      p_distance_county:1,p_transtype:1,p_description:1,p_alternatecontact_no:1,p_perdiem:1,
      p_transtime:1});


  cursor.toArray(function(err, result) {

    var data=result;

    var xl = require('excel4node');
    var wb = new xl.Workbook();
    var ws,ws1;

    ws = wb.addWorksheet('Profile Info');
    ws1 = wb.addWorksheet('Market Location Info');

    var http = require('http');
    var fs = require('fs');
    var xlsxFileName = ".tmp/excelFile_"+new Date()+".xlsx";
    var sheetRow = 1;
    var sheetRow1 = 1;
    
    var keys= [
    {type:"number",key:"_hfid"},
    {type:"string",key:"_hfname"},
    {type:"string",key:"_county"},
    {type:"string",key:"_subcounty"},
    {type:"string",key:"_ownership"},

    {type:"string",key:"_level"},
    {type:"date",key:"p_date"},
    {type:"number",key:"p_insp_number"},
    {type:"string",key:"_inspectorname"},
    {type:"string",key:"p_insp_type"},
    {type:"string",key:"p_incharge"},
    {type:"number",key:"p_incharge_no"},
    {type:"string",key:"p_alternatecontact"},

    {type:"number",key:"p_alternatecontact_no"},
    {type:"number",key:"p_treatment"}
    ];

    
    var keys1= [

    {type:"number",key:"_hfid"},
    {type:"string",key:"_hfname"},
    {type:"string",key:"p_nearest_market"},
    {type:"number",key:"p_market_id"},
    {type:"number",key:"p_market_size"},
    {type:"string",key:"p_landmark"},
    {type:"string",key:"p_description"},
    {type:"number",key:"p_longitude"},

    {type:"number",key:"p_latitude"},   

    {type:"number",key:"p_perdiem"},
    {type:"number",key:"p_distance_county"},
    {type:"number",key:"p_transtime"}
    ];

        //styles
        var normalCenterStyle = wb.createStyle({
          alignment: {
            vertical: ['center'],
            horizontal:['center']
          },
          font: {
            color: 'black',
            size: 11,
          },
          wrapText: true
        });
        var normalLeftStyle = wb.createStyle({
          alignment: {
            vertical: ['center'],
            horizontal:['left']
          },
          font: {
            color: 'black',
            size: 11,
          },
          wrapText: true
        });
        var headerCenterStyle = wb.createStyle({
          alignment: {
            vertical: ['center'],
            horizontal:['center'],
            wrapText: true
          },
          font: {
            color: 'black',
            size: 11,
            bold: true,
          }
          
        });
        var headerLeftStyle = wb.createStyle({
          alignment: {
            vertical: ['center'],
            horizontal:['left'],
            wrapText: true
          },
          font: {
            color: 'black',
            size: 11,
            bold: true,
          }
          
        });
        
        var pngFileName1 = "/assets/images/moh_logo.png";
       //  sheetRow++;
       ws.row(sheetRow).setHeight(70);

       ws.cell(sheetRow,1,sheetRow++,keys.length,true).string('KePSIE Monitoring System, Ministry of Health')
       .style({alignment : {horizontal:['center'],vertical:['center']}, font: {color: 'black',size: 13,bold: true}});


       ws.cell(sheetRow,1,sheetRow++,keys.length,true).string('Inspector Visit Plan')
       .style({alignment : {horizontal:['center']}, font: {color: 'white',size: 13,bold: true}, fill: {
        type: "pattern",
        patternType : "solid",
        fgColor: "#31708f",
        bgColor: "#31708f"
      }});
       ws.cell(sheetRow,1,sheetRow++,keys.length,true).string(' County: '+county+' | Inspector: '+inspectorName+' | Inspection Period: '+periodArr+' ')
       .style({alignment : {horizontal:['center']}, font: {color: 'white',size: 12,bold: true}, fill: {
        type: "pattern",
        patternType : "solid",
        fgColor: "#31708f",
        bgColor: "#31708f"
      }});
       ws.cell(sheetRow,1,sheetRow++,keys.length,true).string('Visit Plan for Inspection Period '+periodArr)
       .style({alignment : {horizontal:['center']}, font: {color: 'black',size: 13,bold: true}});

       ws.cell(sheetRow,1).string("Facility ID").style(headerLeftStyle);
       ws.cell(sheetRow,2).string("Facility Name").style(headerLeftStyle);
       ws.cell(sheetRow,3).string("County").style(headerCenterStyle);
       ws.cell(sheetRow,4).string("Sub-County").style(headerCenterStyle);
       ws.cell(sheetRow,5).string("Ownership").style(headerCenterStyle);
       ws.cell(sheetRow,6).string("Level").style(headerCenterStyle);
       ws.cell(sheetRow,7).string("Planned Inspection Date").style(headerCenterStyle);
       ws.cell(sheetRow,8).string("Inspection Number").style(headerCenterStyle);
       ws.cell(sheetRow,9).string("Inspector Name").style(headerCenterStyle);
       ws.cell(sheetRow,10).string("Inspection type").style(headerCenterStyle);

       ws.cell(sheetRow,11).string("In-Charge Name").style(headerCenterStyle);
       ws.cell(sheetRow,12).string("In-Charge Phone").style(headerCenterStyle);
       ws.cell(sheetRow,13).string("Alternatecontact").style(headerCenterStyle);
       ws.cell(sheetRow,14).string("alternatecontact_no").style(headerCenterStyle);


       ws.cell(sheetRow,15).string("T Group").style(headerCenterStyle);
       ws.row(5).filter({});
       sheetRow++;

       //ws1
       var logoCell=(keys1.length/2)-1;
       ws1.row(sheetRow1).setHeight(70);

       ws1.cell(sheetRow1,1,sheetRow1++,keys1.length,true).string('KePSIE Monitoring System, Ministry of Health')
       .style({alignment : {horizontal:['center'],vertical:['center']}, font: {color: 'black',size: 13,bold: true}});

       ws1.cell(sheetRow1,1,sheetRow1++,keys1.length,true).string('Inspector Visit Plan')
       .style({alignment : {horizontal:['center']}, font: {color: 'white',size: 13,bold: true}, fill: {
        type: "pattern",
        patternType : "solid",
        fgColor: "#31708f",
        bgColor: "#31708f"
      }});
       ws1.cell(sheetRow1,1,sheetRow1++,keys1.length,true).string(' County: '+county+' | Inspector: '+inspectorName+' | Inspection Period: '+periodArr+' ')
       .style({alignment : {horizontal:['center']}, font: {color: 'white',size: 12,bold: true}, fill: {
        type: "pattern",
        patternType : "solid",
        fgColor: "#31708f",
        bgColor: "#31708f"
      }});
       ws1.cell(sheetRow1,1,sheetRow1++,keys1.length,true).string('Visit Plan for Inspection Period '+periodArr)
       .style({alignment : {horizontal:['center']}, font: {color: 'black',size: 13,bold: true}});

       ws1.cell(sheetRow1,1).string("Facility ID").style(headerCenterStyle);
       ws1.cell(sheetRow1,2).string("Facility Name").style(headerCenterStyle);

       ws1.cell(sheetRow1,3).string("Nearest Market").style(headerCenterStyle);
       ws1.cell(sheetRow1,4).string("Market ID").style(headerCenterStyle);
       ws1.cell(sheetRow1,5).string("Market size").style(headerCenterStyle);
       ws1.cell(sheetRow1,6).string("Landmark").style(headerCenterStyle);
       ws1.cell(sheetRow1,7).string("DetailedDescription of Location").style(headerCenterStyle);

       ws1.cell(sheetRow1,8).string("Longitude").style(headerCenterStyle);
       ws1.cell(sheetRow1,9).string("Latitude").style(headerCenterStyle);
       ws1.cell(sheetRow1,10).string("Per Diem").style(headerCenterStyle);
       ws1.cell(sheetRow1,11).string("Distance from County Office(km)").style(headerCenterStyle);
       ws1.cell(sheetRow1,12).string("Estimated transport time from County Office (mins)").style(headerCenterStyle);
       
       ws1.row(5).filter({});
       sheetRow1++;

       for(i in data) {

         var obj=data[i];
        if(data[i].p_transtime!=undefined){
         data[i].p_transtime=parseInt( data[i].p_transtime);
        }
        if(data[i].p_alternatecontact_no!=undefined){
         data[i].p_alternatecontact_no=parseInt( data[i].p_alternatecontact_no);
        }

      for (var j = 0; j < keys.length; j++) {

          if(data[i][keys[j]["key"]]!=undefined){

          if(keys[j]["type"]=="date"){
            var array=data[i][keys[j]["key"]].split("/");
            data[i][keys[j]["key"]]=new Date(array[1]+"-"+array[0]+"-"+array[2]);
            ws.cell(sheetRow,j+1).date(data[i][keys[j]["key"]]).style(normalCenterStyle);

          }else if(keys[j]["type"]=="string"){
            if(j<=1){
              ws.cell(sheetRow,j+1).string(data[i][keys[j]["key"]]).style(normalLeftStyle);
            }else{
              ws.cell(sheetRow,j+1).string(data[i][keys[j]["key"]]).style(normalCenterStyle);
            }
          }else{
            if(j<=1){
             ws.cell(sheetRow,j+1).number(data[i][keys[j]["key"]]).style(normalLeftStyle);
            }else{
              ws.cell(sheetRow,j+1).number(data[i][keys[j]["key"]]).style(normalCenterStyle);
            }
          }
        }
        ws.column(j).setWidth(20);
      }
     for (var j = 0; j < keys1.length; j++) {

      if(data[i][keys1[j]["key"]]!=undefined){

      if(keys1[j]["type"]=="string"){
        if(j<=1){
         ws1.cell(sheetRow1,j+1).string(data[i][keys1[j]["key"]]).style(normalLeftStyle);
        }else{
         ws1.cell(sheetRow1,j+1).string(data[i][keys1[j]["key"]]).style(normalCenterStyle);
        }
     }else{
      if(j<=1){
       ws1.cell(sheetRow1,j+1).number(data[i][keys1[j]["key"]]).style(normalLeftStyle);
      }else{
       ws1.cell(sheetRow1,j+1).number(data[i][keys1[j]["key"]]).style(normalCenterStyle);
      }
     }
   }
   ws1.column(j).setWidth(20);
  
 }
sheetRow++;
sheetRow1++;
}

ws.column(2).setWidth(30);
ws1.column(2).setWidth(30);
ws1.column(12).setWidth(30);

setTimeout(sendExcelFile,1000);

function sendExcelFile() {
  wb.write(xlsxFileName, function (err, stats) {
    if (err) {
      console.error(err);
    }

    var fileName = "";

    fileName = 'Inspector_VisitPlan_'+(CountyService.formateDate())+".xlsx";

    var readStream = fs.createReadStream(xlsxFileName);
    res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    readStream.pipe(res);
    readStream.on('end', function(){

     fs.unlink(xlsxFileName, function(err){
      if (err) throw err;
      console.log(" deleted");
    });
   });
  });
}

});
},
exportDatabankPdfMonthlyReport:function(req,res){

  var county = req.param("county");
  var inspectorId = req.param("inspId");
  var period = req.param("inspPeriod");
  var inspectorName = req.param("inspName");
  var periodArr=[];
  county=CountyService.getCounty(county);

  if (Array.isArray(period)) {
    periodArr=period;
  }else{
    periodArr.push(period);
  }

  var conditionArray=[];

  conditionArray.push({ is_deleted:false,p_date: { $exists: true}});
  if(county!="All"){
    conditionArray.push({_county:county}); 
  }
  if(inspectorId!="All"){
    inspectorId=parseInt(inspectorId);
    conditionArray.push({_inspectorid:inspectorId});   
  }
  if(period!="All"){
    conditionArray.push({p_period:{$in:periodArr}});   
  }

  var mongo = require('mongodb');
  var collection = MongoService.getDB().collection('facility');
  var cursor=collection.find({
    $and :conditionArray},{_county:1,_subcounty:1,_inspectorname:1,_hfid:1,_hfname:1,
      _ownership:1,_level:1,p_incharge:1,p_incharge_no:1,p_nearest_market:1,p_schmt:1,
      p_period:1,p_insp_number:1,p_latitude:1,p_longitude:1,p_date:1,p_market_id:1,
      p_market_size:1,p_treatment:1,p_insp_type:1,p_camp:1,p_landmark:1,p_alternatecontact:1,
      p_distance_county:1,p_transtype:1,p_description:1,p_alternatecontact_no:1,
      p_transtime:1});


  cursor.toArray(function(err, result) {

   var keys= ["_hfid","_hfname","_county","_subcounty","_ownership","_level",
   "p_date","p_insp_number","_inspectorname","p_insp_type",
   "p_incharge","p_incharge_no","p_alternatecontact","p_alternatecontact_no",
   "p_treatment","p_nearest_market","p_landmark",
   "p_description"];

   /*var keys1= ["_hfid","_hfname","_county","_subcounty","_ownership","_level",
   "p_date","p_insp_number","_inspectorname","p_insp_type",
   "p_incharge",
   "p_incharge_no","p_alternatecontact","p_alternatecontact_no","p_treatment"];*/

   
   var tblContent=
   ['Facility ID', 'Facility Name',
   'County', 'Sub-County',
   'Ownership', 'Level', 'Planned Inspection Date', 'Inspection Number',
   'Inspector Name',
   'Inspection type', 'In-Charge Name','In-Charge Phone', 
   'Alternate Contact Name','Alternate Contact Type','T Group',
   'Nearest Market','Landmark','Detailed Description of Location'
   ];


   /*var tblContent1=['Facility Id', 'Facility Name','County', 'Sub-County',
   'Ownership', 'Level', 'Planned Inspection Date', 'Inspection Number','Inspector Name',
   'Inspection type', 'In-Charge Name','In-Charge Phone', 
   'Alternatecontact','Alternatecontact_no','T Group'
   ];*/

   var tableHeader = '<table style="page-break-after: always;"><tbody><tr>';

   for(var i=0;i<tblContent.length;i++){
    tableHeader+='<th>'+tblContent[i]+'</th>';
  }

  tableHeader+='</tr>';
  var sectionHTML = tableHeader;

  for(i in result) {

   var obj=result[i];
   sectionHTML+='<tr>';
   for (var j = 0; j < keys.length; j++) {

    if(obj[keys[j]]==undefined){

      sectionHTML+='<td></td>';
    }else{

      sectionHTML+='<td>'+obj[keys[j]]+""+'</td>';
    }
  }
  sectionHTML+='</tr>';

/*
  if(i%50==0 && (i/50)==1){
    console.log("Here"+i);
   
     sectionHTML+='</tbody></table>';
     console.log("page break "+obj[keys1[0]])
    sectionHTML+=tableHeader

  
  }else{
    console.log("Here else"+i)
    if(i%60==0 && i!=0){
     sectionHTML+='</tbody></table>';
     console.log("Here else==================="+i);
     console.log("page break "+obj[keys1[0]])
     sectionHTML+=tableHeader
   }*/

//}

}

sectionHTML+='</tbody></table>';

/*sectionHTML += '<br><br><center ><span>Inspector Profile Information</span></center><br><br>';

var tableHeader2='<table style="page-break-after: always;" ><tbody><tr>';
var tableHeader2_1='<table ><tbody><tr>';
for(var i=0;i<tblContent1.length;i++){

  tableHeader2+='<th>'+tblContent1[i]+'</th>';
  tableHeader2_1+='<th>'+tblContent1[i]+'</th>';

}

tableHeader2+='</tr>';
tableHeader2_1+='</tr>';

sectionHTML+=tableHeader2;

for(j in result) {

 var obj=result[j];

 sectionHTML+='<tr>';
 for (var k = 0; k < keys1.length; k++) {
  if(obj[keys1[k]]==undefined){

   sectionHTML+='<td></td>';
 }else{
   sectionHTML+='<td>'+obj[keys1[k]]+""+'</td>';
 }
}

sectionHTML+='</tr>';

console.log("Here table2--------"+j)
if(j%60==0 && j!=0){

  if((result.length-j)>60){

   sectionHTML+='</tbody></table>';
   console.log("page break-after "+obj[keys1[0]])
   sectionHTML+=tableHeader2;
 }else{
  console.log(result.length+"______"+j)
  sectionHTML+='</tbody></table>';
  sectionHTML+=tableHeader2_1;
}
}
}

sectionHTML+='</tbody></table>';
*/

//console.log(sectionHTML);


var date = new Date();
var month = date.getMonth() + 1;
var dt=date.getDate();
var hours=date.getHours();
var minutes=date.getMinutes();
var seconds=date.getSeconds();
var tp= (dt > 9 ? dt : "0" + dt) + "-" + (month > 9 ? month : "0" + month) + "-" + date.getFullYear()+"_"+hours+":"+minutes+":"+seconds;



var fileName = "Inspector_VisitPlan_"+tp;


var logourl = sails.config.logoURL;

        // prepare html


        var html = "<html><head><link rel='icon' href='/wb-favicon.png'/><title>KePSIE | PDF</title><style> ";
        html = html + ".secLink {font-size:12px !important;padding:1px} #s14Body img {height : 12px;width : 12px}";
        html = html + "thead {display: table-header-group;} table{border: solid 1px black;border-collapse:collapse} table tr td,th{border: solid 1px black;vertical-align: middle;text-align:center} table tbody tr th {padding: 2px;font-size:11px} table tbody tr td {font-size:9px;border-top: 1px solid #e7ecf1 !important;padding: 1px;}";
        html = html + "table.innertable tbody tr th{padding: 1px !important;font-size:10px !important} table.innertable tbody tr td{font-size:9px !important;padding: 1px !important}";
        html = html + ".pageOneMain {height: 100%;width: 100%;display: table;}.pageOneWrapper {display: table-cell;height: 100%;vertical-align: middle;}.pageOneH1 {text-align: center;color : #31708f;}.pageOneH3 {text-align: center;color : #31708f;}";
        html = html + "</style></head><body style='font-family:\"Open Sans, sans-serif\"'>"

        html  = html +   '<center><img src='+logourl+' width="100px" height="100px"><br><br><span>Inspector Visit Plan</span><br><span>County: '+county+' | Inspector: '+inspectorName+' | Inspection Period: '+period+'</span><br><span>Visit Plan for Inspection Period '+period+'</span> </center><br/>';

        html = html + sectionHTML;
        html = html + "</body></html>";

        // phantom JS code
        var jsreport = require('jsreport');
        var footerHTML = "<center><font style='color:rgba(105, 120, 130, 0.8);font-size:9px;font-family:\"Open Sans, sans-serif\"' id='pageNumber' name='{#pageNum}'>{#pageNum}</font></center><script type='text/javascript'> var elem = document.getElementById('pageNumber'); if (parseInt(elem.getAttribute('name'))==1) { elem.style.display = 'none'; } else {elem.innerHTML = 'Page '+(parseInt(elem.getAttribute('name'))-1)+' of '+(parseInt({#numPages})-1);}</script>";

        footerHTML = "<center><font style='color:rgba(105, 120, 130, 0.8);font-size:9px;font-family:\"Open Sans, sans-serif\"' id='pageNumber' name='{#pageNum}'>{#pageNum} of {#numPages}</font></center>";
        
        jsreport.render({
          template: {
            content: html,
            recipe: "phantom-pdf",
            engine: "handlebars",
            phantom: {
                   // header: "<center><font style='color:rgba(105, 120, 130, 0.8);font-size:13px;font-weight:bold;font-family:\"Open Sans, sans-serif\"'>"+req.param('reportHeader')+"</font></center>",
                   footer: footerHTML,
                   headerHeight: "45px",
                   footerHeight:"30px",
                   margin:"25px",
                   orientation: 'landscape'
                 }
               },
             }).then(function (out) {
              setTimeout(function() {

                res.setHeader('Content-disposition', 'attachment; filename='+fileName+'.pdf');
                out.stream.pipe(res);
              },2000);

            }).catch(function (e) {
              res.end(e.message);
            });

          });

},

exportDatabankPdf:function(req,res){

 var county = req.param("county");
 var inspectorId = req.param("inspId");
 var period = req.param("inspPeriod");
 var inspectorName = req.param("inspName");
 var facilityList=req.param("facilityList");

 var facility_array=[];

 if(Array.isArray(facilityList)){

  for (var i = 0; i < facilityList.length; i++) {
   facility_array.push(parseInt(facilityList[i]));
 }
}else{
  facility_array.push(parseInt(facilityList));
}

var periodArr=[];
county=CountyService.getCounty(county);

if (Array.isArray(period)) {

  periodArr=period;

}else{
  periodArr.push(period);
}

var conditionArray=[];

conditionArray.push({ is_deleted:false},{_hfid:{$in:facility_array}});
if(county!="All"){
  conditionArray.push({_county:county}); 
}
if(inspectorId!="All"){
  inspectorId=parseInt(inspectorId);
  conditionArray.push({_inspectorid:inspectorId});   
}
if(period!="All"){
  conditionArray.push({p_period:{$in:periodArr}});   
}

var mongo = require('mongodb');
var collection = MongoService.getDB().collection('facility');
var cursor=collection.find({
  $and :conditionArray},{_county:1,_subcounty:1,_hfid:1,_hfname:1,
    _ownership:1,_level:1,p_insp_number:1,p_nearest_market:1, p_treatment:1,
    p_incharge:1,p_incharge_no:1,p_description:1, p_landmark:1, p_alternatecontact:1,
    p_alternatecontact_no:1,p_latitude:1,p_longitude:1   
  });

var fs = require('fs');
var dt=new Date();

var username = req.session.loggedInUser.name+dt;


fs.exists('.tmp/'+username,function(exists){
  if(exists){
    console.log('yes folder available');
  }else{
    console.log("no such folder available..");
    fs.mkdirSync('.tmp/'+username);
  }
});

cursor.toArray(function(err, result) {

  var rmdir = require('rmdir');

  var facilityDetail=result;

  if(facilityDetail.length == 0){

    var path = '.tmp/';

    rmdir(path+username, function (err, dirs, files) {

    });

    req.flash('noPdfFound', 'No PDF available');
    return res.redirect(sails.config.routesPrefix+'/inspectorVisitPlan/dataBank');
  }
  else{

    var PdfPrinter = require('pdfmake/src/printer');
    var fonts = {
      Dejavu: {
        normal:'/usr/share/fonts/truetype/opensans/OpenSans-Regular.ttf',
        bold: '/usr/share/fonts/truetype/opensans/OpenSans-Regular.ttf',
        italics: '/usr/share/fonts/truetype/opensans/OpenSans-Italic.ttf',
        bolditalics: '/usr/share/fonts/truetype/opensans/OpenSans-Italic.ttf'
        /*local path start */
        /*normal: '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        bold: '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
        italics: '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
        bolditalics: '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'*/
      },
    };


    var printer = new PdfPrinter(fonts);

    var async = require('async');

    var base64Img = require('base64-img');
    var data = base64Img.base64Sync('assets/images/moh_logo.png');
    var fileNames;

    var tblContent=[];

    async.eachSeries(facilityDetail, function(item, callback) {


      var hfid = (item["_hfid"] == undefined) ? "" : ""+item["_hfid"].toString();
      var hfname = (item["_hfname"] == undefined) ? "" : ""+item["_hfname"].toString();
      var ownership = (""+item["_ownership"] == undefined) ? "" : ""+item["_ownership"].toString();
      var level = (item["_level"] == undefined) ? "" : ""+item["_level"].toString();
      var p_insp_number = (item["p_insp_number"] == undefined) ? "" : ""+item["p_insp_number"].toString();
      var p_nearest_market = (item["p_nearest_market"] == undefined) ? "" : ""+item["p_nearest_market"].toString();
      var p_treatment = (item["p_treatment"] == undefined) ? "" : ""+item["p_treatment"].toString();
      var p_incharge = (item["p_incharge"] == undefined) ? "" : ""+item["p_incharge"].toString();
      var p_incharge_no = (item["p_incharge_no"] == undefined) ? "" : ""+item["p_incharge_no"].toString();
      var p_description = (item["p_description"] == undefined) ? "" : ""+item["p_description"].toString();
      var p_landmark = (item["p_landmark"] == undefined) ? "" : ""+item["p_landmark"].toString();
      var p_alternatecontact = (item["p_alternatecontact"] == undefined) ? "" : ""+item["p_alternatecontact"].toString();
      var p_alternatecontact_no = (item["p_alternatecontact_no"] == undefined) ? "" : ""+item["p_alternatecontact_no"].toString();
      var p_longitude = (item["p_longitude"] == undefined) ? "" : ""+item["p_longitude"].toString();
      var p_latitude = (item["p_latitude"] == undefined) ? "" : ""+item["p_latitude"].toString();  
      tblContent=[
      [{ text: 'Item', style: 'tableHeader' },
      { text: 'Details', style: 'tableHeader' }],
      ["Facility ID",hfid],
      ["Facility Name",hfname],
      ["Ownership",ownership],
      ["Level",level],
      [ "Inspection Number",p_insp_number],
      ["Nearest Market",p_nearest_market],
      ["Treatment Group",p_treatment],
      ["In-Charge Name",p_incharge],
      ["In-Charge Phone",p_incharge_no],
      ["Detailed Description of Location",p_description],
      ["Landmark",p_landmark],
      ["Alternate Contact",p_alternatecontact],
      ["Alternate Contact Number",p_alternatecontact_no], 
      ["Longitude",p_longitude], 
      ["Latitude",p_latitude]  

      ];

      var headerNote="County: "+county+" | Inspector's Name: "+inspectorName+" | Inspection Period: "+period+" | Facility: "+hfid;
      ;

      var docDefinition = 
      {
       footer: function(currentPage, pageCount) {
         return {text:currentPage.toString() + ' of ' + pageCount, alignment: 'center'}; 
       },
       content: [
       {
        image: data,
        fit: [84, 76],
        alignment: 'center',
      },
      {
        text:"Health facility information sheet",
        alignment: 'center',
      },
      {
        text:headerNote,
        style: 'note',
        alignment: 'center',
      },
      {
        style: 'tableExample',

        table: {

          headerRows: 1,
          body: tblContent
        }
      }
      ],
      styles: {

        tableExample: {
         fontSize: 8,
         margin: [60, 5, 0, 15]
       },
       tableHeader: {
        bold: true,
        fontSize: 11,
        color: 'black',
        bold:true,
        alignment: 'center',
      },
      logoHeader:{
        margin: [0,0,0,0]
      },
      note:{
        fontSize: 9,
        bold: true
      }
    },
    defaultStyle: {
      font: 'Dejavu'
    }
  }

  var pdfDoc = printer.createPdfKitDocument(docDefinition);
  var fileName = hfname+hfid+".pdf";

  var writeStream = fs.createWriteStream('.tmp/'+username+'/'+fileName, { encoding: 'utf8' });

  pdfDoc.pipe(writeStream);
  pdfDoc.end();

  writeStream.on('finish', function () {

   callback();
 });
},function(err) {
    // if any of the file processing produced an error, err would equal that error
    if( err ) {
      console.log('A pdfs failed to process');
    } else {
      console.log('All pdfs have been processed successfully');

      var fileNames = [];

      var arrayOfFiles = fs.readdirSync('.tmp/'+username+'/');

      arrayOfFiles.forEach( function (file) {
        fileNames.push(file);
      });

      var output = fs.createWriteStream('.tmp/facilityPDF_'+dt+'.zip');

      var archiver = require('archiver');
      archive = archiver('zip');

      archive.pipe(output);

      var getStream = function(fileName){
        return fs.readFileSync(fileName);
      }

      for(i=0; i<fileNames.length; i++){
        var path = '.tmp/'+username+ '/'+fileNames[i];
        archive.append(getStream(path), { name: fileNames[i]});
      }

      output.on('close', function() {
        console.log('archiver has been finalized and the output file descriptor has closed.');

      });

      archive.finalize(function(err, bytes) {
        if (err) {
          console.log("error....");
          throw err;
        }
        console.log(bytes + ' total bytes');

      });

      output.on ( 'error', function ( err ) {
        console.log("-----Error----->>>>");
        console.log ( err );
      });

      output.on('finish', function() {

        res.download('.tmp/facilityPDF_'+dt+'.zip');

        var path = '.tmp/';

        rmdir(path+username, function (err, dirs, files) {

        });
      });
    }
  });
}
});
},

getVisitPlanMapData: function(req,res){

 var county = req.param("county");
 var inspectorId = req.param("inspector");
 var period = req.param("inspPeriod");

 var conditionArray=[];

 conditionArray.push({ is_deleted:false});
 if(county!="All"){
  conditionArray.push({_county:county}); 
}
if(inspectorId!="All"){
  inspectorId=parseInt(inspectorId);
  conditionArray.push({_inspectorid:inspectorId});   
}
if(period!="All"){
  conditionArray.push({p_period:period});   
}

console.log(conditionArray);


var mongo = require('mongodb');
var collection = MongoService.getDB().collection('facility');
var cursor=collection.find({
  $and :conditionArray},{_county:1,_subcounty:1,_inspectorname:1,_hfid:1,_hfname:1,_ownership:1,
    _level:1,p_insp_number:1,p_insp_type:1,p_nearest_market:1,p_schmt:1,p_date:1,
    p_distance_county:1,p_transtype:1,p_description:1,m_visit_completed:1,p_latitude:1,
    p_longitude:1,p_market_size:1});

cursor.toArray(function(err, result) {

  console.log(result);

  res.json(result);

});
},

exportMapAsKML: function (req, res) {


  var county = req.param("county");
  var inspectorId = req.param("inspector");
  var period = req.param("inspPeriod");

  var conditionArray=[];

  conditionArray.push({ is_deleted:false});
  if(county!="All"){
    conditionArray.push({_county:county}); 
  }
  if(inspectorId!="All"){
    inspectorId=parseInt(inspectorId);
    conditionArray.push({_inspectorid:inspectorId});   
  }
  if(period!="All"){
    conditionArray.push({p_period:period});   
  }


  county=CountyService.getCountyNumber(county);

  var mongo = require('mongodb');
  var collection = MongoService.getDB().collection('facility');
  var cursor=collection.find({
    $and :conditionArray},{_county:1,_subcounty:1,_inspectorname:1,_hfid:1,_hfname:1,_ownership:1,
    _level:1,p_insp_number:1,p_insp_type:1,p_nearest_market:1,p_schmt:1,p_date:1,
    p_distance_county:1,p_transtype:1,p_description:1,m_visit_completed:1,p_latitude:1,
    p_longitude:1,p_market_size:1});


  cursor.toArray(function(err, result) {

    facilities=result;


    for (var i = 0; i < result.length; i++) {
      result[i]._level=CountyService.getLevelNumber(result[i]._level);

    }

            // prepare xml string
            var fs = require('fs');
            var content = '<?xml version="1.0" encoding="UTF-8"?>';
            content = content + '<kml xmlns="http://www.opengis.net/kml/2.2">';
            content = content + '<Document>';
            content = content + '<name>Inspector Visit Plan - Maps </name>';
            var long = "36.7073069";
            var lat = "-1.3047997";
            var zoom = "800000";
            if (county == "All") {
              long = "36.7073069";
              lat = "-1.3047997";
              zoom = "800000";
            } else if (county == "1") {
              long = "34.7286168";
              lat = "0.2818605";
              zoom = "130000";
            } else if (county == "2") {
              long = "39.7565459";
              lat = "-3.5372587";
              zoom = "150000";
            } else if (county == "3") {
              long = "37.6260278";
              lat = "0.0483656";
              zoom = "130000";
            }
            content = content + '<LookAt>';
            content = content + '<longitude>' + long + '</longitude><latitude>' + lat + '</latitude>';
            content = content + '<range>' + zoom + '</range>';
            content = content + '</LookAt>';
            for (i in facilities) {
              if (facilities[i].m_visit_completed == "No"|| facilities[i].m_visit_completed == "Yes") {
                content = content + '<Placemark>';
                content = content + '<name>' + facilities[i]._hfname + '</name>';
                content = content + '<description>';
                content = content + 'HF ID : ' + facilities[i]._hfid + '\n';
                content = content + 'County : ' + facilities[i]._county + '\n';
                content = content + 'Sub County : ' + facilities[i]._subcounty + '\n';
                content = content + 'Ownership : ' + facilities[i]._ownership + '\n';
                content = content + 'Level : ' + facilities[i]._level + '\n';

                content = content + 'Date planned to be visited : ' + facilities[i].p_date + '\n';
                content = content + 'Inspection number : ' + facilities[i].p_insp_number + '\n';
                content = content + 'Inspection type : ' + facilities[i].p_insp_type + '\n';

                //content = content + 'Market Size : ' + facilities[i].p_market_size + '\n';

                content = content + '</description>';
                content = content + '<Point>';
                content = content + '<coordinates>' + facilities[i].p_longitude + ',' + facilities[i].p_latitude + ',0</coordinates>';
                content = content + '</Point>';
                content = content + '</Placemark>';
              }
            }
            content = content + '</Document>';
            content = content + '</kml>';

            // write xml string to .kml file
            var fileName = "InspectorVisitPlanMap_"+(CountyService.formateDate())+".kml"
            var filePath = ".tmp/" + fileName;
            var fd = fs.openSync(filePath, 'w');

            // send the .kml file to view
            fs.writeFile(filePath, content, function (err) {
              if (err) {
                return console.log(err);
              }
              var readStream = fs.createReadStream(filePath);
              res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
              res.setHeader('Content-type', 'text/kml');
              readStream.pipe(res);
              readStream.on('end', function(){
                fs.unlink(filePath, function(err){
                  if (err) throw err;
                  console.log('successfully deleted ');
                });
              });
            });
          });
},

getVisitPlanData: function(req, res) {

  var county = req.param("county");
  var inspectorId = req.param("inspector")._id;
  var period = req.param("inspPeriod").key;

        // get user role from session

        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');
        var cursor=collection.find({},{_county:1,_subcounty:1,_inspectorname:1,_hfid:1,_hfname:1,_ownership:1,
          _level:1,p_incharge:1,p_incharge_no:1,p_nearest_market:1,p_schmt:1,p_period:1,
          p_distance_county:1,p_transtype:1,p_description:1});


        cursor.toArray(function(err, result) {

          var visitPlanData=result;


          var hideInspectorColumn = false;
          var user = req.session.loggedInUser;
          if(user.role=="Admin" || user.role=="Report Viewer(National)") {
            hideInspectorColumn = false;
          } else {
            hideInspectorColumn = true;
          }

          var visitPlanFilteredData = [];
          for(idx in visitPlanData) {
            var obj = visitPlanData[idx];

            if((county=="All" || (county)==obj._county)
              && (inspectorId=="All" || inspectorId==obj._inspectorid)
              && (period=="All" || period== obj.p_period)) {
              visitPlanFilteredData.push(obj);
          }
        }

        res.send({
          visitPlanData: visitPlanFilteredData,
          hideInspectorColumn : hideInspectorColumn
        });

      });
      },

      getInspProgressData: function(req, res) {

        //get request data
        var county = req.param("county");
        var inspectorId = req.param("inspector")._id;
        var period = req.param("inspPeriod").key;


        var inspectors = [];
        var resultArr = [];

        var county = req.param("county");
        var inspectorId = req.param("inspector")._id;
        var period = req.param("inspPeriod").key;

        User.find({role:"Inspector"},function(err, users) {

          inspectors = users;

          var user = req.session.loggedInUser;

          var progressFilteredData = [];

        //get inspector progress data

        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');

        var conditionString = '"is_deleted":false,';
        if(county != "All") {
          conditionString = conditionString + '"_county":"'+county+'",';
        }
        if(inspectorId != "All") {
          conditionString = conditionString + '"_inspectorid":'+inspectorId+',';
        }
        if(period != "All") {
          conditionString = conditionString + '"p_period":"'+period+'",';
        }

        conditionString = conditionString.replace(/,\s*$/, "");

        conditionString = "{"+conditionString+"}";

        try {
          conditionString = JSON.parse(conditionString);
        }catch(e) {
          console.log("error in conditionString");
        }

        var cursor1 = collection.aggregate([  { $match :conditionString },
          {"$group":{_id:{insp:"$_inspectorid",complete:"$m_insp_completed"},_inspectorname:{$last: '$_inspectorname'},_county:{$last: '$_county'}, count:{$sum:1}}}, 
          { "$group": {"_id": "$_id.insp", "inspections": { "$push": { "status": "$_id.complete", "count": "$count" },}, name: {"$last": "$_inspectorname"},county:{"$last": "$_county"}, "count": { "$sum": "$count" } }} ]);
        cursor1.toArray(function(err, result) {

          console.log("m_insp_completed here")
          var visited = 0;
          var pending = 0;
          var total = 0;

          if(result != undefined && result.length>0){

            for(j=0;j<result.length;j++) {
             var objInsp = {};

             objInsp.inspectorId = result[j]._id;
             objInsp.inspectorName = result[j].name;
             objInsp.county = result[j].county;
             objInsp.total = result[j].count;
             var inspections = result[j].inspections;
             var flag="";


             if(inspections != undefined && inspections.length > 0 ) {
              var inspection1 = inspections[0];

              if(inspection1 != undefined && inspection1.status=="Yes") {
               objInsp.visited =  inspection1.count;
               flag="Yes";
             }else if(inspection1 != undefined && inspection1.status=="No") {
              objInsp.pending =  inspection1.count;
              flag="No";
            }
            var inspection2 = inspections[1]; 


            if(inspection2 != undefined ){

              if( inspection2.status=="Yes") {
               objInsp.visited =  inspection2.count;
             }else if( inspection2.status=="No") {
              objInsp.pending =  inspection2.count;
            }
          }else{
            if(flag=="Yes"){
             objInsp.pending =0;
           }else{
             objInsp.visited = 0;
           }
         }
       }else{
         objInsp.visited = 0;
         objInsp.pending =0;
       }
       objInsp.progress = (objInsp.visited / objInsp.total ) * 100;
       if(objInsp.inspectorId != undefined && objInsp.inspectorId != null) {
        resultArr.push(objInsp); 
      }

    }
  }

  for(idx in resultArr) {
    var obj = resultArr[idx];
    progressFilteredData.push(obj);
  }
  res.send({
    inspProgressData: progressFilteredData
  });

});
      });

      },
      getInspProgressDataByCounty: function(req, res) {

        var county = req.param("county");
        var inspectorId = req.param("inspector")._id;
        var period = req.param("inspPeriod").key;

        var countyNameArr=[];
        var seriesDataArr=[];
        
        //get inspector progress data

        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');

        var conditionString = '"is_deleted":false';
        if(county != "All") {
          conditionString = conditionString + ',"_county":"'+county+'"';
        }

        if(inspectorId != "All" && inspectorId != " ") {
          conditionString = conditionString + ',"_inspectorid":'+inspectorId;
        }
        if(period != "All") {
          conditionString = conditionString + ',"p_period":"'+period+'"';
        }

        
        conditionString = conditionString.replace(/,\s*$/, "");
        
        conditionString = "{"+conditionString+"}";
        try {
          conditionString = JSON.parse(conditionString);  
        }catch(e) {
          console.log("error in conditionString");
        }
        
        var cursor1 = collection.aggregate([  { $match :conditionString },
         {$group:{_id:{county:"$_county",status:"$m_insp_completed"},count:{$sum:1}}}])

        cursor1.toArray(function(err, result) {
          console.log("m_insp_completed here county")
         var countyArr=[];
         countyArr[0]={y:0,complete:0,pending:0,total:0};
         countyArr[1]={y:0,complete:0,pending:0,total:0};
         countyArr[2]={y:0,complete:0,pending:0,total:0};
         countyArr[3]={y:0,complete:0,pending:0,total:0};

         for (var i = 0; i < result.length; i++) {
          if(result[i]._id.status=='Yes'){
           countyArr[0].complete+=result[i].count;

           if(result[i]._id.county=='Kakamega'){
            countyArr[1].complete+=result[i].count;
          }else if(result[i]._id.county=='Kilifi'){
            countyArr[2].complete+=result[i].count;
          }else if(result[i]._id.county=='Meru'){
            countyArr[3].complete+=result[i].count;
          }

        }else if(result[i]._id.status=='No'){
         countyArr[0].pending+=result[i].count;

         if(result[i]._id.county=='Kakamega'){
          countyArr[1].pending+=result[i].count;
        }else if(result[i]._id.county=='Kilifi'){
          countyArr[2].pending+=result[i].count;
        }else if(result[i]._id.county=='Meru'){
          countyArr[3].pending+=result[i].count;
        }

      }
    }
    for (var j = 0; j < countyArr.length; j++) {

      countyArr[j].total=countyArr[j].complete+countyArr[j].pending;

      if(countyArr[j].total!=0){

        countyArr[j].y=countyArr[j].complete*100/countyArr[j].total;
      }
    }

    if(county=="All" && inspectorId=="All"){
      countyNameArr=CountyService.allCounty();
      seriesDataArr=countyArr;

    }else if(county=="All" && inspectorId!="All") {

      for (var i = 1; i < countyArr.length; i++) {
        if(countyArr[i].y!=0){
         countyNameArr.push(CountyService.getCounty(i));
         seriesDataArr.push(countyArr[i]);
       }
     }

   }else {

    countyNameArr.push(county);
    seriesDataArr.push(countyArr[CountyService.getCountyNumber(county)]);
  }

  res.json({
    countyNameArr:countyNameArr,
    seriesDataArr:seriesDataArr

  });

});

      },

      getInspectionPeriods: function(req, res) {
        var county = req.param("county");
        var inspector=req.param("inspector");

        var loggedInUser = req.session.loggedInUser;
        UserService.getInspectionPeriods(loggedInUser, county,inspector, sendResponse);

        function sendResponse(inspectionPeriods) {

          res.send({
            "inspectionPeriods":inspectionPeriods,
          });
        }
      },


      exportAsPDF: function(req, res) {

       var logourl = sails.config.logoURL;

       var county = req.param("county");
       var inspectorName = req.param("inspectorName");
       var inspPeriod = req.param("inspPeriod");
       var reportType = req.param("reportType");

        // prepare html code
        var html = "<html><head><link rel='icon' href='/wb-favicon.png'/><title>KePSIE | PDF</title><style> ";
        html = html + ".centerCell{text-align:center} table {border:1px solid #e7ecf1;width:98%}.header1 a {font-size: 14px;background-color: #31708f;color: white;padding: 5px 5px 4px 5px;text-decoration: none;display: block;font-weight: bold;}.header1 {margin-bottom: 10px;font-size: 17px;background-color: #31708f;color: white;padding: 3px;border-radius: 5px 5px 0 0!important}.table thead tr th {font-size: 16px;font-weight: bold;padding: 6px;border: 1px solid #e7ecf1;} .table tfoot tr th {font-size: 16px;font-weight: bold;padding: 6px;border: 1px solid #e7ecf1;} table tbody tr td {border: 1px solid #e7ecf1 !important;padding: 4px;line-height: 1.42857;vertical-align: top;} td{font-size:15px} th{font-size:15px}.pageOneMain {height: 100%;width: 100%;display: table;}.pageOneWrapper {display: table-cell;height: 100%;vertical-align: middle;}.pageOneH1 {text-align: center;color : #31708f;}.pageOneH3 {text-align: center;color : #31708f;}";
        html = html + "thead {display: table-row-group;} tfoot {display: table-row-group;} .countyHeader {margin-bottom:0px; float: left;padding: 7px;background-color: rgb(49, 112, 143);color: white;padding-left: 10px;padding-right: 25px;border-radius: 5px 5px 0px 0px !important;display: none;}";
        html = html + "table{margin-bottom: 10px;} table td{font-size: 13px} .countyHeader{font-size: 13px}</style></head><body style='color: #333333; font-family:\"Open Sans, sans-serif !important\";font-size:13px'>"
        html = html + '<center><img src='+logourl+' width="120px" height="120px"></center>';
        if(reportType=="VisitPlans") {
          html = html + '<div class="header1" style="width:1091px"><a class="secLink" href="javascript:void(0)">Inspection Planning: Visit Plans Report </a></div>';
        } else {
          html = html + '<div class="header1" style="width:1024px"><a class="secLink" href="javascript:void(0)">Inspection Planning: Inspector Progress Report </a></div>';
        }
        html = html + '<table><tr><td> County: '+county+'</td> <td style="width: 300px%"> Inspector: '+inspectorName+' </td><td style="width: 300px%">  Inspection Period: '+inspPeriod+' </td></tr></table>' ;
        html = html + req.param("reportHTML");
        html = html + "</body></html>";
        
        var jsreport = require('jsreport');

        jsreport.render({
          template: {
            content: html,
            recipe: "phantom-pdf",
            engine: "handlebars",
            phantom: {
              orientation: "landscape",
            }
          },
        }).then(function (out) {
          if(reportType=="VisitPlans") {

            res.setHeader('Content-disposition', 'attachment; filename='+req.__("visit_plan_report")+'_'+(CountyService.formateDate())+'.pdf');
          } else {
           res.setHeader('Content-disposition', 'attachment; filename='+req.__("inspection_progress_report")+'_'+(CountyService.formateDate())+'.pdf');
         }
         out.stream.pipe(res);
       }).catch(function (e) {
        res.end(e.message);
      });
     },

     exportAsExcel: function(req, res) {

      var county = req.param("county");
      var inspectorName = req.param("inspectorName");
      var inspPeriod = req.param("inspPeriod");
      var reportType = req.param("reportType");
      var data;
      if(reportType=="VisitPlans") {
        data = req.param("visitPlanData");
      } else {
        data = req.param("inspProgressData");
      }
      
      data = JSON.parse(data);

        //prepare excel
        var xl = require('excel4node');
        var wb = new xl.Workbook();
        var ws;
        if(reportType=="VisitPlans") {
          ws = wb.addWorksheet('Visit_Plans');
        } else {
          ws = wb.addWorksheet('Inspector_Progress_Report');
        }
        var http = require('http');
        var fs = require('fs');
        var xlsxFileName = ".tmp/excelFile_"+new Date()+".xlsx";
        var sheetRow = 1;

        //styles
        var normalCenterStyle = wb.createStyle({
          alignment: {
            vertical: ['center'],
            horizontal:['center']
          },
          font: {
            color: 'black',
            size: 11,
          },
          wrapText: true
        });
        var headerCenterStyle = wb.createStyle({
          alignment: {
            vertical: ['center'],
            horizontal:['center']
          },
          font: {
            color: 'black',
            size: 11,
            bold: true,
          }
        });

        //add data to excel
        if(reportType=="VisitPlans") {
            //heading
            ws.cell(sheetRow,1,sheetRow++,15,true).string('Visit Plans | County: '+county+' | Inspector: '+inspectorName+' | Inspection Period: '+inspPeriod+' ')
            .style({alignment : {horizontal:['center']}, font: {color: 'white',size: 13,bold: true}, fill: {
              type: "pattern",
              patternType : "solid",
              fgColor: "#31708f",
              bgColor: "#31708f"
            }});
            ws.cell(sheetRow,1,sheetRow++,15,true).string('Visit Plan for Inspection Period '+inspPeriod)
            .style({alignment : {horizontal:['center']}, font: {color: 'black',size: 13,bold: true}});

            ws.cell(sheetRow,1).string("County").style(headerCenterStyle);
            ws.cell(sheetRow,2).string("Sub-County").style(headerCenterStyle);
            ws.cell(sheetRow,3).string("Inspector Name").style(headerCenterStyle);
            ws.cell(sheetRow,4).string("Facility Id").style(headerCenterStyle);
            ws.cell(sheetRow,5).string("Facility Name").style(headerCenterStyle);
            ws.cell(sheetRow,6).string("Ownership").style(headerCenterStyle);
            ws.cell(sheetRow,7).string("Level").style(headerCenterStyle);
            ws.cell(sheetRow,8).string("Nearest Market").style(headerCenterStyle);
            ws.cell(sheetRow,9).string("T Group").style(headerCenterStyle);
            ws.cell(sheetRow,10).string("SCHMT Office").style(headerCenterStyle);
            ws.cell(sheetRow,11).string("Distance from County Office(km)").style(headerCenterStyle);
            ws.cell(sheetRow,12).string("Transportation Mode").style(headerCenterStyle);
            ws.cell(sheetRow,13).string("In-Charge Name").style(headerCenterStyle);
            ws.cell(sheetRow,14).string("In-Charge Phone").style(headerCenterStyle);
            ws.cell(sheetRow,15).string("Detailed Dscription of Location").style(headerCenterStyle);
            sheetRow++;


            for(i in data) {

              var obj = data[i];

              ws.cell(sheetRow,1).string(obj['_county']).style(normalCenterStyle);

              ws.cell(sheetRow,2).string(obj['_subcounty']).style(normalCenterStyle);

              ws.cell(sheetRow,3).string(obj['_inspectorname']).style(normalCenterStyle);

              ws.cell(sheetRow,4).number(obj['_hfid']).style(normalCenterStyle);

              ws.cell(sheetRow,5).string(obj['_hfname']).style(normalCenterStyle);

              ws.cell(sheetRow,6).string(obj['_ownership']).style(normalCenterStyle);

              ws.cell(sheetRow,7).string(obj['_level']).style(normalCenterStyle);

              ws.cell(sheetRow,8).string(obj['p_nearest_market']).style(normalCenterStyle);

              ws.cell(sheetRow,9).string(" ").style(normalCenterStyle);

              ws.cell(sheetRow,10).string(obj['p_schmt']).style(normalCenterStyle);
              ws.cell(sheetRow,11).number(obj['p_distance_county']).style(normalCenterStyle);
              ws.cell(sheetRow,12).string(obj['p_transtype']).style(normalCenterStyle);
              ws.cell(sheetRow,13).string(obj['p_incharge']).style(normalCenterStyle);
              ws.cell(sheetRow,14).number(obj['p_incharge_no']).style(normalCenterStyle);
              ws.cell(sheetRow,15).string(obj['p_description']).style(normalCenterStyle);
              sheetRow++;
            }
          //  console.log("setWidth");
          ws.column(1).setWidth(15);
          ws.column(2).setWidth(15);
          ws.column(3).setWidth(25);
          ws.column(4).setWidth(15);
          ws.column(5).setWidth(20);
          ws.column(6).setWidth(10);
          ws.column(7).setWidth(5);
          ws.column(8).setWidth(20);
          ws.column(9).setWidth(10);
          ws.column(10).setWidth(25);
          ws.column(11).setWidth(10);
          ws.column(12).setWidth(15);
          ws.column(13).setWidth(25);
          ws.column(14).setWidth(15);
          ws.column(15).setWidth(25);
           // console.log("finish");
         } else {
          ws.cell(sheetRow,1,sheetRow++,5,true).string('Inspector Progress Report | County: '+county+' | Inspector: '+inspectorName+' | Inspection Period: '+inspPeriod+' ')
          .style({alignment : {horizontal:['center']}, font: {color: 'white',size: 13,bold: true},fill: {
            type: "pattern",
            patternType : "solid",
            fgColor: "#31708f",
            bgColor: "#31708f"
          }});
          ws.cell(sheetRow,1,sheetRow++,5,true).string('Progress Report of '+inspectorName+' Inspector')
          .style({alignment : {horizontal:['center']}, font: {color: 'black',size: 13,bold: true}});

          ws.cell(sheetRow,1).string("Inspector Name").style(headerCenterStyle);
          ws.cell(sheetRow,2).string("Visited").style(headerCenterStyle);
          ws.cell(sheetRow,3).string("Pending").style(headerCenterStyle);
          ws.cell(sheetRow,4).string("Total").style(headerCenterStyle);
          ws.cell(sheetRow,5).string("Progress").style(headerCenterStyle);
          sheetRow++;

          for(i in data) {

           var obj = data[i];
           ws.cell(sheetRow,1).string(obj['inspectorName']).style(normalCenterStyle);
           ws.cell(sheetRow,2).number(obj['visited']).style(normalCenterStyle);
           ws.cell(sheetRow,3).number(obj['pending']).style(normalCenterStyle);
           ws.cell(sheetRow,4).number(obj['total']).style(normalCenterStyle);
           ws.cell(sheetRow,5).string(obj['progress']+"%").style(normalCenterStyle);
           sheetRow++;
         }
         ws.column(1).setWidth(25);
         ws.column(2).setWidth(15);
         ws.column(3).setWidth(15);
         ws.column(4).setWidth(15);
         ws.column(5).setWidth(15);
       }


       wb.write(xlsxFileName, function (err, stats) {
        if (err) {
          console.error(err);
        }

        var fileName = "";
        if(reportType=="VisitPlans") {
          fileName = 'Inspection_VisitPlans_'+(CountyService.formateDate())+".xlsx";
        } else {
          fileName = 'Inspector_Progress_'+(CountyService.formateDate())+".xlsx";
        }
        var readStream = fs.createReadStream(xlsxFileName);
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
        res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        readStream.pipe(res);
        readStream.on('end', function(){
          fs.unlink(xlsxFileName, function(err){
            if (err) throw err;
            console.log(" deleted");
          });
        });
      });
     },

     getVisitPlanFigureData:function(req,res){

       var county = req.param("county");

       var mongo = require('mongodb');
       var collection = MongoService.getDB().collection('facility');
       var conditionString={};
       if(county!="All"){
         conditionString. _county=county;
       }

       var cursor = collection.aggregate([
        {$match:conditionString},
        { $group:{_id:{ year:{ "$substr": [ "$p_date", 0, 4 ] },
        month:{ "$substr": [ "$p_date", 5, 2 ] },
        status:"$m_insp_completed"},count:{$sum:1}}}]);

       cursor.toArray(function(err, result) {

        var cursor1 = collection.aggregate(
          [{
           $group:
           {
             _id: null,

             lastUpdateDate: { $max: "$updatedAt" }
           }
         }]
         );

        cursor1.toArray(function(err, updateDate) {

          console.log(updateDate);
          var year,nextYear;
          var date=new Date();

          if(date.getMonth()<9 && date.getMonth()>=0){

           year= (new Date().getFullYear()-1).toString();
           nextYear=(new Date().getFullYear()).toString();
         }else{
           year= new Date().getFullYear().toString();
           nextYear=(new Date().getFullYear()+1).toString();
         }

         var inspWave=CountyService.getInspectionWave();
         var currentWave=inspWave.currentWave;

         var monthArr=[]

         /*if(currentWave==1){

          monthArr=[{year:year,month:"11"},{year:year,month:"12"},
          {year:nextYear,month:"01"}];

        }else if(currentWave==2){

         monthArr=[{year:year,month:"11"},{year:year,month:"12"},
         {year:nextYear,month:"01"},{year:nextYear,month:"02"},{year:nextYear,month:"03"},
         {year:nextYear,month:"04"}];

       }else if(currentWave==3){

        monthArr=[{year:year,month:"11"},{year:year,month:"12"},
        {year:nextYear,month:"01"},{year:nextYear,month:"02"},{year:nextYear,month:"03"},
        {year:nextYear,month:"04"},{year:nextYear,month:"05"},{year:nextYear,month:"06"},
        {year:nextYear,month:"07"}];

      }else if(currentWave==4){

        monthArr=[{year:year,month:"11"},{year:year,month:"12"},
        {year:nextYear,month:"01"},{year:nextYear,month:"02"},{year:nextYear,month:"03"},
        {year:nextYear,month:"04"},{year:nextYear,month:"05"},{year:nextYear,month:"06"},
        {year:nextYear,month:"07"},{year:nextYear,month:"08"},{year:nextYear,month:"09"},
        {year:nextYear,month:"10"}];
      } 
      */
      if(currentWave==1){

        monthArr=[{year:year,month:"11"},{year:year,month:"12"},
        {year:nextYear,month:"01"},{year:nextYear,month:"02"}];

      }else if(currentWave==2){

       monthArr=[{year:year,month:"11"},{year:year,month:"12"},
       {year:nextYear,month:"01"},{year:nextYear,month:"02"},{year:nextYear,month:"03"},
       {year:nextYear,month:"04"},{year:nextYear,month:"05"},{year:nextYear,month:"06"}];

     }else if(currentWave==3){

      monthArr=[{year:year,month:"11"},{year:year,month:"12"},
      {year:nextYear,month:"01"},{year:nextYear,month:"02"},{year:nextYear,month:"03"},
      {year:nextYear,month:"04"},{year:nextYear,month:"05"},{year:nextYear,month:"06"},
      {year:nextYear,month:"07"},{year:nextYear,month:"08"},{year:nextYear,month:"09"},
      {year:nextYear,month:"10"}];

    }
    var dt_year=new Date().getFullYear();

    var insp_conducted=[];
    var insp_projected=[];

    for(var j=0;j<monthArr.length;j++){

      var projected=0;
      var flag=0;
      var flag1=0;

      for(var i=0;i<result.length;i++){

        if(result[i]._id.month==monthArr[j].month && result[i]._id.year==monthArr[j].year){

         projected=projected+result[i].count;
         flag=1;

         if(result[i]._id.status=="Yes"){
           flag1=1;
           insp_conducted.push(result[i].count);
         }
       }
     }

    if(flag==1){
      insp_projected.push(projected);
    }else{
      insp_projected.push(0);
    }
    if(flag1==0){
      insp_conducted.push(0);
    }
  }
  var updateDate;
  if(updateDate[0]!=undefined){
   updateDate= updateDate[0].lastUpdateDate;
 }else{
   updateDate= "";
 }
 console.log(updateDate);
 res.json({insp_conducted:insp_conducted,insp_projected:insp_projected,updateDate:updateDate})
});
      });
     }

   }
