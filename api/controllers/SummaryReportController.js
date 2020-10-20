/**
 * SummaryReportController
 * 
 * @description : Server-side logic for managing the summary reports/figures/map
 * @author : Abhishek Upadhyay, Jay Pastagia
 */

var async = require('async');
module.exports = {

    getFilterValues: function(req, res) {
        var loggedInUser = req.session.loggedInUser;
        var countyList = CountyService.getCountiesInFigures();
        res.send({
            countyList: countyList
        });
    },

    summaryReportTable: function(req, res) {
        res.view('reports/summaryReportTable');
    },

    summaryReportFigure: function(req, res) {
        res.view('reports/summaryReportFigure');
    },

    summaryReportMap: function(req, res) {
        res.view('reports/summaryReportMap', { data: "hello" });
    },

    exportFigureAsPDF: function(req, res) {
        // prepare html
        var logourl = sails.config.logoURL;
        var sectionHTML = req.param("reportHTML");


        var html = "<html><head><link rel='icon' href='/wb-favicon.png'/><title>KePSIE | PDF</title><style>.ng-hide{display:none;} ";

        html = html + "</style></head><body style='color: #333333; font-family:\"Open Sans, sans-serif !important\";font-size:13px'>";
        html = html + '<center><img src=' + logourl + ' width="100px" height="100px"></center><br/>' + sectionHTML;
        html = html + "</body></html>";

        var jsreport = require('jsreport');
        var footerHTML = "<center><font style='color:rgba(105, 120, 130, 0.8);font-size:9px;font-family:\"Open Sans, sans-serif\"' id='pageNumber' name='{#pageNum}'>{#pageNum} of {#numPages}</font></center>";

        jsreport.render({
            template: {
                content: html,
                recipe: "phantom-pdf",
                engine: "handlebars",
                phantom: {
                    format: 'A3',
                    orientation: "portrait",
                }
            },
        }).then(function(out) {
            setTimeout(function() {
                res.setHeader('Content-disposition', 'attachment; filename=summary_jhic_figure_' + (CountyService.formateDate()) + '.pdf');
                out.stream.pipe(res);
            }, 2000);

        }).catch(function(e) {
            console.log("end pdf figures");
            res.end(e.message);
        });
    },


    exportTableAsPDF: function(req, res) {

        var logourl = sails.config.logoURL;
        var unit = req.param("unit");
        var facilityType = req.param("facilityType");
        var county = req.param("selectedCounty");
        // prepare html
        var html = "<html><head><link rel='icon' href='/wb-favicon.png'/><title>KePSIE | PDF</title><style> ";
        html = html + "#summaryReportDiv {padding: 10px} .centerCell{text-align:center} table {border:0px solid #e7ecf1; border-collapse: collapse;}.header1 a {font-size: 13px;background-color: #31708f;color: white;padding: 5px 5px 4px 5px;text-decoration: none;display: block;font-weight: bold;}.header1 {margin-bottom: 10px;font-size: 12px;background-color: #31708f;color: white;padding: 3px;border-radius: 5px 5px 0 0!important;width:100%}.table thead tr th {font-size: 13px;font-weight: bold;padding: 6px;border: 1px solid #e7ecf1;} .table tfoot tr th {font-size: 13px;font-weight: bold;padding: 6px;border: 1px solid #e7ecf1;} table tbody tr td {padding: 4px;line-height: 1.42857;vertical-align: top;} td{font-size:12px} th{font-size:12px}.pageOneMain {height: 100%;display: table;}.pageOneWrapper {display: table-cell;height: 100%;vertical-align: middle;}.pageOneH1 {text-align: center;color : #31708f;}.pageOneH3 {text-align: center;color : #31708f;}";
        html = html + "thead {display: table-row-group;} tfoot {display: table-row-group;} .countyHeader {margin-bottom:0px; float: left;padding: 7px;background-color: rgb(49, 112, 143);color: white;padding-left: 10px;padding-right: 25px;border-radius: 5px 5px 0px 0px !important;display: none;margin-top: 10px;}";
        html = html + "table{margin:auto} table td{border:1px solid #e7ecf1;font-size: 12px} .countyHeader{float:left;font-size: 13px;margin-right: 30%; display: block;}</style></head><body style='font-family:\"Open Sans, sans-serif\"'>"
        html = html + '<center><img src=' + logourl + ' width="80px" height="80px"></center><div class="header1"><a class="secLink" href="javascript:void(0)">Summary JHIC Reports - Tables </a></div>';
        html = html + "<table style='width:98%'><tr><td> Unit: " + unit + "</td> <td> Facility type: " + facilityType + " </td><td>  County: " + county + " </td></tr></table>";
        html = html + req.param("tableHTML");
        html = html + "</body></html>";

        // phantom JS code
        var jsreport = require('jsreport');
        jsreport.render({
            template: {
                content: html,
                recipe: "phantom-pdf",
                engine: "handlebars",
                phantom: {
                    orientation: "landscape"
                }
            },
        }).then(function(out) {
            res.setHeader('Content-disposition', 'attachment; filename=' + req.__("summary_jhic_table_filename") + "_" + (CountyService.formateDate()) + '.pdf');
            out.stream.pipe(res);
        }).catch(function(e) {
            res.end(e.message);
        });
    },


    exportTableAsEXCEL: function(req, res) {

        var unit = req.param("unit");
        var facilityType = req.param("facilityType");
        var county = req.param("selectedCounty");


        var datastr = req.param("tableHTML");

        var dataJson = JSON.parse(datastr);


        var xl = require('excel4node');
        var wb = new xl.Workbook();
        var ws;

        ws = wb.addWorksheet('Summary_JHIC_Report_Table');

        var http = require('http');
        var fs = require('fs');
        var xlsxFileName = ".tmp/excelFile_" + new Date() + ".xlsx";
        var sheetRow = 1;

        // styles
        var normalCenterStyle = wb.createStyle({
            alignment: {
                vertical: ['center'],
                horizontal: ['center']
            },
            font: {
                color: 'black',
                size: 11,
            },
            wrapText: true
        });
        var normalCenterStyle1 = wb.createStyle({
            alignment: {
                vertical: ['center'],
                horizontal: ['center']
            },
            font: {
                color: 'black',
                size: 11,
            },
            wrapText: true,
            numberFormat: '#%'
        });
        var normalLeftStyle = wb.createStyle({
            alignment: {
                vertical: ['center'],
                horizontal: ['left']
            },
            font: {
                color: 'black',
                size: 11,
            },
            wrapText: true
        });
        var noteStyle = wb.createStyle({
            alignment: {
                vertical: ['center'],
                horizontal: ['center']
            },
            font: {
                color: 'black',
                size: 9,
            },
            wrapText: true
        });
        var headerCenterStyle = wb.createStyle({
            alignment: {
                vertical: ['center'],
                horizontal: ['center']
            },
            font: {
                color: 'black',
                size: 11,
                bold: true,
            }
        });
        var headerCenterStyle1 = wb.createStyle({
            alignment: {
                vertical: ['center'],
                horizontal: ['center']
            },
            font: {
                color: 'black',
                size: 11,
                bold: true,
            },
            numberFormat: '#%'
        });
        var pngFileName1 = "/assets/images/moh_logo.png";
        // sheetRow++;
        ws.row(sheetRow).setHeight(70);

        var headerLength = dataJson["excelData"][0]["subHeaderData"].length + 1;

        ws.cell(sheetRow, 1, sheetRow++, headerLength, true).string('KePSIE Monitoring System, Ministry of Health')
            .style({ alignment: { horizontal: ['center'], vertical: ['center'] }, font: { color: 'black', size: 13, bold: true } });


        ws.cell(sheetRow, 1, sheetRow++, headerLength, true).string('Summary JHIC Reports - Tables')
            .style({
                alignment: { horizontal: ['center'] },
                font: { color: 'white', size: 13, bold: true },
                fill: {
                    type: "pattern",
                    patternType: "solid",
                    fgColor: "#31708f",
                    bgColor: "#31708f"
                }
            });
        ws.cell(sheetRow, 1, sheetRow++, headerLength, true).string(' Unit: ' + unit + ' | Facility Type: ' + facilityType + ' | County: ' + county)
            .style({
                alignment: { horizontal: ['center'] },
                font: { color: 'white', size: 12, bold: true },
                fill: {
                    type: "pattern",
                    patternType: "solid",
                    fgColor: "#31708f",
                    bgColor: "#31708f"
                }
            });
        ws.cell(sheetRow, 1, sheetRow++, headerLength, true).string('JHIC Results')
            .style({
                alignment: { horizontal: ['center'] },
                font: { size: 12, bold: true },
                patternType: "solid"

            });

        var countyArr = ["All", "Kakamega", "Kilifi", "Meru"];

        if (county == "By County" && (facilityType == "By Level" || facilityType == "By Ownership")) {
            sheetRow++;
            sheetRow++;
        }

        for (var t = 0; t < dataJson["excelData"].length; t++) {

            var table1 = dataJson["excelData"][t];
            console.log(table1);

            if (county == "By County" && (facilityType == "By Level" || facilityType == "By Ownership")) {

                ws.cell(sheetRow, 1, sheetRow++, 1, true).string('County: ' + countyArr[t])
                    .style({
                        alignment: { horizontal: ['center'] },
                        font: { color: 'white', size: 12, bold: true },
                        fill: {
                            type: "pattern",
                            patternType: "solid",
                            fgColor: "#31708f",
                            bgColor: "#31708f"
                        }
                    });
            }

            ws.cell(sheetRow, 1, sheetRow + 1, 1, true).string("Section").style(headerCenterStyle);
            for (var i = 0, j = 0; i < table1["headerData"].length; i++, j++) {

                ws.cell(sheetRow, j + 2, sheetRow, j + 3, true).string(table1["headerData"][i]["title"])
                    .style(headerCenterStyle);
                j++;
            }
            sheetRow++;

            for (var i = 0; i < table1["subHeaderData"].length; i++) {
                ws.cell(sheetRow, i + 2).string(table1["subHeaderData"][i]["title"]).style(headerCenterStyle);
            }

            sheetRow++;

            var data = table1["summaryData"]

            for (i in data) {

                var rowSummaryData = data[i];
                var cellValue = "";
                ws.cell(sheetRow, 1).string(rowSummaryData[0]).style(normalLeftStyle);

                for (var j = 1; j < rowSummaryData.length; j++) {
                    var value = rowSummaryData[j];
                    if (value.indexOf("%") == -1) {
                        if (!isNaN(value)) {
                            cellValue = Math.round(value);
                            ws.cell(sheetRow, j + 1).number(cellValue).style(normalCenterStyle);
                        }
                    } else {
                        var score = value.split("%");
                        if (!isNaN(score[0])) {
                            cellValue = Math.round(score[0]) / 100;
                            ws.cell(sheetRow, j + 1).number(cellValue).style(normalCenterStyle1);
                        }
                    }
                }
                sheetRow++;
            }

            var footdata = table1["footData"]

            ws.cell(sheetRow, 1).string("Mean Score").style(headerCenterStyle);

            if (footdata) {

                for (var i = 0; i < footdata.length; i++) {

                    var rowfootData = footdata[i];
                    var value = rowfootData.score;
                    var cellValue = "";

                    if (value.indexOf("%") == -1) {
                        if (!isNaN(value)) {
                            cellValue = Math.round(value);
                            ws.cell(sheetRow, i + 2).number(cellValue).style(headerCenterStyle);
                        }
                    } else {
                        var score = value.split("%");
                        if (!isNaN(score[0])) {
                            cellValue = Math.round(score[0]) / 100;
                            ws.cell(sheetRow, i + 2).number(cellValue).style(headerCenterStyle1);
                        }
                    }
                }
            }
            sheetRow++;
            ws.cell(sheetRow, 1, sheetRow++, headerLength, true).string("Note: N/A is used to indicate when information is not available, because health facilities inspected may not have that particular unit/service.").style(noteStyle);
            sheetRow++;
            sheetRow++;
        }


        ws.column(1).setWidth(50);

        setTimeout(sendExcelFile, 1000);

        function sendExcelFile() {
            wb.write(xlsxFileName, function(err, stats) {
                if (err) {
                    console.error(err);
                }

                var fileName = "";

                fileName = "Summary_JHIC_Reports_Table_" + CountyService.formateDate() + ".xlsx";

                var readStream = fs.createReadStream(xlsxFileName);
                res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
                res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                readStream.pipe(res);
                readStream.on('end', function() {
                    fs.unlink(xlsxFileName, function(err) {
                        if (err) throw err;
                        console.log('successfully deleted ');
                    });
                });
            });

        }

    },

    exportMapAsKML: function(req, res) {



        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');

        var cursor = collection.aggregate([

            {
                $group: {
                    _id: "$_hfid",
                    inspection: { $max: "$p_insp_number" },
                    _hfid: { $last: '$_hfid' },
                    risk_c: { $last: '$risk_c' },
                    _hfname: { $last: '$_hfname' },
                    _inspectorid: { $last: '$_inspectorid' },
                    _inspectorname: { $last: '$_inspectorname' },
                    _date: { $last: '$_date' },
                    _county: { $last: '$_county' },
                    _subcounty: { $last: '$_subcounty' },
                    _level: { $last: '$_level' },
                    _ownership: { $last: '$_ownership' },
                    p_location: { $last: '$p_location' },
                    p_latitude: { $last: '$p_latitude' },
                    p_longitude: { $last: '$p_longitude' },
                    total_ps: { $last: '$total_ps' },
                    p_market_size: { $last: '$p_market_size' }
                }
            },
            {
                $project: {
                    inspection: 1,
                    "_hfid": 1,
                    "_hfname": 1,
                    "_inspectorid": 1,
                    "_inspectorname": 1,
                    "_date": 1,
                    "_county": 1,
                    "_subcounty": 1,
                    "_level": 1,
                    "_ownership": 1,
                    "p_location": 1,
                    "p_latitude": 1,
                    "p_longitude": 1,
                    "risk_c": 1,
                    "total_ps": 1,
                    "p_market_size": 1
                }
            }
        ]);


        cursor.toArray(function(err, result) {

            facilities = result;


            for (var i = 0; i < result.length; i++) {
                result[i]._county = CountyService.getCountyNumber(result[i]._county);

                result[i]._level = CountyService.getLevelNumber(result[i]._level);

            }
            // get data from request
            var county = req.param("county");
            var ownership = req.param("ownership");
            var level = req.param("level");

            // prepare xml string
            var fs = require('fs');
            var content = '<?xml version="1.0" encoding="UTF-8"?>';
            content = content + '<kml xmlns="http://www.opengis.net/kml/2.2">';
            content = content + '<Document>';
            content = content + '<name>Summary Checklist Report</name>';
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
                if ((county == "All" || county == facilities[i]._county) &&
                    (ownership == "all" || ownership == facilities[i]._ownership) &&
                    (level == "all" || level == facilities[i]._level)) {
                    content = content + '<Placemark>';
                    content = content + '<name>' + facilities[i]._hfid + '</name>';
                    content = content + '<description>';
                    content = content + 'Latitude : ' + facilities[i].p_latitude + '\n';
                    content = content + 'Longitude : ' + facilities[i].p_longitude + '\n';
                    content = content + 'HF Name : ' + facilities[i]._hfname + '\n';
                    content = content + 'Sub County : ' + facilities[i]._subcounty + '\n';
                    content = content + 'Location : ' + facilities[i].p_location + '\n';
                    content = content + 'Level : ' + facilities[i]._level + '\n';
                    content = content + 'Ownership : ' + facilities[i]._ownership + '\n';
                    content = content + 'Market Size : ' + facilities[i].p_market_size + '\n';
                    content = content + 'Patients Month : ' + facilities[i].patientsMonth + '\n';
                    content = content + 'Total PS : ' + facilities[i].total_ps + '\n';
                    content = content + 'riskC : ' + facilities[i].risk_c + '\n';
                    content = content + 'Third : ' + facilities[i].third + '\n';
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
            var fileName = req.__("summary_jhic_map_filename") + (CountyService.formateDate()) + ".kml"
            var filePath = ".tmp/" + fileName;
            var fd = fs.openSync(filePath, 'w');

            // send the .kml file to view
            fs.writeFile(filePath, content, function(err) {
                if (err) {
                    return console.log(err);
                }
                var readStream = fs.createReadStream(filePath);
                res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
                res.setHeader('Content-type', 'text/kml');
                readStream.pipe(res);
                readStream.on('end', function() {
                    fs.unlink(filePath, function(err) {
                        if (err) throw err;
                        console.log('successfully deleted ');
                    });
                });
            });
        });
    },

    getTableDataByFilter: function(req, res) {

        // get data from request
        var hfUnit = req.param("hfUnit");
        var hfType = req.param("hfType");
        var hfRegion = req.param("hfRegion");

        var headerData = [];
        var summaryData = [];
        var subHeaderData = [];
        var footData = [];
        var SummaryReportResponse = [];


        // prepare data to sbe sent to view
        headerData.splice(0, headerData.length);
        subHeaderData.splice(0, subHeaderData.length);
        summaryData.splice(0, summaryData.length);

        xAxisArray = CountyService.getAll();
        InspectionDataService.getJHICsectionScore(hfType, hfRegion, function(result) {


            if (hfType == "All") {

                if (hfRegion == "By County") {


                    var counties = sails.config.counties;

                    headerData.push({ title: "All" });

                    for (i = 0; i < counties.length; i++) {
                        headerData.push({ title: counties[i] });
                    }

                    InspectionDataService.getJHICsectionScoreForAll(hfType, hfRegion, function(resp) {


                        /* dynamic data start */

                        var index1, index2, index3;
                        for (var i = 0; i < result.length; i++) {

                            if (result[i]._id == "Kakamega") {
                                index1 = i;
                            } else if (result[i]._id == "Kilifi") {
                                index2 = i;
                            } else if (result[i]._id == "Meru") {
                                index3 = i;
                            }
                        }

                        if (index1 == undefined) {
                            var index1Arr = {
                                os2: 0,
                                ms2: "N/A",
                                os3: 0,
                                ms3: "N/A",
                                os4: 0,
                                ms4: "N/A",
                                os5: 0,
                                ms5: "N/A",
                                os6: 0,
                                ms6: "N/A",
                                os7: 0,
                                ms7: "N/A",
                                os8: 0,
                                ms8: "N/A",
                                os9: 0,
                                ms9: "N/A",
                                os10: 0,
                                ms10: "N/A",
                                os11: 0,
                                ms11: "N/A",
                                os12: 0,
                                ms12: "N/A",
                                os13: 0,
                                ms13: "N/A",
                                mean_os: 0,
                                mean_ms: "N/A"
                            };

                            result["Kakamega"] = index1Arr;
                            index1 = "Kakamega";
                        }
                        if (index2 == undefined) {
                            var index2Arr = {
                                os2: 0,
                                ms2: "N/A",
                                os3: 0,
                                ms3: "N/A",
                                os4: 0,
                                ms4: "N/A",
                                os5: 0,
                                ms5: "N/A",
                                os6: 0,
                                ms6: "N/A",
                                os7: 0,
                                ms7: "N/A",
                                os8: 0,
                                ms8: "N/A",
                                os9: 0,
                                ms9: "N/A",
                                os10: 0,
                                ms10: "N/A",
                                os11: 0,
                                ms11: "N/A",
                                os12: 0,
                                ms12: "N/A",
                                os13: 0,
                                ms13: "N/A",
                                mean_os: 0,
                                mean_ms: "N/A"
                            };

                            result["Kilifi"] = index2Arr;
                            index2 = "Kilifi";
                        }
                        if (index3 == undefined) {
                            var index3Arr = {
                                os2: 0,
                                ms2: "N/A",
                                os3: 0,
                                ms3: "N/A",
                                os4: 0,
                                ms4: "N/A",
                                os5: 0,
                                ms5: "N/A",
                                os6: 0,
                                ms6: "N/A",
                                os7: 0,
                                ms7: "N/A",
                                os8: 0,
                                ms8: "N/A",
                                os9: 0,
                                ms9: "N/A",
                                os10: 0,
                                ms10: "N/A",
                                os11: 0,
                                ms11: "N/A",
                                os12: 0,
                                ms12: "N/A",
                                os13: 0,
                                ms13: "N/A",
                                mean_os: 0,
                                mean_ms: "N/A"
                            };

                            result["Meru"] = index3Arr;
                            index3 = "Meru";
                        }


                        subHeaderData.push({ title: "Observations" }, { title: "Mean" }, { title: "Observations" }, { title: "Mean" }, { title: "Observations" }, { title: "Mean" }, { title: "Observations" }, { title: "Mean" });
                        summaryData.push(
                            [req.__("s2"), String(resp[0].os2), String(resp[0].ms2) + "%", String(result[index1].os2), String(result[index1].ms2) + "%", String(result[index2].os2), String(result[index2].ms2) + "%", String(result[index3].os2), String(result[index3].ms2) + "%"],

                            [req.__("s3"), String(resp[0].os3), String(resp[0].ms3) + "%", String(result[index1].os3), String(result[index1].ms3) + "%", String(result[index2].os3), String(result[index2].ms3) + "%", String(result[index3].os3), String(result[index3].ms3) + "%"],

                            [req.__("s4"), String(resp[0].os4), String(resp[0].ms4) + "%", String(result[index1].os4), String(result[index1].ms4) + "%", String(result[index2].os4), String(result[index2].ms4) + "%", String(result[index3].os4), String(result[index3].ms4) + "%"],

                            [req.__("s5"), String(resp[0].os5), String(resp[0].ms5) + "%", String(result[index1].os5), String(result[index1].ms5) + "%", String(result[index2].os5), String(result[index2].ms5) + "%", String(result[index3].os5), String(result[index3].ms5) + "%"],

                            [req.__("s6"), String(resp[0].os6), String(resp[0].ms6) + "%", String(result[index1].os6), String(result[index1].ms6) + "%", String(result[index2].os6), String(result[index2].ms6) + "%", String(result[index3].os6), String(result[index3].ms6) + "%"],

                            [req.__("s7"), String(resp[0].os7), String(resp[0].ms7) + "%", String(result[index1].os7), String(result[index1].ms7) + "%", String(result[index2].os7), String(result[index2].ms7) + "%", String(result[index3].os7), String(result[index3].ms7) + "%"],

                            [req.__("s8"), String(resp[0].os8), String(resp[0].ms8) + "%", String(result[index1].os8), String(result[index1].ms8) + "%", String(result[index2].os8), String(result[index2].ms8) + "%", String(result[index3].os8), String(result[index3].ms8) + "%"],

                            [req.__("s9"), String(resp[0].os9), String(resp[0].ms9) + "%", String(result[index1].os9), String(result[index1].ms9) + "%", String(result[index2].os9), String(result[index2].ms9) + "%", String(result[index3].os9), String(result[index3].ms9) + "%"],

                            [req.__("s10"), String(resp[0].os10), String(resp[0].ms10) + "%", String(result[index1].os10), String(result[index1].ms10) + "%", String(result[index2].os10), String(result[index2].ms10) + "%", String(result[index3].os10), String(result[index3].ms10) + "%"],

                            [req.__("s11"), String(resp[0].os11), String(resp[0].ms11) + "%", String(result[index1].os11), String(result[index1].ms11) + "%", String(result[index2].os11), String(result[index2].ms11) + "%", String(result[index3].os11), String(result[index3].ms11) + "%"],

                            [req.__("s12"), String(resp[0].os12), String(resp[0].ms12) + "%", String(result[index1].os12), String(result[index1].ms12) + "%", String(result[index2].os12), String(result[index2].ms12) + "%", String(result[index3].os12), String(result[index3].ms12) + "%"],

                            [req.__("s13"), String(resp[0].os13), String(resp[0].ms13) + "%", String(result[index1].os13), String(result[index1].ms13) + "%", String(result[index2].os13), String(result[index2].ms13) + "%", String(result[index3].os13), String(result[index3].ms13) + "%"]);

                        footData.push({ score: String(resp[0].mean_os) }, { score: "" + String(resp[0].mean_ms) + "%" }, { score: String(result[index1].mean_os) }, { score: "" + String(result[index1].mean_ms) + "%" },

                            { score: String(result[index2].mean_os) }, { score: "" + String(result[index2].mean_ms) + "%" }, { score: String(result[index3].mean_os) }, { score: "" + String(result[index3].mean_ms) + "%" });

                        SummaryReportResponse.push({
                            headerData: headerData,
                            subHeaderData: subHeaderData,
                            summaryData: summaryData,
                            footData: footData
                        });

                        res.send({

                            SummaryReportResponse: SummaryReportResponse
                        });
                    });


                } else {

                    if (hfRegion == "All") {
                        headerData.push({ title: "All" });

                    } else if (hfRegion == "1") {
                        headerData.push({ title: "Kakamega" });
                    } else if (hfRegion == "2") {
                        headerData.push({ title: "Kilifi" });
                    } else if (hfRegion == "3") {
                        headerData.push({ title: "Meru" });
                    }
                    var index;
                    if (hfRegion == "All") {
                        index = 0;
                    } else {
                        for (var i = 0; i < result.length; i++) {

                            if (CountyService.getCounty(hfRegion) == result[i]._id) {
                                index = i;
                            }
                        }

                        if (index == undefined) {
                            var indexArr = {
                                os2: 0,
                                ms2: "N/A",
                                os3: 0,
                                ms3: "N/A",
                                os4: 0,
                                ms4: "N/A",
                                os5: 0,
                                ms5: "N/A",
                                os6: 0,
                                ms6: "N/A",
                                os7: 0,
                                ms7: "N/A",
                                os8: 0,
                                ms8: "N/A",
                                os9: 0,
                                ms9: "N/A",
                                os10: 0,
                                ms10: "N/A",
                                os11: 0,
                                ms11: "N/A",
                                os12: 0,
                                ms12: "N/A",
                                os13: 0,
                                ms13: "N/A",
                                mean_os: 0,
                                mean_ms: "N/A"
                            };

                            result["County"] = indexArr;
                            index = "County";
                        }
                    }

                    // dynamic data for table start

                    if (result != undefined && result[index] != undefined) {

                        subHeaderData.push({ title: "Observations" }, { title: "Mean" });
                        summaryData.push(
                            [req.__("s2"), String(result[index].os2), String(result[index].ms2) + "%"], [req.__("s3"), String(result[index].os3), String(result[index].ms3) + "%"], [req.__("s4"), String(result[index].os4), String(result[index].ms4) + "%"], [req.__("s5"), String(result[index].os5), String(result[index].ms5) + "%"], [req.__("s6"), String(result[index].os6), String(result[index].ms6) + "%"], [req.__("s7"), String(result[index].os7), String(result[index].ms7) + "%"], [req.__("s8"), String(result[index].os8), String(result[index].ms8) + "%"], [req.__("s9"), String(result[index].os9), String(result[index].ms9) + "%"], [req.__("s10"), String(result[index].os10), String(result[index].ms10) + "%"], [req.__("s11"), String(result[index].os11), String(result[index].ms11) + "%"], [req.__("s12"), String(result[index].os12), String(result[index].ms12) + "%"], [req.__("s13"), String(result[index].os13), String(result[index].ms13) + "%"]);
                        footData.push({ score: String(result[index].mean_os) }, { score: "" + String(result[index].mean_ms) + "%" });

                    }


                    SummaryReportResponse.push({
                        headerData: headerData,
                        subHeaderData: subHeaderData,
                        summaryData: summaryData,
                        footData: footData
                    });

                    res.send({

                        SummaryReportResponse: SummaryReportResponse
                    });

                }

            } else if (hfType == "3") {

                InspectionDataService.getJHICsectionScoreForAll(hfType, hfRegion, function(resp) {

                    headerData.push({ title: "All" });
                    headerData.push({ title: "Public" });
                    headerData.push({ title: "Private" });
                    if (hfRegion == "All") {
                        var index1, index2, index;
                        for (var i = 0; i < result.length; i++) {

                            if (result[i]._id == "Public") {
                                index1 = i;
                            } else if (result[i]._id == "Private") {
                                index2 = i;
                            }
                        }
                        if (resp.length > 0) {
                            index = 0;
                        }
                        var tableBody = InspectionDataService.prepareTableDataByOwnerShip(req, index1, index2, result, resp, index, sendResponse);

                        function sendResponse(tableBody) {
                            SummaryReportResponse.push(tableBody);

                        }
                        res.send({
                            SummaryReportResponse: SummaryReportResponse
                        });
                    } else if (hfRegion == "1") {
                        var index1, index2, index;

                        for (var i = 0; i < result.length; i++) {

                            if (result[i]._id.county == "Kakamega") {
                                if (result[i]._id.ownership == "Public") {
                                    index1 = i;
                                } else if (result[i]._id.ownership == "Private") {
                                    index2 = i;
                                }
                            }
                        }
                        if (resp.length > 0) {
                            if (resp[0]._id == "Kakamega") {
                                index = 0;
                            }
                        }
                        var tableBody = InspectionDataService.prepareTableDataByOwnerShip(req, index1, index2, result, resp, index, sendResponse);

                        function sendResponse(tableBody) {
                            SummaryReportResponse.push(tableBody);

                        }
                        res.send({

                            SummaryReportResponse: SummaryReportResponse
                        });
                    } else if (hfRegion == "2") {
                        var index1, index2, index;
                        for (var i = 0; i < result.length; i++) {
                            if (result[i]._id.county == "Kilifi") {
                                if (result[i]._id.ownership == "Public") {
                                    index1 = i;
                                } else if (result[i]._id.ownership == "Private") {
                                    index2 = i;
                                }
                            }
                        }
                        if (resp.length > 0) {
                            if (resp[0]._id == "Kilifi") {
                                index = 0;
                            }
                        }
                        var tableBody = InspectionDataService.prepareTableDataByOwnerShip(req, index1, index2, result, resp, index, sendResponse);

                        function sendResponse(tableBody) {
                            SummaryReportResponse.push(tableBody);

                        }
                        res.send({

                            SummaryReportResponse: SummaryReportResponse
                        });
                    } else if (hfRegion == "3") {
                        var index1, index2, index;
                        for (var i = 0; i < result.length; i++) {
                            if (result[i]._id.county == "Meru") {
                                if (result[i]._id.ownership == "Public") {
                                    index1 = i;
                                } else if (result[i]._id.ownership == "Private") {
                                    index2 = i;
                                }
                            }
                        }
                        if (resp.length > 0) {
                            if (resp[0]._id == "Meru") {
                                index = 0;
                            }
                        }
                        var tableBody = InspectionDataService.prepareTableDataByOwnerShip(req, index1, index2, result, resp, index, sendResponse);

                        function sendResponse(tableBody) {
                            SummaryReportResponse.push(tableBody);

                        }
                        res.send({

                            SummaryReportResponse: SummaryReportResponse
                        });
                    } else if (hfRegion == "By County") {

                        var index1, index2, index;

                        InspectionDataService.getJHICsectionScore("3", "All", function(resultAll) {

                            for (var i = 0; i < resultAll.length; i++) {

                                if (resultAll[i]._id == "Public") {
                                    index1 = i;
                                } else if (resultAll[i]._id == "Private") {
                                    index2 = i;
                                }
                            }
                            InspectionDataService.getJHICsectionScore("All", "All", function(result1) {

                                if (result1.length > 0) {
                                    index = 0;
                                }
                                var data = InspectionDataService.prepareTableDataByOwnerShip(req, index1, index2, resultAll, result1, index, temp);

                                function temp(tableBody) {
                                    SummaryReportResponse.push(tableBody);
                                }

                                index1 = index2 = index = undefined;
                                for (var i = 0; i < result.length; i++) {

                                    if (result[i]._id.county == "Kakamega") {
                                        if (result[i]._id.ownership == "Public") {
                                            index1 = i;
                                        } else if (result[i]._id.ownership == "Private") {
                                            index2 = i;
                                        }
                                    }
                                }

                                for (var i = 0; i < resp.length; i++) {

                                    if (resp[i]._id == "Kakamega") {
                                        index = i;

                                    }
                                }

                                var tableBody1 = InspectionDataService.prepareTableDataByOwnerShip(req, index1, index2, result, resp, index, sendResponse1);

                                function sendResponse1(tableBody) {

                                    SummaryReportResponse.push(tableBody);

                                }

                                index1 = index2 = index = undefined;

                                for (var i = 0; i < result.length; i++) {

                                    if (result[i]._id.county == "Kilifi") {
                                        if (result[i]._id.ownership == "Public") {
                                            index1 = i;
                                        } else if (result[i]._id.ownership == "Private") {
                                            index2 = i;
                                        }
                                    }
                                }

                                for (var i = 0; i < resp.length; i++) {
                                    if (resp[i]._id == "Kilifi") {
                                        index = i;
                                    }
                                }

                                var tableBody2 = InspectionDataService.prepareTableDataByOwnerShip(req, index1, index2, result, resp, index, sendResponse2);

                                function sendResponse2(tableBody) {
                                    SummaryReportResponse.push(tableBody);
                                }


                                index1 = index2 = index = undefined;
                                for (var i = 0; i < result.length; i++) {
                                    if (result[i]._id.county == "Meru") {
                                        if (result[i]._id.ownership == "Public") {
                                            index1 = i;
                                        } else if (result[i]._id.ownership == "Private") {
                                            index2 = i;
                                        }
                                    }
                                }

                                for (var i = 0; i < resp.length; i++) {
                                    if (resp[i]._id == "Meru") {
                                        index = i;
                                    }
                                }

                                var tableBody3 = InspectionDataService.prepareTableDataByOwnerShip(req, index1, index2, result, resp, index, sendResponse3);

                                function sendResponse3(tableBody) {
                                    SummaryReportResponse.push(tableBody);
                                }

                                res.send({
                                    SummaryReportResponse: SummaryReportResponse
                                });
                            });
                        });


                    }

                });


            } else if (hfType == "2") {

                InspectionDataService.getJHICsectionScoreForAll(hfType, hfRegion, function(resp) {


                    headerData.push({ title: "All" });
                    headerData.push({ title: "Level 2" });
                    headerData.push({ title: "Level 3" });
                    headerData.push({ title: "Level 4 & 5" });
                    // headerData.push({title: "Level 5"});
                    if (hfRegion == "All") {
                        var index1, index2, index3, index4, index;
                        for (var i = 0; i < result.length; i++) {

                            if ("Level 2" == result[i]._id) {
                                index1 = i;
                            } else if ("Level 3" == result[i]._id) {
                                index2 = i;
                            } else if ("Level 4" == result[i]._id) {
                                index3 = i;
                            } else if ("Level 5" == result[i]._id) {
                                index4 = i;
                            }
                        }
                        if (resp.length > 0) {
                            index = 0;
                        }
                        var tableBody = InspectionDataService.prepareTabledata(req, index1, index2, index3, index4, result, resp, index, sendResponse);

                        function sendResponse(tableBody) {
                            SummaryReportResponse.push(tableBody);
                        }

                        res.send({

                            SummaryReportResponse: SummaryReportResponse
                        });
                    } else if (hfRegion == "1") {
                        var index1, index2, index3, index4, index;

                        for (var i = 0; i < result.length; i++) {

                            if (result[i]._id.county == "Kakamega") {
                                if (result[i]._id.level == "Level 2") {
                                    index1 = i;
                                } else if (result[i]._id.level == "Level 3") {
                                    index2 = i;
                                } else if (result[i]._id.level == "Level 4") {
                                    index3 = i;
                                } else if (result[i]._id.level == "Level 5") {
                                    index4 = i;
                                }
                            }
                        }

                        if (resp.length > 0) {
                            if (resp[0]._id == "Kakamega") {
                                index = 0;
                            }
                        }
                        var tableBody = InspectionDataService.prepareTabledata(req, index1, index2, index3, index4, result, resp, index, sendResponse);

                        function sendResponse(tableBody) {
                            SummaryReportResponse.push(tableBody);
                        }

                        res.send({
                            SummaryReportResponse: SummaryReportResponse
                        });

                    } else if (hfRegion == "2") {
                        var index1, index2, index3, index4, index;
                        for (var i = 0; i < result.length; i++) {
                            if (result[i]._id.county == "Kilifi") {
                                if (result[i]._id.level == "Level 2") {
                                    index1 = i;
                                } else if (result[i]._id.level == "Level 3") {
                                    index2 = i;
                                } else if (result[i]._id.level == "Level 4") {
                                    index3 = i;
                                } else if (result[i]._id.level == "Level 5") {
                                    index4 = i;
                                }
                            }
                        }
                        if (resp.length > 0) {
                            if (resp[0]._id == "Kilifi") {
                                index = 0;
                            }
                        }
                        var tableBody = InspectionDataService.prepareTabledata(req, index1, index2, index3, index4, result, resp, index, sendResponse);

                        function sendResponse(tableBody) {

                            SummaryReportResponse.push(tableBody);

                        }
                        res.send({

                            SummaryReportResponse: SummaryReportResponse
                        });
                    } else if (hfRegion == "3") {
                        var index1, index2, index3, index4, index;
                        for (var i = 0; i < result.length; i++) {
                            if (result[i]._id.county == "Meru") {
                                if (result[i]._id.level == "Level 2") {
                                    index1 = i;
                                } else if (result[i]._id.level == "Level 3") {
                                    index2 = i;
                                } else if (result[i]._id.level == "Level 4") {
                                    index3 = i;
                                } else if (result[i]._id.level == "Level 5") {
                                    index4 = i;
                                }
                            }
                        }
                        if (resp.length > 0) {
                            if (resp[0]._id == "Meru") {
                                index = 0;
                            }
                        }
                        var tableBody = InspectionDataService.prepareTabledata(req, index1, index2, index3, index4, result, resp, index, sendResponse);

                        function sendResponse(tableBody) {

                            SummaryReportResponse.push(tableBody);

                        }
                        res.send({

                            SummaryReportResponse: SummaryReportResponse
                        });
                    } else if (hfRegion == "By County") {

                        var index1, index2, index3, index4, index;

                        InspectionDataService.getJHICsectionScore("2", "All", function(resultAll) {


                            for (var i = 0; i < resultAll.length; i++) {

                                if ("Level 2" == resultAll[i]._id) {
                                    index1 = i;
                                } else if ("Level 3" == resultAll[i]._id) {
                                    index2 = i;
                                } else if ("Level 4" == resultAll[i]._id) {
                                    index3 = i;
                                } else if ("Level 5" == resultAll[i]._id) {
                                    index4 = i;
                                }
                            }
                            InspectionDataService.getJHICsectionScore("All", "All", function(result1) {

                                if (result1.length > 0) {
                                    index = 0;
                                }

                                var data = InspectionDataService.prepareTabledata(req, index1, index2, index3, index4, resultAll, result1, index, temp);

                                function temp(tableBody) {
                                    SummaryReportResponse.push(tableBody);
                                }

                                index1 = index2 = index3 = index4 = index = undefined;

                                for (var i = 0; i < result.length; i++) {

                                    if (result[i]._id.county == "Kakamega") {
                                        if (result[i]._id.level == "Level 2") {
                                            index1 = i;
                                        } else if (result[i]._id.level == "Level 3") {
                                            index2 = i;
                                        } else if (result[i]._id.level == "Level 4") {
                                            index3 = i;
                                        } else if (result[i]._id.level == "Level 5") {
                                            index4 = i;
                                        }
                                    }
                                }

                                for (var i = 0; i < resp.length; i++) {
                                    if (resp[i]._id == "Kakamega") {
                                        index = i;
                                    }
                                }

                                var tableBody1 = InspectionDataService.prepareTabledata(req, index1, index2, index3, index4, result, resp, index, sendResponse1);

                                function sendResponse1(tableBody) {

                                    SummaryReportResponse.push(tableBody);

                                }

                                index1 = index2 = index3 = index4 = index = undefined;
                                for (var i = 0; i < result.length; i++) {

                                    if (result[i]._id.county == "Kilifi") {
                                        if (result[i]._id.level == "Level 2") {
                                            index1 = i;
                                        } else if (result[i]._id.level == "Level 3") {
                                            index2 = i;
                                        } else if (result[i]._id.level == "Level 4") {
                                            index3 = i;
                                        } else if (result[i]._id.level == "Level 5") {
                                            index4 = i;
                                        }
                                    }
                                }

                                for (var i = 0; i < resp.length; i++) {

                                    if (resp[i]._id == "Kilifi") {
                                        index = i;

                                    }
                                }


                                var tableBody2 = InspectionDataService.prepareTabledata(req, index1, index2, index3, index4, result, resp, index, sendResponse2);

                                function sendResponse2(tableBody) {
                                    SummaryReportResponse.push(tableBody);
                                }


                                index1 = index2 = index3 = index4 = index = undefined;
                                for (var i = 0; i < result.length; i++) {
                                    if (result[i]._id.county == "Meru") {
                                        if (result[i]._id.level == "Level 2") {
                                            index1 = i;
                                        } else if (result[i]._id.level == "Level 3") {
                                            index2 = i;
                                        } else if (result[i]._id.level == "Level 4") {
                                            index3 = i;
                                        } else if (result[i]._id.level == "Level 5") {
                                            index4 = i;
                                        }
                                    }
                                }

                                for (var i = 0; i < resp.length; i++) {

                                    if (resp[i]._id == "Meru") {
                                        index = i;
                                        console.log("inddd   :" + index);
                                    }
                                }

                                var tableBody3 = InspectionDataService.prepareTabledata(req, index1, index2, index3, index4, result, resp, index, sendResponse3);

                                function sendResponse3(tableBody) {

                                    SummaryReportResponse.push(tableBody);
                                    console.log("push4");

                                }

                                res.send({

                                    SummaryReportResponse: SummaryReportResponse
                                });


                            });
                        });

                    }

                });

            } else {
                headerData.push({ title: "All" });

                var index;
                if (hfRegion == "All") {
                    index = 0;
                } else {
                    for (var i = 0; i < result.length; i++) {
                        console.log("result id:  " + result[i]._id);
                        if (hfRegion == result[i]._id) {
                            index = i;
                        }
                    }

                }

                // dynamic data for table start
                if (index == undefined) {
                    var indexArr = {
                        os2: 0,
                        ms2: "N/A",
                        os3: 0,
                        ms3: "N/A",
                        os4: 0,
                        ms4: "N/A",
                        os5: 0,
                        ms5: "N/A",
                        os6: 0,
                        ms6: "N/A",
                        os7: 0,
                        ms7: "N/A",
                        os8: 0,
                        ms8: "N/A",
                        os9: 0,
                        ms9: "N/A",
                        os10: 0,
                        ms10: "N/A",
                        os11: 0,
                        ms11: "N/A",
                        os12: 0,
                        ms12: "N/A",
                        os13: 0,
                        ms13: "N/A",
                        mean_os: 0,
                        mean_ms: "N/A"
                    };

                    result["County"] = indexArr;
                    index = "County";
                }

                subHeaderData.push({ title: "Observation" }, { title: "Mean" });
                summaryData.push(
                    [req.__("s2"), String(result[index].os2), String(result[index].ms2) + "%"], [req.__("s3"), String(result[index].os3), String(result[index].ms3) + "%"], [req.__("s4"), String(result[index].os4), String(result[index].ms4) + "%"], [req.__("s5"), String(result[index].os5), String(result[index].ms5) + "%"], [req.__("s6"), String(result[index].os6), String(result[index].ms6) + "%"], [req.__("s7"), String(result[index].os7), String(result[index].ms7) + "%"], [req.__("s8"), String(result[index].os8), String(result[index].ms8) + "%"], [req.__("s9"), String(result[index].os9), String(result[index].ms9) + "%"], [req.__("s10"), String(result[index].os10), String(result[index].ms10) + "%"], [req.__("s11"), String(result[index].os11), String(result[index].ms11) + "%"], [req.__("s12"), String(result[index].os12), String(result[index].ms12) + "%"], [req.__("s13"), String(result[index].os13), String(result[index].ms13) + "%"]);
                footData.push({ score: String(result[index].mean_os) }, { score: "" + String(result[index].mean_ms) + "%" });

                SummaryReportResponse.push({
                    headerData: headerData,
                    subHeaderData: subHeaderData,
                    summaryData: summaryData,
                    footData: footData
                });

                res.send({

                    SummaryReportResponse: SummaryReportResponse
                });
            }

        });

    },

    getFigureDataByFilter: function(req, res) {

        // get data from request
        var series = req.param("series");
        var hfType = req.param("hfType");
        var county = req.param("county");
        var unit = req.param("unit");

        var xAxisArray = [];
        var seriesArray = [];
        var drilldownArray = [];
        var patternPath = sails.config.assetURL + '/images/';
        var index0, index1, index2, index3, index4;
        var val0, val1, val2, val3, val4;
        var dataArray = [];
        var mydata = [];
        // mayur
        console.log("county " + county);
        if (series == 1 && county != "By County" && (hfType == 2 || hfType == 3)) {
            console.log("mayur code execute");

            xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];

            if (hfType == 2) {

                InspectionDataService.getDataByLevel(hfType, county, function(result) {
                    console.log("back");
                    console.log(result);


                    var total_facility = 200;


                    xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];

                    var seriesArray2 = [{ name: 'Level 2 (N=' + result[0].count + ')', data: result[0].array, color: 'rgba(49, 112, 143,1)' }];
                    var seriesArray3 = [{ name: 'Level 3 (N=' + result[1].count + ')', data: result[1].array, color: 'rgba(49, 112, 143,1)' }];
                    var seriesArray4 = [{ name: 'Level 4 & 5 (N=' + result[2].count + ')', data: result[2].array, color: 'rgba(49, 112, 143,1)' }];
                    var seriesArrayAll = [{ name: 'All Levels (N=' + result[3].count + ')', data: result[3].array, color: 'rgba(49, 112, 143,1)' }];

                    seriesArray.push(seriesArray2);
                    seriesArray.push(seriesArray3);
                    seriesArray.push(seriesArray4);
                    seriesArray.push(seriesArrayAll);
                    sendResponse(xAxisArray, seriesArray);
                });



            } else {

                InspectionDataService.getDataByOwnership(hfType, county, function(result) {
                    console.log("back");
                    console.log(result);


                    var total_facility = 200;


                    xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];

                    var seriesArray2 = [{ name: 'Public (N=' + result[0].count + ')', data: result[0].array, color: 'rgba(49, 112, 143,1)' }];
                    var seriesArray3 = [{ name: 'Private (N=' + result[1].count + ')', data: result[1].array, color: 'rgba(49, 112, 143,1)' }];
                    var seriesArrayAll = [{ name: 'All Ownerships (N=' + result[2].count + ')', data: result[2].array, color: 'rgba(49, 112, 143,1)' }];

                    seriesArray.push(seriesArray2);
                    seriesArray.push(seriesArray3);
                    seriesArray.push(seriesArrayAll);

                    sendResponse(xAxisArray, seriesArray);
                });

            }


        } else if (series == 1 && county == "By County" && (hfType == 2 || hfType == 3)) {
            console.log("mayur code execute");

            var mySeriesArray = [];


            xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];

            if (hfType == 2) {
                // mayur
                var listofCounties = ["All", "1", "2", "3"];
                async.eachSeries(listofCounties, function(mycounty, callback) {


                    console.log('Processing county ' + mycounty);

                    InspectionDataService.getDataByLevel(hfType, mycounty, function(result) {
                        console.log("back");
                        console.log(result);


                        var total_facility = 200;

                        var seriesArray2 = [{ name: 'Level 2 (N=' + result[0].count + ')', data: result[0].array, color: 'rgba(49, 112, 143,1)' }];
                        var seriesArray3 = [{ name: 'Level 3 (N=' + result[1].count + ')', data: result[1].array, color: 'rgba(49, 112, 143,1)' }];
                        var seriesArray4 = [{ name: 'Level 4 & 5 (N=' + result[2].count + ')', data: result[2].array, color: 'rgba(49, 112, 143,1)' }];
                        var seriesArrayAll = [{ name: 'All Levels (N=' + result[3].count + ')', data: result[3].array, color: 'rgba(49, 112, 143,1)' }];

                        mySeriesArray.push(seriesArray2);
                        mySeriesArray.push(seriesArray3);
                        mySeriesArray.push(seriesArray4);
                        mySeriesArray.push(seriesArrayAll);
                        console.log('county processed' + mycounty);
                        callback();
                    });
                    // Do work to process file here



                }, function(err) {
                    // if any of the file processing produced an error, err would equal that
                    // error
                    if (err) {
                        // One of the iterations produced an error.
                        // All processing will now stop.
                        console.log('A model failed to process');
                    } else {
                        xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];
                        sendResponse(xAxisArray, mySeriesArray);

                    }
                });

            } else {

                var mySeriesArray = [];


                xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];

                if (hfType == 3) {
                    // mayur
                    console.log('Processing county Ownership ');
                    var listofCounties = ["All", "1", "2", "3"];
                    async.eachSeries(listofCounties, function(mycounty, callback) {
                        console.log('Processing county ' + mycounty);
                        InspectionDataService.getDataByOwnership(hfType, mycounty, function(result) {
                            console.log("back");
                            console.log(result);

                            var total_facility = 200;

                            var seriesArray2 = [{ name: 'Public (N=' + result[0].count + ')', data: result[0].array, color: 'rgba(49, 112, 143,1)' }];
                            var seriesArray3 = [{ name: 'Private (N=' + result[1].count + ')', data: result[1].array, color: 'rgba(49, 112, 143,1)' }];
                            var seriesArrayAll = [{ name: 'All Ownerships (N=' + result[2].count + ')', data: result[2].array, color: 'rgba(49, 112, 143,1)' }];

                            mySeriesArray.push(seriesArray2);
                            mySeriesArray.push(seriesArray3);
                            mySeriesArray.push(seriesArrayAll);
                            // mySeriesArray.push([]);
                            console.log('county processed' + mycounty);

                            callback();

                        });


                        // Do work to process file here


                    }, function(err) {
                        // if any of the file processing produced an error, err would equal that
                        // error
                        if (err) {
                            // One of the iterations produced an error.
                            // All processing will now stop.
                            console.log('A model failed to process');
                        } else {
                            xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];
                            sendResponse(xAxisArray, mySeriesArray);

                        }
                    });
                }


            }
        } else if (series == "1") {
            if (hfType == "1") {
                if (county == "All") {

                    var total_facility = 0;;

                    InspectionDataService.getPercentageOfFacilities(hfType, county, function(result) {


                        if (result != undefined) {
                            for (var i = 0; i < result.length; i++) {


                                total_facility += result[i].count;

                                if (result[i]._id == 'Non-Compliant') {
                                    index0 = i;
                                } else if (result[i]._id == 'Minimally Compliant') {
                                    index1 = i;
                                } else if (result[i]._id == 'Partially Compliant') {
                                    index2 = i;
                                } else if (result[i]._id == 'Substantially Compliant') {
                                    index3 = i;
                                } else if (result[i]._id == 'Fully Compliant') {
                                    index4 = i;
                                }
                            }

                        }
                        if (index0 != undefined) {
                            val0 = { y: result[index0].percentage, count: result[index0].count };
                        } else {
                            val0 = { y: 0, count: 0 };
                        }

                        if (index1 != undefined) {
                            val1 = { y: result[index1].percentage, count: result[index1].count };
                        } else {
                            val1 = { y: 0, count: 0 };
                        }
                        if (index2 != undefined) {
                            val2 = { y: result[index2].percentage, count: result[index2].count };
                        } else {
                            val2 = { y: 0, count: 0 };
                        }
                        if (index3 != undefined) {
                            val3 = { y: result[index3].percentage, count: result[index3].count };
                        } else {
                            val3 = { y: 0, count: 0 };
                        }
                        if (index4 != undefined) {
                            val4 = { y: result[index4].percentage, count: result[index4].count };

                        } else {
                            val4 = { y: 0, count: 0 };
                        }
                        dataArray.push(val0);
                        dataArray.push(val1);
                        dataArray.push(val2);
                        dataArray.push(val3);
                        dataArray.push(val4);

                        xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];
                        seriesArray = [{ name: '% of Facilities by Compliance Category (N=' + total_facility + ')', data: dataArray, color: 'rgba(49, 112, 143,1)' }];
                        sendResponse(xAxisArray, seriesArray);
                    });
                } else if (county == "By County") {

                    xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];

                    InspectionDataService.getPercentageOfFacilities(hfType, county, function(result) {


                        function getPercByCountyByRisk(county, risk) {
                            for (i in result) {
                                if (county == result[i]._id.county &&
                                    risk == result[i]._id.risk) {
                                    // return result[i].percentage;
                                    var data = { y: result[i].percentage, count: result[i].count };
                                    return data;
                                }
                            }
                            return { y: 0, count: 0 };
                        };


                        var total_facility_all = 0;

                        InspectionDataService.getPercentageOfFacilities("1", "All", function(result) {

                            for (var i = 0; i < result.length; i++) {


                                total_facility_all += result[i].count;


                                if (result[i]._id == 'Non-Compliant') {
                                    index0 = i;
                                } else if (result[i]._id == 'Minimally Compliant') {
                                    index1 = i;
                                } else if (result[i]._id == 'Partially Compliant') {
                                    index2 = i;
                                } else if (result[i]._id == 'Substantially Compliant') {
                                    index3 = i;
                                } else if (result[i]._id == 'Fully Compliant') {
                                    index4 = i;
                                }
                            }
                            if (index0 != undefined) {
                                val0 = { y: result[index0].percentage, count: result[index0].count };
                            } else {
                                val0 = { y: 0, count: 0 };
                            }

                            if (index1 != undefined) {
                                val1 = { y: result[index1].percentage, count: result[index1].count };
                            } else {
                                val1 = { y: 0, count: 0 };
                            }
                            if (index2 != undefined) {
                                val2 = { y: result[index2].percentage, count: result[index2].count };
                            } else {
                                val2 = { y: 0, count: 0 };
                            }
                            if (index3 != undefined) {
                                val3 = { y: result[index3].percentage, count: result[index3].count };
                            } else {
                                val3 = { y: 0, count: 0 };
                            }
                            if (index4 != undefined) {
                                val4 = { y: result[index4].percentage, count: result[index4].count };

                            } else {
                                val4 = { y: 0, count: 0 };
                            }

                            var seriesArrayAll = [{ name: '% of Facilities by Compliance Category (N=' + total_facility_all + ')', data: [val0, val1, val2, val3, val4], color: 'rgba(49, 112, 143,1)' }];

                            seriesArray.push(seriesArrayAll);

                            var county10 = getPercByCountyByRisk("Kakamega", 'Non-Compliant');

                            var county11 = getPercByCountyByRisk("Kakamega", 'Minimally Compliant');
                            var county12 = getPercByCountyByRisk("Kakamega", 'Partially Compliant');
                            var county13 = getPercByCountyByRisk("Kakamega", 'Substantially Compliant');
                            var county14 = getPercByCountyByRisk("Kakamega", 'Fully Compliant');
                            var county1null = getPercByCountyByRisk("Kakamega", null);

                            var total_facility_kakamega = county10.count + county11.count + county12.count + county13.count + county14.count + county1null.count;

                            if (total_facility_kakamega != 0) {

                                county10.y = (100 * county10.count) / total_facility_kakamega;
                                county11.y = (100 * county11.count) / total_facility_kakamega;
                                county12.y = (100 * county12.count) / total_facility_kakamega;
                                county13.y = (100 * county13.count) / total_facility_kakamega;
                                county14.y = (100 * county14.count) / total_facility_kakamega;

                            }

                            var seriesArrayKakamega = [{
                                name: '% of Facilities by Compliance Category (N=' + total_facility_kakamega + ')',
                                data: [county10, county11, county12, county13, county14],


                                color: "rgba(49, 112, 143,1)"
                            }];
                            seriesArray.push(seriesArrayKakamega);

                            var county20 = getPercByCountyByRisk("Kilifi", 'Non-Compliant');
                            var county21 = getPercByCountyByRisk("Kilifi", 'Minimally Compliant');
                            var county22 = getPercByCountyByRisk("Kilifi", 'Partially Compliant');
                            var county23 = getPercByCountyByRisk("Kilifi", 'Substantially Compliant');
                            var county24 = getPercByCountyByRisk("Kilifi", 'Fully Compliant');


                            var county2null = getPercByCountyByRisk("Kilifi", null);

                            var total_facility_kilifi = county20.count + county21.count + county22.count + county23.count + county24.count + county2null.count;

                            if (total_facility_kilifi != 0) {

                                county20.y = (100 * county20.count) / total_facility_kilifi;
                                county21.y = (100 * county21.count) / total_facility_kilifi;
                                county22.y = (100 * county22.count) / total_facility_kilifi;
                                county23.y = (100 * county23.count) / total_facility_kilifi;
                                county24.y = (100 * county24.count) / total_facility_kilifi;

                            }

                            var seriesArrayKilifi = [{
                                name: '% of Facilities by Compliance Category (N=' + total_facility_kilifi + ')',
                                data: [county20, county21, county22, county23, county24],


                                color: "rgba(49, 112, 143,1)"
                            }];
                            seriesArray.push(seriesArrayKilifi);

                            var county30 = getPercByCountyByRisk("Meru", 'Non-Compliant');
                            var county31 = getPercByCountyByRisk("Meru", 'Minimally Compliant');
                            var county32 = getPercByCountyByRisk("Meru", 'Partially Compliant');
                            var county33 = getPercByCountyByRisk("Meru", 'Substantially Compliant');
                            var county34 = getPercByCountyByRisk("Meru", 'Fully Compliant');


                            var county3null = getPercByCountyByRisk("Meru", null);

                            var total_facility_meru = county30.count + county31.count + county32.count + county33.count + county34.count + county3null.count;



                            if (total_facility_meru != 0) {

                                county30.y = (100 * county30.count) / total_facility_meru;
                                county31.y = (100 * county31.count) / total_facility_meru;
                                county32.y = (100 * county32.count) / total_facility_meru;
                                county33.y = (100 * county33.count) / total_facility_meru;
                                county34.y = (100 * county34.count) / total_facility_meru;

                            }

                            var seriesArrayMeru = [{
                                name: '% of Facilities by Compliance Category (N=' + total_facility_meru + ')',
                                data: [county30, county31, county32, county33, county34],


                                color: "rgba(49, 112, 143,1)"
                            }];
                            seriesArray.push(seriesArrayMeru);

                            sendResponse(xAxisArray, seriesArray);
                        });

                    });




                } else {

                    xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];
                    InspectionDataService.getPercentageOfFacilities(hfType, county, function(result) {

                        var countyName = CountyService.getCounty(county);
                        var total_facility_all = 0;

                        for (var i = 0; i < result.length; i++) {

                            if (result[i]._id.county == countyName) {

                                total_facility_all += result[i].count;

                                if (result[i]._id.risk == 'Non-Compliant') {
                                    index0 = i;
                                } else if (result[i]._id.risk == 'Minimally Compliant') {
                                    index1 = i;
                                } else if (result[i]._id.risk == 'Partially Compliant') {
                                    index2 = i;
                                } else if (result[i]._id.risk == 'Substantially Compliant') {
                                    index3 = i;
                                } else if (result[i]._id.risk == 'Fully Compliant') {
                                    index4 = i;
                                }
                            }
                        }

                        if (index0 != undefined) {
                            val0 = { y: result[index0].percentage, count: result[index0].count };
                        } else {
                            val0 = { y: 0, count: 0 };
                        }

                        if (index1 != undefined) {
                            val1 = { y: result[index1].percentage, count: result[index1].count };
                        } else {
                            val1 = { y: 0, count: 0 };
                        }
                        if (index2 != undefined) {
                            val2 = { y: result[index2].percentage, count: result[index2].count };
                        } else {
                            val2 = { y: 0, count: 0 };
                        }
                        if (index3 != undefined) {
                            val3 = { y: result[index3].percentage, count: result[index3].count };
                        } else {
                            val3 = { y: 0, count: 0 };
                        }
                        if (index4 != undefined) {
                            val4 = { y: result[index4].percentage, count: result[index4].count };

                        } else {
                            val4 = { y: 0, count: 0 };
                        }

                        var total0 = total_facility_all;


                        if (total0 != 0) {

                            val0.y = (100 * val0.count) / total0;
                            val1.y = (100 * val1.count) / total0;
                            val2.y = (100 * val2.count) / total0;
                            val3.y = (100 * val3.count) / total0;
                            val4.y = (100 * val4.count) / total0;

                        }

                        sendResponse(xAxisArray, [{ name: '% of Facilities by Compliance Category (N=' + total_facility_all + ')', data: [val0, val1, val2, val3, val4], color: 'rgba(49, 112, 143,1)' }])
                    });
                }



            } else if (hfType == "2") {
                if (county == "All") {
                    var finalResult = "";
                    console.log("in level");
                    InspectionDataService.getPercentageOfFacilities(hfType, county, function(result) {

                        var levels = CountyService.getLevelList();


                        function getPercByLevelByRisk(level, risk) {
                            for (i in result) {
                                if (level == result[i]._id.level &&
                                    risk == result[i]._id.risk) {
                                    var data = { y: result[i].percentage, count: result[i].count };
                                    return data;
                                }
                            }
                            return { y: 0, count: 0 };
                        };

                        var level20 = getPercByLevelByRisk("Level 2", 'Non-Compliant');
                        var level30 = getPercByLevelByRisk("Level 3", 'Non-Compliant');
                        var level40 = getPercByLevelByRisk("Level 4", 'Non-Compliant');
                        var level50 = getPercByLevelByRisk("Level 5", 'Non-Compliant');




                        var level21 = getPercByLevelByRisk("Level 2", 'Minimally Compliant');
                        var level31 = getPercByLevelByRisk("Level 3", 'Minimally Compliant');
                        var level41 = getPercByLevelByRisk("Level 4", 'Minimally Compliant');
                        var level51 = getPercByLevelByRisk("Level 5", 'Minimally Compliant');


                        var level22 = getPercByLevelByRisk("Level 2", 'Partially Compliant');
                        var level32 = getPercByLevelByRisk("Level 3", 'Partially Compliant');
                        var level42 = getPercByLevelByRisk("Level 4", 'Partially Compliant');
                        var level52 = getPercByLevelByRisk("Level 5", 'Partially Compliant');



                        var level23 = getPercByLevelByRisk("Level 2", 'Substantially Compliant');
                        var level33 = getPercByLevelByRisk("Level 3", 'Substantially Compliant');
                        var level43 = getPercByLevelByRisk("Level 4", 'Substantially Compliant');
                        var level53 = getPercByLevelByRisk("Level 5", 'Substantially Compliant');



                        var level24 = getPercByLevelByRisk("Level 2", 'Fully Compliant');
                        var level34 = getPercByLevelByRisk("Level 3", 'Fully Compliant');
                        var level44 = getPercByLevelByRisk("Level 4", 'Fully Compliant');
                        var level54 = getPercByLevelByRisk("Level 5", 'Fully Compliant');

                        var total0 = level20.y + level21.y + level22.y + level23.y + level24.y;

                        if (total0 != 0) {

                            level20.y = (100 * level20.y) / total0;
                            level21.y = (100 * level21.y) / total0;
                            level22.y = (100 * level22.y) / total0;
                            level23.y = (100 * level23.y) / total0;
                            level24.y = (100 * level24.y) / total0;

                        }

                        var total1 = level30.y + level31.y + level32.y + level33.y + level34.y;

                        if (total1 != 0) {

                            level30.y = (100 * level30.y) / total1;
                            level31.y = (100 * level31.y) / total1;
                            level32.y = (100 * level32.y) / total1;
                            level33.y = (100 * level33.y) / total1;
                            level34.y = (100 * level34.y) / total1;


                        }
                        var level40_50 = { y: 0, count: 0 };
                        var level41_51 = { y: 0, count: 0 };
                        var level42_52 = { y: 0, count: 0 };
                        var level43_53 = { y: 0, count: 0 };
                        var level44_54 = { y: 0, count: 0 };



                        var total2 = level40.y + level41.y + level42.y + level43.y + level44.y + level50.y + level51.y + level52.y + level53.y + level54.y;
                        if (total2 != 0) {
                            level40_50.y = (100 * (level40.y + level50.y)) / total2;
                            level41_51.y = (100 * (level41.y + level51.y)) / total2;
                            level42_52.y = (100 * (level42.y + level52.y)) / total2;
                            level43_53.y = (100 * (level43.y + level53.y)) / total2;
                            level44_54.y = (100 * (level44.y + level54.y)) / total2;
                        }
                        level40_50.count = level40.count + level50.count;
                        level41_51.count = level41.count + level51.count;
                        level42_52.count = level42.count + level52.count;
                        level43_53.count = level43.count + level53.count;
                        level44_54.count = level44.count + level54.count;





                        var c1 = [level20, level30, level40_50];
                        var c2 = [level21, level31, level41_51];
                        var c3 = [level22, level32, level42_52];
                        var c4 = [level23, level33, level43_53];
                        var c5 = [level24, level34, level44_54];




                        var total_facility_level2 = c1[0].count + c2[0].count + c3[0].count + c4[0].count + c5[0].count;
                        var total_facility_level3 = c1[1].count + c2[1].count + c3[1].count + c4[1].count + c5[1].count;
                        var total_facility_level4_5 = c1[2].count + c2[2].count + c3[2].count + c4[2].count + c5[2].count;

                        var xAxisArray = ['Level 2 <br> (N=' + total_facility_level2 + ')', 'Level 3 <br> (N=' + total_facility_level3 + ')', 'Level 4 & 5 <br> (N=' + total_facility_level4_5 + ')'];


                        var seriesArrayAllByLevel = [{
                            name: 'Non-Compliant',
                            data: c1,
                            color: 'rgba(49, 112, 143,1)'
                        }, {
                            name: 'Minimally Compliant',
                            data: c2,
                            color: 'rgba(49, 112, 143,0.75)'
                        }, {
                            name: 'Partially Compliant',
                            data: c3,
                            color: 'rgba(49, 112, 143,0.5)'
                        }, {
                            name: 'Substantially Compliant',
                            data: c4,
                            color: 'rgba(49, 112, 143,0.3)'
                        }, {
                            name: 'Fully Compliant',
                            data: c5,
                            color: 'rgba(49, 112, 143,0.3)'
                        }];

                        sendResponse(xAxisArray, seriesArrayAllByLevel)
                    });
                } else if (county == "By County") {

                    var xAxisArray = [];

                    InspectionDataService.getPercentageOfFacilities(hfType, county, function(result) {


                        InspectionDataService.formatDataForFigure("1", result, function(c1, c2, c3, c4, c5) {




                            var total_facility_level2 = c1[0].count + c2[0].count + c3[0].count + c4[0].count + c5[0].count;
                            var total_facility_level3 = c1[1].count + c2[1].count + c3[1].count + c4[1].count + c5[1].count;
                            var total_facility_level4_5 = c1[2].count + c2[2].count + c3[2].count + c4[2].count + c5[2].count;

                            var xAxisArrayKakamegaByLevel = ['Level 2 <br> (N=' + total_facility_level2 + ')', 'Level 3 <br> (N=' + total_facility_level3 + ')', 'Level 4 & 5 <br> (N=' + total_facility_level4_5 + ')'];

                            xAxisArray.push(xAxisArrayKakamegaByLevel);

                            var seriesArrayKakamegaByLevel = [{
                                name: 'Non-Compliant',
                                data: c1,
                                color: 'rgba(49, 112, 143,1)'
                            }, {
                                name: 'Minimally Compliant',
                                data: c2,
                                color: 'rgba(49, 112, 143,0.75)'
                            }, {
                                name: 'Partially Compliant',
                                data: c3,
                                color: 'rgba(49, 112, 143,0.5)'
                            }, {
                                name: 'Substantially Compliant',
                                data: c4,
                                color: 'rgba(49, 112, 143,0.3)'
                            }, {
                                name: 'Fully Compliant',
                                data: c5,
                                color: 'rgba(49, 112, 143,0.3)'
                            }];



                            seriesArray.push(seriesArrayKakamegaByLevel);
                            InspectionDataService.formatDataForFigure("2", result, function(c1, c2, c3, c4, c5) {



                                var total_facility_level2 = c1[0].count + c2[0].count + c3[0].count + c4[0].count + c5[0].count;
                                var total_facility_level3 = c1[1].count + c2[1].count + c3[1].count + c4[1].count + c5[1].count;
                                var total_facility_level4_5 = c1[2].count + c2[2].count + c3[2].count + c4[2].count + c5[2].count;

                                xAxisArrayKilifiByLevel = ['Level 2 <br> (N=' + total_facility_level2 + ')', 'Level 3 <br> (N=' + total_facility_level3 + ')', 'Level 4 & 5 <br> (N=' + total_facility_level4_5 + ')'];

                                xAxisArray.push(xAxisArrayKilifiByLevel);

                                var seriesArrayKilifiByLevel = [{
                                    name: 'Non-Compliant',
                                    data: c1,
                                    color: 'rgba(49, 112, 143,1)'
                                }, {
                                    name: 'Minimally Compliant',
                                    data: c2,
                                    color: 'rgba(49, 112, 143,0.75)'
                                }, {
                                    name: 'Partially Compliant',
                                    data: c3,
                                    color: 'rgba(49, 112, 143,0.5)'
                                }, {
                                    name: 'Substantially Compliant',
                                    data: c4,
                                    color: 'rgba(49, 112, 143,0.3)'
                                }, {
                                    name: 'Fully Compliant',
                                    data: c5,
                                    color: 'rgba(49, 112, 143,0.3)'
                                }];
                                seriesArray.push(seriesArrayKilifiByLevel);

                                InspectionDataService.formatDataForFigure("3", result, function(c1, c2, c3, c4, c5) {




                                    var total_facility_level2 = c1[0].count + c2[0].count + c3[0].count + c4[0].count + c5[0].count;
                                    var total_facility_level3 = c1[1].count + c2[1].count + c3[1].count + c4[1].count + c5[1].count;
                                    var total_facility_level4_5 = c1[2].count + c2[2].count + c3[2].count + c4[2].count + c5[2].count;

                                    xAxisArrayMeruByLevel = ['Level 2 <br> (N=' + total_facility_level2 + ')', 'Level 3 <br> (N=' + total_facility_level3 + ')', 'Level 4 & 5 <br> (N=' + total_facility_level4_5 + ')'];

                                    xAxisArray.push(xAxisArrayMeruByLevel);

                                    var seriesArrayMeruByLevel = [{
                                        name: 'Non-Compliant',
                                        data: c1,
                                        color: 'rgba(49, 112, 143,1)'
                                    }, {
                                        name: 'Minimally Compliant',
                                        data: c2,
                                        color: 'rgba(49, 112, 143,0.75)'
                                    }, {
                                        name: 'Partially Compliant',
                                        data: c3,
                                        color: 'rgba(49, 112, 143,0.5)'
                                    }, {
                                        name: 'Substantially Compliant',
                                        data: c4,
                                        color: 'rgba(49, 112, 143,0.3)'
                                    }, {
                                        name: 'Fully Compliant',
                                        data: c5,
                                        color: 'rgba(49, 112, 143,0.3)'
                                    }];
                                    seriesArray.push(seriesArrayMeruByLevel);


                                    InspectionDataService.getPercentageOfFacilities("2", "All", function(result) {


                                        function getPercByLevelByRisk(level, risk) {
                                            for (i in result) {
                                                if (level == result[i]._id.level &&
                                                    risk == result[i]._id.risk) {
                                                    var data = { y: result[i].percentage, count: result[i].count };
                                                    return data;
                                                }
                                            }
                                            return { y: 0, count: 0 };
                                        };


                                        var level20 = getPercByLevelByRisk("Level 2", 'Non-Compliant');
                                        var level30 = getPercByLevelByRisk("Level 3", 'Non-Compliant');
                                        var level40 = getPercByLevelByRisk("Level 4", 'Non-Compliant');
                                        var level50 = getPercByLevelByRisk("Level 5", 'Non-Compliant');




                                        var level21 = getPercByLevelByRisk("Level 2", 'Minimally Compliant');
                                        var level31 = getPercByLevelByRisk("Level 3", 'Minimally Compliant');
                                        var level41 = getPercByLevelByRisk("Level 4", 'Minimally Compliant');
                                        var level51 = getPercByLevelByRisk("Level 5", 'Minimally Compliant');


                                        var level22 = getPercByLevelByRisk("Level 2", 'Partially Compliant');
                                        var level32 = getPercByLevelByRisk("Level 3", 'Partially Compliant');
                                        var level42 = getPercByLevelByRisk("Level 4", 'Partially Compliant');
                                        var level52 = getPercByLevelByRisk("Level 5", 'Partially Compliant');


                                        var level23 = getPercByLevelByRisk("Level 2", 'Substantially Compliant');
                                        var level33 = getPercByLevelByRisk("Level 3", 'Substantially Compliant');
                                        var level43 = getPercByLevelByRisk("Level 4", 'Substantially Compliant');
                                        var level53 = getPercByLevelByRisk("Level 5", 'Substantially Compliant');


                                        var level24 = getPercByLevelByRisk("Level 2", 'Fully Compliant');
                                        var level34 = getPercByLevelByRisk("Level 3", 'Fully Compliant');
                                        var level44 = getPercByLevelByRisk("Level 4", 'Fully Compliant');
                                        var level54 = getPercByLevelByRisk("Level 5", 'Fully Compliant');



                                        var total0 = level20.y + level21.y + level22.y + level23.y + level24.y;

                                        if (total0 != 0) {

                                            level20.y = (100 * level20.y) / total0;
                                            level21.y = (100 * level21.y) / total0;
                                            level22.y = (100 * level22.y) / total0;
                                            level23.y = (100 * level23.y) / total0;
                                            level24.y = (100 * level24.y) / total0;

                                        }

                                        var total1 = level30.y + level31.y + level32.y + level33.y + level34.y;

                                        if (total1 != 0) {

                                            level30.y = (100 * level30.y) / total1;
                                            level31.y = (100 * level31.y) / total1;
                                            level32.y = (100 * level32.y) / total1;
                                            level33.y = (100 * level33.y) / total1;
                                            level34.y = (100 * level34.y) / total1;


                                        }
                                        var level40_50 = { y: 0, count: 0 };
                                        var level41_51 = { y: 0, count: 0 };
                                        var level42_52 = { y: 0, count: 0 };
                                        var level43_53 = { y: 0, count: 0 };
                                        var level44_54 = { y: 0, count: 0 };



                                        var total2 = level40.y + level41.y + level42.y + level43.y + level44.y + level50.y + level51.y + level52.y + level53.y + level54.y;
                                        if (total2 != 0) {
                                            level40_50.y = (100 * (level40.y + level50.y)) / total2;
                                            level41_51.y = (100 * (level41.y + level51.y)) / total2;
                                            level42_52.y = (100 * (level42.y + level52.y)) / total2;
                                            level43_53.y = (100 * (level43.y + level53.y)) / total2;
                                            level44_54.y = (100 * (level44.y + level54.y)) / total2;
                                        }
                                        level40_50.count = level40.count + level50.count;
                                        level41_51.count = level41.count + level51.count;
                                        level42_52.count = level42.count + level52.count;
                                        level43_53.count = level43.count + level53.count;
                                        level44_54.count = level44.count + level54.count;



                                        var c1 = [level20, level30, level40_50];
                                        var c2 = [level21, level31, level41_51];
                                        var c3 = [level22, level32, level42_52];
                                        var c4 = [level23, level33, level43_53];
                                        var c5 = [level24, level34, level44_54];

                                        var seriesArrayAllByLevel = [{
                                            name: 'Non-Compliant',
                                            data: c1,
                                            color: 'rgba(49, 112, 143,1)'
                                        }, {
                                            name: 'Minimally Compliant',
                                            data: c2,
                                            color: 'rgba(49, 112, 143,0.75)'
                                        }, {
                                            name: 'Partially Compliant',
                                            data: c3,
                                            color: 'rgba(49, 112, 143,0.5)'
                                        }, {
                                            name: 'Substantially Compliant',
                                            data: c4,
                                            color: 'rgba(49, 112, 143,0.3)'
                                        }, {
                                            name: 'Fully Compliant',
                                            data: c5,
                                            color: 'rgba(49, 112, 143,0.3)'
                                        }];

                                        var total_facility_level2 = c1[0].count + c2[0].count + c3[0].count + c4[0].count + c5[0].count;
                                        var total_facility_level3 = c1[1].count + c2[1].count + c3[1].count + c4[1].count + c5[1].count;
                                        var total_facility_level4_5 = c1[2].count + c2[2].count + c3[2].count + c4[2].count + c5[2].count;

                                        xAxisArrayAllByLevel = ['Level 2 <br> (N=' + total_facility_level2 + ')', 'Level 3 <br> (N=' + total_facility_level3 + ')', 'Level 4 & 5 <br> (N=' + total_facility_level4_5 + ')'];

                                        xAxisArray.push(xAxisArrayAllByLevel);


                                        seriesArray.push(seriesArrayAllByLevel);

                                        sendResponse(xAxisArray, seriesArray);
                                    });

                                });

                            });
                        });
                    });



                } else {
                    // xAxisArray = [CountyService.getCounty(county)];
                    xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];


                    InspectionDataService.getPercentageOfFacilities(hfType, county, function(result) {

                        InspectionDataService.formatDataForFigure(county, result, function(c1, c2, c3, c4, c5) {



                            var total_facility_level2 = c1[0].count + c2[0].count + c3[0].count + c4[0].count + c5[0].count;
                            var total_facility_level3 = c1[1].count + c2[1].count + c3[1].count + c4[1].count + c5[1].count;
                            var total_facility_level4_5 = c1[2].count + c2[2].count + c3[2].count + c4[2].count + c5[2].count;

                            xAxisArray = ['Level 2 <br> (N=' + total_facility_level2 + ')', 'Level 3 <br> (N=' + total_facility_level3 + ')', 'Level 4 & 5 <br> (N=' + total_facility_level4_5 + ')'];


                            var seriesArray = [{
                                name: 'Non-Compliant',
                                data: c1,
                                color: 'rgba(49, 112, 143,1)'
                            }, {
                                name: 'Minimally Compliant',
                                data: c2,
                                color: 'rgba(49, 112, 143,0.75)'
                            }, {
                                name: 'Partially Compliant',
                                data: c3,
                                color: 'rgba(49, 112, 143,0.5)'
                            }, {
                                name: 'Substantially Compliant',
                                data: c4,
                                color: 'rgba(49, 112, 143,0.3)'
                            }, {
                                name: 'Fully Compliant',
                                data: c5,
                                color: 'rgba(49, 112, 143,0.3)'
                            }];


                            sendResponse(xAxisArray, seriesArray);


                        });



                    });
                }
            } else if (hfType == "3") {
                if (county == "All") {
                    // xAxisArray = ['All Counties'];
                    xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];


                    InspectionDataService.getPercentageOfFacilities(hfType, county, function(result) {

                        var ownerships = CountyService.getOwnershipList();
                        var finalResult = "";


                        index0 = undefined;
                        index1 = undefined;
                        index2 = undefined;
                        index3 = undefined;
                        index4 = undefined;
                        for (var i = 0; i < result.length; i++) {

                            if (result[i]._id.ownership == "Public") {
                                if (result[i]._id.risk == 'Non-Compliant') {
                                    index0 = i;
                                } else if (result[i]._id.risk == 'Minimally Compliant') {
                                    index1 = i;
                                } else if (result[i]._id.risk == 'Partially Compliant') {
                                    index2 = i;
                                } else if (result[i]._id.risk == 'Substantially Compliant') {
                                    index3 = i;
                                } else if (result[i]._id.risk == 'Fully Compliant') {
                                    index4 = i;
                                }
                            }
                        }
                        if (index0 != undefined) {
                            val0 = { y: result[index0].percentage, count: result[index0].count };
                        } else {
                            val0 = { y: 0, count: 0 };
                        }

                        if (index1 != undefined) {
                            val1 = { y: result[index1].percentage, count: result[index1].count };
                        } else {
                            val1 = { y: 0, count: 0 };
                        }
                        if (index2 != undefined) {
                            val2 = { y: result[index2].percentage, count: result[index2].count };
                        } else {
                            val2 = { y: 0, count: 0 };
                        }
                        if (index3 != undefined) {
                            val3 = { y: result[index3].percentage, count: result[index3].count };
                        } else {
                            val3 = { y: 0, count: 0 };
                        }
                        if (index4 != undefined) {
                            val4 = { y: result[index4].percentage, count: result[index4].count };

                        } else {
                            val4 = { y: 0, count: 0 };
                        }


                        var total1 = val0.y + val1.y + val2.y + val3.y + val4.y;

                        if (total1 != 0) {

                            val0.y = (100 * val0.y) / total1;
                            val1.y = (100 * val1.y) / total1;
                            val2.y = (100 * val2.y) / total1;
                            val3.y = (100 * val3.y) / total1;
                            val4.y = (100 * val4.y) / total1;


                        }

                        finalResult = finalResult + '"Public" :[ ' + val0 + ',' + val1 + ',' + val2 + ',' + val3 + ',' + val4 + '],';
                        var Public = [val0, val1, val2, val3, val4];

                        index0 = undefined;
                        index1 = undefined;
                        index2 = undefined;
                        index3 = undefined;
                        index4 = undefined;
                        for (var i = 0; i < result.length; i++) {

                            if (result[i]._id.ownership == "Private") {
                                if (result[i]._id.risk == 'Non-Compliant') {
                                    index0 = i;
                                } else if (result[i]._id.risk == 'Minimally Compliant') {
                                    index1 = i;
                                } else if (result[i]._id.risk == 'Partially Compliant') {
                                    index2 = i;
                                } else if (result[i]._id.risk == 'Substantially Compliant') {
                                    index3 = i;
                                } else if (result[i]._id.risk == 'Fully Compliant') {
                                    index4 = i;
                                }
                            }
                        }
                        if (index0 != undefined) {
                            val0 = { y: result[index0].percentage, count: result[index0].count };
                        } else {
                            val0 = { y: 0, count: 0 };
                        }

                        if (index1 != undefined) {
                            val1 = { y: result[index1].percentage, count: result[index1].count };
                        } else {
                            val1 = { y: 0, count: 0 };
                        }
                        if (index2 != undefined) {
                            val2 = { y: result[index2].percentage, count: result[index2].count };
                        } else {
                            val2 = { y: 0, count: 0 };
                        }
                        if (index3 != undefined) {
                            val3 = { y: result[index3].percentage, count: result[index3].count };
                        } else {
                            val3 = { y: 0, count: 0 };
                        }
                        if (index4 != undefined) {
                            val4 = { y: result[index4].percentage, count: result[index4].count };

                        } else {
                            val4 = { y: 0, count: 0 };
                        }


                        var total2 = val0.y + val1.y + val2.y + val3.y + val4.y;

                        if (total2 != 0) {

                            val0.y = (100 * val0.y) / total2;
                            val1.y = (100 * val1.y) / total2;
                            val2.y = (100 * val2.y) / total2;
                            val3.y = (100 * val3.y) / total2;
                            val4.y = (100 * val4.y) / total2;


                        }


                        finalResult = finalResult + '"Private" :[ ' + val0 + ',' + val1 + ',' + val2 + ',' + val3 + ',' + val4 + '],';



                        var Private = [val0, val1, val2, val3, val4];


                        var c1 = [Public[0], Private[0]];
                        var c2 = [Public[1], Private[1]];
                        var c3 = [Public[2], Private[2]];
                        var c4 = [Public[3], Private[3]];
                        var c5 = [Public[4], Private[4]];

                        var total_facility_public = c1[0].count + c2[0].count + c3[0].count + c4[0].count + c5[0].count;
                        var total_facility_private = c1[1].count + c2[1].count + c3[1].count + c4[1].count + c5[1].count;

                        var xAxisArray = ['Public <br> (N=' + total_facility_public + ')', 'Private <br> (N=' + total_facility_private + ')'];

                        var seriesArray = [{
                            name: 'Non-Compliant',
                            data: c1,
                            color: 'rgba(49, 112, 143,1)'
                        }, {
                            name: 'Minimally Compliant',
                            data: c2,
                            color: 'rgba(49, 112, 143,0.75)'
                        }, {
                            name: 'Partially Compliant',
                            data: c3,
                            color: 'rgba(49, 112, 143,0.5)'
                        }, {
                            name: 'Substantially Compliant',
                            data: c4,
                            color: 'rgba(49, 112, 143,0.3)'
                        }, {
                            name: 'Fully Compliant',
                            data: c5,
                            color: 'rgba(49, 112, 143,0.3)'
                        }];



                        sendResponse(xAxisArray, seriesArray)
                    });
                } else if (county == "By County") {

                    var xAxisArray = [];

                    InspectionDataService.getPercentageOfFacilities(hfType, county, function(result) {
                        InspectionDataService.formatDataForFigureByOwnership("1", result, function(c1, c2, c3, c4, c5) {


                            var total_facility_public = c1[0].count + c2[0].count + c3[0].count + c4[0].count + c5[0].count;
                            var total_facility_private = c1[1].count + c2[1].count + c3[1].count + c4[1].count + c5[1].count;

                            var xAxisArrayKakamegaByOwner = ['Public <br> (N=' + total_facility_public + ')', 'Private <br> (N=' + total_facility_private + ')'];
                            xAxisArray.push(xAxisArrayKakamegaByOwner);

                            var seriesArrayKakamegaByOwner = [{
                                name: 'Non-Compliant',
                                data: c1,
                                color: 'rgba(49, 112, 143,1)'
                            }, {
                                name: 'Minimally Compliant',
                                data: c2,
                                color: 'rgba(49, 112, 143,0.75)'
                            }, {
                                name: 'Partially Compliant',
                                data: c3,
                                color: 'rgba(49, 112, 143,0.5)'
                            }, {
                                name: 'Substantially Compliant',
                                data: c4,
                                color: 'rgba(49, 112, 143,0.3)'
                            }, {
                                name: 'Fully Compliant',
                                data: c5,
                                color: 'rgba(49, 112, 143,0.3)'
                            }];



                            seriesArray.push(seriesArrayKakamegaByOwner);
                            InspectionDataService.formatDataForFigureByOwnership("2", result, function(c1, c2, c3, c4, c5) {


                                var total_facility_public = c1[0].count + c2[0].count + c3[0].count + c4[0].count + c5[0].count;
                                var total_facility_private = c1[1].count + c2[1].count + c3[1].count + c4[1].count + c5[1].count;

                                var xAxisArrayKilifiByOwner = ['Public <br> (N=' + total_facility_public + ')', 'Private <br> (N=' + total_facility_private + ')'];
                                xAxisArray.push(xAxisArrayKilifiByOwner);

                                var seriesArrayKilifiByOwner = [{
                                    name: 'Non-Compliant',
                                    data: c1,
                                    color: 'rgba(49, 112, 143,1)'
                                }, {
                                    name: 'Minimally Compliant',
                                    data: c2,
                                    color: 'rgba(49, 112, 143,0.75)'
                                }, {
                                    name: 'Partially Compliant',
                                    data: c3,
                                    color: 'rgba(49, 112, 143,0.5)'
                                }, {
                                    name: 'Substantially Compliant',
                                    data: c4,
                                    color: 'rgba(49, 112, 143,0.3)'
                                }, {
                                    name: 'Fully Compliant',
                                    data: c5,
                                    color: 'rgba(49, 112, 143,0.3)'
                                }];


                                seriesArray.push(seriesArrayKilifiByOwner);

                                InspectionDataService.formatDataForFigureByOwnership("3", result, function(c1, c2, c3, c4, c5) {

                                    var total_facility_public = c1[0].count + c2[0].count + c3[0].count + c4[0].count + c5[0].count;
                                    var total_facility_private = c1[1].count + c2[1].count + c3[1].count + c4[1].count + c5[1].count;

                                    var xAxisArrayMeruByOwner = ['Public <br> (N=' + total_facility_public + ')', 'Private <br> (N=' + total_facility_private + ')'];
                                    xAxisArray.push(xAxisArrayMeruByOwner);

                                    var seriesArrayMeruByOwner = [{
                                        name: 'Non-Compliant',
                                        data: c1,
                                        color: 'rgba(49, 112, 143,1)'
                                    }, {
                                        name: 'Minimally Compliant',
                                        data: c2,
                                        color: 'rgba(49, 112, 143,0.75)'
                                    }, {
                                        name: 'Partially Compliant',
                                        data: c3,
                                        color: 'rgba(49, 112, 143,0.5)'
                                    }, {
                                        name: 'Substantially Compliant',
                                        data: c4,
                                        color: 'rgba(49, 112, 143,0.3)'
                                    }, {
                                        name: 'Fully Compliant',
                                        data: c5,
                                        color: 'rgba(49, 112, 143,0.3)'
                                    }];

                                    seriesArray.push(seriesArrayMeruByOwner);





                                    InspectionDataService.getPercentageOfFacilities("3", "All", function(result) {


                                        function getPercByOwnerByRisk(owner, risk) {
                                            for (i in result) {
                                                if (owner == result[i]._id.ownership &&
                                                    risk == result[i]._id.risk) {
                                                    var data = { y: result[i].percentage, count: result[i].count };
                                                    return data;
                                                }
                                            }
                                            return { y: 0, count: 0 };;
                                        };


                                        var owner20 = getPercByOwnerByRisk("Public", 'Non-Compliant');
                                        var owner30 = getPercByOwnerByRisk("Private", 'Non-Compliant');



                                        var owner21 = getPercByOwnerByRisk("Public", 'Minimally Compliant');
                                        var owner31 = getPercByOwnerByRisk("Private", 'Minimally Compliant');


                                        var owner22 = getPercByOwnerByRisk("Public", 'Partially Compliant');
                                        var owner32 = getPercByOwnerByRisk("Private", 'Partially Compliant');



                                        var owner23 = getPercByOwnerByRisk("Public", 'Substantially Compliant');
                                        var owner33 = getPercByOwnerByRisk("Private", 'Substantially Compliant');



                                        var owner24 = getPercByOwnerByRisk("Public", 'Fully Compliant');
                                        var owner34 = getPercByOwnerByRisk("Private", 'Fully Compliant');




                                        var total0 = owner20.y + owner21.y + owner22.y + owner23.y + owner24.y;

                                        if (total0 != 0) {
                                            owner20.y = (100 * owner20.y) / total0;
                                            owner21.y = (100 * owner21.y) / total0;
                                            owner22.y = (100 * owner22.y) / total0;
                                            owner23.y = (100 * owner23.y) / total0;
                                            owner24.y = (100 * owner24.y) / total0;
                                        }



                                        var total1 = owner30.y + owner31.y + owner32.y + owner33.y + owner34.y;

                                        if (total1 != 0) {
                                            owner30.y = (100 * owner30.y) / total1;
                                            owner31.y = (100 * owner31.y) / total1;
                                            owner32.y = (100 * owner32.y) / total1;
                                            owner33.y = (100 * owner33.y) / total1;
                                            owner34.y = (100 * owner34.y) / total1;
                                        }

                                        var c1 = [owner20, owner30];
                                        var c2 = [owner21, owner31];
                                        var c3 = [owner22, owner32];
                                        var c4 = [owner23, owner33];
                                        var c5 = [owner24, owner34];



                                        var total_facility_public = c1[0].count + c2[0].count + c3[0].count + c4[0].count + c5[0].count;
                                        var total_facility_private = c1[1].count + c2[1].count + c3[1].count + c4[1].count + c5[1].count;

                                        var xAxisArrayAllByOwner = ['Public <br> (N=' + total_facility_public + ')', 'Private <br> (N=' + total_facility_private + ')'];
                                        xAxisArray.push(xAxisArrayAllByOwner);

                                        var seriesArrayAllByOwner = [{
                                            name: 'Non-Compliant',
                                            data: c1,
                                            color: 'rgba(49, 112, 143,1)'
                                        }, {
                                            name: 'Minimally Compliant',
                                            data: c2,
                                            color: 'rgba(49, 112, 143,0.75)'
                                        }, {
                                            name: 'Partially Compliant',
                                            data: c3,
                                            color: 'rgba(49, 112, 143,0.5)'
                                        }, {
                                            name: 'Substantially Compliant',
                                            data: c4,
                                            color: 'rgba(49, 112, 143,0.3)'
                                        }, {
                                            name: 'Fully Compliant',
                                            data: c5,
                                            color: 'rgba(49, 112, 143,0.3)'
                                        }];


                                        seriesArray.push(seriesArrayAllByOwner);


                                        sendResponse(xAxisArray, seriesArray);
                                    });
                                });
                            });
                        });
                    });


                } else {
                    // xAxisArray = [CountyService.getCounty(county)];
                    xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];

                    InspectionDataService.getPercentageOfFacilities(hfType, county, function(result) {


                        InspectionDataService.formatDataForFigureByOwnership(county, result, function(c1, c2, c3, c4, c5) {


                            var total_facility_public = c1[0].count + c2[0].count + c3[0].count + c4[0].count + c5[0].count;
                            var total_facility_private = c1[1].count + c2[1].count + c3[1].count + c4[1].count + c5[1].count;

                            var xAxisArray = ['Public <br> (N=' + total_facility_public + ')', 'Private <br> (N=' + total_facility_private + ')'];

                            var seriesArray = [{
                                name: 'Non-Compliant',
                                data: c1,
                                color: 'rgba(49, 112, 143,1)'
                            }, {
                                name: 'Minimally Compliant',
                                data: c2,
                                color: 'rgba(49, 112, 143,0.75)'
                            }, {
                                name: 'Partially Compliant',
                                data: c3,
                                color: 'rgba(49, 112, 143,0.5)'
                            }, {
                                name: 'Substantially Compliant',
                                data: c4,
                                color: 'rgba(49, 112, 143,0.3)'
                            }, {
                                name: 'Fully Compliant',
                                data: c5,
                                color: 'rgba(49, 112, 143,0.3)'
                            }];

                            sendResponse(xAxisArray, seriesArray);

                        });
                    });
                }
            } else if (hfType == "4") {
                if (county == "All") {
                    xAxisArray = ['All Counties'];
                    InspectionDataService.getPercentageOfFacilities(hfType, county, function(result) {

                        var risks = CountyService.getRiskList();
                        var finalResult = "";
                        for (i in risks) {
                            if (risks[i].value == "All") continue;
                            var key = risks[i].value;
                            var value = 0;
                            for (j in result) {
                                if ((result[j]._id) == (key)) {
                                    value = result[j].percentage;
                                    break;
                                }
                            }
                            finalResult = finalResult + '"' + key + '" : ' + value + ',';
                        }
                        finalResult = finalResult.replace(/,\s*$/, "");
                        finalResult = "{" + finalResult + "}";
                        finalResult = JSON.parse(finalResult);

                        sendResponse(xAxisArray, [{
                            name: 'Fully',
                            data: [finalResult["Fully"]],
                            color: 'rgba(49, 112, 143,1)'
                        }, {
                            name: 'Substantially',
                            data: [finalResult["Substantially"]],
                            color: 'rgba(49, 112, 143,0.75)'
                        }, {
                            name: 'Partially',
                            data: [finalResult["Partially"]],
                            color: 'rgba(49, 112, 143,0.5)'
                        }, {
                            name: 'Minimally',
                            data: [finalResult["Minimally"]],
                            color: 'rgba(49, 112, 143,0.3)'
                        }])
                    });
                } else if (county == "By County") {
                    xAxisArray = CountyService.getAll();
                    InspectionDataService.getPercentageOfFacilities(hfType, county, function(result) {
                        function getPercByRiskByCounty(risk, county) {
                            for (i in result) {
                                if (risk == result[i]._id.risk &&
                                    county == CountyService.getCounty(result[i]._id.county)) {
                                    return result[i].percentage;
                                }
                            }
                            return 0;
                        };

                        var fully1 = getPercByRiskByCounty("Fully", "Kakamega");
                        var fully2 = getPercByRiskByCounty("Fully", "Kilifi");
                        var fully3 = getPercByRiskByCounty("Fully", "Meru");
                        var substantially1 = getPercByRiskByCounty("Substantially", "Kakamega");
                        var substantially2 = getPercByRiskByCounty("Substantially", "Kilifi");
                        var substantially3 = getPercByRiskByCounty("Substantially", "Meru");
                        var partially1 = getPercByRiskByCounty("Partially", "Kakamega");
                        var partially2 = getPercByRiskByCounty("Partially", "Kilifi");
                        var partially3 = getPercByRiskByCounty("Partially", "Meru");
                        var minimally1 = getPercByRiskByCounty("Minimally", "Kakamega");
                        var minimally2 = getPercByRiskByCounty("Minimally", "Kilifi");
                        var minimally3 = getPercByRiskByCounty("Minimally", "Meru");
                        var total1 = fully1 + substantially1 + partially1 + minimally1;
                        var total2 = fully2 + substantially2 + partially2 + minimally2;
                        var total3 = fully3 + substantially3 + partially3 + minimally3;

                        fully1 = (100 * fully1) / total1;
                        fully2 = (100 * fully2) / total2;
                        fully3 = (100 * fully3) / total3;

                        substantially1 = (100 * substantially1) / total1;
                        substantially2 = (100 * substantially2) / total2;
                        substantially3 = (100 * substantially3) / total3;

                        partially1 = (100 * partially1) / total1;
                        partially2 = (100 * partially2) / total2;
                        partially3 = (100 * partially3) / total3;

                        minimally1 = (100 * minimally1) / total1;
                        minimally2 = (100 * minimally2) / total2;
                        minimally3 = (100 * minimally3) / total3;

                        sendResponse(xAxisArray, [{
                            name: 'Fully',
                            data: [fully1, fully2, fully3],
                            color: 'rgba(49, 112, 143,1)'
                        }, {
                            name: 'Substantially',
                            data: [substantially1, substantially2, substantially3],
                            color: 'rgba(49, 112, 143,0.75)'
                        }, {
                            name: 'Partially',
                            data: [partially1, partially2, partially3],
                            color: 'rgba(49, 112, 143,0.5)'
                        }, {
                            name: 'Minimally',
                            data: [minimally1, minimally2, minimally3],
                            color: 'rgba(49, 112, 143,0.3)'
                        }]);
                    });
                } else {
                    xAxisArray = [CountyService.getCounty(county)];
                    InspectionDataService.getPercentageOfFacilities(hfType, county, function(result) {
                        function getPercByRiskByCounty(risk, county) {
                            for (i in result) {
                                if (risk == result[i]._id.risk &&
                                    county == CountyService.getCounty(result[i]._id.county)) {
                                    return result[i].percentage;
                                }
                            }
                            return 0;
                        };

                        var fully1 = getPercByRiskByCounty("Fully", CountyService.getCounty(county));
                        var substantially1 = getPercByRiskByCounty("Substantially", CountyService.getCounty(county));
                        var partially1 = getPercByRiskByCounty("Partially", CountyService.getCounty(county));
                        var minimally1 = getPercByRiskByCounty("Minimally", CountyService.getCounty(county));
                        var total1 = fully1 + substantially1 + partially1 + minimally1;

                        fully1 = (100 * fully1) / total1;
                        substantially1 = (100 * substantially1) / total1;
                        partially1 = (100 * partially1) / total1;
                        minimally1 = (100 * minimally1) / total1;

                        sendResponse(xAxisArray, [{
                            name: 'Fully',
                            data: [fully1],
                            color: 'rgba(49, 112, 143,1)'
                        }, {
                            name: 'Substantially',
                            data: [substantially1],
                            color: 'rgba(49, 112, 143,0.75)'
                        }, {
                            name: 'Partially',
                            data: [partially1],
                            color: 'rgba(49, 112, 143,0.5)'
                        }, {
                            name: 'Minimally',
                            data: [minimally1],
                            color: 'rgba(49, 112, 143,0.3)'
                        }]);
                    });
                }
            }
        } else {
            // dynamic start

            if (unit != "All") {

                if (hfType == "1") {
                    if (county == "All") {
                        console.log("unit not all");

                        xAxisArray = CountyService.getUnit();
                        InspectionDataService.getPercentageOfMeanScoresByUnit(hfType, county, function(meanScoreArray) {



                            if (meanScoreArray[0] != undefined) {

                                seriesArray = [{
                                    name: "Mean Scores (N=" + meanScoreArray[0].count + ")",
                                    data: [meanScoreArray[0].s2_ps, meanScoreArray[0].s3_ps,
                                        meanScoreArray[0].s4_ps, meanScoreArray[0].s5_ps, meanScoreArray[0].s6_ps, meanScoreArray[0].s7_ps,
                                        meanScoreArray[0].s8_ps, meanScoreArray[0].s9_ps, meanScoreArray[0].s10_ps, meanScoreArray[0].s11_ps,
                                        meanScoreArray[0].s12_ps, meanScoreArray[0].s13_ps
                                    ],
                                    color: 'rgba(49, 112, 143,1)'
                                }];
                            } else {
                                seriesArray = [{ name: "Mean Scores (N=0)", data: [], color: 'rgba(49, 112, 143,1)' }];
                            }
                            sendResponse(xAxisArray, seriesArray);
                        });

                    } else if (county == "By County") {

                        var dataArrayKakamega = [];
                        var dataArrayKilifi = [];
                        var dataArrayMeru = [];
                        xAxisArray = CountyService.getUnit();
                        InspectionDataService.getPercentageOfMeanScoresByUnit(hfType, county, function(result) {


                            for (var i = 0; i < result.length; i++) {
                                if (result[i]._id == "Kakamega") {

                                    dataArrayKakamega = [{
                                        name: "Mean Scores (N=" + result[i].count + ")",
                                        data: [result[i].s2_ps, result[i].s3_ps,
                                            result[i].s4_ps, result[i].s5_ps, result[i].s6_ps, result[i].s7_ps,
                                            result[i].s8_ps, result[i].s9_ps, result[i].s10_ps, result[i].s11_ps,
                                            result[i].s12_ps, result[i].s13_ps
                                        ],
                                        color: 'rgba(49, 112, 143,1)'
                                    }];

                                }
                                if (result[i]._id == "Kilifi") {
                                    dataArrayKilifi = [{
                                        name: "Mean Scores (N=" + result[i].count + ")",
                                        data: [result[i].s2_ps, result[i].s3_ps,
                                            result[i].s4_ps, result[i].s5_ps, result[i].s6_ps, result[i].s7_ps,
                                            result[i].s8_ps, result[i].s9_ps, result[i].s10_ps, result[i].s11_ps,
                                            result[i].s12_ps, result[i].s13_ps
                                        ],
                                        color: 'rgba(49, 112, 143,1)'
                                    }];
                                }
                                if (result[i]._id == "Meru") {
                                    dataArrayMeru = [{
                                        name: "Mean Scores (N=" + result[i].count + ")",
                                        data: [result[i].s2_ps, result[i].s3_ps,
                                            result[i].s4_ps, result[i].s5_ps, result[i].s6_ps, result[i].s7_ps,
                                            result[i].s8_ps, result[i].s9_ps, result[i].s10_ps, result[i].s11_ps,
                                            result[i].s12_ps, result[i].s13_ps
                                        ],
                                        color: 'rgba(49, 112, 143,1)'
                                    }];
                                }
                            }

                            if (dataArrayKakamega.length == 0) {
                                dataArrayKakamega = [{
                                    name: "Mean Scores (N=0)",
                                    data: [],
                                    color: 'rgba(49, 112, 143,1)'
                                }];
                            }
                            if (dataArrayKilifi.length == 0) {
                                dataArrayKilifi = [{
                                    name: "Mean Scores (N=0)",
                                    data: [],
                                    color: 'rgba(49, 112, 143,1)'
                                }];
                            }
                            if (dataArrayMeru.length == 0) {
                                dataArrayMeru = [{
                                    name: "Mean Scores (N=0)",
                                    data: [],
                                    color: 'rgba(49, 112, 143,1)'
                                }];
                            }


                            InspectionDataService.getPercentageOfMeanScoresByUnit(hfType, "All", function(resultAll) {

                                if (resultAll.length == 0) {
                                    dataArrayAll = [{
                                        name: "Mean Scores (N=0)",
                                        data: [],
                                        color: 'rgba(49, 112, 143,1)'
                                    }];
                                } else {


                                    dataArrayAll = [{
                                        name: "Mean Scores (N=" + resultAll[0].count + ")",
                                        data: [resultAll[0].s2_ps, resultAll[0].s3_ps,
                                            resultAll[0].s4_ps, resultAll[0].s5_ps, resultAll[0].s6_ps, resultAll[0].s7_ps,
                                            resultAll[0].s8_ps, resultAll[0].s9_ps, resultAll[0].s10_ps, resultAll[0].s11_ps,
                                            resultAll[0].s12_ps, resultAll[0].s13_ps
                                        ],
                                        color: 'rgba(49, 112, 143,1)'
                                    }];
                                }
                                seriesArray.push(dataArrayAll);
                                seriesArray.push(dataArrayKakamega);
                                seriesArray.push(dataArrayKilifi);
                                seriesArray.push(dataArrayMeru);


                                sendResponse(xAxisArray, seriesArray);
                            });
                        });
                    } else {

                        var dataArray = [];
                        xAxisArray = CountyService.getUnit();
                        InspectionDataService.getPercentageOfMeanScoresByUnit(hfType, county, function(result) {
                            var finalResult = "";

                            for (var i = 0; i < result.length; i++) {
                                if (result[i]._id == CountyService.getCounty(county)) {
                                    dataArray = [{
                                        name: "Mean Scores (N=" + result[i].count + ")",
                                        data: [result[i].s2_ps, result[i].s3_ps,
                                            result[i].s4_ps, result[i].s5_ps, result[i].s6_ps, result[i].s7_ps,
                                            result[i].s8_ps, result[i].s9_ps, result[i].s10_ps, result[i].s11_ps,
                                            result[i].s12_ps, result[i].s13_ps
                                        ],
                                        color: 'rgba(49, 112, 143,1)'
                                    }];
                                }
                            }
                            sendResponse(xAxisArray, dataArray)
                        });

                    }
                } else if (hfType == "2") {

                    if (county == "All") {
                        xAxisArray = CountyService.getUnit();

                        InspectionDataService.getPercentageOfMeanScoresByUnit(hfType, county, function(result) {
                            InspectionDataService.meanScoreByUnitAllFormatData(result, county, function(seriesArray) {

                                sendResponse(xAxisArray, seriesArray)
                            });
                        });

                    } else if (county == "By County") {
                        var seriesArray = [];
                        xAxisArray = CountyService.getUnit();

                        InspectionDataService.getPercentageOfMeanScoresByUnit(hfType, "All", function(result) {
                            InspectionDataService.meanScoreByUnitAllFormatData(result, "All", function(seriesArrayAll) {

                                for (var i = 0; i < seriesArrayAll.length; i++) {
                                    seriesArray.push(seriesArrayAll[i]);
                                }

                                InspectionDataService.getPercentageOfMeanScoresByUnit(hfType, "1", function(result) {
                                    InspectionDataService.meanScoreByUnitByCountyFormatData(result, "1", function(seriesArrayKakamega) {
                                        console.log("seriesArray Kakamega========");
                                        console.log(seriesArrayKakamega);

                                        for (var i = 0; i < seriesArrayKakamega.length; i++) {
                                            seriesArray.push(seriesArrayKakamega[i]);
                                        }
                                        console.log(seriesArray);
                                        InspectionDataService.getPercentageOfMeanScoresByUnit(hfType, "2", function(result) {
                                            InspectionDataService.meanScoreByUnitByCountyFormatData(result, "2", function(seriesArrayKilifi) {
                                                console.log("seriesArray Kilifi========");
                                                seriesArray.concat(seriesArrayKilifi);

                                                for (var i = 0; i < seriesArrayKilifi.length; i++) {
                                                    seriesArray.push(seriesArrayKilifi[i]);
                                                }
                                                InspectionDataService.getPercentageOfMeanScoresByUnit(hfType, "3", function(result) {
                                                    InspectionDataService.meanScoreByUnitByCountyFormatData(result, "3", function(seriesArrayMeru) {
                                                        console.log("seriesArray Meru========");

                                                        for (var i = 0; i < seriesArrayMeru.length; i++) {
                                                            seriesArray.push(seriesArrayMeru[i]);
                                                        }

                                                        sendResponse(xAxisArray, seriesArray)
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    } else {
                        xAxisArray = CountyService.getUnit();

                        InspectionDataService.getPercentageOfMeanScoresByUnit(hfType, county, function(result) {

                            InspectionDataService.meanScoreByUnitByCountyFormatData(result, county, function(seriesArray) {
                                sendResponse(xAxisArray, seriesArray)
                            });
                        });
                    }

                } else if (hfType == "3") {

                    if (county == "All") {
                        xAxisArray = CountyService.getUnit();
                        InspectionDataService.getPercentageOfMeanScoresByUnit(hfType, county, function(result) {

                            InspectionDataService.meanScoreByUnitByOwnerShipAllFormatData(result, county, function(seriesArray) {

                                sendResponse(xAxisArray, seriesArray)
                            });
                        });

                    } else if (county == "By County") {
                        var seriesArray = [];
                        xAxisArray = CountyService.getUnit();

                        InspectionDataService.getPercentageOfMeanScoresByUnit(hfType, "All", function(result) {
                            InspectionDataService.meanScoreByUnitByOwnerShipAllFormatData(result, "All", function(seriesArrayAll) {

                                for (var i = 0; i < seriesArrayAll.length; i++) {
                                    seriesArray.push(seriesArrayAll[i]);
                                }

                                InspectionDataService.getPercentageOfMeanScoresByUnit(hfType, "1", function(result) {
                                    InspectionDataService.meanScoreByUnitByOwnerShipFormatData(result, "1", function(seriesArrayKakamega) {
                                        console.log("seriesArray Kakamega========");
                                        console.log(seriesArrayKakamega);

                                        for (var i = 0; i < seriesArrayKakamega.length; i++) {
                                            seriesArray.push(seriesArrayKakamega[i]);
                                        }
                                        console.log(seriesArray);
                                        InspectionDataService.getPercentageOfMeanScoresByUnit(hfType, "2", function(result) {
                                            InspectionDataService.meanScoreByUnitByOwnerShipFormatData(result, "2", function(seriesArrayKilifi) {
                                                console.log("seriesArray Kilifi========");
                                                seriesArray.concat(seriesArrayKilifi);

                                                for (var i = 0; i < seriesArrayKilifi.length; i++) {
                                                    seriesArray.push(seriesArrayKilifi[i]);
                                                }
                                                InspectionDataService.getPercentageOfMeanScoresByUnit(hfType, "3", function(result) {
                                                    InspectionDataService.meanScoreByUnitByOwnerShipFormatData(result, "3", function(seriesArrayMeru) {
                                                        console.log("seriesArray Meru========");

                                                        for (var i = 0; i < seriesArrayMeru.length; i++) {
                                                            seriesArray.push(seriesArrayMeru[i]);
                                                        }

                                                        console.log(seriesArray);
                                                        sendResponse(xAxisArray, seriesArray)
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    } else {
                        xAxisArray = CountyService.getUnit();


                        InspectionDataService.getPercentageOfMeanScoresByUnit(hfType, county, function(result) {

                            console.log("ownership here =========");
                            console.log(result);

                            InspectionDataService.meanScoreByUnitByOwnerShipFormatData(result, county, function(seriesArray) {
                                sendResponse(xAxisArray, seriesArray)
                            });
                        });
                    }
                }

            } else {

                if (hfType == "1") {
                    if (county == "All") {


                        xAxisArray = ['All Counties'];
                        InspectionDataService.getPercentageOfMeanScores(hfType, county, function(meanScoreArray) {
                            if (meanScoreArray[0] == undefined) {
                                seriesArray = [{ name: "Mean Scores", data: [{ y: 0, count: 0 }], color: 'rgba(49, 112, 143,1)' }];
                            } else {
                                seriesArray = [{ name: "Mean Scores", data: [{ y: meanScoreArray[0].ps, count: meanScoreArray[0].count }], color: 'rgba(49, 112, 143,1)' }];
                            }

                            sendResponse(xAxisArray, seriesArray);
                        });
                    } else if (county == "By County") {

                        var dataArrayKakamega = "";
                        var dataArrayKilifi = "";
                        var dataArrayMeru = "";
                        xAxisArray = CountyService.getAll();
                        xAxisArray.push("All");
                        InspectionDataService.getPercentageOfMeanScores(hfType, county, function(result) {
                            InspectionDataService.getPercentageOfMeanScores("1", "All", function(resultAll) {

                                var finalResult = "";
                                for (i in xAxisArray) {
                                    if (xAxisArray[i] == "All") continue;

                                    var key = xAxisArray[i];
                                    var value = 0;
                                    for (j in result) {
                                        if (result[j]._id == (key)) {
                                            dataArray[j] = { y: result[j].ps, count: result[j].count };
                                            break;
                                        }
                                    }
                                }

                                for (var i = 0; i < result.length; i++) {
                                    if (result[i]._id == "Kakamega") {
                                        dataArrayKakamega = { y: result[i].ps, count: result[i].count };

                                    }
                                    if (result[i]._id == "Kilifi") {
                                        dataArrayKilifi = { y: result[i].ps, count: result[i].count };

                                    }
                                    if (result[i]._id == "Meru") {
                                        dataArrayMeru = { y: result[i].ps, count: result[i].count };

                                    }
                                }

                                if (dataArrayKakamega == "") {
                                    dataArrayKakamega = { y: 0, count: 0 };
                                }
                                if (dataArrayKilifi == "") {
                                    dataArrayKilifi = { y: 0, count: 0 };
                                }
                                if (dataArrayMeru == "") {
                                    dataArrayMeru = { y: 0, count: 0 };
                                }
                                var dataArrayAll;
                                if (resultAll[0] != undefined) {
                                    dataArrayAll = { y: resultAll[0].ps, count: resultAll[0].count };
                                } else {
                                    dataArrayAll = { y: 0, count: 0 };
                                }


                                sendResponse(xAxisArray, [{
                                    name: 'Mean Scores',
                                    data: [dataArrayKakamega, dataArrayKilifi, dataArrayMeru, dataArrayAll],
                                    color: 'rgba(49, 112, 143,1)'
                                }]);
                            });
                        });



                    } else {

                        var dataArray = "";
                        xAxisArray = [CountyService.getCounty(county)];
                        InspectionDataService.getPercentageOfMeanScores(hfType, county, function(result) {
                            var finalResult = "";
                            for (i in xAxisArray) {
                                if (xAxisArray[i] == "All") continue;
                                var key = xAxisArray[i];
                                var value = 0;
                                for (j in result) {
                                    if (result[j]._id == (key)) {
                                        value = result[j].ps;
                                        break;
                                    }
                                }
                                finalResult = finalResult + '"' + key + '" : ' + value + ',';
                            }
                            finalResult = finalResult.replace(/,\s*$/, "");
                            finalResult = "{" + finalResult + "}";
                            finalResult = JSON.parse(finalResult);


                            for (var i = 0; i < result.length; i++) {
                                if (result[i]._id == CountyService.getCounty(county)) {
                                    dataArray = { y: result[i].ps, count: result[i].count };

                                }

                            }


                            sendResponse(xAxisArray, [{
                                name: 'Mean Scores',
                                data: [dataArray],
                                color: 'rgba(49, 112, 143,1)'
                            }])
                        });

                    }
                } else if (hfType == "2") {

                    if (county == "All") {
                        xAxisArray = ['All Counties'];
                        var dataArrayLevel2, dataArrayLevel3, dataArrayLevel4, dataArrayLevel5, dataArrayAllLevel;
                        InspectionDataService.getPercentageOfMeanScores(hfType, county, function(result) {
                            InspectionDataService.getPercentageOfMeanScores("1", county, function(resultAll) {

                                var levels = CountyService.getLevelList();


                                for (var i = 0; i < result.length; i++) {
                                    if (result[i]._id == "Level 2") {
                                        dataArrayLevel2 = { y: result[i].ps, count: result[i].count };

                                    }
                                    if (result[i]._id == "Level 3") {
                                        dataArrayLevel3 = { y: result[i].ps, count: result[i].count };

                                    }
                                    if (result[i]._id == "Level 4") {
                                        dataArrayLevel4 = { y: result[i].ps, count: result[i].count };

                                    }
                                    if (result[i]._id == "Level 5") {
                                        dataArrayLevel5 = { y: result[i].ps, count: result[i].count };

                                    }
                                }
                                if (resultAll[0] != undefined) {
                                    dataArrayAllLevel = { y: resultAll[0].ps, count: resultAll[0].count };
                                }
                                if (dataArrayLevel2 == undefined) {
                                    dataArrayLevel2 = { y: 0, count: 0 };
                                }
                                if (dataArrayLevel3 == undefined) {
                                    dataArrayLevel3 = { y: 0, count: 0 };
                                }
                                if (dataArrayLevel4 == undefined) {
                                    dataArrayLevel4 = { y: 0, count: 0 };
                                }
                                if (dataArrayLevel5 == undefined) {
                                    dataArrayLevel5 = { y: 0, count: 0 };
                                }
                                if (dataArrayAllLevel == undefined) {
                                    dataArrayAllLevel = { y: 0, count: 0 };
                                }

                                var total_facility_level2 = dataArrayLevel2

                                var dataArrayLevel4_5 = {};
                                dataArrayLevel4_5.count = dataArrayLevel4.count + dataArrayLevel5.count;
                                if (dataArrayLevel4.y == 0 || dataArrayLevel5.y == 0) {
                                    dataArrayLevel4_5.y = (dataArrayLevel4.y + dataArrayLevel5.y) / 1;
                                } else {
                                    dataArrayLevel4_5.y = ((dataArrayLevel4.y * dataArrayLevel4.count) + (dataArrayLevel5.y * dataArrayLevel5.count)) / dataArrayLevel4_5.count;
                                }

                                console.log("dataArrayLevel4_5");
                                console.log(dataArrayLevel4_5);

                                sendResponse(xAxisArray, [{
                                    name: 'Level 2 (N=' + dataArrayLevel2.count + ')',
                                    data: [dataArrayLevel2],
                                    color: '#3546C3'
                                }, {
                                    name: 'Level 3 (N=' + dataArrayLevel3.count + ')',
                                    data: [dataArrayLevel3],
                                    color: '#43a2ca'
                                }, {
                                    name: 'Level 4 & 5 (N=' + dataArrayLevel4_5.count + ')',
                                    data: [dataArrayLevel4_5],
                                    color: '#a8ddb5'
                                }, {
                                    name: 'All Levels (N=' + dataArrayAllLevel.count + ')',
                                    data: [dataArrayAllLevel],
                                    color: '#e0f3db'
                                }])
                            });
                        });
                    } else if (county == "By County") {
                        xAxisArray = CountyService.getAll();
                        xAxisArray.push("All");
                        InspectionDataService.getPercentageOfMeanScores(hfType, county, function(result) {
                            InspectionDataService.getPercentageOfMeanScores("1", county, function(resultAll) {

                                function getPercByLevelByCounty(level, county) {
                                    for (i in result) {
                                        if (level == result[i]._id.level &&
                                            county == result[i]._id.county) {
                                            var tmp = { y: result[i].ps, count: result[i].count };
                                            return tmp;
                                        }
                                    }
                                    return { y: 0, count: 0 };
                                };

                                function getPercByLevelAll(county) {
                                    for (i in resultAll) {
                                        if (county == resultAll[i]._id) {
                                            var tmp = { y: resultAll[i].ps, count: resultAll[i].count };
                                            return tmp;
                                        }
                                    }
                                    return { y: 0, count: 0 };
                                };

                                var level21 = getPercByLevelByCounty("Level 2", "Kakamega");
                                var level22 = getPercByLevelByCounty("Level 2", "Kilifi");
                                var level23 = getPercByLevelByCounty("Level 2", "Meru");
                                var level31 = getPercByLevelByCounty("Level 3", "Kakamega");
                                var level32 = getPercByLevelByCounty("Level 3", "Kilifi");
                                var level33 = getPercByLevelByCounty("Level 3", "Meru");

                                var level41 = getPercByLevelByCounty("Level 4", "Kakamega");
                                var level42 = getPercByLevelByCounty("Level 4", "Kilifi");
                                var level43 = getPercByLevelByCounty("Level 4", "Meru");

                                var level51 = getPercByLevelByCounty("Level 5", "Kakamega");
                                var level52 = getPercByLevelByCounty("Level 5", "Kilifi");
                                var level53 = getPercByLevelByCounty("Level 5", "Meru");

                                var levelAllKakamega = getPercByLevelAll("Kakamega");
                                var levelAllKilifi = getPercByLevelAll("Kilifi");
                                var levelAllMeru = getPercByLevelAll("Meru");

                                var total_facility_level2 = level21.count + level22.count + level23.count;
                                var total_facility_level3 = level31.count + level32.count + level33.count;
                                var total_facility_level4 = level41.count + level42.count + level43.count;
                                var total_facility_level5 = level51.count + level52.count + level53.count;
                                var total_facility_All = levelAllKakamega.count + levelAllKilifi.count + levelAllMeru.count;

                                var Level41_51 = {};
                                Level41_51.count = level41.count + level51.count;

                                if (level41.y == 0 || level51.y == 0) {
                                    Level41_51.y = (level41.y + level51.y) / 1;
                                } else {
                                    Level41_51.y = ((level41.y * level41.count) + (level51.y * level51.count)) / Level41_51.count;
                                }

                                var Level42_52 = {};
                                Level42_52.count = level42.count + level52.count;
                                if (level42.y == 0 || level52.y == 0) {
                                    Level42_52.y = (level42.y + level52.y) / 1;
                                } else {
                                    Level42_52.y = ((level42.y * level42.count) + (level52.y * level52.count)) / Level42_52.count;
                                }


                                var Level43_53 = {};
                                Level43_53.count = level43.count + level53.count;
                                if (level43.y == 0 || level53.y == 0) {
                                    Level43_53.y = (level43.y + level53.y) / 1;
                                } else {
                                    Level43_53.y = ((level43.y * level43.count) + (level53.y * level53.count)) / Level43_53.count;
                                }


                                var total_facility_level4_5 = total_facility_level4 + total_facility_level5;

                                var dataArrayLevel2, dataArrayLevel3, dataArrayLevel4, dataArrayLevel5, dataArrayAllLevel;
                                InspectionDataService.getPercentageOfMeanScores(hfType, "All", function(resultByCounty) {
                                    InspectionDataService.getPercentageOfMeanScores("1", "All", function(resultByCountyAll) {

                                        var levels = CountyService.getLevelList();


                                        for (var i = 0; i < resultByCounty.length; i++) {
                                            if (resultByCounty[i]._id == "Level 2") {
                                                dataArrayLevel2 = { y: resultByCounty[i].ps, count: resultByCounty[i].count };

                                            }
                                            if (resultByCounty[i]._id == "Level 3") {
                                                dataArrayLevel3 = { y: resultByCounty[i].ps, count: resultByCounty[i].count };

                                            }
                                            if (resultByCounty[i]._id == "Level 4") {
                                                dataArrayLevel4 = { y: resultByCounty[i].ps, count: resultByCounty[i].count };

                                            }
                                            if (resultByCounty[i]._id == "Level 5") {
                                                dataArrayLevel5 = { y: resultByCounty[i].ps, count: resultByCounty[i].count };

                                            }
                                        }
                                        if (resultByCountyAll[0] != undefined) {
                                            dataArrayAllLevel = { y: resultByCountyAll[0].ps, count: resultByCountyAll[0].count };
                                        }

                                        if (dataArrayLevel2 == undefined) {
                                            dataArrayLevel2 = { y: 0, count: 0 };
                                        }
                                        if (dataArrayLevel3 == undefined) {
                                            dataArrayLevel3 = { y: 0, count: 0 };
                                        }
                                        if (dataArrayLevel4 == undefined) {
                                            dataArrayLevel4 = { y: 0, count: 0 };
                                        }
                                        if (dataArrayLevel5 == undefined) {
                                            dataArrayLevel5 = { y: 0, count: 0 };
                                        }
                                        if (dataArrayAllLevel == undefined) {
                                            dataArrayAllLevel = { y: 0, count: 0 };
                                        }
                                        var dataArrayLevel4_5 = {};

                                        dataArrayLevel4_5.count = dataArrayLevel4.count + dataArrayLevel5.count;

                                        if (dataArrayLevel4.y == 0 || dataArrayLevel5.y == 0) {
                                            dataArrayLevel4_5.y = (dataArrayLevel4.y + dataArrayLevel5.y) / 1;
                                        } else {
                                            dataArrayLevel4_5.y = ((dataArrayLevel4.y * dataArrayLevel4.count) + (dataArrayLevel5.y * dataArrayLevel5.count)) / dataArrayLevel4_5.count;
                                        }


                                        sendResponse(xAxisArray, [
                                            [{
                                                name: 'Level 2 (N=' + total_facility_level2 + ')',
                                                data: [level21, level22, level23, dataArrayLevel2],
                                                color: 'rgba(49, 112, 143,1)'
                                            }],
                                            [{
                                                name: 'Level 3 (N=' + total_facility_level3 + ')',
                                                data: [level31, level32, level33, dataArrayLevel3],
                                                color: 'rgba(49, 112, 143,1)'
                                            }],
                                            [{
                                                name: 'Level 4 & 5 (N=' + total_facility_level4_5 + ')',
                                                data: [Level41_51, Level42_52, Level43_53, dataArrayLevel4_5],
                                                color: 'rgba(49, 112, 143,1)'
                                            }],
                                            [{
                                                name: 'All Levels (N=' + total_facility_All + ')',
                                                data: [levelAllKakamega, levelAllKilifi, levelAllMeru, dataArrayAllLevel],
                                                color: 'rgba(49, 112, 143,1)'
                                            }]
                                        ]);
                                    });
                                });
                            });
                        });
                    } else {
                        xAxisArray = [CountyService.getCounty(county)];
                        InspectionDataService.getPercentageOfMeanScores(hfType, county, function(result) {
                            InspectionDataService.getPercentageOfMeanScores("1", county, function(resultAll) {


                                function getPercByLevelByCounty(level, county) {
                                    for (i in result) {
                                        if (level == result[i]._id.level &&
                                            county == result[i]._id.county) {
                                            var tmp = { y: result[i].ps, count: result[i].count };
                                            return tmp;
                                        }
                                    }
                                    return { y: 0, count: 0 };
                                };

                                function getPercByLevelAll(county) {
                                    for (i in resultAll) {
                                        if (county == resultAll[i]._id) {
                                            var tmp = { y: resultAll[i].ps, count: resultAll[i].count };
                                            return tmp;
                                        }
                                    }
                                    return { y: 0, count: 0 };
                                };

                                var level21 = getPercByLevelByCounty("Level 2", CountyService.getCounty(county));
                                var level31 = getPercByLevelByCounty("Level 3", CountyService.getCounty(county));
                                var level41 = getPercByLevelByCounty("Level 4", CountyService.getCounty(county));
                                var level51 = getPercByLevelByCounty("Level 5", CountyService.getCounty(county));
                                var levelAll = getPercByLevelAll(CountyService.getCounty(county));

                                var Level41_51 = {};
                                Level41_51.count = level41.count + level51.count;

                                if (level41.y == 0 || level51.y == 0) {
                                    Level41_51.y = (level41.y + level51.y) / 1;
                                } else {
                                    Level41_51.y = ((level41.y * level41.count) + (level51.y * level51.count)) / Level41_51.count;
                                }

                                sendResponse(xAxisArray, [{
                                    name: 'Level 2 (N=' + level21.count + ')',
                                    data: [level21],
                                    color: '#3546C3'
                                }, {
                                    name: 'Level 3 (N=' + level31.count + ')',
                                    data: [level31],
                                    color: '#43a2ca'
                                }, {
                                    name: 'Level 4 & 5 (N=' + Level41_51.count + ')',
                                    data: [Level41_51],
                                    color: '#a8ddb5'
                                }, {
                                    name: 'All Levels (N=' + levelAll.count + ')',
                                    data: [levelAll],
                                    color: '#e0f3db'
                                }]);
                            });
                        });
                    }
                } else if (hfType == "3") {

                    if (county == "All") {
                        xAxisArray = ['All Counties'];
                        InspectionDataService.getPercentageOfMeanScores(hfType, county, function(result) {
                            InspectionDataService.getPercentageOfMeanScores("1", county, function(resultAll) {

                                var ownerships = CountyService.getOwnershipList();

                                var dataArrayPublic, dataArrayPrivate;
                                for (var i = 0; i < result.length; i++) {
                                    if (result[i]._id == "Public") {
                                        dataArrayPublic = { y: result[i].ps, count: result[i].count };
                                    }
                                    if (result[i]._id == "Private") {
                                        dataArrayPrivate = { y: result[i].ps, count: result[i].count };
                                    }
                                }

                                if (dataArrayPublic == undefined) {
                                    dataArrayPublic = { y: 0, count: 0 };
                                }
                                if (dataArrayPrivate == undefined) {
                                    dataArrayPrivate = { y: 0, count: 0 };
                                }
                                var dataArrayAllOwnership;
                                if (resultAll[0] != undefined) {
                                    dataArrayAllOwnership = { y: resultAll[0].ps, count: resultAll[0].count };
                                }
                                if (dataArrayAllOwnership == undefined) {
                                    dataArrayAllOwnership = { y: 0, count: 0 };
                                }

                                sendResponse(xAxisArray, [{
                                        name: 'Public (N=' + dataArrayPublic.count + ')',
                                        data: [dataArrayPublic],
                                        color: '#3546C3'
                                    }, {
                                        name: 'Private (N=' + dataArrayPrivate.count + ')',
                                        data: [dataArrayPrivate],
                                        color: '#43a2ca'
                                    },
                                    {
                                        name: 'All Ownerships (N=' + dataArrayAllOwnership.count + ')',
                                        data: [dataArrayAllOwnership],
                                        color: '#a8ddb5'
                                    }
                                ])
                            });
                        });
                    } else if (county == "By County") {
                        xAxisArray = CountyService.getAll();
                        xAxisArray.push("All");
                        InspectionDataService.getPercentageOfMeanScores(hfType, county, function(result) {
                            InspectionDataService.getPercentageOfMeanScores("1", county, function(resultAll) {

                                console.log("check list by county-ownership");
                                console.log(result);
                                console.log(resultAll);

                                function getPercByOwnershipByCounty(ownership, county) {
                                    for (i in result) {
                                        if (ownership == result[i]._id.ownership &&
                                            county == result[i]._id.county) {
                                            var tmp = { y: result[i].ps, count: result[i].count };
                                            return tmp;
                                        }
                                    }
                                    return { y: 0, count: 0 };
                                };

                                function getPercByOwnershipAll(county) {
                                    for (i in resultAll) {
                                        if (county == resultAll[i]._id) {
                                            var tmp = { y: resultAll[i].ps, count: resultAll[i].count };
                                            return tmp;
                                        }
                                    }
                                    return { y: 0, count: 0 };
                                };


                                var public1 = getPercByOwnershipByCounty("Public", "Kakamega");
                                var public2 = getPercByOwnershipByCounty("Public", "Kilifi");
                                var public3 = getPercByOwnershipByCounty("Public", "Meru");
                                var private1 = getPercByOwnershipByCounty("Private", "Kakamega");
                                var private2 = getPercByOwnershipByCounty("Private", "Kilifi");
                                var private3 = getPercByOwnershipByCounty("Private", "Meru");

                                var All1 = getPercByOwnershipAll("Kakamega");
                                var All2 = getPercByOwnershipAll("Kilifi");
                                var All3 = getPercByOwnershipAll("Meru");

                                var total_facility_public = public1.count + public2.count + public3.count;
                                var total_facility_private = private1.count + private2.count + private3.count;
                                var total_facility_all = All1.count + All2.count + All3.count;

                                InspectionDataService.getPercentageOfMeanScores(hfType, "All", function(resultByCounty) {
                                    InspectionDataService.getPercentageOfMeanScores("1", "All", function(resultByCountyAll) {

                                        var ownerships = CountyService.getOwnershipList();

                                        var dataArrayPublic, dataArrayPrivate;
                                        for (var i = 0; i < resultByCounty.length; i++) {
                                            if (resultByCounty[i]._id == "Public") {
                                                dataArrayPublic = { y: resultByCounty[i].ps, count: resultByCounty[i].count };

                                            }
                                            if (resultByCounty[i]._id == "Private") {
                                                dataArrayPrivate = { y: resultByCounty[i].ps, count: resultByCounty[i].count };
                                            }

                                        }

                                        if (dataArrayPublic == undefined) {
                                            dataArrayPublic = { y: 0, count: 0 };
                                        }
                                        if (dataArrayPrivate == undefined) {
                                            dataArrayPrivate = { y: 0, count: 0 };
                                        }
                                        var dataArrayAllOwnership;
                                        if (resultByCountyAll[0] != undefined) {
                                            dataArrayAllOwnership = { y: resultByCountyAll[0].ps, count: resultByCountyAll[0].count };
                                        }
                                        if (dataArrayAllOwnership == undefined) {
                                            dataArrayAllOwnership = { y: 0, count: 0 };
                                        }


                                        sendResponse(xAxisArray, [
                                            [{
                                                name: 'Public (N=' + total_facility_public + ')',
                                                data: [public1, public2, public3, dataArrayPublic],
                                                color: 'rgba(49, 112, 143,1)'
                                            }],
                                            [{
                                                name: 'Private (N=' + total_facility_private + ')',
                                                data: [private1, private2, private3, dataArrayPrivate],
                                                color: 'rgba(49, 112, 143,1)'
                                            }],
                                            [{
                                                name: 'All Ownerships (N=' + total_facility_all + ')',
                                                data: [All1, All2, All3, dataArrayAllOwnership],
                                                color: 'rgba(49, 112, 143,1)'
                                            }]
                                        ]);
                                    });
                                });
                            });
                        });
                    } else {
                        xAxisArray = [CountyService.getCounty(county)];
                        InspectionDataService.getPercentageOfMeanScores(hfType, county, function(result) {
                            InspectionDataService.getPercentageOfMeanScores("1", county, function(resultAll) {

                                function getPercByOwnershipByCounty(ownership, county) {
                                    for (i in result) {
                                        if (ownership == result[i]._id.ownership &&
                                            county == result[i]._id.county) {
                                            var tmp = { y: result[i].ps, count: result[i].count };
                                            return tmp;
                                        }
                                    }
                                    return { y: 0, count: 0 };
                                };

                                function getPercByOwnershipAll(county) {
                                    for (i in resultAll) {
                                        if (county == resultAll[i]._id) {
                                            var tmp = { y: resultAll[i].ps, count: resultAll[i].count };
                                            return tmp;
                                        }
                                    }
                                    return { y: 0, count: 0 };
                                };

                                var public1 = getPercByOwnershipByCounty("Public", CountyService.getCounty(county));
                                var private1 = getPercByOwnershipByCounty("Private", CountyService.getCounty(county));
                                var All = getPercByOwnershipAll(CountyService.getCounty(county));

                                sendResponse(xAxisArray, [{
                                    name: 'Public (N=' + public1.count + ')',
                                    data: [public1],
                                    color: '#3546C3'
                                }, {
                                    name: 'Private (N=' + private1.count + ')',
                                    data: [private1],
                                    color: '#43a2ca'
                                }, {
                                    name: 'All Ownerships (N=' + All.count + ')',
                                    data: [All],
                                    color: '#a8ddb5'
                                }]);
                            });
                        });
                    }

                } else if (hfType == "4") {

                    if (county == "All") {
                        xAxisArray = ['All Counties'];
                        InspectionDataService.getPercentageOfMeanScores(hfType, county, function(result) {

                            var risks = CountyService.getRiskList();
                            var finalResult = "";
                            for (i in risks) {
                                if (risks[i].value == "All") continue;
                                var key = risks[i].value;
                                var value = 0;
                                for (j in result) {
                                    if ((result[j]._id) == (key)) {
                                        value = result[j].ps;
                                        break;
                                    }
                                }
                                finalResult = finalResult + '"' + key + '" : ' + value + ',';
                            }
                            finalResult = finalResult.replace(/,\s*$/, "");
                            finalResult = "{" + finalResult + "}";
                            finalResult = JSON.parse(finalResult);

                            sendResponse(xAxisArray, [{
                                name: 'Fully',
                                data: [finalResult["Fully"]],
                                color: 'rgba(49, 112, 143,1)'
                            }, {
                                name: 'Substantially',
                                data: [finalResult["Substantially"]],
                                color: 'rgba(49, 112, 143,0.75)'
                            }, {
                                name: 'Partially',
                                data: [finalResult["Partially"]],
                                color: 'rgba(49, 112, 143,0.5)'
                            }, {
                                name: 'Minimally',
                                data: [finalResult["Minimally"]],
                                color: 'rgba(49, 112, 143,0.3)'
                            }])
                        });
                    } else if (county == "By County") {
                        xAxisArray = CountyService.getAll();
                        InspectionDataService.getPercentageOfMeanScores(hfType, county, function(result) {
                            function getPercByRiskByCounty(risk, county) {
                                for (i in result) {
                                    if (risk == result[i]._id.risk &&
                                        county == CountyService.getCounty(result[i]._id.county)) {
                                        return result[i].ps;
                                    }
                                }
                                return 0;
                            };

                            var fully1 = getPercByRiskByCounty("Fully", "Kakamega");
                            var fully2 = getPercByRiskByCounty("Fully", "Kilifi");
                            var fully3 = getPercByRiskByCounty("Fully", "Meru");
                            var substantially1 = getPercByRiskByCounty("Substantially", "Kakamega");
                            var substantially2 = getPercByRiskByCounty("Substantially", "Kilifi");
                            var substantially3 = getPercByRiskByCounty("Substantially", "Meru");
                            var partially1 = getPercByRiskByCounty("Partially", "Kakamega");
                            var partially2 = getPercByRiskByCounty("Partially", "Kilifi");
                            var partially3 = getPercByRiskByCounty("Partially", "Meru");
                            var minimally1 = getPercByRiskByCounty("Minimally", "Kakamega");
                            var minimally2 = getPercByRiskByCounty("Minimally", "Kilifi");
                            var minimally3 = getPercByRiskByCounty("Minimally", "Meru");
                            var total1 = fully1 + substantially1 + partially1 + minimally1;
                            var total2 = fully2 + substantially2 + partially2 + minimally2;
                            var total3 = fully3 + substantially3 + partially3 + minimally3;

                            fully1 = (100 * fully1) / total1;
                            fully2 = (100 * fully2) / total2;
                            fully3 = (100 * fully3) / total3;

                            substantially1 = (100 * substantially1) / total1;
                            substantially2 = (100 * substantially2) / total2;
                            substantially3 = (100 * substantially3) / total3;

                            partially1 = (100 * partially1) / total1;
                            partially2 = (100 * partially2) / total2;
                            partially3 = (100 * partially3) / total3;

                            minimally1 = (100 * minimally1) / total1;
                            minimally2 = (100 * minimally2) / total2;
                            minimally3 = (100 * minimally3) / total3;

                            sendResponse(xAxisArray, [{
                                name: 'Fully',
                                data: [fully1, fully2, fully3],
                                color: 'rgba(49, 112, 143,1)'
                            }, {
                                name: 'Substantially',
                                data: [substantially1, substantially2, substantially3],
                                color: 'rgba(49, 112, 143,0.75)'
                            }, {
                                name: 'Partially',
                                data: [partially1, partially2, partially3],
                                color: 'rgba(49, 112, 143,0.5)'
                            }, {
                                name: 'Minimally',
                                data: [minimally1, minimally2, minimally3],
                                color: 'rgba(49, 112, 143,0.3)'
                            }]);
                        });
                    } else {
                        xAxisArray = [CountyService.getCounty(county)];
                        InspectionDataService.getPercentageOfMeanScores(hfType, county, function(result) {
                            function getPercByRiskByCounty(risk, county) {
                                for (i in result) {
                                    if (risk == result[i]._id.risk &&
                                        county == CountyService.getCounty(result[i]._id.county)) {
                                        return result[i].ps;
                                    }
                                }
                                return 0;
                            };

                            var fully1 = getPercByRiskByCounty("Fully", CountyService.getCounty(county));
                            var substantially1 = getPercByRiskByCounty("Substantially", CountyService.getCounty(county));
                            var partially1 = getPercByRiskByCounty("Partially", CountyService.getCounty(county));
                            var minimally1 = getPercByRiskByCounty("Minimally", CountyService.getCounty(county));
                            var total1 = fully1 + substantially1 + partially1 + minimally1;

                            fully1 = (100 * fully1) / total1;
                            substantially1 = (100 * substantially1) / total1;
                            partially1 = (100 * partially1) / total1;
                            minimally1 = (100 * minimally1) / total1;

                            sendResponse(xAxisArray, [{
                                name: 'Fully',
                                data: [fully1],
                                color: 'rgba(49, 112, 143,1)'
                            }, {
                                name: 'Substantially',
                                data: [substantially1],
                                color: 'rgba(49, 112, 143,0.75)'
                            }, {
                                name: 'Partially',
                                data: [partially1],
                                color: 'rgba(49, 112, 143,0.5)'
                            }, {
                                name: 'Minimally',
                                data: [minimally1],
                                color: 'rgba(49, 112, 143,0.3)'
                            }]);
                        });
                    }
                }
            }
        }

        function sendResponse(categoryArray, seriesArray) {

            res.send({
                categoryArray: categoryArray,
                seriesArray: seriesArray,
            });
        }
    },

    getMapDataByFilter: function(req, res) {

        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');

        var cursor = collection.aggregate([
            { $match: { is_deleted: false, m_insp_completed: "Yes" } },
            {
                $group: {
                    _id: "$_hfid",
                    inspection: { $max: "$p_insp_number" },
                    _hfid: { $last: '$_hfid' },
                    m_visit_completed: { $last: '$m_visit_completed' },
                    m_followup_action: { $last: '$m_followup_action' },
                    risk_c: { $last: '$risk_c' },
                    _hfname: { $last: '$_hfname' },
                    _inspectorid: { $last: '$_inspectorid' },
                    _inspectorname: { $last: '$_inspectorname' },
                    _date: { $last: '$_date' },
                    _county: { $last: '$_county' },
                    _subcounty: { $last: '$_subcounty' },
                    _level: { $last: '$_level' },
                    _ownership: { $last: '$_ownership' },
                    p_location: { $last: '$p_location' },
                    p_latitude: { $last: '$p_latitude' },
                    p_longitude: { $last: '$p_longitude' },
                    total_ps: { $last: '$total_ps' },
                    p_market_size: { $last: '$p_market_size' }
                }
            },
            {
                $project: {
                    inspection: 1,
                    "_hfid": 1,
                    "_hfname": 1,
                    "_inspectorid": 1,
                    "_inspectorname": 1,
                    "_date": 1,
                    "_county": 1,
                    "_subcounty": 1,
                    "_level": 1,
                    "_ownership": 1,
                    "p_location": 1,
                    "p_latitude": 1,
                    "p_longitude": 1,
                    "risk_c": 1,
                    "total_ps": 1,
                    "p_market_size": 1,
                    "m_visit_completed": 1,
                    "m_followup_action": 1
                }
            }
        ]);

        cursor.toArray(function(err, result) {

            for (var i = 0; i < result.length; i++) {

                result[i]._county = CountyService.getCountyNumber(result[i]._county);
                result[i]._level = CountyService.getLevelNumber(result[i]._level);

            }
            res.send({ facilities: result });
        });
    },

    getAllFacilities: function(req, res) {
        res.send({ facilities: facilities });
    }
}