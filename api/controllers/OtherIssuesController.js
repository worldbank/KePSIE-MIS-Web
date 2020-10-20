/**
 * OtherIssuesController
 *
 * @description : Server-side logic for Other Issues
 * @author : Jay Pastagia
 */

 module.exports = {

 	otherIssue: function (req, res) { 

    var loggedInUser=req.session.loggedInUser;

    var issueReportUser= [
 'Admin','MOH Coordinator','WB -Supervisors',
  'WB - Research team','Inspector'];

    if(issueReportUser.indexOf(loggedInUser.role)!=-1){
      var conditionObject={
        m_insp_completed:"Yes",
        is_deleted: false      
      };

      if(loggedInUser.role=='Inspector'){
        conditionObject._county=loggedInUser.county
      }

      Facility.find(conditionObject,{_hfid:1}).sort({_hfid:1}).exec(
      function(err, facilityList) {

        res.view('reports/otherIssue',{facilityId:facilityList});
      });

      }else{
        res.view('reports/otherIssueSummary');

      }
    },

    summary: function (req, res) { 
     res.view('reports/otherIssueSummary');
   },

   otherIssueSubmit:function(req,res){

     var issue=req.body;


     console.log("report issue here");
     console.log(issue);


     issue.inspectorId=req.session.loggedInUser.inspectorId;
     issue.inspectorName=req.session.loggedInUser.name;
     //issue.county=req.session.loggedInUser.county;
     issue.is_deleted=false;
     OtherIssues.create(issue,function issueCreated(err,issue){

      res.json(issue);


    });

   },
   checkId:function(req,res){

     Facility.find({_hfid:req.body.facilityId,'is_deleted': false}).exec(function(err, facility) {

      return res.json(facility);     
    });
   },
   otherIssuesList:function(req,res){

     var countyName=CountyService.getCounty(req.param("county"));

     var inspectorId= req.param("inspId");
     var inspName=req.param("inspName");
     
     var collection = MongoService.getDB().collection('otherissues'); 
     var cursor;

     if(countyName=="All" && inspectorId=="All") {  
      cursor = collection.find({ is_deleted:false});
    } else if(countyName=="All") {
      cursor = collection.find({inspectorId:inspectorId,is_deleted:false});
    } else if(inspectorId=="All") {
      cursor = collection.find({ county:countyName, is_deleted:false });
    } else {
      cursor = collection.find({county:countyName,inspectorId:inspectorId,is_deleted:false});
    }

    cursor.toArray(function (err, result) {

      var data=result;

      var xl = require('excel4node');
      var wb = new xl.Workbook();
      var ws;

      ws = wb.addWorksheet('Other Issues');

      var http = require('http');
      var fs = require('fs');
      var xlsxFileName = ".tmp/excelFile_"+new Date()+".xlsx";
      var sheetRow = 1;

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

      var pngFileName1 = "/assets/images/moh_logo.png";
       //  sheetRow++;
       ws.row(sheetRow).setHeight(70);

        ws.row(sheetRow).setHeight(70);

        ws.cell(sheetRow,1,sheetRow++,6,true).string('KePSIE Monitoring System, Ministry of Health')
                .style({alignment : {horizontal:['center'],vertical:['center']}, font: {color: 'black',size: 13,bold: true}});
      
       ws.cell(sheetRow,1,sheetRow++,6,true).string('Other Issues')
       .style({alignment : {horizontal:['center']}, font: {color: 'white',size: 13,bold: true}, fill: {
        type: "pattern",
        patternType : "solid",
        fgColor: "#31708f",
        bgColor: "#31708f"
      }});
       ws.cell(sheetRow,1,sheetRow++,6,true).string(' County: '+countyName+' | Inspector: '+inspName)
       .style({alignment : {horizontal:['center']}, font: {color: 'white',size: 12,bold: true},
        fill: {
          type: "pattern",
          patternType : "solid",
          fgColor: "#31708f",
          bgColor: "#31708f"
        }});


       ws.cell(sheetRow,1).string("Facility ID").style(headerCenterStyle);
       ws.cell(sheetRow,2).string("Facility Name").style(headerCenterStyle);
       ws.cell(sheetRow,3).string("County").style(headerCenterStyle);
       ws.cell(sheetRow,4).string("Issue").style(headerCenterStyle);
       ws.cell(sheetRow,5).string("Comment").style(headerCenterStyle);
       ws.cell(sheetRow,6).string("Inspector Name").style(headerCenterStyle);


       sheetRow++;

       var data=result;

       for(i in data) {

        var obj = data[i];

        ws.cell(sheetRow,1).string(obj['facilityId']).style(normalCenterStyle);

        ws.cell(sheetRow,2).string(obj['_hfname']).style(normalCenterStyle);

        ws.cell(sheetRow,3).string(obj['county']).style(normalCenterStyle);

        ws.cell(sheetRow,4).string(obj['ms_issue']).style(normalCenterStyle);

        ws.cell(sheetRow,5).string(obj['ms_issue_comment']).style(normalCenterStyle);
        
        ws.cell(sheetRow,6).string(obj['inspectorName']).style(normalCenterStyle);

        sheetRow++;
      }
      ws.column(1).setWidth(15);
      ws.column(2).setWidth(15);
      ws.column(3).setWidth(15);
      ws.column(4).setWidth(15);
      ws.column(5).setWidth(20);
      ws.column(6).setWidth(15);

      setTimeout(sendExcelFile,1000); 

      function sendExcelFile() {
        wb.write(xlsxFileName, function (err, stats) {
          if (err) {
            console.error(err);
          }

          var fileName = "";

          fileName = 'Other_Issues_'+(CountyService.formateDate())+".xlsx";

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
  }
};

