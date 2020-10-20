/**
 * QualityChecksController
 *
 * @description :: Server-side logic for managing Quality Checks
 * @author : Jay Pastagia
 */
var nodemailer = require('async');
module.exports = {

    //Quality start

    getQualityOfficersNames: function(req, res) {
        var county = req.param("county");

        var loggedInUser = req.session.loggedInUser;
        UserService.getQualityOfficersNames(loggedInUser, county, sendResponse);

        function sendResponse(Officers) {

            res.send({
                "Officers": Officers,
            });
        }
    },
    getFilterValues: function(req, res) {
        var loggedInUser = req.session.loggedInUser;
        var countyList = CountyService.getCountiesInFiguresByRole(loggedInUser);
        res.send({
            countyList: countyList
        });
    },

    exportDatabank: function(req, res) {


        var county = req.param("county");
        var inspectorId = req.param("officerId");
        var period = req.param("inspPeriod");
        var inspectorName = req.param("officerName");
        var periodArr = [];
        county = CountyService.getCounty(county);

        if (Array.isArray(period)) {

            periodArr = period;

        } else {
            periodArr.push(period);
        }

        var conditionArray = [];

        conditionArray.push({ is_deleted: false });
        if (county != "All") {
            conditionArray.push({ _county: county });
        }
        if (inspectorId != "All") {
            inspectorId = parseInt(inspectorId);
            conditionArray.push({ _inspectorid: inspectorId });
        }
        if (period != "All") {
            conditionArray.push({ p_period: { $in: periodArr } });
        }


        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');
        var cursor = collection.find({
            $and: conditionArray
        }, {
            _county: 1,
            _subcounty: 1,
            _hfid: 1,
            _hfname: 1,
            _ownership: 1,
            _level: 1,
            q_qoname: 1,
            q_jhic: 1,
            q_date_plan_jhic: 1,
            q_scorecards: 1,
            q_date_plan_scorecards: 1,
            q_closure: 1,
            q_date_plan_closure: 1,
            q_closure_rad: 1,
            q_date_plan_closure_rad: 1,
            q_closure_lab: 1,
            q_date_plan_closure_lab: 1,
            q_closure_nutri: 1,
            q_date_plan_closure_nutri: 1,
            q_closure_pharm: 1,
            q_date_plan_closure_pharm: 1,

            p_nearest_market: 1,
            p_market_id: 1,
            p_market_size: 1,
            p_treatment: 1,
            p_schmt: 1,
            p_distance_county: 1,
            p_transtype: 1,
            p_incharge: 1,
            p_incharge_no: 1,
            p_period: 1,
            p_insp_number: 1,
            p_latitude: 1,
            p_longitude: 1,
            p_date: 1,
            p_insp_type: 1,
            p_camp: 1,
            p_landmark: 1,
            p_alternatecontact: 1,
            p_description: 1,
            p_alternatecontact_no: 1,
            p_transitime: 1
        });


        cursor.toArray(function(err, result) {

            var data = result;

            var xl = require('excel4node');
            var wb = new xl.Workbook();
            var ws;

            ws = wb.addWorksheet('QualityReports_Visit_Plans');

            var http = require('http');
            var fs = require('fs');
            var xlsxFileName = ".tmp/excelFile_" + new Date() + ".xlsx";
            var sheetRow = 1;

            //styles
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

            ws.row(sheetRow).setHeight(70);

            ws.cell(sheetRow, 1, sheetRow++, 40, true).string('KePSIE Monitoring System, Ministry of Health')
                .style({ alignment: { horizontal: ['center'], vertical: ['center'] }, font: { color: 'black', size: 13, bold: true } });

            ws.cell(sheetRow, 1, sheetRow++, 40, true).string('Quality Checks Visit Plan')
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
            ws.cell(sheetRow, 1, sheetRow++, 40, true).string(' County: ' + county + ' | Quality Officer: ' + inspectorName + ' | Inspection Period: ' + periodArr + ' ')
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
            ws.cell(sheetRow, 1, sheetRow++, 40, true).string('Quality Checks Visit Plan for Inspection Period ' + periodArr)
                .style({ alignment: { horizontal: ['center'] }, font: { color: 'black', size: 13, bold: true } });

            var keys = [
                { type: "number", key: "_hfid", name: "Facility Id" },
                { type: "string", key: "_hfname", name: "Facility Name" },
                { type: "string", key: "_county", name: "County" },
                { type: "string", key: "_subcounty", name: "Sub-County" },
                { type: "string", key: "_ownership", name: "Ownership" },

                { type: "string", key: "_level", name: "Level" },

                { type: "string", key: "q_qoname", name: "Quality Officer Name" },
                { type: "string", key: "q_jhic", name: "HF selected for JHIC checks (Yes or No)" },
                { type: "string", key: "q_date_plan_jhic", name: "Planned JHIC Check Visit Date" },
                { type: "string", key: "q_scorecards", name: "HF selected for Scorecard checks (Yes or No)" },

                { type: "string", key: "q_date_plan_scorecards", name: "Planned Scorecard Check Visit Date" },


                { type: "string", key: "q_closure", name: "HF selected for Facility closure checks (Yes or No)" },
                { type: "string", key: "q_date_plan_closure", name: "Planned Facility Closure Check Visit Date" },
                { type: "string", key: "q_closure_rad", name: "HF selected for Radiology closure checks (Yes or No)" },
                { type: "string", key: "q_date_plan_closure_rad", name: "Planned Radiology Closure Check Visit Date" },
                { type: "string", key: "q_closure_lab", name: "HF selected for Laboratory closure checks (Yes or No)" },
                { type: "string", key: "q_date_plan_closure_lab", name: "Planned Lab Closure Check Visit Date" },
                { type: "string", key: "q_closure_nutri", name: "HF selected for Nutrition closure checks (Yes or No)" },
                { type: "string", key: "q_date_plan_closure_nutri", name: "Planned Nutrition Closure Check Visit Date" },
                { type: "string", key: "q_closure_pharm", name: "HF selected for Pharmacy closure checks (Yes or No)" },
                { type: "string", key: "q_date_plan_closure_pharm", name: "Planned Pharmacy Closure Check Visit Date" },

                { type: "string", key: "p_date", name: "Planned Inspection Date" },

                { type: "string", key: "p_nearest_market", name: "Nearest Market" },
                { type: "number", key: "p_market_id", name: "Market ID" },
                { type: "number", key: "p_market_size", name: "Market size" },
                { type: "number", key: "p_treatment", name: "T Group" },
                { type: "string", key: "p_schmt", name: "SCHMT Office" },
                { type: "number", key: "p_distance_county", name: "Distance from County Office(km)" },
                { type: "string", key: "p_transtype", name: "Transportation Mode" },

                { type: "string", key: "p_incharge", name: "In-Charge Name" },
                { type: "number", key: "p_incharge_no", name: "In-Charge Phone" },
                { type: "string", key: "p_description", name: "Detailed Dscription of Location" },
                { type: "string", key: "p_insp_type", name: "Inspection type" },
                { type: "string", key: "p_camp", name: "Recommended camping location" },
                { type: "string", key: "p_transitime", name: "Estimated transport time from camping location" },
                { type: "string", key: "p_landmark", name: "Landmark" },
                { type: "string", key: "p_alternatecontact", name: "Alternatecontact" },

                { type: "string", key: "p_alternatecontact_no", name: "alternatecontact_no" },
                { type: "number", key: "p_longitude", name: "Longitude" },

                { type: "number", key: "p_latitude", name: "Latitude" }

            ];

            for (var k = 0; k < keys.length; k++) {

                ws.cell(sheetRow, k + 1).string(keys[k].name).style(headerCenterStyle);
            }

            sheetRow++;

            for (i in data) {

                if (data[i]["q_jhic"] == 1) {
                    data[i]["q_jhic"] = "Yes";
                } else if (data[i]["q_jhic"] == 0) {
                    data[i]["q_jhic"] = "No";
                }

                if (data[i]["q_scorecards"] == 1) {
                    data[i]["q_scorecards"] = "Yes";
                } else if (data[i]["q_scorecards"] == 0) {
                    data[i]["q_scorecards"] = "No";
                }
                if (data[i]["q_closure"] == 1) {
                    data[i]["q_closure"] = "Yes";
                } else if (data[i]["q_closure"] == 0) {
                    data[i]["q_closure"] = "No";
                }

                if (data[i]["q_closure_rad"] == 1) {
                    data[i]["q_closure_rad"] = "Yes";
                } else if (data[i]["q_closure_rad"] == 0) {
                    data[i]["q_closure_rad"] = "No";
                }

                if (data[i]["q_closure_lab"] == 1) {
                    data[i]["q_closure_lab"] = "Yes";
                } else if (data[i]["q_closure_lab"] == 0) {
                    data[i]["q_closure_lab"] = "No";
                }

                if (data[i]["q_closure_nutri"] == 1) {
                    data[i]["q_closure_nutri"] = "Yes";
                } else if (data[i]["q_closure_nutri"] == 0) {
                    data[i]["q_closure_nutri"] = "No";
                }

                if (data[i]["q_closure_pharm"] == 1) {
                    data[i]["q_closure_pharm"] = "Yes";
                } else if (data[i]["q_closure_pharm"] == 0) {
                    data[i]["q_closure_pharm"] = "No";
                }

                var obj = data[i];

                for (var j = 0; j < keys.length; j++) {

                    if (data[i][keys[j]["key"]] == undefined) {

                        ws.cell(sheetRow, j + 1).string("").style(normalCenterStyle);
                    } else {

                        if (keys[j]["type"] == "string") {

                            ws.cell(sheetRow, j + 1).string(data[i][keys[j]["key"]]).style(normalCenterStyle);

                        } else {
                            ws.cell(sheetRow, j + 1).number(data[i][keys[j]["key"]]).style(normalCenterStyle);
                        }
                    }
                }

                sheetRow++;
            }
            console.log("setWidth");
            ws.column(1).setWidth(15);
            ws.column(2).setWidth(15);
            ws.column(3).setWidth(25);
            ws.column(4).setWidth(15);
            ws.column(5).setWidth(20);
            ws.column(6).setWidth(10);
            ws.column(7).setWidth(15);
            ws.column(8).setWidth(20);
            ws.column(9).setWidth(10);
            ws.column(10).setWidth(25);
            ws.column(11).setWidth(10);
            ws.column(12).setWidth(15);
            ws.column(13).setWidth(25);
            ws.column(14).setWidth(15);
            ws.column(15).setWidth(25);
            ws.column(16).setWidth(15);
            ws.column(17).setWidth(15);
            ws.column(18).setWidth(15);
            console.log("finish");

            setTimeout(sendExcelFile, 1000);

            function sendExcelFile() {
                wb.write(xlsxFileName, function(err, stats) {
                    if (err) {
                        console.error(err);
                    }

                    var fileName = "";

                    fileName = 'Quality_Checks_Visit_Plan_' + (CountyService.formateDate()) + ".xlsx";

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
        });

    },

    exportDatabankPdf: function(req, res) {

        var county = req.param("county");
        var officerId = req.param("officerId");
        var period = req.param("inspPeriod");
        var officerName = req.param("officerName");
        var facilityList = req.param("facilityList");

        var facility_array = [];

        if (Array.isArray(facilityList)) {

            for (var i = 0; i < facilityList.length; i++) {
                facility_array.push(parseInt(facilityList[i]));
            }

        } else {
            facility_array.push(parseInt(facilityList));

        }

        var periodArr = [];
        county = CountyService.getCounty(county);

        if (Array.isArray(period)) {

            periodArr = period;

        } else {
            periodArr.push(period);
        }

        var conditionArray = [];

        conditionArray.push({ is_deleted: false }, { _hfid: { $in: facility_array } });
        if (county != "All") {
            conditionArray.push({ _county: county });
        }
        if (officerId != "All") {
            officerId = parseInt(officerId);
            conditionArray.push({ q_qoid: officerId });
        }
        if (period != "All") {
            conditionArray.push({ p_period: { $in: periodArr } });
        }

        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');
        var cursor = collection.find({
            $and: conditionArray
        }, {
            _county: 1,
            _subcounty: 1,
            _hfid: 1,
            _hfname: 1,
            _ownership: 1,
            _level: 1,
            q_jhic: 1,
            q_scorecards: 1,
            q_closure: 1,
            q_closure_rad: 1,
            q_closure_lab: 1,
            q_closure_nutri: 1,
            q_closure_pharm: 1,

            p_nearest_market: 1,
            p_treatment: 1,
            p_incharge: 1,
            p_incharge_no: 1,
            p_description: 1,
            p_landmark: 1,
            p_alternatecontact: 1,
            p_alternatecontact_no: 1,
            p_latitude: 1,
            p_longitude: 1
        });

        var fs = require('fs');
        var dt = new Date();

        var username = req.session.loggedInUser.name + dt;

        fs.exists('.tmp/' + username, function(exists) {
            if (exists) {
                console.log('yes folder available');
            } else {
                console.log("no such folder available..");
                fs.mkdirSync('.tmp/' + username);
            }
        });

        cursor.toArray(function(err, result) {

            var facilityDetail = result;
            console.log("pdf========");

            console.log(facilityDetail);

            if (facilityDetail.length == 0) {

                console.log("No PDF available");
                var path = '.tmp/';

                req.flash('noPdfFound', 'No PDF available');
                return res.redirect(sails.config.routesPrefix + '/qualitychecks/planning/table');
            } else {


                var PdfPrinter = require('pdfmake/src/printer');
                var fonts = {
                    Dejavu: {
                        normal: '/usr/share/fonts/truetype/opensans/OpenSans-Regular.ttf',
                        bold: '/usr/share/fonts/truetype/opensans/OpenSans-Regular.ttf',
                        italics: '/usr/share/fonts/truetype/opensans/OpenSans-Italic.ttf',
                        bolditalics: '/usr/share/fonts/truetype/opensans/OpenSans-Italic.ttf'
                            /*local path start */
                            /* normal: '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
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

                var tblContent = [];


                async.eachSeries(facilityDetail, function(item, callback) {


                    var hfid = (item["_hfid"] == undefined) ? "" : "" + item["_hfid"].toString();
                    var hfname = (item["_hfname"] == undefined) ? "" : "" + item["_hfname"].toString();
                    var ownership = (item["_ownership"] == undefined) ? "" : "" + item["_ownership"].toString();
                    var level = (item["_level"] == undefined) ? "" : "" + item["_level"].toString();

                    var p_nearest_market = (item["p_nearest_market"] == undefined) ? "" : "" + item["p_nearest_market"].toString();
                    var p_treatment = (item["p_treatment"] == undefined) ? "" : "" + item["p_treatment"].toString();
                    var p_incharge = (item["p_incharge"] == undefined) ? "" : "" + item["p_incharge"].toString();
                    var p_incharge_no = (item["p_incharge_no"] == undefined) ? "" : "" + item["p_incharge_no"].toString();
                    var p_description = (item["p_description"] == undefined) ? "" : "" + item["p_description"].toString();
                    var p_landmark = (item["p_landmark"] == undefined) ? "" : "" + item["p_landmark"].toString();
                    var p_alternatecontact = (item["p_alternatecontact"] == undefined) ? "" : "" + item["p_alternatecontact"].toString();
                    var p_alternatecontact_no = (item["p_alternatecontact_no"] == undefined) ? "" : "" + item["p_alternatecontact_no"].toString();
                    var p_longitude = (item["p_longitude"] == undefined) ? "" : "" + item["p_longitude"].toString();
                    var p_latitude = (item["p_latitude"] == undefined) ? "" : "" + item["p_latitude"].toString();

                    var q_jhic = (item["q_jhic"] == undefined) ? "" : "" + item["q_jhic"].toString();
                    var q_scorecards = (item["q_scorecards"] == undefined) ? "" : "" + item["q_scorecards"].toString();
                    var q_closure = (item["q_closure"] == undefined) ? "" : "" + item["q_closure"].toString();
                    var q_closure_rad = (item["q_closure_rad"] == undefined) ? "" : "" + item["q_closure_rad"].toString();
                    var q_closure_lab = (item["q_closure_lab"] == undefined) ? "" : "" + item["q_closure_lab"].toString();
                    var q_closure_nutri = (item["q_closure_nutri"] == undefined) ? "" : "" + item["q_closure_nutri"].toString();
                    var q_closure_pharm = (item["q_closure_pharm"] == undefined) ? "" : "" + item["q_closure_pharm"].toString();

                    console.log("checks 1========");

                    tblContent = [
                        [{ text: 'Item', style: 'tableHeader' },
                            { text: 'Details', style: 'tableHeader' }
                        ],
                        ["Facility ID", hfid],
                        ["Facility Name", hfname],
                        ["Ownership", ownership],
                        ["Level", level],

                        ["HF selected for JHIC checks (1 = Yes; 0 = No)", q_jhic],
                        ["HF selected for Scorecard checks (1 = Yes; 0 = No) ", q_scorecards],
                        ["HF selected for Facility closure checks (1 = Yes; 0 = No)", q_closure],

                        ["HF selected for Radiology closure checks (1 = Yes; 0 = No)", q_closure_rad],

                        ["HF selected for Laboratory closure checks (1 = Yes; 0 = No)", q_closure_lab],
                        ["HF selected for Nutrition closure checks (1 = Yes; 0 = No)", q_closure_nutri],

                        ["HF selected for Pharmacy closure checks (1 = Yes; 0 = No)", q_closure_pharm],


                        ["Nearest Market", p_nearest_market],
                        ["T Group", p_treatment],
                        ["In-Charge Name", p_incharge],
                        ["In-Charge Phone", p_incharge_no],
                        ["Detailed Description of Location", p_description],
                        ["Landmark", p_landmark],
                        ["Alternate Contact", p_alternatecontact],
                        ["Alternate Contact Number", p_alternatecontact_no],
                        ["Longitude", p_longitude],
                        ["Latitude", p_latitude]

                    ];


                    var headerNote = "County: " + county + " | Quality Officer: " + officerName + " | Inspection Period: " + period + " | Facility: " + hfid;

                    var docDefinition = {
                        footer: function(currentPage, pageCount) {
                            return { text: currentPage.toString() + ' of ' + pageCount, alignment: 'center' };
                        },
                        content: [{
                                image: data,
                                fit: [84, 76],
                                alignment: 'center',
                            },
                            {
                                text: "Daily Inspector Visit Plan",
                                alignment: 'center',
                            },
                            {
                                text: headerNote,
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

                                margin: [35, 5, 0, 0]
                            },
                            tableHeader: {
                                bold: true,
                                fontSize: 11,
                                color: 'black'
                            },
                            logoHeader: {
                                margin: [0, 0, 0, 0]
                            },
                            note: {
                                fontSize: 9,
                                bold: true
                            }
                        },
                        defaultStyle: {
                            font: 'Dejavu'
                        }
                    };

                    var pdfDoc = printer.createPdfKitDocument(docDefinition);
                    var fileName = hfname + hfid + ".pdf";

                    var writeStream = fs.createWriteStream('.tmp/' + username + '/' + fileName, { encoding: 'utf8' });

                    pdfDoc.pipe(writeStream);
                    pdfDoc.end();

                    writeStream.once('finish', function() {

                        callback();
                    });
                }, function(err) {

                    if (err) {

                        console.log('A pdfs failed to process');
                    } else {
                        console.log('All pdfs have been processed successfully');

                        var fileNames = [];

                        var arrayOfFiles = fs.readdirSync('.tmp/' + username + '/');

                        arrayOfFiles.forEach(function(file) {
                            fileNames.push(file);
                        });

                        var output = fs.createWriteStream('.tmp/Quality_Checks_Visit_Plan_' + dt + '.zip');

                        var archiver = require('archiver');
                        archive = archiver('zip');

                        archive.pipe(output);

                        var getStream = function(fileName) {
                            return fs.readFileSync(fileName);
                        }

                        for (i = 0; i < fileNames.length; i++) {
                            var path = '.tmp/' + username + '/' + fileNames[i];
                            archive.append(getStream(path), { name: fileNames[i] });
                        }
                        output.on('close', function() {});

                        archive.finalize(function(err, bytes) {
                            if (err) {
                                console.log("error....");
                                throw err;
                            }
                            console.log(bytes + ' total bytes');
                        });

                        output.on('error', function(err) {
                            console.log("-----Error----->>>>");
                            console.log(err);
                        });

                        output.on('finish', function() {

                            res.download('.tmp/Quality_Checks_Visit_Plan_' + dt + '.zip');

                            var path = '.tmp/';
                        });
                    }
                });

            }
        });
    },


    getFigureData: function(req, res) {

        var county = req.param("county");
        var indicator = req.param("indicator");
        console.log("here is the county: " + county);
        console.log(indicator);
        var conditionString = { is_deleted: false, m_insp_completed: "Yes" };
        if (county.value != "All") {
            conditionString._county = county.value;

        }
        var indicatorQuery = [];
        var indicatorCompQuery = [];

        var indicatorList = ['$q_jhic', '$q_scorecards', '$q_closure', '$q_closure_rad',
            '$q_closure_lab', '$q_closure_nutri', '$q_closure_pharm'
        ];

        var indicatorListComp = ['$q_jhic_comp', '$q_scorecards_comp', '$q_closure_comp',
            '$q_closure_rad_comp',
            '$q_closure_lab_comp', '$q_closure_nutri_comp', '$q_closure_pharm_comp'
        ];

        var tmpIndiactor = ['JHIC Discrepancies', 'Scorecard Non-Adherence',
            'Facility Closure Non-Adherence', 'Pharmacy Closure Non-Adherence',
            'Lab Closure Non-Adherence', 'Radiology Closure Non-Adherence',
            'Nutrition Closure Non-Adherence'
        ];

        if (indicator.length == 1 && indicator[0] == "All") {
            indicatorQuery = indicatorList
            indicatorCompQuery = indicatorListComp
        } else {
            for (var i = 0; i < indicator.length; i++) {
                var index = tmpIndiactor.indexOf(indicator[i]);
                if (index != -1) {
                    indicatorQuery.push(indicatorList[index]);
                    indicatorCompQuery.push(indicatorListComp[index]);
                }
            }
        }
        var mongo = require('mongodb');

        var collection = MongoService.getDB().collection('facility');
        var cursor = collection.aggregate([
            { $match: conditionString },
            { $sort: { p_insp_number: 1 } },
            {
                $group: {
                    _id: "$_hfid",
                    inspection: { $max: "$p_insp_number" },
                    latest: { $last: "$$ROOT" }
                }
            },
            {
                $group: {
                    _id: {
                        year: { "$substr": ["$latest.p_date", 0, 4] },
                        month: { "$substr": ["$latest.p_date", 5, 2] }
                    },
                    count: { $sum: 1 },
                    q_jhic: { $sum: '$latest.q_jhic' },
                    q_scorecards: { $sum: '$latest.q_scorecards' },
                    q_closure: { $sum: '$latest.q_closure' },
                    q_closure_rad: { $sum: '$latest.q_closure_rad' },
                    q_closure_lab: { $sum: '$latest.q_closure_lab' },
                    q_closure_nutri: { $sum: '$latest.q_closure_nutri' },
                    q_closure_pharm: { $sum: '$latest.q_closure_pharm' },

                    q_jhic_comp: { $sum: '$latest.q_jhic_comp' },
                    q_scorecards_comp: { $sum: '$latest.q_scorecards_comp' },
                    q_closure_comp: { $sum: '$latest.q_closure_comp' },
                    q_closure_rad_comp: { $sum: '$latest.q_closure_rad_comp' },
                    q_closure_lab_comp: { $sum: '$latest.q_closure_lab_comp' },
                    q_closure_nutri_comp: { $sum: '$latest.q_closure_nutri_comp' },
                    q_closure_pharm_comp: { $sum: '$latest.q_closure_pharm_comp' }
                }
            }, {
                $project: {
                    q_jhic: '$q_jhic',
                    q_scorecards: '$q_scorecards',
                    q_closure: '$q_closure',
                    q_closure_rad: '$q_closure_rad',
                    q_closure_lab: '$q_closure_lab',
                    q_closure_nutri: '$q_closure_nutri',
                    q_closure_pharm: '$q_closure_pharm',

                    q_jhic_comp: '$q_jhic_comp',
                    q_scorecards_comp: '$q_scorecards_comp',
                    q_closure_comp: '$q_closure_comp',
                    q_closure_rad_comp: '$q_closure_rad_comp',
                    q_closure_lab_comp: '$q_closure_lab_comp',
                    q_closure_nutri_comp: '$q_closure_nutri_comp',
                    q_closure_pharm_comp: '$q_closure_pharm_comp',

                    total: { '$add': indicatorQuery },
                    total_comp: { '$add': indicatorCompQuery }
                }

            }
        ]);

        cursor.toArray(function(err, result) {

            var cursor1 = collection.aggregate(
                [{
                    $group: {
                        _id: null,

                        lastUpdateDate: { $max: "$updatedAt" }
                    }
                }]
            );

            cursor1.toArray(function(err, updateDate) {

                var year, nextYear;

                var date = new Date();

                if (date.getMonth() < 9 && date.getMonth() >= 0) {

                    year = (new Date().getFullYear() - 1).toString();
                    nextYear = (new Date().getFullYear()).toString();
                } else {
                    year = new Date().getFullYear().toString();
                    nextYear = (new Date().getFullYear() + 1).toString();
                }

                var inspWave = CountyService.getInspectionWave();
                var currentWave = inspWave.currentWave;

                var monthArr = []


                /*For 3-month wave
                  
                 if(currentWave==1){

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

                if (currentWave == 1) {

                    monthArr = [{ year: year, month: "11" }, { year: year, month: "12" },
                        { year: nextYear, month: "01" }, { year: nextYear, month: "02" }
                    ];

                } else if (currentWave == 2) {

                    monthArr = [{ year: year, month: "11" }, { year: year, month: "12" },
                        { year: nextYear, month: "01" }, { year: nextYear, month: "02" }, { year: nextYear, month: "03" },
                        { year: nextYear, month: "04" }, { year: nextYear, month: "05" }, { year: nextYear, month: "06" }
                    ];

                } else if (currentWave == 3) {

                    monthArr = [{ year: year, month: "11" }, { year: year, month: "12" },
                        { year: nextYear, month: "01" }, { year: nextYear, month: "02" }, { year: nextYear, month: "03" },
                        { year: nextYear, month: "04" }, { year: nextYear, month: "05" }, { year: nextYear, month: "06" },
                        { year: nextYear, month: "07" }, { year: nextYear, month: "08" }, { year: nextYear, month: "09" },
                        { year: nextYear, month: "10" }
                    ];

                }
                var dt_year = new Date().getFullYear();

                var insp_conducted = [];
                var insp_projected = [];

                for (var j = 0; j < monthArr.length; j++) {

                    var projected = 0;
                    var flag = 0;

                    for (var i = 0; i < result.length; i++) {
                        if (result[i]._id.month == monthArr[j].month && result[i]._id.year == monthArr[j].year) {

                            insp_projected.push(result[i].total);
                            insp_conducted.push(result[i].total_comp);
                            flag = 1;
                        }
                    }

                    if (flag == 0) {
                        insp_conducted.push(0);
                        insp_projected.push(0);
                    }
                }

                var updateDate;
                if (updateDate[0] != undefined) {
                    updateDate = updateDate[0].lastUpdateDate;
                } else {
                    updateDate = "";
                }
                console.log(updateDate);

                res.json({ insp_conducted: insp_conducted, insp_projected: insp_projected, updateDate: updateDate })

            });
        });

    },

    //Quality end


    reportfigures: function(req, res) {
        res.view('qualitychecks/reportsFigure');
    },
    reporttables: function(req, res) {
        res.view('qualitychecks/reportsTable');
    },

    //figures
    planningfigures: function(req, res) {
        res.view('qualitychecks/planningFigure');
    },


    getFacilityList: function(req, res) {

        var loggedInUser = req.session.loggedInUser;

        var condObj = {};
        console.log("inside get facilityList");

        if (loggedInUser.role == "Inspector") {

            condObj = {
                m_insp_completed: "Yes",
                is_deleted: false,
                _county: loggedInUser.county,
                q_qoid: loggedInUser.inspectorId
            };
        } else {

            var county = req.param("county").value;
            var officerId = req.param("officer")._id;

            console.log(county + "========" + officerId);

            condObj = {
                m_insp_completed: "Yes",
                is_deleted: false
            };

            if (county != "All") {
                condObj._county = county;
            }
            if (officerId != "All") {
                condObj.q_qoid = officerId;

            }
        }

        Facility.find(condObj, { _hfid: 1, _hfname: 1 }).sort('_hfid ASC').exec(function(err, facilityId) {

            res.json({ facilityList: facilityId });

        });

    },

    planningtables: function(req, res) {
        res.view('qualitychecks/planningTable');
    },

    planningmaps: function(req, res) {
        res.view('qualitychecks/planningMap');
    },
    getVisitPlanMapData: function(req, res) {

        console.log("req.param() : " + req.param("inspector"));
        var county = req.param("county");
        var inspectorId = req.param("inspector");
        var period = req.param("inspPeriod");


        var conditionArray = [];

        conditionArray.push({ is_deleted: false });
        if (county != "All") {
            conditionArray.push({ _county: county });
        }
        if (inspectorId != "All") {
            inspectorId = parseInt(inspectorId);
            conditionArray.push({ q_qoid: inspectorId });
        }
        if (period != "All") {
            conditionArray.push({ p_period: period });
        }

        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');
        var cursor = collection.find({
            $and: conditionArray
        }, {
            _county: 1,
            _subcounty: 1,
            _hfid: 1,
            _hfname: 1,
            _ownership: 1,
            _level: 1,
            p_market_size: 1,
            p_latitude: 1,
            p_longitude: 1,
            q_jhic: 1,
            q_scorecards: 1,
            q_closure: 1,
            q_closure_rad: 1,
            q_closure_lab: 1,
            q_closure_nutri: 1,
            q_closure_pharm: 1,
            q_jhic_comp: 1,
            q_scorecards_comp: 1,
            q_closure_comp: 1,
            q_closure_rad_comp: 1,
            q_closure_lab_comp: 1,
            q_closure_nutri_comp: 1,
            q_closure_pharm_comp: 1
        });


        cursor.toArray(function(err, result) {

            console.log("visitPlanMap result");
            console.log(result);
            res.json(result);

        });

    },


    exportMapAsKML: function(req, res) {
        console.log("req.param() : " + req.param("inspector"));
        var county = req.param("county");
        var inspectorId = req.param("inspector");
        var period = req.param("inspPeriod");
        console.log("county : " + county);
        console.log("inspectorId : " + inspectorId);
        console.log("period : " + period);
        var conditionArray = [];

        conditionArray.push({ is_deleted: false });
        if (county != "All") {
            conditionArray.push({ _county: county });
        }
        if (inspectorId != "All") {
            inspectorId = parseInt(inspectorId);
            conditionArray.push({ _inspectorid: inspectorId });
        }
        if (period != "All") {
            conditionArray.push({ p_period: period });
        }
        console.log("county : " + county);
        console.log("inspectorId : " + inspectorId);
        console.log("period : " + period);

        county = CountyService.getCountyNumber(county);

        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');
        var cursor = collection.find({
            $and: conditionArray
        }, {
            _county: 1,
            _subcounty: 1,
            _hfid: 1,
            _hfname: 1,
            _ownership: 1,
            _level: 1,
            p_market_size: 1,
            p_latitude: 1,
            p_longitude: 1,
            q_jhic: 1,
            q_scorecards: 1,
            q_closure: 1,
            q_closure_rad: 1,
            q_closure_lab: 1,
            q_closure_nutri: 1,
            q_closure_pharm: 1,
            q_jhic_comp: 1,
            q_scorecards_comp: 1,
            q_closure_comp: 1,
            q_closure_rad_comp: 1,
            q_closure_lab_comp: 1,
            q_closure_nutri_comp: 1,
            q_closure_pharm_comp: 1
        });


        cursor.toArray(function(err, result) {

            facilities = result;
            for (var i = 0; i < result.length; i++) {
                result[i]._level = CountyService.getLevelNumber(result[i]._level);
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
                if (facilities[i].m_visit_completed == "No" || facilities[i].m_visit_completed == "Yes") {
                    content = content + '<Placemark>';
                    content = content + '<name>' + facilities[i]._hfid + '</name>';
                    content = content + '<description>';
                    content = content + 'HF Name : ' + facilities[i]._hfname + '\n';
                    content = content + 'County : ' + facilities[i]._county + '\n';
                    content = content + 'Sub County : ' + facilities[i]._subcounty + '\n';
                    content = content + 'Ownership : ' + facilities[i]._ownership + '\n';
                    content = content + 'Level : ' + facilities[i]._level + '\n';

                    content = content + 'Market Size : ' + facilities[i].p_market_size + '\n';

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
            var fileName = "InspectorVisitPlanMap" + (CountyService.formateDate()) + ".kml"
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
        var county = req.param("county");
        var inspPeriod = req.param("inspPeriod");
        var indicator = req.param("indicator");
        var inspector = req.param("inspector");

        console.log(inspector)
        console.log(indicator);

        console.log("qualitychecks Table=====" + county + "-------" + inspPeriod);


        var headerData = [];
        var qualityData = [];
        var subHeaderData = [];
        var footData = [];
        var QualityReportResponse = [];



        var conditionString = '"is_deleted":false,';
        if (county != "All" && county != "By County") {
            conditionString = conditionString + '"_county":"' + county + '",';
        }

        if (inspPeriod != "All") {
            conditionString = conditionString + '"p_period":"' + inspPeriod + '",';
        }

        conditionString = conditionString.replace(/,\s*$/, "");

        conditionString = "{" + conditionString + "}";
        conditionString = JSON.parse(conditionString);

        console.log("Check hereee 1");

        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');

        if (indicator.indexOf("JHIC Discrepancies") != -1 && indicator.length == 1) {

            var conditionString1 = '"is_deleted":false,"q_jhic_comp":1,';
            if (county != "All" && county != "By County") {
                conditionString1 = conditionString1 + '"_county":"' + county + '",';
            }

            if (inspPeriod != "All") {
                conditionString1 = conditionString1 + '"p_period":"' + inspPeriod + '",';
            }

            if (inspector._id != "All") {

                console.log("inspector not All");
                console.log(parseInt(inspector._id));
                console.log(inspector._id);
                var inspectorId = parseInt(inspector._id)
                console.log(inspectorId);

                conditionString1 = conditionString1 + '"_inspectorid":' + inspectorId + ',';

            }
            console.log("Check hereee 2");

            console.log(conditionString1);

            conditionString1 = conditionString1.replace(/,\s*$/, "");

            conditionString1 = "{" + conditionString1 + "}";
            conditionString1 = JSON.parse(conditionString1);

            console.log(conditionString1);

            var cursor = collection.aggregate([{ $match: conditionString1 },
                {
                    "$group": {
                        _id: { inspId: "$_inspectorid" },
                        inspName: { $last: "$_inspectorname" },
                        county: { $last: "$_county" },
                        avgResult: { $avg: { $multiply: ["$q_jhic_disc", 100] } },
                        count: { $sum: "$q_jhic_comp" }
                    }
                }
            ]);


            var cursor1 = collection.aggregate(
                [{ $match: { q_jhic_disc: { $ne: null } } },
                    {
                        $group: {
                            _id: "$q_jhic_disc",
                            count: { $sum: "$q_jhic_comp" }
                        }
                    }, { $sort: { _id: -1 } }
                ]
            );

            var avg_q_jhic = collection.aggregate([{ $match: conditionString },
                {
                    $group: {
                        _id: null,
                        "q_jhic_disc": { $avg: { $multiply: ["$q_jhic_disc", 100] } }
                    }
                }
            ]);

            cursor.toArray(function(err, result) {

                var headerName;

                if (county == "All") {
                    headerName = "All";
                } else {
                    headerName = county;
                }

                console.log("result check here........");
                console.log(result);

                headerData.push({ title: headerName });
                subHeaderData.push({ title: "Observations" }, { title: "Mean" });

                var kakamegaInspList = [];
                var kilifiInspList = [];
                var meruInspList = [];


                for (var i = 0; i < result.length; i++) {

                    if (result[i]["county"] == "Kakamega") {

                        kakamegaInspList.push([
                            result[i].inspName,
                            result[i]["count"] + "",
                            result[i]["avgResult"] + "%"
                        ]);

                    } else if (result[i]["county"] == "Kilifi") {

                        kilifiInspList.push([
                            result[i].inspName,
                            result[i]["count"] + "",
                            result[i]["avgResult"] + "%"
                        ]);

                    } else if (result[i]["county"] == "Meru") {

                        meruInspList.push([
                            result[i].inspName,
                            result[i]["count"] + "",
                            result[i]["avgResult"] + "%"
                        ]);
                    }
                }

                qualityData = kakamegaInspList.concat(kilifiInspList);

                qualityData = qualityData.concat(meruInspList);

                cursor1.toArray(function(err, min_maxresult) {

                    console.log("min_maxresult");
                    console.log(min_maxresult);
                    avg_q_jhic.toArray(function(err, avg_q_jhic) {
                        if ((min_maxresult != undefined && min_maxresult.length != 0) && inspector._id == "All") {

                            if (min_maxresult.length == 1) {
                                qualityData.push(["Min",
                                    min_maxresult[0]["count"] + "",
                                    (min_maxresult[0]["_id"] * 100) + "%"
                                ]);
                            } else {

                                var length = min_maxresult.length;

                                qualityData.push(["Min",
                                    min_maxresult[length - 1]["count"] + "",
                                    (min_maxresult[length - 1]._id * 100) + "%"
                                ]);

                                qualityData.push([
                                    "Max",
                                    min_maxresult[0]["count"] + "",
                                    (min_maxresult[0]._id * 100) + "%"
                                ]);
                            }
                            console.log("avg_q_jhic");
                            console.log(avg_q_jhic);
                            if ((avg_q_jhic != undefined && avg_q_jhic.length != 0) && inspector._id == "All") {

                                qualityData.push([
                                    "Average",
                                    "1",
                                    (avg_q_jhic[0]["q_jhic_disc"]) + "%"
                                ]);
                            }
                        }

                        console.log("qualityData here.......");
                        console.log(qualityData);


                        QualityReportResponse.push({
                            headerData: headerData,
                            subHeaderData: subHeaderData,
                            summaryData: qualityData
                        });

                        res.send({
                            QualityReportResponse: QualityReportResponse
                        });
                    });
                });
            });
        } else {

            console.log("Check hereee 2");

            console.log(conditionString);

            var cursor = collection.aggregate([{ $match: conditionString },
                {
                    $group: {
                        _id: "$_county",
                        "JHIC Discrepancies": { $avg: { $multiply: ["$q_jhic_disc", 100] } },
                        "JHIC Discrepancies Count": { $sum: "$q_jhic_comp" },
                        "Scorecard Non-Adherence": { $avg: { $multiply: ["$q_scorecards_disc", 100] } },
                        "Scorecard Count": { $sum: "$q_scorecards_comp" },
                        "Facility Closure Non-Adherence": { $avg: { $multiply: ["$q_closure_disc", 100] } },
                        "Facility Count": { $sum: "$q_closure_comp" },
                        "Radiology Closure Non-Adherence": { $avg: { $multiply: ["$q_closure_rad_disc", 100] } },
                        "Radiology Count": { $sum: "$q_closure_rad_comp" },
                        "Lab Closure Non-Adherence": { $avg: { $multiply: ["$q_closure_lab_disc", 100] } },
                        "Lab Count": { $sum: "$q_closure_lab_comp" },
                        "Pharmacy Closure Non-Adherence": { $avg: { $multiply: ["$q_closure_pharm_disc", 100] } },
                        "Pharmacy Count": { $sum: "$q_closure_pharm_comp" },
                        "Nutrition Closure Non-Adherence": { $avg: { $multiply: ["$q_closure_nutri_disc", 100] } },
                        "Nutrition Count": { $sum: "$q_closure_nutri_comp" },
                        "Total": { $sum: 1 }
                    }
                },


                {
                    $project: {
                        "All": {
                            $avg: ["$JHIC Discrepancies", "$Scorecard Non-Adherence",
                                "$Facility Closure Non-Adherence",
                                "$Pharmacy Closure Non-Adherence", "$Lab Closure Non-Adherence", "$Radiology Closure Non-Adherence",
                                "$Nutrition Closure Non-Adherence"
                            ]
                        },
                        "JHIC Discrepancies": 1,
                        "Scorecard Non-Adherence": 1,
                        "Facility Closure Non-Adherence": 1,
                        "JHIC Discrepancies Count": 1,
                        "Pharmacy Closure Non-Adherence": 1,
                        "Lab Closure Non-Adherence": 1,
                        "Radiology Closure Non-Adherence": 1,
                        "Nutrition Closure Non-Adherence": 1,


                        "JHIC Discrepancies Count": 1,
                        "Scorecard Count": 1,
                        "Facility Count": 1,

                        "Pharmacy Count": 1,
                        "Lab Count": 1,
                        "Radiology Count": 1,
                        "Nutrition Count": 1,

                        "Total": 1
                    }
                }
            ]);

            console.log("Check hereee 3");

            var cursor1 = collection.aggregate([{ $match: conditionString },
                {
                    $group: {
                        _id: null,
                        "JHIC Discrepancies": { $avg: { $multiply: ["$q_jhic_disc", 100] } },
                        "JHIC Discrepancies Count": { $sum: "$q_jhic_comp" },
                        "Scorecard Non-Adherence": { $avg: { $multiply: ["$q_scorecards_disc", 100] } },
                        "Scorecard Count": { $sum: "$q_scorecards_comp" },
                        "Facility Closure Non-Adherence": { $avg: { $multiply: ["$q_closure_disc", 100] } },
                        "Facility Count": { $sum: "$q_closure_comp" },
                        "Radiology Closure Non-Adherence": { $avg: { $multiply: ["$q_closure_rad_disc", 100] } },
                        "Radiology Count": { $sum: "$q_closure_rad_comp" },
                        "Lab Closure Non-Adherence": { $avg: { $multiply: ["$q_closure_lab_disc", 100] } },
                        "Lab Count": { $sum: "$q_closure_lab_comp" },
                        "Pharmacy Closure Non-Adherence": { $avg: { $multiply: ["$q_closure_pharm_disc", 100] } },
                        "Pharmacy Count": { $sum: "$q_closure_pharm_comp" },
                        "Nutrition Closure Non-Adherence": { $avg: { $multiply: ["$q_closure_nutri_disc", 100] } },
                        "Nutrition Count": { $sum: "$q_closure_nutri_comp" },
                        "Total": { $sum: 1 }
                    }
                },

                {
                    $project: {
                        "All": {
                            $avg: ["$JHIC Discrepancies", "$Scorecard Non-Adherence",
                                "$Facility Closure Non-Adherence",
                                "$Pharmacy Closure Non-Adherence", "$Lab Closure Non-Adherence", "$Radiology Closure Non-Adherence",
                                "$Nutrition Closure Non-Adherence"
                            ]
                        },
                        "JHIC Discrepancies": 1,
                        "Scorecard Non-Adherence": 1,
                        "Facility Closure Non-Adherence": 1,
                        "JHIC Discrepancies Count": 1,
                        "Pharmacy Closure Non-Adherence": 1,
                        "Lab Closure Non-Adherence": 1,
                        "Radiology Closure Non-Adherence": 1,
                        "Nutrition Closure Non-Adherence": 1,


                        "JHIC Discrepancies Count": 1,
                        "Scorecard Count": 1,
                        "Facility Count": 1,

                        "Pharmacy Count": 1,
                        "Lab Count": 1,
                        "Radiology Count": 1,
                        "Nutrition Count": 1,

                        "Total": 1
                    }
                }
            ]);

            console.log("Check hereee 3");

            cursor.toArray(function(err, result) {

                console.log("Check hereee 4");

                cursor1.toArray(function(err, resultAllCounty) {
                    console.log("resultAllCounty check hereee");
                    console.log(resultAllCounty);
                    if (resultAllCounty == undefined || resultAllCounty == null || resultAllCounty.length == 0) {
                        console.log("inside undefined");
                        resultAllCounty.push({
                            _id: null,
                            'JHIC Discrepancies': null,
                            'JHIC Discrepancies Count': 0,
                            'Scorecard Non-Adherence': null,
                            'Scorecard Count': 0,
                            'Facility Closure Non-Adherence': null,
                            'Facility Count': 0,
                            'Radiology Closure Non-Adherence': null,
                            'Radiology Count': 0,
                            'Lab Closure Non-Adherence': null,
                            'Lab Count': 0,
                            'Pharmacy Closure Non-Adherence': null,
                            'Pharmacy Count': 0,
                            'Nutrition Closure Non-Adherence': null,
                            'Nutrition Count': 0,
                            Total: 0,
                            All: null
                        });
                    }

                    resultAllCounty[0]._id = "All";

                    var IndicatorAvg = [

                        "JHIC Discrepancies",
                        "Scorecard Non-Adherence",
                        "Facility Closure Non-Adherence",
                        "Radiology Closure Non-Adherence",
                        "Lab Closure Non-Adherence",
                        "Pharmacy Closure Non-Adherence",
                        "Nutrition Closure Non-Adherence"
                    ];
                    var IndicatorCount = [
                        "JHIC Discrepancies Count",
                        "Scorecard Count",
                        "Facility Count",
                        "Radiology Count",
                        "Lab Count",
                        "Pharmacy Count",
                        "Nutrition Count",
                    ];

                    var IndicatorAvgList = [];
                    var IndicatorCountList = [];

                    if (indicator.indexOf('All') == -1) {

                        for (var i = 0; i < indicator.length; i++) {
                            var index = IndicatorAvg.indexOf(indicator[i]);
                            if (index != -1) {
                                IndicatorAvgList.push(IndicatorAvg[index]);
                                IndicatorCountList.push(IndicatorCount[index])
                            }
                        }
                        IndicatorAvg = IndicatorAvgList;
                        IndicatorCount = IndicatorCountList;
                    }

                    if (county == "All") {
                        headerData.push({ title: "All" });


                        subHeaderData.push({ title: "Observations" }, { title: "Mean" });

                        for (var i = 0; i < IndicatorAvg.length; i++) {
                            qualityData.push([
                                IndicatorAvg[i],
                                resultAllCounty[0][IndicatorCount[i]] + "",
                                resultAllCounty[0][IndicatorAvg[i]] + "%"
                            ]);
                        }

                        QualityReportResponse.push({
                            headerData: headerData,
                            subHeaderData: subHeaderData,
                            summaryData: qualityData,

                        });

                        res.send({

                            QualityReportResponse: QualityReportResponse
                        });

                    } else if (county != "All" && county != "By County") {

                        headerData.push({ title: county });

                        console.log("here 1");

                        subHeaderData.push({ title: "Observations" }, { title: "Mean" });

                        console.log("here 2");
                        var flag = 0;
                        if (result != undefined) {
                            console.log("here 3");
                            for (var j = 0; j < result.length; j++) {
                                if (result[j]._id == county) {
                                    console.log("here 4");
                                    flag = 1;
                                    for (var i = 0; i < IndicatorAvg.length; i++) {
                                        qualityData.push([
                                            IndicatorAvg[i],
                                            result[j][IndicatorCount[i]] + "",
                                            result[j][IndicatorAvg[i]] + "%"
                                        ]);
                                    }

                                }
                            }
                        }
                        if (flag == 0) {

                            var data = {
                                "_id": county,
                                "JHIC Discrepancies": null,
                                "JHIC Discrepancies Count": 0,
                                "Scorecard Non-Adherence": null,
                                "Scorecard Count": 0,
                                "Facility Closure Non-Adherence": null,
                                "Facility Count": 0,
                                "Radiology Closure Non-Adherence": null,
                                "Radiology Count": 0,
                                "Lab Closure Non-Adherence": null,
                                "Lab Count": 0,
                                "Pharmacy Closure Non-Adherence": null,
                                "Pharmacy Count": 0,
                                "Nutrition Closure Non-Adherence": null,
                                "Nutrition Count": 0,
                                "Total": 0,
                                "All": null
                            };

                            for (var i = 0; i < IndicatorAvg.length; i++) {
                                qualityData.push([
                                    IndicatorAvg[i],
                                    data[IndicatorCount[i]] + "",
                                    data[IndicatorAvg[i]] + "%"
                                ]);
                            }



                        }
                        console.log("here 5");


                        QualityReportResponse.push({
                            headerData: headerData,
                            subHeaderData: subHeaderData,
                            summaryData: qualityData,

                        });

                        res.send({

                            QualityReportResponse: QualityReportResponse
                        });

                    } else if (county == "By County") {

                        headerData.push({ title: "All" });
                        headerData.push({ title: "Kakamega" });
                        headerData.push({ title: "Kilifi" });
                        headerData.push({ title: "Meru" });

                        subHeaderData.push({ title: "Observations" }, { title: "Mean" });
                        subHeaderData.push({ title: "Observations" }, { title: "Mean" });
                        subHeaderData.push({ title: "Observations" }, { title: "Mean" });
                        subHeaderData.push({ title: "Observations" }, { title: "Mean" });

                        var kakamegaIndex, kilifiIndex, meruIndex;

                        for (var j = 0; j < result.length; j++) {
                            if (result[j]._id == "Kakamega") {
                                kakamegaIndex = j;
                            } else if (result[j]._id == "Kilifi") {
                                kilifiIndex = j;
                            } else if (result[j]._id == "Meru") {
                                meruIndex = j;
                            }
                        }

                        if (kilifiIndex == undefined) {

                            var data = {
                                "_id": "Kilifi",
                                "JHIC Discrepancies": null,
                                "JHIC Discrepancies Count": 0,
                                "Scorecard Non-Adherence": null,
                                "Scorecard Count": 0,
                                "Facility Closure Non-Adherence": null,
                                "Facility Count": 0,
                                "Radiology Closure Non-Adherence": null,
                                "Radiology Count": 0,
                                "Lab Closure Non-Adherence": null,
                                "Lab Count": 0,
                                "Pharmacy Closure Non-Adherence": null,
                                "Pharmacy Count": 0,
                                "Nutrition Closure Non-Adherence": null,
                                "Nutrition Count": 0,
                                "Total": 0,
                                "All": null
                            };
                            result["kilifi"] = data;
                            kilifiIndex = "kilifi";
                        }
                        if (meruIndex == undefined) {

                            var data = {
                                "_id": "Meru",
                                "JHIC Discrepancies": null,
                                "JHIC Discrepancies Count": 0,
                                "Scorecard Non-Adherence": null,
                                "Scorecard Count": 0,
                                "Facility Closure Non-Adherence": null,
                                "Facility Count": 0,
                                "Radiology Closure Non-Adherence": null,
                                "Radiology Count": 0,
                                "Lab Closure Non-Adherence": null,
                                "Lab Count": 0,
                                "Pharmacy Closure Non-Adherence": null,
                                "Pharmacy Count": 0,
                                "Nutrition Closure Non-Adherence": null,
                                "Nutrition Count": 0,
                                "Total": 0,
                                "All": null
                            };
                            result["meru"] = data;
                            meruIndex = "meru";
                        }


                        for (var i = 0; i < IndicatorAvg.length; i++) {
                            qualityData.push([
                                IndicatorAvg[i],
                                resultAllCounty[0][IndicatorCount[i]] + "",
                                resultAllCounty[0][IndicatorAvg[i]] + "%",

                                result[kakamegaIndex][IndicatorCount[i]] + "",
                                result[kakamegaIndex][IndicatorAvg[i]] + "%",

                                result[kilifiIndex][IndicatorCount[i]] + "",
                                result[kilifiIndex][IndicatorAvg[i]] + "%",

                                result[meruIndex][IndicatorCount[i]] + "",
                                result[meruIndex][IndicatorAvg[i]] + "%"
                            ]);
                        }


                        QualityReportResponse.push({
                            headerData: headerData,
                            subHeaderData: subHeaderData,
                            summaryData: qualityData,

                        });

                        res.send({

                            QualityReportResponse: QualityReportResponse
                        });

                    }
                });

            });
        }

    },
    getProgressData: function(req, res) {

        //get request data
        var county = req.param("county");
        var inspectorId = req.param("inspector")._id;
        var period = req.param("inspPeriod").key;
        var indicator = req.param("indicator");
        var inspectors = [];
        var resultArr = [];
        var progressFilteredData = [];

        //get inspector progress data

        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');

        var conditionString = '"is_deleted":false,';
        if (county != "All") {
            conditionString = conditionString + '"_county":"' + county + '",';
        }
        if (inspectorId != "All") {
            conditionString = conditionString + '"_inspectorid":' + inspectorId + ',';
        }
        if (period != "All") {
            conditionString = conditionString + '"p_period":"' + period + '",';
        }

        conditionString = conditionString.replace(/,\s*$/, "");

        conditionString = "{" + conditionString + "}";
        conditionString = JSON.parse(conditionString);

        var cursor1 = collection.aggregate([{ $match: conditionString },
            {
                "$group": {
                    _id: "$_inspectorid",
                    name: { $last: '$_inspectorname' },
                    county: { $last: '$_county' },
                    count: { $avg: { $multiply: ["$q_jhic_disc", 100] } },
                    number: { $sum: 1 }
                }
            }
        ]);
        cursor1.toArray(function(err, result) {

            if (result.length > 0) {

                for (j = 0; j < result.length; j++) {
                    var objInsp = {};

                    objInsp.inspectorId = result[j]._id;
                    objInsp.inspectorName = result[j].name;
                    objInsp.county = result[j].county;
                    objInsp.progress = result[j].count;
                    objInsp.total = result[j].number;



                    if (objInsp.inspectorId != undefined && objInsp.inspectorId != null) {
                        resultArr.push(objInsp);
                    }

                }
            }
            for (idx in resultArr) {
                var obj = resultArr[idx];
                progressFilteredData.push(obj);

            }
            res.send({
                inspProgressData: progressFilteredData
            });
        });
    },
    getProgressDataByCounty: function(req, res) {

        var county = req.param("county");
        var inspectorId = req.param("inspector")._id;
        var period = req.param("inspPeriod").key;
        var indicator = req.param("indicator");

        // filter data
        var countyNameArr = [];
        var seriesDataArr = [];

        //get inspector progress data

        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');

        var conditionString = '"is_deleted":false,';
        if (county != "All") {
            conditionString = conditionString + '"_county":"' + county + '",';
        }

        if (period != "All") {
            conditionString = conditionString + '"p_period":"' + period + '",';
        }

        if (indicator[0] == "JHIC Discrepancies" && indicator.length == 1 && inspectorId != "All") {
            conditionString = conditionString + '"_inspectorid":' + inspectorId + ',';
        }


        conditionString = conditionString.replace(/,\s*$/, "");

        conditionString = "{" + conditionString + "}";
        conditionString = JSON.parse(conditionString);



        var cursor = collection.aggregate([{ $match: conditionString },
            {
                $group: {
                    _id: "$_county",
                    "JHIC Discrepancies": { $avg: { $multiply: ["$q_jhic_disc", 100] } },
                    "JHIC Discrepancies Count": { $sum: "$q_jhic_comp" },
                    "Scorecard Non-Adherence": { $avg: { $multiply: ["$q_scorecards_disc", 100] } },
                    "Scorecard Count": { $sum: "$q_scorecards_comp" },
                    "Facility Closure Non-Adherence": { $avg: { $multiply: ["$q_closure_disc", 100] } },
                    "Facility Count": { $sum: "$q_closure_comp" },
                    "Radiology Closure Non-Adherence": { $avg: { $multiply: ["$q_closure_rad_disc", 100] } },
                    "Radiology Count": { $sum: "$q_closure_rad_comp" },
                    "Lab Closure Non-Adherence": { $avg: { $multiply: ["$q_closure_lab_disc", 100] } },
                    "Lab Count": { $sum: "$q_closure_lab_comp" },
                    "Pharmacy Closure Non-Adherence": { $avg: { $multiply: ["$q_closure_pharm_disc", 100] } },
                    "Pharmacy Count": { $sum: "$q_closure_pharm_comp" },
                    "Nutrition Closure Non-Adherence": { $avg: { $multiply: ["$q_closure_nutri_disc", 100] } },
                    "Nutrition Count": { $sum: "$q_closure_nutri_comp" },

                    "Total": { $sum: 1 }
                }
            },
            {
                $project: {
                    "All": {
                        $avg: ["$JHIC Discrepancies", "$Scorecard Non-Adherence",
                            "$Facility Closure Non-Adherence",
                            "$Pharmacy Closure Non-Adherence", "$Lab Closure Non-Adherence", "$Radiology Closure Non-Adherence",
                            "$Nutrition Closure Non-Adherence"
                        ]
                    },

                    "Total Count": {
                        $sum: ["$JHIC Discrepancies Count", "$Scorecard Count",
                            "$Facility Count",
                            "$Pharmacy Count", "$Lab Count",
                            "$Radiology Count",
                            "$Nutrition Count"
                        ]
                    },

                    "JHIC Discrepancies": 1,
                    "Scorecard Non-Adherence": 1,
                    "Facility Closure Non-Adherence": 1,
                    "Pharmacy Closure Non-Adherence": 1,
                    "Lab Closure Non-Adherence": 1,
                    "Radiology Closure Non-Adherence": 1,
                    "Nutrition Closure Non-Adherence": 1,

                    "JHIC Discrepancies Count": 1,
                    "Scorecard Count": 1,
                    "Facility Count": 1,

                    "Pharmacy Count": 1,
                    "Lab Count": 1,
                    "Radiology Count": 1,
                    "Nutrition Count": 1
                }
            }
        ]);

        var cursor1 = collection.aggregate([{ $match: conditionString },
            {
                $group: {
                    _id: null,
                    "JHIC Discrepancies": { $avg: { $multiply: ["$q_jhic_disc", 100] } },
                    "JHIC Discrepancies Count": { $sum: "$q_jhic_comp" },
                    "Scorecard Non-Adherence": { $avg: { $multiply: ["$q_scorecards_disc", 100] } },
                    "Scorecard Count": { $sum: "$q_scorecards_comp" },
                    "Facility Closure Non-Adherence": { $avg: { $multiply: ["$q_closure_disc", 100] } },
                    "Facility Count": { $sum: "$q_closure_comp" },
                    "Radiology Closure Non-Adherence": { $avg: { $multiply: ["$q_closure_rad_disc", 100] } },
                    "Radiology Count": { $sum: "$q_closure_rad_comp" },
                    "Lab Closure Non-Adherence": { $avg: { $multiply: ["$q_closure_lab_disc", 100] } },
                    "Lab Count": { $sum: "$q_closure_lab_comp" },
                    "Pharmacy Closure Non-Adherence": { $avg: { $multiply: ["$q_closure_pharm_disc", 100] } },
                    "Pharmacy Count": { $sum: "$q_closure_pharm_comp" },
                    "Nutrition Closure Non-Adherence": { $avg: { $multiply: ["$q_closure_nutri_disc", 100] } },
                    "Nutrition Count": { $sum: "$q_closure_nutri_comp" },

                    "Total": { $sum: 1 }
                }
            },
            {
                $project: {
                    "All": {
                        $avg: ["$JHIC Discrepancies", "$Scorecard Non-Adherence",
                            "$Facility Closure Non-Adherence",
                            "$Pharmacy Closure Non-Adherence", "$Lab Closure Non-Adherence", "$Radiology Closure Non-Adherence",
                            "$Nutrition Closure Non-Adherence"
                        ]
                    },

                    "Total Count": {
                        $sum: ["$JHIC Discrepancies Count", "$Scorecard Count",
                            "$Facility Count",
                            "$Pharmacy Count", "$Lab Count",
                            "$Radiology Count",
                            "$Nutrition Count"
                        ]
                    },


                    "JHIC Discrepancies": 1,
                    "Scorecard Non-Adherence": 1,
                    "Facility Closure Non-Adherence": 1,
                    "Pharmacy Closure Non-Adherence": 1,
                    "Lab Closure Non-Adherence": 1,
                    "Radiology Closure Non-Adherence": 1,
                    "Nutrition Closure Non-Adherence": 1,

                    "JHIC Discrepancies Count": 1,
                    "Scorecard Count": 1,
                    "Facility Count": 1,

                    "Pharmacy Count": 1,
                    "Lab Count": 1,
                    "Radiology Count": 1,
                    "Nutrition Count": 1
                }
            }
        ]);

        cursor.toArray(function(err, result) {

            cursor1.toArray(function(err, resultAllCounty) {

                if (resultAllCounty[0] != undefined) {
                    resultAllCounty[0]._id = "All";

                    if (indicator[0] == "JHIC Discrepancies" && indicator.length == 1 && inspectorId != "All") {

                    } else {
                        result.push(resultAllCounty[0]);
                    }
                }

                console.log("All result");
                console.log(result);

                var resultObj = {};
                for (var k = 0; k < indicator.length; k++) {

                    resultObj[indicator[k]] = [];
                }

                var IndicatorAvg = [
                    "All",
                    "JHIC Discrepancies",
                    "Scorecard Non-Adherence",
                    "Facility Closure Non-Adherence",
                    "Radiology Closure Non-Adherence",
                    "Lab Closure Non-Adherence",
                    "Pharmacy Closure Non-Adherence",
                    "Nutrition Closure Non-Adherence"
                ];
                var IndicatorCount = [
                    "Total Count",
                    "JHIC Discrepancies Count",
                    "Scorecard Count",
                    "Facility Count",
                    "Radiology Count",
                    "Lab Count",
                    "Pharmacy Count",
                    "Nutrition Count",
                ];

                var countyList = CountyService.getAll();

                countyList.unshift("All");
                if (county == "All") {

                    for (var j = 0; j < countyList.length; j++) {

                        for (var i = 0; i < result.length; i++) {

                            if (countyList[j] == result[i]._id) {

                                for (var k = 0; k < indicator.length; k++) {
                                    var countIndex = IndicatorAvg.indexOf(indicator[k]);

                                    var tmp1 = { name: result[i]._id, y: result[i][indicator[k]], total: result[i][IndicatorCount[countIndex]] };

                                    resultObj[indicator[k]].push(tmp1);

                                }
                            }
                        }
                    }

                } else {

                    var flag = 0;
                    for (var i = 0; i < result.length; i++) {
                        if (county == result[i]._id) {
                            for (var k = 0; k < indicator.length; k++) {

                                var countIndex = IndicatorAvg.indexOf(indicator[k]);

                                var tmp1 = { name: result[i]._id, y: result[i][indicator[k]], total: result[i][IndicatorCount[countIndex]] };


                                resultObj[indicator[k]].push(tmp1);

                            }
                            flag = 1;
                            break;
                        }

                    }
                    if (flag == 0) {
                        for (var k = 0; k < indicator.length; k++) {

                            var tmp1 = { name: county, y: 0, total: 0 };


                            resultObj[indicator[k]].push(tmp1);

                        }
                    }
                }
                console.log(resultObj);
                console.log("resultObj send ..........");

                res.json(resultObj);

            });
        });
    },

    exportTableAsEXCEL: function(req, res) {

        var selectedInspPeriod = req.param("selectedInspPeriod");

        var county = req.param("selectedCounty");

        var datastr = req.param("tableHTML");

        var dataJson = JSON.parse(datastr);

        var xl = require('excel4node');
        var wb = new xl.Workbook();
        var ws;

        ws = wb.addWorksheet('Quality_Checks_Tables');

        var http = require('http');
        var fs = require('fs');
        var xlsxFileName = ".tmp/excelFile_" + new Date() + ".xlsx";
        var sheetRow = 1;

        //styles
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
        var pngFileName1 = "/assets/images/moh_logo.png";
        //  sheetRow++;
        ws.row(sheetRow).setHeight(70);



        var headerLength = dataJson["excelData"][0]["subHeaderData"].length + 1;

        ws.cell(sheetRow, 1, sheetRow++, headerLength, true).string('KePSIE Monitoring System, Ministry of Health')
            .style({ alignment: { horizontal: ['center'], vertical: ['center'] }, font: { color: 'black', size: 13, bold: true } });


        ws.cell(sheetRow, 1, sheetRow++, headerLength, true).string('Quality Checks - Tables')
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
        ws.cell(sheetRow, 1, sheetRow++, headerLength, true).string(' County: ' + county + ' | Inspection Period: ' + selectedInspPeriod)
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

        for (var t = 0; t < dataJson["excelData"].length; t++) {

            var table1 = dataJson["excelData"][t];
            console.log(table1);
            ws.cell(sheetRow, 1, sheetRow + 1, 1, true).string("Section").style(headerCenterStyle);
            for (var i = 0, j = 0; i < table1["headerData"].length; i++, j++) {

                ws.cell(sheetRow, j + 2, sheetRow, j + 3, true).string(table1["headerData"][i]["title"])
                    .style(headerCenterStyle);
                j++;
            }
            sheetRow++;

            for (var i = 0; i < table1["subHeaderData"].length; i++) {

                console.log(table1["subHeaderData"][i]["title"]);

                ws.cell(sheetRow, i + 2).string(table1["subHeaderData"][i]["title"]).style(headerCenterStyle);
            }

            sheetRow++;

            var data = table1["summaryData"]

            for (i in data) {

                var rowSummaryData = data[i];
                var cellValue = "";
                ws.cell(sheetRow, 1).string(rowSummaryData[0]).style(normalCenterStyle);

                for (var j = 1; j < rowSummaryData.length; j++) {
                    var value = rowSummaryData[j];
                    if (value.indexOf("%") == -1) {
                        if (isNaN(value)) {
                            cellValue = "N/A";
                        } else {
                            cellValue = Math.round(value).toString();
                        }
                    } else {
                        var score = value.split("%");
                        if (isNaN(score[0])) {
                            cellValue = "N/A";
                        } else {
                            cellValue = Math.round(score[0]).toString() + "%";
                        }
                    }

                    ws.cell(sheetRow, j + 1).string(cellValue).style(normalCenterStyle);
                }
                sheetRow++;
            }

            ws.cell(sheetRow, 1, sheetRow++, headerLength, true).string("Note: N/A is used to indicate when information is not available, because the health facility does not have that particular unit/service.").style(noteStyle);
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

                fileName = 'Quality_Checks_Tables_' + (CountyService.formateDate()) + ".xlsx";

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
    exportTableAsPDF: function(req, res) {

        var logourl = sails.config.logoURL;
        var selectedInspPeriod = req.param("selectedInspPeriod");

        var county = req.param("selectedCounty");
        // prepare html
        var html = "<html><head><link rel='icon' href='/wb-favicon.png'/><title>KePSIE | PDF</title><style> ";
        html = html + ".centerCell{text-align:center} table {border:1px solid #e7ecf1;width:98%}.header1 a {font-size: 14px;background-color: #31708f;color: white;padding: 5px 5px 4px 5px;text-decoration: none;display: block;font-weight: bold;}.header1 {margin-bottom: 10px;font-size: 13px;background-color: #31708f;color: white;padding: 3px;border-radius: 5px 5px 0 0!important;width:100%}.table thead tr th {font-size: 13px;font-weight: bold;padding: 6px;border: 1px solid #e7ecf1;} .table tfoot tr th {font-size: 13px;font-weight: bold;padding: 6px;border: 1px solid #e7ecf1;} table tbody tr td {border: 1px solid #e7ecf1 !important;padding: 4px;line-height: 1.42857;vertical-align: top;} td{font-size:13px} th{font-size:13px}.pageOneMain {height: 100%;width: 100%;display: table;}.pageOneWrapper {display: table-cell;height: 100%;vertical-align: middle;}.pageOneH1 {text-align: center;color : #31708f;}.pageOneH3 {text-align: center;color : #31708f;}";
        html = html + "thead {display: table-row-group;} tfoot {display: table-row-group;} .countyHeader {margin-bottom:0px; float: left;padding: 7px;background-color: rgb(49, 112, 143);color: white;padding-left: 10px;padding-right: 25px;border-radius: 5px 5px 0px 0px !important;display: none;}";
        html = html + "table{margin:auto} table td{border:1px solid #e7ecf1;font-size: 12px} .countyHeader{float:left;font-size: 13px;margin-right: 30%; display: block;}</style></head><body style='font-family:\"Open Sans, sans-serif\"'>"
        html = html + '<center><img src=' + logourl + ' width="100px" height="100px"></center><div class="header1"><a class="secLink" href="javascript:void(0)">Quality Checks - Tables </a></div>';
        html = html + "<table style='width:98%'><tr><td style='width:49%'> County : " + county + "</td> <td style='width:49%'> Inspection Period : " + selectedInspPeriod + " </td></tr></table>";
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
            res.setHeader('Content-disposition', 'attachment; filename=Quality_Checks_Tables_' + (CountyService.formateDate()) + '.pdf');
            out.stream.pipe(res);
        }).catch(function(e) {
            res.end(e.message);
        });
    },
};