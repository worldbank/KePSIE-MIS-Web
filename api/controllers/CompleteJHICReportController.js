/**
 * CompleteJHICReportController
 * 
 * @description : Server-side logic for managing complete jhic aggregate and
 *              individual reports
 * @author : Abhishek Upadhyay,Jay Pastagia
 */

function getTableData(req, callback) {
    var id = req.param("id");
    if (id == null || id == "") {
        id = "572823f5eb64d25c0ae27a9c";
    }
    var mongo = require('mongodb');
    var o_id = new mongo.ObjectID(id);
    var collection = MongoService.getDB().collection('facility');
    var cursor = collection.find({ _id: o_id });
    cursor.toArray(function(err, result) {
        var collection1 = MongoService.getDB().collection('facility');
        var cursor1 = collection1.find({});
        cursor1.toArray(function(err1, result1) {
            callback(err, result[0], err1, result1[parseInt(getRandomArbitrary(0, 100))]);
        });
    });
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

var fs = require('fs');
var winston = require('winston');


module.exports = {

    getFilterValues: function(req, res) {
        var loggedInUser = req.session.loggedInUser;
        var countyList = CountyService.getCounties();
        var subCountyList = CountyService.getSubCountiesByCounties(countyList);
        var ownershipList = CountyService.getOwnershipList(loggedInUser);
        var levelList = CountyService.getLevelList(loggedInUser);
        res.send({
            countyList: countyList,
            subCountyList: subCountyList,
            ownershipList: ownershipList,
            levelList: levelList,
        });
    },

    individualReport: function(req, res) {
        res.view('reports/completeJHICIndividualList');
    },

    aggregateReport: function(req, res) {
        InspectionDataService.aggregate(req, "All", "All", "All", "All", function(result, size) {
            res.view('reports/completeJHICAggregate', {
                score: result,
                observations: size,
                facility: false
            });
        });
    },

    getAggregateList: function(req, res) {
        var county = req.param("county");
        var subCounty = req.param("subCounty");
        var ownership = req.param("ownership");
        var level = req.param("level");

        InspectionDataService.aggregate(req, county, subCounty, ownership, level, function(result, size) {

            if (result != undefined) {
                function nextChar(c) {
                    return String.fromCharCode(c.charCodeAt(0) + 1);
                }

                var i;
                for (i = 2; i < 14; i++) {


                    var labelAlp = 'a';
                    var temp = 1;
                    var nextLabel = req.__('s' + i + labelAlp);
                    while (nextLabel != ('s' + i + labelAlp)) {

                        if (result['s' + i + labelAlp + "_ms"] !== undefined && result['s' + i + labelAlp + "_ms"] !== null &&
                            result['s' + i + labelAlp + "_os"] !== undefined && result['s' + i + labelAlp + "_os"] !== null &&
                            result['s' + i + labelAlp + "_ps"] !== undefined && result['s' + i + labelAlp + "_ps"] !== null) {
                            result['s' + i + labelAlp + '_ms'] = result['s' + i + labelAlp + '_ms'].toFixed(2);
                            result['s' + i + labelAlp + '_os'] = result['s' + i + labelAlp + '_os'].toFixed(2);
                            result['s' + i + labelAlp + '_ps'] = result['s' + i + labelAlp + '_ps'].toFixed(2) + "%";
                        } else {
                            result['s' + i + labelAlp + '_ms'] = "N/A";
                            result['s' + i + labelAlp + '_os'] = "N/A";
                            result['s' + i + labelAlp + '_ps'] = "N/A";
                        }

                        var labelNum = "1";
                        var nextLabel1 = req.__('s' + i + labelAlp + "_" + labelNum);
                        while (nextLabel1 != ('s' + i + labelAlp + "_" + labelNum)) {

                            if (result['s' + i + labelAlp + "_" + labelNum + "_ms"] !== undefined && result['s' + i + labelAlp + "_" + labelNum + "_ms"] !== null &&
                                result['s' + i + labelAlp + "_" + labelNum + "_os"] !== undefined && result['s' + i + labelAlp + "_" + labelNum + "_os"] !== null &&
                                result['s' + i + labelAlp + "_" + labelNum + "_ps"] !== undefined && result['s' + i + labelAlp + "_" + labelNum + "_ps"] !== null) {

                                result['s' + i + labelAlp + '_' + labelNum + '_ms'] = result['s' + i + labelAlp + '_' + labelNum + '_ms'].toFixed(2);
                                result['s' + i + labelAlp + '_' + labelNum + '_os'] = result['s' + i + labelAlp + '_' + labelNum + '_os'].toFixed(2);
                                result['s' + i + labelAlp + '_' + labelNum + '_ps'] = result['s' + i + labelAlp + '_' + labelNum + '_ps'].toFixed(2) + "%";

                            } else {
                                result['s' + i + labelAlp + '_' + labelNum + '_ms'] = "N/A";
                                result['s' + i + labelAlp + '_' + labelNum + '_os'] = "N/A";
                                result['s' + i + labelAlp + '_' + labelNum + '_ps'] = "N/A";
                            }

                            var labelAlp1 = "a";
                            var nextLabel2 = req.__('s' + i + labelAlp + "_" + labelNum + labelAlp1);
                            while (nextLabel2 != ('s' + i + labelAlp + "_" + labelNum + labelAlp1)) {

                                if (result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + "_ms"] !== undefined && result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + "_ms"] !== null &&
                                    result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + "_os"] !== undefined && result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + "_os"] !== null &&
                                    result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + "_ps"] !== undefined && result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + "_ps"] !== null) {
                                    result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + "_ms"] = result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + "_ms"].toFixed(2);
                                    result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + "_os"] = result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + "_os"].toFixed(2);
                                    result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + "_ps"] = result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + "_ps"].toFixed(2) + "%";
                                } else {
                                    result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + '_ms'] = "N/A";
                                    result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + '_os'] = "N/A";
                                    result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + '_ps'] = "N/A";
                                }

                                labelAlp1 = nextChar(labelAlp1);
                                nextLabel2 = req.__('s' + i + labelAlp + "_" + labelNum + labelAlp1);
                            }
                            labelNum = parseInt(labelNum) + 1;
                            nextLabel1 = req.__('s' + i + labelAlp + "_" + labelNum);
                        }
                        labelAlp = nextChar(labelAlp);
                        nextLabel = req.__('s' + i + labelAlp);
                    }
                }

            }

            res.send({
                score: result,
                observations: size,
                facility: false
            });
        });
    },

    getAggregateDataByRisk: function(req, res) {
        var county = req.param("county");
        var subCounty = req.param("subCounty");
        var ownership = req.param("ownership");
        var level = req.param("level");

        InspectionDataService.countByFacilityClosed(county, subCounty, ownership, level, function(closedFacility) {


            InspectionDataService.countByRiskCategory(county, subCounty, ownership, level, function(result) {

                res.send({
                    facilitiesByRisk: result,
                    closedFacility: closedFacility
                });
            });
        });
    },

    getIndividualReport: function(req, res) {
        var loggedInUser = req.session.loggedInUser;
        var allowedCounties = CountyService.getCounties();
        var id = req.param("id");
        winston.info("IndividualReport Id: " + req.param("id"));
        InspectionDataService.getById(id, function(result, previous_insp) {

            if (JSON.stringify(allowedCounties).indexOf(CountyService.getCounty(result._county)) == -1) {

                res.view("403");
            }
            User.find({

                is_deleted: "false",

            }, { name: 1, email: 1 }).sort({ name: 1 }).exec(
                function(err, userList) {
                    if (err) {
                        winston.warn("IndividualReport Error Id: " + req.param("id"));
                    }

                    var inspectorId = result._inspectorid + "";

                    User.find({
                        $or: [{ role: "Admin" }, {
                            role: "Inspector",
                            inspectorId: inspectorId
                        }],
                        is_deleted: "false"
                    }, { name: 1, email: 1 }).exec(
                        function(err, ccUserList) {

                            console.log("ccUserList");
                            console.log(ccUserList);


                            res.view('reports/completeJHICIndividual', {
                                detail: false,
                                info: result,
                                previous_info: previous_insp,
                                score: result.scores,
                                userList: userList,
                                ccUserList: ccUserList
                            });

                        });
                });
        });
    },

    getIndividualDetailedReport: function(req, res) {
        var loggedInUser = req.session.loggedInUser;
        var allowedCounties = CountyService.getCounties();
        var id = req.param("id");
        winston.info("IndividualDetailReport Id: " + req.param("id"));
        InspectionDataService.getById(id, function(result, previous_insp) {
            if (JSON.stringify(allowedCounties).indexOf(CountyService.getCounty(result._county)) == -1) {
                res.view("403");
            }
            User.find({

                is_deleted: "false",

            }, { name: 1, email: 1 }).sort({ name: 1 }).exec(
                function(err, userList) {

                    if (err) {
                        winston.warn("IndividualDetailReport Error Id: " + req.param("id"));
                    }

                    var inspectorId = result._inspectorid + "";

                    User.find({
                        $or: [{ role: "Admin" }, {
                            role: "Inspector",
                            inspectorId: inspectorId
                        }],
                        is_deleted: "false"
                    }, { name: 1, email: 1 }).exec(
                        function(err, ccUserList) {

                            console.log("ccUserList" + inspectorId);
                            console.log(ccUserList);

                            res.view('reports/completeJHICIndividual', {
                                detail: true,
                                info: result,
                                previous_info: previous_insp,
                                score: result.scores,
                                userList: userList,
                                ccUserList: ccUserList
                            });
                        });
                });
        });
    },

    getInspectorNames: function(req, res) {
        var county = req.param("county");

        var loggedInUser = req.session.loggedInUser;
        UserService.getInspectorNames(loggedInUser, county, sendResponse);

        function sendResponse(inspectors) {

            res.send({
                "inspectors": inspectors,
            });
        }
    },

    getIndividualList: function(req, res) {
        var hfLevelData = [];
        var columns = ["_hfid", "_county", "_hfname", "p_insp_number", "_inspectorname", "_date", "p_insp_type"];
        var iDisplayStart = parseInt(req.query.iDisplayStart);
        var iDisplayLength = parseInt(req.query.iDisplayLength);
        console.log(iDisplayLength);
        var showPage = parseInt(iDisplayStart / iDisplayLength) + 1;
        console.log(showPage);
        var sSearch = req.query.sSearch;
        var iSortCol_0 = req.query.iSortCol_0;
        var sSortDir_0 = req.query.sSortDir_0;

        if (sSortDir_0 == "desc") {
            sSortDir_0 = -1;
        } else {
            sSortDir_0 = 1;
        }

        var sortColumn = '{"' + (columns[parseInt(iSortCol_0)]) + '" : ' + sSortDir_0 + '}';
        var county = req.param("county");
        var inspName = req.param("inspector").name;
        var generalSearchText = req.param("generalSearchText");
        if (generalSearchText != "" && generalSearchText != null) {
            sSearch = generalSearchText;
        }

        var fromDate = req.param("fromDate");
        var toDate = req.param("toDate");


        var fromDateArray = fromDate.split("-");
        var toDateArray = toDate.split("-");
        var fromDateObj = new Date(fromDateArray[2], parseInt(fromDateArray[1]) - 1, parseInt(fromDateArray[0]));
        var toDateObj = new Date(toDateArray[2], parseInt(toDateArray[1]) - 1, parseInt(toDateArray[0]) + 1);

        var collection = MongoService.getDB().collection('facility');
        var cursor;
        var loggedInUser = req.session.loggedInUser;

        if (county == "All" && inspName == "All") {

            cursor = collection.find({
                    $and: [{
                            $or: [
                                { _hfname: { "$regex": sSearch, "$options": "i" } },
                                { _inspectorname: { "$regex": sSearch, "$options": "i" } },
                                { _county: { "$regex": sSearch, "$options": "i" } },
                                { _hfid: parseInt(sSearch) }
                            ]
                        },
                        { _date: { "$gte": fromDateObj, "$lt": toDateObj } },
                        { m_insp_completed: "Yes" }, { is_deleted: false }
                    ]
                }, { _id: 1, _inspectorname: 1, _hfid: 1, _hfname: 1, _county: 1, _date: 1, _insp_type: 1, p_insp_number: 1 })
                .sort(JSON.parse(sortColumn));

        } else if (county == "All") {
            cursor = collection.find({
                    $and: [{
                            $or: [
                                { _hfname: { "$regex": sSearch, "$options": "i" } },
                                { _inspectorname: { "$regex": sSearch, "$options": "i" } },
                                { _county: { "$regex": sSearch, "$options": "i" } },
                                { _hfid: parseInt(sSearch) }
                            ]
                        },
                        { _inspectorname: inspName },
                        { _date: { "$gte": fromDateObj, "$lt": toDateObj } }, { m_insp_completed: "Yes" }, { is_deleted: false }
                    ]
                }, { _id: 1, _inspectorname: 1, _hfid: 1, _hfname: 1, _county: 1, _date: 1, _insp_type: 1, p_insp_number: 1 })
                .sort(JSON.parse(sortColumn));
        } else if (inspName == "All") {
            cursor = collection.find({
                    $and: [{
                            $or: [
                                { _hfname: { "$regex": sSearch, "$options": "i" } },
                                { _inspectorname: { "$regex": sSearch, "$options": "i" } },
                                { _county: { "$regex": sSearch, "$options": "i" } },
                                { _hfid: parseInt(sSearch) }
                            ]
                        },
                        { _county: CountyService.getCounty(county) },
                        { _date: { "$gte": fromDateObj, "$lt": toDateObj } }, { m_insp_completed: "Yes" }, { is_deleted: false }
                    ]
                }, { _id: 1, _inspectorname: 1, _hfid: 1, _hfname: 1, _county: 1, _date: 1, _insp_type: 1, p_insp_number: 1 })
                .sort(JSON.parse(sortColumn));
        } else {
            cursor = collection.find({
                    $and: [{
                            $or: [
                                { _hfname: { "$regex": sSearch, "$options": "i" } },
                                { _inspectorname: { "$regex": sSearch, "$options": "i" } },
                                { _county: { "$regex": sSearch, "$options": "i" } },
                                { _hfid: parseInt(sSearch) }
                            ]
                        },
                        { _county: CountyService.getCounty(county) }, { _inspectorname: inspName },
                        { _date: { "$gte": fromDateObj, "$lt": toDateObj } }, { m_insp_completed: "Yes" }, { is_deleted: false }
                    ]
                }, { _id: 1, _inspectorname: 1, _hfid: 1, _hfname: 1, _county: 1, _date: 1, _insp_type: 1, p_insp_number: 1 })
                .sort(JSON.parse(sortColumn));
        }

        cursor.toArray(function(err, result) {

            if (err) {
                console.log(err);
            } else {

                if (iDisplayLength == -1) {
                    iDisplayLength = result.length;
                }
                res.send({
                    "aaData": result.slice(iDisplayStart, (iDisplayStart + iDisplayLength)),
                    "iTotalRecords": result.length,
                    "iTotalDisplayRecords": result.length
                });
            }
        });
    },
    exportIndividualAsPdf: function(req, res) {

        var logourl = sails.config.logoURL;
        winston.info("exportIndividualAsPdf Start");
        // prepare html
        var sectionHTML = req.param("reportHTML");

        var detailed = false;
        if (sectionHTML.indexOf("s1Body") > -1) {
            detailed = true;
        }
        var Overview_heading = "";
        var html = "<html><head><link rel='icon' href='/wb-favicon.png'/><title>KePSIE | PDF</title><style> ";
        if (detailed) {
            html = html + "#reportContainer {page-break-before: always !important;}";
        }
        html = html + ".notes {font-weight: normal;font-size: 11px;font-style: italic;}.secLink {font-size:12px !important;padding:1px} #s14Body img {height : 12px;width : 12px}";
        html = html + "table tbody tr th {padding: 2px;font-size:11px} table tbody tr td {font-size:10px;border-top: 1px solid #e7ecf1 !important;padding: 1px;vertical-align: top;}";
        html = html + "table.innertable tbody tr th{padding: 1px !important;font-size:10px !important} table.innertable tbody tr td{font-size:9px !important;padding: 1px !important}";
        html = html + ".outofbusiness{font-size:10px; color: indianred;font-weight: 600;}"
        html = html + ".pageOneMain {height: 100%;width: 100%;display: table;}.pageOneWrapper {display: table-cell;height: 100%;vertical-align: middle;}.pageOneH1 {text-align: center;color : #31708f;}.pageOneH3 {text-align: center;color : #31708f;}";
        html = html + "</style></head><body style='font-family:\"Open Sans, sans-serif\"'>"
        if (detailed) {
            html = html + '<div class = "pageOneMain"><div class = "pageOneWrapper"><center><img src=' + logourl + ' width="100px" height="100px"></center><br/><h1 class="pageOneH1">The Joint Health<br/> Inspection Checklist<br/></h1><h3 class="pageOneH3">Checklist for Singular or Joint Inspections for Public and<br/> Private Providers by Health Regulatory Bodies under the<br/> Ministry of Health</h3></div></div>';
        } else {
            html = html + '<center><img src=' + logourl + ' width="100px" height="100px"></center><br/>';
        }
        html = html + sectionHTML;
        html = html + "</body></html>";

        // phantom JS code
        var jsreport = require('jsreport');
        var footerHTML = "<center><font style='color:rgba(105, 120, 130, 0.8);font-size:9px;font-family:\"Open Sans, sans-serif\"' id='pageNumber' name='{#pageNum}'>{#pageNum}</font></center><script type='text/javascript'> var elem = document.getElementById('pageNumber'); if (parseInt(elem.getAttribute('name'))==1) { elem.style.display = 'none'; } else {elem.innerHTML = 'Page '+(parseInt(elem.getAttribute('name'))-1)+' of '+(parseInt({#numPages})-1);}</script>";
        if (!detailed) {
            footerHTML = "<center><font style='color:rgba(105, 120, 130, 0.8);font-size:9px;font-family:\"Open Sans, sans-serif\"' id='pageNumber' name='{#pageNum}'>{#pageNum} of {#numPages}</font></center>";
        }
        jsreport.render({
            template: {
                content: html,
                recipe: "phantom-pdf",
                engine: "handlebars",
                phantom: {
                    header: "<center><font style='color:rgba(105, 120, 130, 0.8);font-size:13px;font-weight:bold;font-family:\"Open Sans, sans-serif\"'>" + req.param('reportHeader') + "</font></center>",
                    footer: footerHTML,
                    headerHeight: "45px",
                    footerHeight: "30px",
                    margin: "25px"
                }
            },
        }).then(function(out) {
            setTimeout(function() {
                var report = "Complete";
                if (!detailed) {
                    report = "Overview";
                }
                res.setHeader('Content-disposition', 'attachment; filename=' + req.param('reportHeader') + '_' + (CountyService.formateDate()) + '.pdf');
                out.stream.pipe(res);
            }, 2000);

            winston.info("exportIndividualAsPdf End");

        }).catch(function(e) {
            res.end(e.message);
        });
    },

    mailIndividualAsPdf: function(req, res) {

        winston.info("mailIndividualAsPdf Start");

        var logourl = sails.config.logoURL;
        var emailData = req.body.emailDetail;
        // prepare html
        var sectionHTML = emailData.reportHTML;

        var detailed = false;
        if (sectionHTML.indexOf("s1Body") > -1) {
            detailed = true;
        }
        var Overview_heading = "";
        var html = "<html><head><link rel='icon' href='/wb-favicon.png'/><title>KePSIE | PDF</title><style> ";
        html = html + ".secLink {font-size:12px !important;padding:1px} #s14Body img {height : 12px;width : 12px}";
        html = html + "table tbody tr th {padding: 2px;font-size:11px} table tbody tr td {font-size:10px;border-top: 1px solid #e7ecf1 !important;padding: 1px;vertical-align: top;}";
        html = html + "table.innertable tbody tr th{padding: 1px !important;font-size:10px !important} table.innertable tbody tr td{font-size:9px !important;padding: 1px !important}";
        html = html + ".pageOneMain {height: 100%;width: 100%;display: table;}.pageOneWrapper {display: table-cell;height: 100%;vertical-align: middle;}.pageOneH1 {text-align: center;color : #31708f;}.pageOneH3 {text-align: center;color : #31708f;}";
        html = html + "</style></head><body style='font-family:\"Open Sans, sans-serif\"'>"
        if (detailed) {
            html = html + '<div class = "pageOneMain"><div class = "pageOneWrapper"><center><img src=' + logourl + ' width="100px" height="100px"></center><br/><h1 class="pageOneH1">The Joint Health<br/> Inspection Checklist<br/></h1><h3 class="pageOneH3">Checklist for Singular or Joint Inspections for Public and<br/> Private Providers by Health Regulatory Bodies under the<br/> Ministry of Health</h3></div></div>';
        } else {
            html = html + '<center><img src=' + logourl + ' width="100px" height="100px"></center><br/>';


        }
        html = html + sectionHTML;
        html = html + "</body></html>";

        // phantom JS code
        var jsreport = require('jsreport');
        var footerHTML = "<center><font style='color:rgba(105, 120, 130, 0.8);font-size:9px;font-family:\"Open Sans, sans-serif\"' id='pageNumber' name='{#pageNum}'>{#pageNum}</font></center><script type='text/javascript'> var elem = document.getElementById('pageNumber'); if (parseInt(elem.getAttribute('name'))==1) { elem.style.display = 'none'; } else {elem.innerHTML = 'Page '+(parseInt(elem.getAttribute('name'))-1)+' of '+(parseInt({#numPages})-1);}</script>";
        if (!detailed) {
            footerHTML = "<center><font style='color:rgba(105, 120, 130, 0.8);font-size:9px;font-family:\"Open Sans, sans-serif\"' id='pageNumber' name='{#pageNum}'>{#pageNum} of {#numPages}</font></center>";
        }
        jsreport.render({
            template: {
                content: html,
                recipe: "phantom-pdf",
                engine: "handlebars",
                phantom: {
                    header: "<center><font style='color:rgba(105, 120, 130, 0.8);font-size:13px;font-weight:bold;font-family:\"Open Sans, sans-serif\"'>" + emailData.mailReportHeader + "</font></center>",
                    footer: footerHTML,
                    headerHeight: "45px",
                    footerHeight: "30px",
                    margin: "25px"
                }
            },
        }).then(function(out) {

            setTimeout(function() {

                //  res.setHeader('Content-disposition', 'attachment; filename='+req.__("complete_jhic_individual_report")+'_'+report+'_'+(CountyService.formateDate())+'.pdf');
                out.stream.pipe(fs.createWriteStream('.tmp/' + emailData.mailReportHeader + '.pdf'));

                EmailService.mailIndividualReport(emailData, function() {
                    fs.unlink('.tmp/' + emailData.mailReportHeader + '.pdf', function(err) {
                        if (err) throw err;

                        return res.json();
                    });
                });
            }, 2000);
            winston.info("mailIndividualAsPdf End");

        }).catch(function(e) {
            res.end(e.message);
        });
    },
    exportAggregateAsPDF: function(req, res) {
        // prepare html
        winston.info("exportAggregateAsPDF Start");
        var logourl = sails.config.logoURL;
        var sectionHTML = req.param("reportHTML");



        var reportType = req.param("reportType");
        var county = req.param("county");
        var subCounty = req.param("subCounty");
        var ownership = req.param("ownership");
        var observations = req.param("observations");
        var level = req.param("level");

        var html = "<html><head><link rel='icon' href='/wb-favicon.png'/><title>KePSIE | PDF</title><style> ";
        if (reportType == "Complete") {
            html = html + ".secLink {font-size:12px !important;padding:1px} #s14Body img {height : 12px;width : 12px} .header2 {font-weight: bold}";
            html = html + "table tbody tr th {padding: 2px;font-size:11px} table tbody tr td {font-size:10px;border-top: 1px solid #e7ecf1 !important;padding: 1px;vertical-align: top;}";
            html = html + "table.innertable tbody tr th{padding: 1px !important;font-size:10px !important} table.innertable tbody tr td{font-size:10px !important;padding: 1px !important}";
        } else {
            html = html + ".secLink {font-size:18px !important;padding:4px} #s14Body img {height : 12px;width : 12px}";
            html = html + "table tbody tr th {padding: 2px;font-size:11px} table tbody tr td {font-size:10px;border-top: 1px solid #e7ecf1 !important;padding: 3px;vertical-align: top;}";
            html = html + "table.innertable tbody tr th{padding: 1px !important;font-size:10px !important} table.innertable tbody tr td{font-size:10px !important;padding:3px !important}";
        }
        html = html + "</style></head><body style='color: #333333; font-family:\"Open Sans, sans-serif !important\";font-size:13px'>";
        html = html + '<center><img src=' + logourl + ' width="100px" height="100px"></center><br/>' + sectionHTML;
        html = html + "</body></html>";

        // phantom JS code
        var jsreport = require('jsreport');
        var footerHTML = "<center><font style='color:rgba(105, 120, 130, 0.8);font-size:9px;font-family:\"Open Sans, sans-serif\"' id='pageNumber' name='{#pageNum}'>{#pageNum} of {#numPages}</font></center>";

        jsreport.render({
            template: {
                content: html,
                recipe: "phantom-pdf",
                engine: "handlebars",
                phantom: {
                    header: "<font style='color:#545454;font-size:13px;font-weight:bold;font-family:\"Open Sans, sans-serif\"'>" +
                        "Aggregate JHIC Report - " + reportType + " (Observations: " + observations + ")" +
                        "</font><br />" +
                        "<font style='color:#545454;font-size:9px;font-family:\"Open Sans, sans-serif\"'>County: " + county + " | Sub County: " + subCounty + " |Ownership: " + ownership + " | Level: " + level + " </font>" +
                        "",
                    footer: footerHTML,
                    headerHeight: "70px",
                    footerHeight: "30px",
                    margin: "25px"
                }
            },
        }).then(function(out) {
            setTimeout(function() {
                res.setHeader('Content-disposition', 'attachment; filename=' + req.__("complete_jhic_aggregate_report") + '_' + reportType + '_' + (CountyService.formateDate()) + '.pdf');
                out.stream.pipe(res);
            }, 2000);

            winston.info("exportAggregateAsPDF End");

        }).catch(function(e) {
            res.end(e.message);
        });
    },


    exportAggregateAsExcel: function(req, res) {

        winston.info("exportAggregateAsExcel Start");

        var reportType = req.param("reportType");
        var county = req.param("county");
        var subCounty = req.param("subCounty");
        var ownership = req.param("ownership");
        var level = req.param("level");

        var http = require('http');
        var fs = require('fs');
        var d = new Date();
        var n = d.getMilliseconds();
        var xlsxFileName = ".tmp/excelFile.xlsx";
        var sheetRow = 1;

        // prepare excel
        var xl = require('excel4node');
        var wb = new xl.Workbook();
        var ws = wb.addWorksheet('JHIC_AGGREGATE_REPORT_' + reportType);

        // styles
        var mainHeadingStyle
        var header1Style = wb.createStyle({
            alignment: {
                vertical: ['center']
            },
            font: {
                color: 'white',
                size: 12,
                bold: true,
            },
            fill: {
                type: "pattern",
                patternType: "solid",
                fgColor: "#31708f",
                bgColor: "#31708f"
            }
        });
        var header2Style = wb.createStyle({
            alignment: {
                vertical: ['center']
            },
            font: {
                color: 'black',
                size: 11,
                bold: true,
            },
            fill: {
                type: "pattern",
                patternType: "solid",
                fgColor: "#CCCCCC",
                bgColor: "#CCCCCC"
            }
        });
        var innerTableHeaderStyle = wb.createStyle({
            alignment: {
                vertical: ['center'],
                wrapText: true
            },
            font: {
                color: 'black',
                size: 11,
                bold: true,
            },
            fill: {
                type: "pattern",
                patternType: "solid",
                fgColor: "#CCCCCC",
                bgColor: "#CCCCCC"
            }
        });
        var innerTableHeaderCenterStyle = wb.createStyle({
            alignment: {
                horizontal: ['center'],
                vertical: ['center']
            },
            font: {
                color: 'black',
                size: 11,
                bold: true,
            },
            fill: {
                type: "pattern",
                patternType: "solid",
                fgColor: "#CCCCCC",
                bgColor: "#CCCCCC"
            },
            numberFormat: '#0.00'
        });
        var innerTableHeaderCenterStyle1 = wb.createStyle({
            alignment: {
                horizontal: ['center'],
                vertical: ['center']
            },
            font: {
                color: 'black',
                size: 11,
                bold: true,
            },
            fill: {
                type: "pattern",
                patternType: "solid",
                fgColor: "#CCCCCC",
                bgColor: "#CCCCCC"
            },
            numberFormat: '#0.00%'
        });
        var innerTableScoreHeaderStyle = wb.createStyle({
            alignment: {
                horizontal: ['center'],
                vertical: ['center'],
                wrapText: true
            },
            font: {
                color: 'black',
                size: 11,
                bold: true,
            },
            fill: {
                type: "pattern",
                patternType: "solid",
                fgColor: "#CCCCCC",
                bgColor: "#CCCCCC"
            }
        });
        var innerTableScoreHeaderStyle1 = wb.createStyle({
            alignment: {
                horizontal: ['center'],
                vertical: ['center'],
                wrapText: true
            },
            font: {
                color: 'black',
                size: 11,
                bold: true,
            },
        });
        var normalStyle = wb.createStyle({
            alignment: {
                vertical: ['center']
            },
            font: {
                color: 'black',
                size: 11,
            }
        });

        var numberCenterStyle = wb.createStyle({
            alignment: {
                vertical: ['center'],
                horizontal: ['center'],
            },
            font: {
                color: 'black',
                size: 11,
            },
            numberFormat: '#0.00'
        });

        var numberCenterStyle1 = wb.createStyle({
            alignment: {
                vertical: ['center'],
                horizontal: ['center'],
            },
            font: {
                color: 'black',
                size: 11,
            },
            numberFormat: '#0.00%'
        });

        var normalIndentStyle = wb.createStyle({
            alignment: {
                vertical: ['center'],
                //indent: 2
            },
            font: {
                color: 'black',
                size: 11,
            }
        });
        var normalCenterStyle = wb.createStyle({
            alignment: {
                vertical: ['center'],
                horizontal: ['center']
            },
            font: {
                color: 'black',
                size: 11,
            }
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
        var totalStyle = wb.createStyle({
            alignment: {
                vertical: ['center']
            },
            font: {
                color: 'black',
                size: 11,
                bold: true,
            }
        });
        var numberStyle = wb.createStyle({
            alignment: {
                horizontal: ['center'],
                vertical: ['center']
            },
            font: {
                color: 'black',
                size: 11,
            }
        });

        var boldFontStyle = wb.createStyle({
            alignment: {
                vertical: ['center'],
                horizontal: ['center']
            },
            font: {
                color: 'black',
                size: 11,
                bold: true
            },
            numberFormat: '#0.00'
        });

        var boldFontStyle1 = wb.createStyle({
            alignment: {
                vertical: ['center'],
                horizontal: ['center']
            },
            font: {
                color: 'black',
                size: 11,
                bold: true
            },
            numberFormat: '#0.00%'
        });



        // get data and populate in excel
        InspectionDataService.aggregate(req, county, subCounty, ownership, level, function(result, size) {

            function nextChar(c) {
                return String.fromCharCode(c.charCodeAt(0) + 1);
            }
            ws.row(sheetRow).setHeight(70);

            // heading
            ws.cell(sheetRow, 1, sheetRow++, 6, true).string('KePSIE Monitoring System, Ministry of Health')
                .style({ alignment: { horizontal: ['center'] }, font: { color: 'black', size: 13, bold: true } });

            ws.cell(sheetRow, 1, sheetRow++, 6, true).string('Aggregate JHIC Report - ' + reportType)
                .style({ alignment: { horizontal: ['center'] }, font: { color: 'black', size: 13, bold: true } });
            ws.cell(sheetRow, 1, sheetRow++, 6, true).string("County: " + county + " | " + "Sub County: " + subCounty + " | Ownership: " + ownership + " | Level: " + level)
                .style({ alignment: { horizontal: ['center'] }, font: { color: 'black', size: 11 } });
            ws.cell(sheetRow, 1, sheetRow++, 6, true).string("(Observations: " + size + ")")
                .style({ alignment: { horizontal: ['center'] }, font: { color: 'black', size: 11 } });
            ws.cell(sheetRow, 1, sheetRow++, 6, true).string("");

            ws.cell(sheetRow, 1, sheetRow, 3, true).string('');
            if (reportType == "Complete") {
                ws.cell(sheetRow, 4).string("Max Score").style(innerTableScoreHeaderStyle1);
                ws.cell(sheetRow, 5).string("Observed Score").style(innerTableScoreHeaderStyle1);
                ws.cell(sheetRow, 6).string("Percentage Score").style(innerTableScoreHeaderStyle1);
            }
            sheetRow++;

            if (reportType == "Complete") {
                // level-1
                for (var i = 2; i < 14; i++) {

                    if (result['s' + i + "_ms"] != null) {

                        ws.cell(sheetRow, 1, sheetRow, 6, true).string("Section " + i + " : " + req.__('s' + i)).style(header1Style);
                        sheetRow++;
                        var labelAlp = 'a';
                        var nextLabel = req.__('s' + i + labelAlp);

                        // level-2
                        while (nextLabel != ('s' + i + labelAlp)) {
                            ws.cell(sheetRow, 1, sheetRow, 3, true).string(labelAlp.toUpperCase() + '. ' + nextLabel).style(innerTableHeaderStyle);

                            if (result['s' + i + labelAlp + "_ms"] != null) {
                                ws.cell(sheetRow, 4).number(result['s' + i + labelAlp + "_ms"]).style(innerTableHeaderCenterStyle);
                            }

                            if (result['s' + i + labelAlp + "_os"] != null) {
                                ws.cell(sheetRow, 5).number(result['s' + i + labelAlp + "_os"]).style(innerTableHeaderCenterStyle);
                            }

                            if (result['s' + i + labelAlp + "_ps"] != null) {
                                result['s' + i + labelAlp + "_ps"] = result['s' + i + labelAlp + "_ps"] / 100;
                                ws.cell(sheetRow, 6).number(result['s' + i + labelAlp + "_ps"]).style(innerTableHeaderCenterStyle1);
                            }

                            sheetRow++;
                            var labelNum = "1";
                            var nextLabel1 = req.__('s' + i + labelAlp + "_" + labelNum);

                            // level-3
                            while (nextLabel1 != ('s' + i + labelAlp + "_" + labelNum)) {
                                ws.cell(sheetRow, 1).string('').style(normalStyle);
                                ws.cell(sheetRow, 2, sheetRow, 3, true).string(labelNum + '. ' + nextLabel1)
                                    .style({ alignment: { vertical: ['center'] }, font: { color: 'black', size: 11, bold: true } });


                                if (result['s' + i + labelAlp + "_" + labelNum + "_ms"] != null) {
                                    ws.cell(sheetRow, 4).number(result['s' + i + labelAlp + "_" + labelNum + "_ms"]).style(boldFontStyle);
                                }

                                if (result['s' + i + labelAlp + "_" + labelNum + "_os"] != null) {
                                    ws.cell(sheetRow, 5).number(result['s' + i + labelAlp + "_" + labelNum + "_os"]).style(boldFontStyle);
                                }

                                if (result['s' + i + labelAlp + "_" + labelNum + "_ps"] != null) {
                                    result['s' + i + labelAlp + "_" + labelNum + "_ps"] = result['s' + i + labelAlp + "_" + labelNum + "_ps"] / 100;
                                    ws.cell(sheetRow, 6).number(result['s' + i + labelAlp + "_" + labelNum + "_ps"]).style(boldFontStyle1);
                                }

                                sheetRow++;
                                var labelAlp1 = "a";
                                var nextLabel2 = req.__('s' + i + labelAlp + "_" + labelNum + labelAlp1);

                                // level-4
                                while (nextLabel2 != ('s' + i + labelAlp + "_" + labelNum + labelAlp1)) {
                                    ws.cell(sheetRow, 1).string('').style(normalStyle);
                                    ws.cell(sheetRow, 2, sheetRow, 3, true).string(nextLabel2).style(normalIndentStyle);

                                    if (result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + "_ms"] != null) {
                                        ws.cell(sheetRow, 4).number(result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + "_ms"]).style(numberCenterStyle);
                                    }

                                    if (result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + "_os"] != null) {
                                        ws.cell(sheetRow, 5).number(result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + "_os"]).style(numberCenterStyle);
                                    }

                                    if (result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + "_ps"] != null) {
                                        result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + "_ps"] = result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + "_ps"] / 100;
                                        ws.cell(sheetRow, 6).number(result['s' + i + labelAlp + "_" + labelNum + labelAlp1 + "_ps"]).style(numberCenterStyle1);
                                    }

                                    sheetRow++;
                                    labelAlp1 = nextChar(labelAlp1);
                                    nextLabel2 = req.__('s' + i + labelAlp + "_" + labelNum + labelAlp1);
                                }

                                labelNum = parseInt(labelNum) + 1;
                                nextLabel1 = req.__('s' + i + labelAlp + "_" + labelNum);
                            }
                            labelAlp = nextChar(labelAlp);
                            nextLabel = req.__('s' + i + labelAlp);
                        }
                    }
                }
            }

            // Report heading
            ws.cell(sheetRow, 1, sheetRow++, 6, true).string('Findings and Recommendations').style(header1Style);
            ws.cell(sheetRow, 1, sheetRow++, 6, true).string('Health Facility Score Summary Table').style(header2Style);
            ws.cell(sheetRow, 1, sheetRow, 6).string('');
            ws.row(sheetRow).setHeight(1);
            sheetRow++;
            ws.cell(sheetRow, 2).string('Section No').style(innerTableHeaderStyle);
            ws.cell(sheetRow, 3).string('Section Title').style(innerTableHeaderStyle);
            ws.cell(sheetRow, 4).string('Max Score').style(innerTableScoreHeaderStyle);
            ws.cell(sheetRow, 5).string('Observed Score').style(innerTableScoreHeaderStyle);
            ws.cell(sheetRow, 6).string('Percentage Score').style(innerTableScoreHeaderStyle);
            sheetRow++;

            var total_ms = 0;
            var total_os = 0;
            var total_ps = 0;
            for (var i = 2; i < 14; i++) {
                ws.cell(sheetRow, 2).string('Section ' + i).style(normalStyle);
                /*ws.addImage({
                    path: 'assets/images/up_16.png',
                    type: 'picture',
                    position: {
                        type: 'oneCellAnchor',
                        from: {
                            col: 3,
                            colOff: 0,
                            row: sheetRow,
                            rowOff: 0 
                        }
                    }
                });*/

                total_ms = total_ms + result['s' + i + "_ms"];
                total_os = total_os + result['s' + i + "_os"];

                ws.cell(sheetRow, 3).string(req.__('s' + i)).style(normalIndentStyle);

                if (result['s' + i + "_ms"] != null) {
                    ws.cell(sheetRow, 4).number(result['s' + i + "_ms"]).style(numberCenterStyle);
                }

                if (result['s' + i + "_os"] != null) {
                    ws.cell(sheetRow, 5).number(result['s' + i + "_os"]).style(numberCenterStyle);
                }

                if (result['s' + i + "_ps"] != null) {
                    result['s' + i + "_ps"] = result['s' + i + "_ps"] / 100;
                    ws.cell(sheetRow, 6).number(result['s' + i + "_ps"]).style(numberCenterStyle1);
                }
                sheetRow++;
            }
            total_ps = (total_os / total_ms) * 100;

            // total
            ws.cell(sheetRow, 3).string(req.__('s14d_total')).style(totalStyle);

            if (total_ms != null) {
                ws.cell(sheetRow, 4).number(total_ms).style(numberCenterStyle);
            }

            if (total_os != null) {
                ws.cell(sheetRow, 5).number(total_os).style(numberCenterStyle);
            }

            if (total_ps != null) {
                total_ps = total_ps / 100;
                ws.cell(sheetRow, 6).number(total_ps).style(numberCenterStyle1);
            }

            ws.column(1).setWidth(2);
            ws.column(3).setWidth(45);
            ws.column(4).setWidth(15);
            ws.column(5).setWidth(15);
            ws.column(6).setWidth(15);

            sendExcelFile();

            winston.info("exportAggregateAsExcel End");
        });

        function sendExcelFile() {

            wb.write(xlsxFileName, function(err, stats) {
                if (err) {
                    console.error(err);
                }

                var fs = require('fs');

                var fileName = req.__('complete_jhic_aggregate_report') + "_" + reportType + "_" + (CountyService.formateDate()) + ".xlsx";
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
    }
}