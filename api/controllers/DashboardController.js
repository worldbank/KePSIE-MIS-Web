/**
 * OtherIssuesController
 * 
 * @description : Server-side logic for Dashboard
 * @author : Jay Pastagia
 */
var winston = require('winston');

module.exports = {

    about: function(req, res) {

        res.view('aboutkepsie');
    },

    dashboard: function(req, res) {
        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');
        var graph_1_data = [];

        // get meanscore data
        winston.info("Start Dashboard");
        InspectionDataService.getPercentageOfMeanScores("1", "By County", function(resultByCounty) {

            InspectionDataService.getPercentageOfMeanScores("1", "All", function(resultAll) {

                var avg_checkList = 0;
                if (resultAll != undefined && resultAll.length > 0) {
                    avg_checkList = Math.round(resultAll[0].ps);
                }
                var countyList = CountyService.getAll();

                for (var i = 0; i < countyList.length; i++) {

                    var flag = 0;

                    if (resultByCounty != undefined) {

                        for (var j = 0; j < resultByCounty.length; j++) {

                            if (countyList[i] == resultByCounty[j]._id) {

                                var obj = {};
                                obj.name = countyList[i];
                                obj.y = Math
                                    .round(resultByCounty[j].ps);
                                obj.count = resultByCounty[j].count;

                                graph_1_data.push(obj);
                                flag = 1;
                            }
                        }
                    }
                    if (flag = 0) {
                        var obj = {};
                        obj.name = countyList[i];
                        obj.y = 0;
                        obj.count = 0;

                        graph_1_data.push(obj);
                    }
                }

                //compliance category figure
                var total_facility = 0;;
                var hfType = 1;
                var county = 'All';
                InspectionDataService.getPercentageOfFacilities(hfType, county, function(result) {

                    var index0, index1, index2, index3, index4;
                    var index0, val1, val2, val3, val4;
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
                    var dataArray = [];
                    dataArray.push(val0);
                    dataArray.push(val1);
                    dataArray.push(val2);
                    dataArray.push(val3);
                    dataArray.push(val4);
                    console.log('!!!! Preapring response !!!!!');
                    var xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];
                    var seriesArray = [{ showInLegend: false, data: dataArray, color: 'rgba(49, 112, 143,1)' }];
                    // sendResponse(xAxisArray, seriesArray);
                    var summary_jhic_data = {
                        categoryArray: xAxisArray,
                        seriesArray: seriesArray,
                        total_facility: total_facility
                    };

                    //Checklist Score by Unit 
                    xAxisArray = CountyService.getUnit();
                    InspectionDataService.getPercentageOfMeanScoresByUnit(hfType, county, function(meanScoreArray) {
                        var total_count = 0;
                        if (meanScoreArray[0] != undefined) {
                            total_count = meanScoreArray[0].count;
                            seriesArray = [{
                                showInLegend: false,
                                data: [meanScoreArray[0].s2_ps, meanScoreArray[0].s3_ps,
                                    meanScoreArray[0].s4_ps, meanScoreArray[0].s5_ps, meanScoreArray[0].s6_ps, meanScoreArray[0].s7_ps,
                                    meanScoreArray[0].s8_ps, meanScoreArray[0].s9_ps, meanScoreArray[0].s10_ps, meanScoreArray[0].s11_ps,
                                    meanScoreArray[0].s12_ps, meanScoreArray[0].s13_ps
                                ],
                                color: 'rgba(49, 112, 143,1)'
                            }];
                        } else {
                            seriesArray = [{ showInLegend: false, data: [], color: 'rgba(49, 112, 143,1)' }];
                        }
                        var summary_jhic_data_unit = {
                            categoryArray: xAxisArray,
                            seriesArray: seriesArray,
                            total_count: total_count
                        };

                        // closure statics for facility
                        InspectionDataService.closureStatus("All", "All", "All", function(closureReqStatics, closureStatics) {

                            var waveDetails = CountyService.getInspectionWave();
                            var insp_status = collection.aggregate([{
                                $match: {
                                    'is_deleted': false

                                    /* remove comment if have to consider wave for  No. of insp complete
                                     ,'p_wave':waveDetails.currentWave
                                     */
                                }
                            }, {
                                $group: {
                                    _id: "$m_insp_completed",
                                    total: {
                                        $sum: 1
                                    }
                                }
                            }]);

                            insp_status.toArray(function(err, inspectionStatusResult) {

                                var InspectionStatus = {
                                    inspComplete: 0,
                                    inspPending: 0
                                };

                                for (var i = 0; i < inspectionStatusResult.length; i++) {
                                    if (inspectionStatusResult[i]._id == "Yes") {

                                        InspectionStatus.inspComplete = inspectionStatusResult[i].total;

                                    }
                                    /*else if (inspectionStatusResult[i]._id == "No") {

                  				InspectionStatus.inspPending = inspectionStatusResult[i].total;

                  			}*/
                                }

                                var risk_cPercentage = collection.aggregate([{
                                        $match: {
                                            is_deleted: false,
                                            m_insp_completed: "Yes"
                                        }
                                    }, {
                                        $sort: {
                                            p_insp_number: 1
                                        }
                                    }, {
                                        $group: {
                                            _id: "$_hfid",
                                            inspection: {
                                                $max: "$p_insp_number"
                                            },
                                            risk_c: {
                                                $last: '$risk_c'
                                            }
                                        }
                                    },

                                    {
                                        $group: {
                                            _id: "$risk_c",
                                            count: {
                                                $sum: 1
                                            }
                                        }
                                    }, {
                                        $group: {
                                            _id: null,
                                            "total": {
                                                "$sum": "$count"
                                            },
                                            "category": {
                                                "$push": {
                                                    "name": "$_id",
                                                    "count": "$count",
                                                }
                                            }
                                        }
                                    }
                                ], { allowDiskUse: true });
                                risk_cPercentage.toArray(function(err, risk_cPercentageResult) {

                                    var riskResult = {
                                        "Fully": 0
                                    };

                                    var list = risk_cPercentageResult[0];

                                    var count = 0;
                                    riskResult["Fully"] = 0;
                                    if (list != undefined) {
                                        for (var i = 0; i < list["category"].length; i++) {
                                            if (list["category"][i].name == "Fully Compliant" || list["category"][i].name == "Substantially Compliant") {
                                                count += list["category"][i].count;
                                            }
                                        }
                                        riskResult["Fully"] = Math.round((count / list["total"]) * 100);
                                    }

                                    InspectionDataService.getPercentageOfMeanScores("3", "By County", function(meanscoreByCounty) {
                                        var dataArrayPublic, dataArrayPrivate;
                                        console.log("meanscoreByCountyByownership")
                                        console.log(meanscoreByCounty)
                                        var dataArrayPublic = [0, 0, 0];
                                        var dataArrayPrivate = [0, 0, 0];
                                        var countyList = CountyService.getAll();
                                        var totalPublic = 0;
                                        var totalPrivate = 0;

                                        for (var j = 0; j < countyList.length; j++) {
                                            for (var i = 0; i < meanscoreByCounty.length; i++) {

                                                if (meanscoreByCounty[i]._id.ownership == "Public" && meanscoreByCounty[i]._id.county == countyList[j]) {
                                                    dataArrayPublic[j] = meanscoreByCounty[i].ps;
                                                    totalPublic += meanscoreByCounty[i].count;
                                                }
                                                if (meanscoreByCounty[i]._id.ownership == "Private" && meanscoreByCounty[i]._id.county == countyList[j]) {
                                                    dataArrayPrivate[j] = meanscoreByCounty[i].ps;
                                                    totalPrivate += meanscoreByCounty[i].count;
                                                }
                                            }
                                        }

                                        var checklistByCountyByOwnership = [{
                                            name: 'Public (N=' + totalPublic + ')',
                                            data: dataArrayPublic,
                                            color: '#5b9bd5'
                                        }, {
                                            name: 'Private (N=' + totalPrivate + ')',
                                            data: dataArrayPrivate,
                                            color: '#a4d9a0'
                                        }];



                                        res.view('dashboard', {
                                            'graph_1_data': graph_1_data,
                                            'checklistByCountyByOwnership': checklistByCountyByOwnership,
                                            'summary_jhic_data_unit': summary_jhic_data_unit,
                                            'summary_jhic_data': summary_jhic_data,
                                            'avg_checkList': avg_checkList,
                                            'closureReqStatics': closureReqStatics,
                                            'closureStatics': closureStatics,
                                            'InspectionStatus': InspectionStatus,
                                            'riskResult': riskResult
                                        });

                                        winston.info("End Dashboard");
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    },
    getGraceRenewData: function(req, res) {
        InspectionDataService.getGracePeriodRenewData("All", "All", "All", function(scoreByDept) {

            var gracePeriodRenew = [{
                name: 'To be checked after grace period',
                data: scoreByDept.dataArrayLicenses,
                color: '#34a4da'
            }, {
                name: 'Found valid after grace period',
                data: scoreByDept.dataArrayRenewed,
                color: '#ed7d31'
            }, {
                name: 'Found invalid after grace period',
                data: scoreByDept.dataArrayInvalid,
                color: '#a4a4a4'
            }];
            return res.json({ 'gracePeriodRenew': gracePeriodRenew });
        });
    },
    getFirstInspData: function(req, res) {

        //Facility.find({is_deleted:false,insp_no:1}).exec(function(err,facilityList){
        var collection = MongoService.getDB().collection('facility');
        //collection.distinct("_hfid",{is_deleted:false}, function(err, facilityList) {
        var c = collection.aggregate([{ $group: { _id: "$_hfid" } }, { $group: { _id: null, count: { $sum: 1 } } }]);
        c.toArray(function(err, facilityList) {

            var first_insp_array = [0, 0];
            if (facilityList[0] != undefined) {
                first_insp_array[0] = facilityList[0].count;
                Facility.find({ is_deleted: false, _insp_type: 101, m_insp_completed: "Yes" }).exec(function(err, inspCompleteList) {
                    if (inspCompleteList != undefined) {
                        var first_inspCompleted_count = inspCompleteList.length;
                        first_insp_array[1] = first_inspCompleted_count;
                        var first_insp_data = [{
                            data: first_insp_array,
                            color: '#00b0f0'
                        }];
                    }
                    return res.json({ 'first_insp_data': first_insp_data });
                });
            }
        });
    },
    getNextInspData: function(req, res) {
        InspectionDataService.next_insp_detail(function(next_insp) {

            var next_insp_detail = [{
                name: "Closed",
                y: 0,
                color: '#e7505a'
            }, {
                name: "3-months",
                y: 0,
                color: '#ed7d31'
            }, {
                name: "6-months",
                y: 0,
                color: '#92d050'
            }, {
                name: "12-months",
                y: 0,
                color: '#548235'
            }, {
                name: "24-months",
                y: 0,
                color: '#264810'
            }];

            for (var i = 0; i < next_insp.length; i++) {
                if (next_insp[i]._id == "Closed") {
                    next_insp_detail[0].y = next_insp[i].count;
                }
                if (next_insp[i]._id == "R: 3 months") {
                    next_insp_detail[1].y = next_insp[i].count;
                }
                if (next_insp[i]._id == "R: 6 months") {
                    next_insp_detail[2].y = next_insp[i].count;
                }
                if (next_insp[i]._id == "R: 1 year") {
                    next_insp_detail[3].y = next_insp[i].count;
                }
                if (next_insp[i]._id == "R: 2 years") {
                    next_insp_detail[4].y = next_insp[i].count;
                }
            }

            return res.json({ 'next_insp_detail': next_insp_detail });
        });
    },
    exportAsPdf: function(req, res) {

        var request = require('request');

        var fontPath = 'https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all';
        var font_options = {
            url: fontPath,
            method: 'GET'
        };

        var languageFilePath = sails.config.assetURL + '/global/css/components.css';
        var options = {
            url: languageFilePath,
            method: 'GET'
        };

        var languageFilePath1 = sails.config.assetURL + '/layouts/layout4/css/layout.min.css';
        var options1 = {
            url: languageFilePath1,
            method: 'GET'
        };

        var languageFilePath2 = sails.config.assetURL + '/global/plugins/bootstrap/css/bootstrap.min.css';
        var options2 = {
            url: languageFilePath2,
            method: 'GET'
        };

        var languageFilePath3 = sails.config.assetURL + '/global/plugins/simple-line-icons/simple-line-icons.min.css';
        var options3 = {
            url: languageFilePath3,
            method: 'GET'
        };

        var languageFilePath4 = sails.config.assetURL + '/global/css/custom-kepsie.css';
        var options4 = {
            url: languageFilePath4,
            method: 'GET'
        };

        request(font_options, function(e, r, fontCss) {
            request(options, function(e, r, componentsCss) {
                request(options1, function(e, r, layoutCss) {
                    request(options2, function(e, r, bootstrapCss) {
                        request(options3, function(e, r, iconsCss) {
                            request(options4, function(e, r, customCss) {

                                var logourl = sails.config.logoURL;
                                winston.info("dashboardAsPdf Start");
                                // prepare html
                                var sectionHTML = req.param("reportHTML");

                                var detailed = false;
                                if (sectionHTML.indexOf("s1Body") > -1) {
                                    detailed = true;
                                }
                                var Overview_heading = "";
                                var html = "<html><head><link rel='icon' href='/wb-favicon.png'/><title>KePSIE - Dashboard | PDF</title><style> ";
                                html = html + fontCss + componentsCss + layoutCss + bootstrapCss + iconsCss + customCss;
                                html = html + '.page-head,.breadcrumb{display:none};.note-info {box-shadow: 0px 0px 14px -1px rgb(139, 180, 231)}.section{font-size: 16px !important;}';
                                html = html + '.icon-bar-chart{font-family: Simple-Line-Icons !important;}.pageBrk{page-break-before: always;}.note.note-info {background-color: #f5f8fd !important;border-color: #8bb4e7 !important;color: #010407 !important;}';
                                html = html + '.highcharts-button{display:none;}.widget-thumb-icon{display:none !important;}.widget-thumb .widget-thumb-heading {color: #8e9daa !important;}'
                                html = html + '.widget-thumb .widget-thumb-body .widget-thumb-body-stat {color: #3e4f5e !important;}'
                                html = html + "</style></head><body >"

                                html = html + '<center><img src=' + logourl + ' width="100px" height="100px"></center><br/>';

                                html = html + sectionHTML;
                                html = html + "</body></html>";

                                // phantom JS code
                                var jsreport = require('jsreport');
                                // var footerHTML = "<center><font style='color:rgba(105, 120, 130, 0.8);font-size:9px;font-family:\"Open Sans, sans-serif\"' id='pageNumber' name='{#pageNum}'>{#pageNum}</font></center><script type='text/javascript'> var elem = document.getElementById('pageNumber'); if (parseInt(elem.getAttribute('name'))==1) { elem.style.display = 'none'; } else {elem.innerHTML = 'Page '+(parseInt(elem.getAttribute('name'))-1)+' of '+(parseInt({#numPages})-1);}</script>";

                                jsreport.render({
                                    template: {
                                        content: html,
                                        recipe: "phantom-pdf",
                                        engine: "handlebars",
                                        phantom: {
                                            header: "<center><font style='color:rgba(105, 120, 130, 0.8);font-size:13px;font-weight:bold;font-family:\"Open Sans, sans-serif\"'>Dashboard</font></center>",
                                            //footer: footerHTML,
                                            headerHeight: "45px",
                                            footerHeight: "30px",
                                            margin: "25px",
                                            format: "A4"
                                        }
                                    },
                                }).then(function(out) {
                                    setTimeout(function() {

                                        res.setHeader('Content-disposition', 'attachment; filename=dashboard_' + (CountyService.formateDate()) + '.pdf');
                                        out.stream.pipe(res);
                                    }, 2000);

                                    winston.info("dashboardAsPdf End");

                                }).catch(function(e) {
                                    res.end(e.message);
                                });
                            });
                        });
                    });
                });
            });
        });
    }
};