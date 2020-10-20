/**
* Facility Closure Controller
*
* @description :: Server-side logic for managing FacilityClosure
* @author : Jay Pastagia
*/

var nodemailer = require('nodemailer');

module.exports = {

//New Closure Tab Start

closureTable : function(req, res) {
  res.view('reports/facilityClosureTable');
},
closureFigure : function(req, res) {
  res.view('reports/facilityClosureFigure');
},
exportExcel : function(req,res) {
  var status = req.param("status");
  var county = req.param("county");
  var authority = req.param("authority");
  console.log(status+"-----"+county+"-------"+authority);
      var header = [
                    {type:"number",key:"_hfid",title:"HF KePSIE ID"},
                    {type:"number",key:"_mfl",title:"HF MFL Number (If Available)"},
                    {type:"string",key:"_county",title:"HF County"},
                    {type:"string",key:"_hfname",title:"HF Name"},
                    {type:"string",key:"_ownership",title:"HF Ownership"},
                    {type:"string",key:"cr_level",title:"Non-Compliant Facility / Department"},
                    {type:"string",key:"cr_level_authority",title:"Regulatory Authority of Non-Compliant Facility / Department"},
                    //{type:"string",key:"cr_issues",title:"Issues Found (Which Are Ground for Closure)"},
                    //{type:"string",key:"cr_closegrace",title:"Inspection Result"},
                    //{type:"date",key:"cr_grace_enddate",title:"End of Grace Period (If Inspection Result is Given Grace Period)"},
                    {type:"string",key:"cr_pending",title:"Any Issues Found Currently Pending"},
                    
                    {type:"string",key:"cr_status_current",title:"Current Status"},
                    {type:"string",key:"cr_history",title:"History of Actions"},
                    {type:"string",key:"cr_comments",title:"Comments"},
                    //{type:"date",key:"_date",title:"Date of Inspection"},
                    //{type:"string",key:"_inspectorname",title:"Name of Inspector"},
                    {type:"string",key:"_owner_name",title:"HF Owner Name"},
                    {type:"string",key:"_owner_designation",title:"HF Owner Designation"},
                    {type:"number",key:"_owner_number",title:"HF Owner Phone Number"},
                    {type:"string",key:"_owner_email",title:"HF Owner Email"},
                    {type:"string",key:"_subcounty",title:"HF Subcounty"},
                    {type:"string",key:"p_nearest_market",title:"HF Nearest Market"},
                    {type:"number",key:"p_latitude",title:"HF Latitude"},
                    {type:"number",key:"p_longitude",title:"HF Longitude"},
                  ];
var condObj = { is_deleted:false};
 
if(county!="All"){
  condObj._county=CountyService.getCounty(county);
}

 Facility.find(condObj).exec(function(err,facilityList){
    var exportList = [];
    for (var i = 0; i < facilityList.length; i++) {
      var data = facilityList[i];

      for (var j = 1; j < 6; j++) {
        if(data["cr_pending"+j] != undefined && (status=="All" || data["cr_pending"+j]==status) 
          && (authority=="All" || data["cr_level_authority"+j]==authority || data["cr_level_authority"+j]=="Unknown")){
          var obj={
                    _hfid:data["_hfid"],
                    _mfl:data["_mfl"],
                    _county:data["_county"],
                    _hfname:data["_hfname"],
                    _ownership:data["_ownership"],
                    cr_level:data["cr_level"+j],
                    cr_level_authority:data["cr_level_authority"+j],
                    cr_pending:data["cr_pending"+j],
                    //cr_issues:data["cr_issues"+j],
                    //cr_closegrace:data["cr_closegrace"+j],
                    //cr_grace_enddate:data["cr_grace_enddate"+j],
                    cr_status_current:data["cr_status_current"+j],
                    cr_history:data["cr_history"+j],
                    cr_comments:data["cr_comments"+j],
                    //_date:data["_date"],
                    //_inspectorname:data["_inspectorname"],
                    _owner_name:data["s1a_3a"],
                    _owner_designation:data["s1a_3c"],
                    _owner_number:data["s1a_3d"],
                    _owner_email:data["s1a_3e"],
                    _subcounty:data["_subcounty"],
                    p_nearest_market:data["p_nearest_market"],
                    p_latitude:data["p_latitude"],
                    p_longitude:data["p_longitude"]
                  };
                  exportList.push(obj);        
                }
              }
            }

var xl = require('excel4node');
var wb = new xl.Workbook();
var ws;

ws = wb.addWorksheet('Closure');

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
            horizontal:['center'],
            wrapText:true
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
        ws.cell(sheetRow,1,sheetRow++,19,true).string('KePSIE Monitoring System, Ministry of Health')
        .style({alignment : {horizontal:['center'],vertical:['center']}, font: {color: 'black',size: 13,bold: true}});

        ws.cell(sheetRow,1,sheetRow++,19,true).string('List of Facilities and Departments Currently Reported for Closure or Given Grace Period')
        .style({alignment : {horizontal:['center']}, font: {color: 'white',size: 13,bold: true}, fill: {
          type: "pattern",
          patternType : "solid",
          fgColor: "#31708f",
          bgColor: "#31708f"
        }});
        ws.cell(sheetRow,1,sheetRow++,19,true).string(' County: '+county+' | Authority: '+authority+' | Status: '+status+' ')
        .style({alignment : {horizontal:['center']}, font: {color: 'white',size: 12,bold: true}, fill: {
          type: "pattern",
          patternType : "solid",
          fgColor: "#31708f",
          bgColor: "#31708f"
        }});

        for (var i = 0; i < header.length; i++) {
          ws.cell(sheetRow,i+1).string(header[i].title).style(headerCenterStyle);
          ws.column(i+1).setWidth(25);
        }
        ws.row(sheetRow).filter({});
        sheetRow++;

        for (var e in exportList) {
          for (var h = 0; h < header.length; h++) {
              var field = header[h].key;
              var type = header[h].type;
            if(exportList[e][field]!=undefined && type=="string"){
              ws.cell(sheetRow,h+1).string(exportList[e][field]+"").style(normalCenterStyle);
            }else if(exportList[e][field]!=undefined && type=="number" && parseFloat(exportList[e][field]) ){
              ws.cell(sheetRow,h+1).number(parseFloat(exportList[e][field])).style(normalCenterStyle);
            }else if(exportList[e][field]!=undefined && type=="date" ){
              ws.cell(sheetRow,h+1).date(exportList[e][field]).style(normalCenterStyle);
            }
          }
          sheetRow++;
        }
      
        setTimeout(sendExcelFile,1000);

        function sendExcelFile() {
          wb.write(xlsxFileName, function (err, stats) {
            if (err) {
              console.error(err);
            }

            var fileName = "";

            fileName = 'Closure_Report_'+(CountyService.formateDate())+".xlsx";

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
getGraceRenewData:function(req,res) {
  console.log("getGraceRenewData--------------------test here");
  var county = req.param("county");
  var ownership = req.param("ownership");
  var level = req.param("level");
  console.log(county+"--------"+ownership+"--------"+level);
  InspectionDataService.getGracePeriodRenewData(county,ownership,level,function(scoreByDept) {
    var gracePeriodRenew=[{
      name: 'To be checked after grace period',
      data: scoreByDept.dataArrayLicenses,
      color: '#34a4da'
    },{
      name: 'Found valid after grace period',
      data: scoreByDept.dataArrayRenewed,
      color: '#ed7d31'
    }, {
      name: 'Found invalid after grace period',
      data: scoreByDept.dataArrayInvalid,
      color: '#a4a4a4'
    }];
     return res.json({'gracePeriodRenew':gracePeriodRenew});
  });

},
getClosureStatus:function(req,res) {
  var county = req.param("county");
  var ownership = req.param("ownership");
  var level = req.param("level");
  InspectionDataService.closureStatus(county,ownership,level,function(closureReqStatics,closureStatics){
  var data1=[];
  data1.push(closureReqStatics.facility);
  data1.push(closureReqStatics.Laboratory);
  data1.push(closureReqStatics.Pharmacy);
  data1.push(closureReqStatics.Radiology);
  data1.push(closureReqStatics.Nutrition);

  var data2=[];
  data2.push(closureStatics.facilityClosed);
  data2.push(closureStatics.Laboratory);
  data2.push(closureStatics.Pharmacy);
  data2.push(closureStatics.Radiology);
  data2.push(closureStatics.Nutrition);

  

    var closureData=[{
      name: 'Closure requests',
      data: data1,
      color: '#34a4da'
    },{
      name: 'Physically closed',
      data: data2,
      color: '#ed7d31'
    }];
     return res.json({'closureData':closureData});
  })
}
//New Closure Tab End
}

function formatDate(date){
  var month = date.getMonth() + 1;
  var dt=date.getDate();
  return (dt > 9 ? dt : "0" + dt) + "/" + (month > 9 ? month : "0" + month) + "/" + date.getFullYear();
}