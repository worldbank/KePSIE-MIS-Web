/**
 * InspCycleReportController
 *
 * @description :: Server-side logic for managing the inspection progress report
 * @author : Abhishek Upadhyay,Jay Pastagia
 */

module.exports = {

    aggregateProgress: function(req, res) {
        res.view('reports/aggregateProgress');
    },

    facilityLevelProgress: function(req, res) {
        res.view('reports/facilityLevelProgress');
    },

    getFigureDataByFilter: function(req, res) {
        var series = req.param("series");
        var hfType = req.param("hfType");
        var county = req.param("county");

        console.log("getFigureDataByFilter-----" + series + "---" + hfType + "----" + county);
        if (series == "1") {
            if (hfType == "1") {
                if (county == "All") {

                    var total_facility_first = 0;
                    var total_facility_latest = 0;
                    var dataArrayFirst = [];
                    var dataArrayLatest = [];

                    InspectionDataService.facilityLevelByRiskCategory(hfType, county, function(resultFirst, resultLatest) {
                        val0 = { y: 0, count: 0 };
                        val1 = { y: 0, count: 0 };
                        val2 = { y: 0, count: 0 };
                        val3 = { y: 0, count: 0 };
                        val4 = { y: 0, count: 0 };

                        if (resultFirst != undefined) {
                            for (var i = 0; i < resultFirst.length; i++) {
                                total_facility_first += resultFirst[i].count;
                                if (resultFirst[i]._id == 'Non-Compliant') {
                                    val0 = { y: resultFirst[i].percentage, count: resultFirst[i].count };
                                } else if (resultFirst[i]._id == 'Minimally Compliant') {
                                    val1 = { y: resultFirst[i].percentage, count: resultFirst[i].count };
                                } else if (resultFirst[i]._id == 'Partially Compliant') {
                                    val2 = { y: resultFirst[i].percentage, count: resultFirst[i].count };
                                } else if (resultFirst[i]._id == 'Substantially Compliant') {
                                    val3 = { y: resultFirst[i].percentage, count: resultFirst[i].count };
                                } else if (resultFirst[i]._id == 'Fully Compliant') {
                                    val4 = { y: resultFirst[i].percentage, count: resultFirst[i].count };
                                }
                            }
                        }

                        dataArrayFirst.push(val0);
                        dataArrayFirst.push(val1);
                        dataArrayFirst.push(val2);
                        dataArrayFirst.push(val3);
                        dataArrayFirst.push(val4);

                        val0 = { y: 0, count: 0 };
                        val1 = { y: 0, count: 0 };
                        val2 = { y: 0, count: 0 };
                        val3 = { y: 0, count: 0 };
                        val4 = { y: 0, count: 0 };

                        if (resultLatest != undefined) {
                            for (var i = 0; i < resultLatest.length; i++) {
                                total_facility_latest += resultLatest[i].count;
                                if (resultLatest[i]._id == 'Non-Compliant') {
                                    val0 = { y: resultLatest[i].percentage, count: resultLatest[i].count };
                                } else if (resultLatest[i]._id == 'Minimally Compliant') {
                                    val1 = { y: resultLatest[i].percentage, count: resultLatest[i].count };
                                } else if (resultLatest[i]._id == 'Partially Compliant') {
                                    val2 = { y: resultLatest[i].percentage, count: resultLatest[i].count };
                                } else if (resultLatest[i]._id == 'Substantially Compliant') {
                                    val3 = { y: resultLatest[i].percentage, count: resultLatest[i].count };
                                } else if (resultLatest[i]._id == 'Fully Compliant') {
                                    val4 = { y: resultLatest[i].percentage, count: resultLatest[i].count };
                                }
                            }
                        }

                        dataArrayLatest.push(val0);
                        dataArrayLatest.push(val1);
                        dataArrayLatest.push(val2);
                        dataArrayLatest.push(val3);
                        dataArrayLatest.push(val4);

                        xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];
                        seriesArray = [{ name: '1st Inspection (N=' + total_facility_first + ')', data: dataArrayFirst, color: 'rgba(68, 114, 196,1)' },
                            { name: 'Latest Inspection (N=' + total_facility_latest + ')', data: dataArrayLatest, color: 'rgba(237, 125, 49,1)' }
                        ];
                        console.log("seriesArray-------------progress");
                        console.log(seriesArray);
                        sendResponse(xAxisArray, seriesArray);
                    });
                } else if (county == "By County") {

                    var xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];
                    var total_facility = 0;
                    var total_facility_latest = 0;
                    var dataArrayFirst = [];
                    var dataArrayLatest = [];

                    InspectionDataService.facilityLevelByRiskCategory(hfType, "All", function(resultFirst, resultLatest) {
                        val0 = { y: 0, count: 0 };
                        val1 = { y: 0, count: 0 };
                        val2 = { y: 0, count: 0 };
                        val3 = { y: 0, count: 0 };
                        val4 = { y: 0, count: 0 };

                        if (resultFirst != undefined) {
                            for (var i = 0; i < resultFirst.length; i++) {
                                total_facility += resultFirst[i].count;
                                if (resultFirst[i]._id == 'Non-Compliant') {
                                    val0 = { y: resultFirst[i].percentage, count: resultFirst[i].count };
                                } else if (resultFirst[i]._id == 'Minimally Compliant') {
                                    val1 = { y: resultFirst[i].percentage, count: resultFirst[i].count };
                                } else if (resultFirst[i]._id == 'Partially Compliant') {
                                    val2 = { y: resultFirst[i].percentage, count: resultFirst[i].count };
                                } else if (resultFirst[i]._id == 'Substantially Compliant') {
                                    val3 = { y: resultFirst[i].percentage, count: resultFirst[i].count };
                                } else if (resultFirst[i]._id == 'Fully Compliant') {
                                    val4 = { y: resultFirst[i].percentage, count: resultFirst[i].count };
                                }
                            }
                        }

                        dataArrayFirst.push(val0);
                        dataArrayFirst.push(val1);
                        dataArrayFirst.push(val2);
                        dataArrayFirst.push(val3);
                        dataArrayFirst.push(val4);

                        val0 = { y: 0, count: 0 };
                        val1 = { y: 0, count: 0 };
                        val2 = { y: 0, count: 0 };
                        val3 = { y: 0, count: 0 };
                        val4 = { y: 0, count: 0 };

                        if (resultLatest != undefined) {
                            for (var i = 0; i < resultLatest.length; i++) {
                                total_facility_latest += resultLatest[i].count;
                                if (resultLatest[i]._id == 'Non-Compliant') {
                                    val0 = { y: resultLatest[i].percentage, count: resultLatest[i].count };
                                } else if (resultLatest[i]._id == 'Minimally Compliant') {
                                    val1 = { y: resultLatest[i].percentage, count: resultLatest[i].count };
                                } else if (resultLatest[i]._id == 'Partially Compliant') {
                                    val2 = { y: resultLatest[i].percentage, count: resultLatest[i].count };
                                } else if (resultLatest[i]._id == 'Substantially Compliant') {
                                    val3 = { y: resultLatest[i].percentage, count: resultLatest[i].count };
                                } else if (resultLatest[i]._id == 'Fully Compliant') {
                                    val4 = { y: resultLatest[i].percentage, count: resultLatest[i].count };
                                }
                            }
                        }

                        dataArrayLatest.push(val0);
                        dataArrayLatest.push(val1);
                        dataArrayLatest.push(val2);
                        dataArrayLatest.push(val3);
                        dataArrayLatest.push(val4);

                        seriesArrayAll = [{ name: '1st Inspection (N=' + total_facility + ')', data: dataArrayFirst, color: 'rgba(68, 114, 196,1)' },
                            { name: 'Latest Inspection (N=' + total_facility_latest + ')', data: dataArrayLatest, color: 'rgba(237, 125, 49,1)' }
                        ];
                        var seriesArrayByCounty = [];
                        seriesArrayByCounty[0] = seriesArrayAll;

                        InspectionDataService.facilityLevelByRiskCategory(hfType, county, function(resultFirst, resultLatest) {

                            facilityLevelByCounty(hfType, "1", resultFirst, resultLatest, function(seriesArrayKakamega) {
                                seriesArrayByCounty[1] = seriesArrayKakamega;

                                facilityLevelByCounty(hfType, "2", resultFirst, resultLatest, function(seriesArrayKilifi) {
                                    seriesArrayByCounty[2] = seriesArrayKilifi;

                                    facilityLevelByCounty(hfType, "3", resultFirst, resultLatest, function(seriesArrayMeru) {
                                        seriesArrayByCounty[3] = seriesArrayMeru;

                                        sendResponse(xAxisArray, seriesArrayByCounty);
                                    });
                                });
                            });
                        });
                    });
                } else {
                    xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];
                    InspectionDataService.facilityLevelByRiskCategory(hfType, county, function(resultFirst, resultLatest) {

                        facilityLevelByCounty(hfType, county, resultFirst, resultLatest, function(seriesArray) {

                            xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];

                            sendResponse(xAxisArray, seriesArray);
                        });
                    });
                }
            } else if (hfType == "2") {
                if (county == "All") {

                    InspectionDataService.facilityLevelByRiskCategory(hfType, county, function(resultFirst, resultLatest) {

                        facilityLevelByLevel(hfType, county, resultFirst, resultLatest, function(seriesArrayByLevel) {
                            var xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];
                            sendResponse(xAxisArray, seriesArrayByLevel)
                        });
                    });
                } else if (county == "By County") {
                    InspectionDataService.facilityLevelByRiskCategory(hfType, county, function(resultFirst, resultLatest) {
                        var firstInsp = resultFirst;
                        var latestInsp = resultLatest;
                        facilityLevelByLevel(hfType, "All", firstInsp, latestInsp, function(seriesArrayByLevelAll) {

                            var seriesArrayByLevel = [];
                            for (var i = 0; i < seriesArrayByLevelAll.length; i++) {
                                seriesArrayByLevel.push(seriesArrayByLevelAll[i]);
                            }
                            facilityLevelByLevel(hfType, "1", firstInsp, latestInsp, function(seriesArrayByLevelKakamega) {
                                for (var i = 0; i < seriesArrayByLevelKakamega.length; i++) {
                                    seriesArrayByLevel.push(seriesArrayByLevelKakamega[i]);
                                }
                                facilityLevelByLevel(hfType, "2", firstInsp, latestInsp, function(seriesArrayByLevelKilifi) {
                                    for (var i = 0; i < seriesArrayByLevelKilifi.length; i++) {
                                        seriesArrayByLevel.push(seriesArrayByLevelKilifi[i]);
                                    }
                                    facilityLevelByLevel(hfType, "3", firstInsp, latestInsp, function(seriesArrayByLevelMeru) {
                                        for (var i = 0; i < seriesArrayByLevelMeru.length; i++) {
                                            seriesArrayByLevel.push(seriesArrayByLevelMeru[i]);
                                        }
                                        var xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];

                                        sendResponse(xAxisArray, seriesArrayByLevel);
                                    });
                                });
                            });
                        });
                    });
                } else {
                    InspectionDataService.facilityLevelByRiskCategory(hfType, county, function(resultFirst, resultLatest) {

                        facilityLevelByLevel(hfType, county, resultFirst, resultLatest, function(seriesArrayByLevel) {
                            var xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];
                            console.log("seriesArrayByLevel------test");
                            console.log(seriesArrayByLevel);
                            sendResponse(xAxisArray, seriesArrayByLevel)
                        });
                    });
                }
            } else {
                if (county == "All") {

                    InspectionDataService.facilityLevelByRiskCategory(hfType, county, function(resultFirst, resultLatest) {
                        console.log("resultFirst All");
                        console.log(resultFirst);
                        facilityLevelByOwnership(hfType, county, resultFirst, resultLatest, function(seriesArrayByOwnership) {
                            var xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];

                            sendResponse(xAxisArray, seriesArrayByOwnership)
                        });
                    });
                } else if (county == "By County") {
                    InspectionDataService.facilityLevelByRiskCategory(hfType, county, function(resultFirst, resultLatest) {
                        console.log("resultFirst bycounty");
                        console.log(resultFirst);
                        var firstInsp = resultFirst;
                        var latestInsp = resultLatest;
                        facilityLevelByOwnership(hfType, "All", firstInsp, latestInsp, function(seriesArrayByOwnershipAll) {
                            var seriesArrayByOwnership = [];
                            for (var i = 0; i < seriesArrayByOwnershipAll.length; i++) {
                                seriesArrayByOwnership.push(seriesArrayByOwnershipAll[i]);
                            }
                            facilityLevelByOwnership(hfType, "1", firstInsp, latestInsp, function(seriesArrayByOwnershipKakamega) {
                                for (var i = 0; i < seriesArrayByOwnershipKakamega.length; i++) {
                                    seriesArrayByOwnership.push(seriesArrayByOwnershipKakamega[i]);
                                }
                                facilityLevelByOwnership(hfType, "2", firstInsp, latestInsp, function(seriesArrayByOwnershipKilifi) {
                                    for (var i = 0; i < seriesArrayByOwnershipKilifi.length; i++) {
                                        seriesArrayByOwnership.push(seriesArrayByOwnershipKilifi[i]);
                                    }
                                    facilityLevelByOwnership(hfType, "3", firstInsp, latestInsp, function(seriesArrayByOwnershipMeru) {
                                        for (var i = 0; i < seriesArrayByOwnershipMeru.length; i++) {
                                            seriesArrayByOwnership.push(seriesArrayByOwnershipMeru[i]);
                                        }
                                        var xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];

                                        sendResponse(xAxisArray, seriesArrayByOwnership);
                                    });
                                });
                            });
                        });
                    });
                } else {
                    InspectionDataService.facilityLevelByRiskCategory(hfType, county, function(resultFirst, resultLatest) {

                        facilityLevelByOwnership(hfType, county, resultFirst, resultLatest, function(seriesArrayByOwnership) {
                            var xAxisArray = ['Non-Compliant', 'Minimally Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'];
                            console.log("seriesArrayByLevel------test");
                            console.log(seriesArrayByOwnership);
                            sendResponse(xAxisArray, seriesArrayByOwnership)
                        });
                    });
                }
            }
        } else {
            // meanscore facility level starts
            if (hfType == "1") {
                if (county == "All") {

                    xAxisArray = ['All Counties'];
                    InspectionDataService.facilityLevelByMeanScores(hfType, county, function(resultFirst, resultLatest) {
                        var seriesArray = [];
                        if (resultFirst[0] == undefined) {
                            seriesArray.push({ name: '1st Inspection (N=0)', data: [{ y: 0, count: 0 }], color: 'rgba(68, 114, 196,1)' });
                        } else {
                            seriesArray.push({ name: '1st Inspection (N=' + resultFirst[0].count + ')', data: [{ y: resultFirst[0].ps, count: resultFirst[0].count }], color: 'rgba(68, 114, 196,1)' });
                        }
                        if (resultLatest[0] == undefined) {
                            seriesArray.push({ name: 'Latest Inspection (N=0)', data: [{ y: 0, count: 0 }], color: 'rgba(237, 125, 49,1)' });
                        } else {
                            seriesArray.push({ name: 'Latest Inspection (N=' + resultLatest[0].count + ')', data: [{ y: resultLatest[0].ps, count: resultLatest[0].count }], color: 'rgba(237, 125, 49,1)' });
                        }

                        sendResponse(xAxisArray, seriesArray);
                    });
                } else if (county == "By County") {

                    var dataArrayKakamega;
                    var dataArrayKilifi;
                    var dataArrayMeru;
                    var dataArrayAll;
                    xAxisArray = CountyService.getAll();
                    xAxisArray.push("All");
                    InspectionDataService.facilityLevelByMeanScores(hfType, county, function(resultFirst, resultLatest) {
                        InspectionDataService.facilityLevelByMeanScores("1", "All", function(resultFirstAll, resultLatestAll) {

                            if (resultFirst.length > 0) {
                                for (var i = 0; i < resultFirst.length; i++) {
                                    if (resultFirst[i]._id == "Kakamega") {
                                        dataArrayKakamega = { y: resultFirst[i].ps, count: resultFirst[i].count };
                                    }
                                    if (resultFirst[i]._id == "Kilifi") {
                                        dataArrayKilifi = { y: resultFirst[i].ps, count: resultFirst[i].count };
                                    }
                                    if (resultFirst[i]._id == "Meru") {
                                        dataArrayMeru = { y: resultFirst[i].ps, count: resultFirst[i].count };
                                    }
                                }
                            }

                            if (dataArrayKakamega == undefined) {
                                dataArrayKakamega = { y: 0, count: 0 };
                            }
                            if (dataArrayKilifi == undefined) {
                                dataArrayKilifi = { y: 0, count: 0 };
                            }
                            if (dataArrayMeru == undefined) {
                                dataArrayMeru = { y: 0, count: 0 };
                            }

                            if (resultFirstAll[0] != undefined) {
                                dataArrayAll = { y: resultFirstAll[0].ps, count: resultFirstAll[0].count };
                            } else {
                                dataArrayAll = { y: 0, count: 0 };
                            }

                            var dataArrayKakamegaLatest;
                            var dataArrayKilifiLatest;
                            var dataArrayMeruLatest;
                            var dataArrayAllLatest;


                            if (resultLatest.length > 0) {
                                for (var i = 0; i < resultLatest.length; i++) {
                                    if (resultLatest[i]._id == "Kakamega") {
                                        dataArrayKakamegaLatest = { y: resultLatest[i].ps, count: resultLatest[i].count };
                                    }
                                    if (resultLatest[i]._id == "Kilifi") {
                                        dataArrayKilifiLatest = { y: resultLatest[i].ps, count: resultLatest[i].count };
                                    }
                                    if (resultLatest[i]._id == "Meru") {
                                        dataArrayMeruLatest = { y: resultLatest[i].ps, count: resultLatest[i].count };
                                    }
                                }
                            }

                            if (dataArrayKakamegaLatest == undefined) {
                                dataArrayKakamegaLatest = { y: 0, count: 0 };
                            }
                            if (dataArrayKilifiLatest == undefined) {
                                dataArrayKilifiLatest = { y: 0, count: 0 };
                            }
                            if (dataArrayMeruLatest == undefined) {
                                dataArrayMeruLatest = { y: 0, count: 0 };
                            }

                            if (resultLatestAll[0] != undefined) {
                                dataArrayAllLatest = { y: resultLatestAll[0].ps, count: resultLatestAll[0].count };
                            } else {
                                dataArrayAllLatest = { y: 0, count: 0 };
                            }

                            sendResponse(xAxisArray, [{ name: '1st Inspection (N=' + dataArrayAll.count + ')', data: [dataArrayKakamega, dataArrayKilifi, dataArrayMeru, dataArrayAll], color: 'rgba(68, 114, 196,1)' },
                                { name: 'Latest Inspection (N=' + dataArrayAllLatest.count + ')', data: [dataArrayKakamegaLatest, dataArrayKilifiLatest, dataArrayMeruLatest, dataArrayAllLatest], color: 'rgba(237, 125, 49,1)' }
                            ]);
                        });
                    });
                } else {
                    var dataArrayFirst;
                    var dataArrayLatest;
                    xAxisArray = [CountyService.getCounty(county)];
                    InspectionDataService.facilityLevelByMeanScores(hfType, county, function(resultFirst, resultLatest) {

                        for (var i = 0; i < resultFirst.length; i++) {
                            if (resultFirst[i]._id == CountyService.getCounty(county)) {
                                dataArrayFirst = { y: resultFirst[i].ps, count: resultFirst[i].count };
                            }
                        }
                        for (var i = 0; i < resultLatest.length; i++) {
                            if (resultLatest[i]._id == CountyService.getCounty(county)) {
                                dataArrayLatest = { y: resultLatest[i].ps, count: resultLatest[i].count };
                            }
                        }
                        sendResponse(xAxisArray, [{
                            name: '1st Inspection (N=' + dataArrayFirst.count + ')',
                            data: [dataArrayFirst],
                            color: 'rgba(68, 114, 196,1)'
                        }, {
                            name: 'Latest Inspection (N=' + dataArrayLatest.count + ')',
                            data: [dataArrayLatest],
                            color: 'rgba(237, 125, 49,1)'
                        }])
                    });
                }
            } else if (hfType == "2") {
                if (county == "All") {

                    InspectionDataService.facilityLevelByMeanScores(hfType, county, function(resultFirst, resultLatest) {

                        MeanScoreByLevel(hfType, county, resultFirst, resultLatest, function(seriesArrayByLevel) {
                            var xAxisArray = ['All Counties'];
                            console.log("seriesArrayByLevelMeanscore");
                            console.log(seriesArrayByLevel);
                            sendResponse(xAxisArray, seriesArrayByLevel)
                        });
                    });
                } else if (county == "By County") {

                    xAxisArray = CountyService.getAll();
                    xAxisArray.push("All");
                    InspectionDataService.facilityLevelByMeanScores(hfType, county, function(resultFirst, resultLatest) {
                        InspectionDataService.facilityLevelByMeanScores("1", county, function(resultFirstAll, resultLatestAll) {

                            function getPercByLevelByCounty(data, level, county) {
                                for (i in data) {
                                    if (level == data[i]._id.level &&
                                        county == data[i]._id.county) {
                                        var tmp = { y: data[i].ps, count: data[i].count };
                                        return tmp;
                                    }
                                }
                                return { y: 0, count: 0 };
                            };

                            function getPercByLevelAll(data, county) {
                                for (i in data) {
                                    if (county == data[i]._id) {
                                        var tmp = { y: data[i].ps, count: data[i].count };
                                        return tmp;
                                    }
                                }
                                return { y: 0, count: 0 };
                            };

                            var level21 = getPercByLevelByCounty(resultFirst, "Level 2", "Kakamega");
                            var level22 = getPercByLevelByCounty(resultFirst, "Level 2", "Kilifi");
                            var level23 = getPercByLevelByCounty(resultFirst, "Level 2", "Meru");

                            var level31 = getPercByLevelByCounty(resultFirst, "Level 3", "Kakamega");
                            var level32 = getPercByLevelByCounty(resultFirst, "Level 3", "Kilifi");
                            var level33 = getPercByLevelByCounty(resultFirst, "Level 3", "Meru");

                            var level41 = getPercByLevelByCounty(resultFirst, "Level 4", "Kakamega");
                            var level42 = getPercByLevelByCounty(resultFirst, "Level 4", "Kilifi");
                            var level43 = getPercByLevelByCounty(resultFirst, "Level 4", "Meru");

                            var level51 = getPercByLevelByCounty(resultFirst, "Level 5", "Kakamega");
                            var level52 = getPercByLevelByCounty(resultFirst, "Level 5", "Kilifi");
                            var level53 = getPercByLevelByCounty(resultFirst, "Level 5", "Meru");

                            var levelAllKakamega = getPercByLevelAll(resultFirstAll, "Kakamega");
                            var levelAllKilifi = getPercByLevelAll(resultFirstAll, "Kilifi");
                            var levelAllMeru = getPercByLevelAll(resultFirstAll, "Meru");

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

                            var total_facility_level2 = level21.count + level22.count + level23.count;
                            var total_facility_level3 = level31.count + level32.count + level33.count;
                            var total_facility_level4 = level41.count + level42.count + level43.count;
                            var total_facility_level5 = level51.count + level52.count + level53.count;
                            var total_facility_All = levelAllKakamega.count + levelAllKilifi.count + levelAllMeru.count;
                            var total_facility_level4_5 = total_facility_level4 + total_facility_level5;



                            var level21Latest = getPercByLevelByCounty(resultLatest, "Level 2", "Kakamega");
                            var level22Latest = getPercByLevelByCounty(resultLatest, "Level 2", "Kilifi");
                            var level23Latest = getPercByLevelByCounty(resultLatest, "Level 2", "Meru");

                            var level31Latest = getPercByLevelByCounty(resultLatest, "Level 3", "Kakamega");
                            var level32Latest = getPercByLevelByCounty(resultLatest, "Level 3", "Kilifi");
                            var level33Latest = getPercByLevelByCounty(resultLatest, "Level 3", "Meru");

                            var level41Latest = getPercByLevelByCounty(resultLatest, "Level 4", "Kakamega");
                            var level42Latest = getPercByLevelByCounty(resultLatest, "Level 4", "Kilifi");
                            var level43Latest = getPercByLevelByCounty(resultLatest, "Level 4", "Meru");

                            var level51Latest = getPercByLevelByCounty(resultLatest, "Level 5", "Kakamega");
                            var level52Latest = getPercByLevelByCounty(resultLatest, "Level 5", "Kilifi");
                            var level53Latest = getPercByLevelByCounty(resultLatest, "Level 5", "Meru");

                            var levelAllKakamegaLatest = getPercByLevelAll(resultLatestAll, "Kakamega");
                            var levelAllKilifiLatest = getPercByLevelAll(resultLatestAll, "Kilifi");
                            var levelAllMeruLatest = getPercByLevelAll(resultLatestAll, "Meru");

                            var Level41_51Latest = { y: 0, count: 0 };
                            Level41_51Latest.count = level41Latest.count + level51Latest.count;

                            if (level41Latest.y == 0 || level51Latest.y == 0) {
                                Level41_51Latest.y = (level41Latest.y + level51Latest.y) / 1;
                            } else {
                                Level41_51Latest.y = ((level41Latest.y * level41Latest.count) + (level51Latest.y * level51Latest.count)) / Level41_51Latest.count;
                            }

                            var Level42_52Latest = { y: 0, count: 0 };
                            Level42_52Latest.count = level42Latest.count + level52Latest.count;
                            if (level42Latest.y == 0 || level52Latest.y == 0) {
                                Level42_52Latest.y = (level42Latest.y + level52Latest.y) / 1;
                            } else {
                                Level42_52Latest.y = ((level42Latest.y * level42Latest.count) + (level52Latest.y * level52Latest.count)) / Level42_52Latest.count;
                            }

                            var Level43_53Latest = { y: 0, count: 0 };
                            Level43_53Latest.count = level43Latest.count + level53Latest.count;
                            if (level43Latest.y == 0 || level53Latest.y == 0) {
                                Level43_53Latest.y = (level43Latest.y + level53Latest.y) / 1;
                            } else {
                                Level43_53Latest.y = ((level43Latest.y * level43Latest.count) + (level53Latest.y * level53Latest.count)) / Level43_53Latest.count;
                            }
                            var total_facility_level2_latest = level21Latest.count + level22Latest.count + level23Latest.count;
                            var total_facility_level3_latest = level31Latest.count + level32Latest.count + level33Latest.count;
                            var total_facility_level4_latest = level41Latest.count + level42Latest.count + level43Latest.count;
                            var total_facility_level5_latest = level51Latest.count + level52Latest.count + level53Latest.count;
                            var total_facility_All_latest = levelAllKakamegaLatest.count + levelAllKilifiLatest.count + levelAllMeruLatest.count;
                            var total_facility_level4_5_latest = total_facility_level4_latest + total_facility_level5_latest;


                            var dataArrayLevel2 = dataArrayLevel3 = dataArrayLevel4 = dataArrayLevel5 = dataArrayAllLevel = { y: 0, count: 0 };
                            var dataArrayLevel2Latest = dataArrayLevel3Latest = dataArrayLevel4Latest = dataArrayLevel5Latest = dataArrayAllLevelLatest = { y: 0, count: 0 };

                            InspectionDataService.facilityLevelByMeanScores(hfType, "All", function(resultFirstByCounty, resultLatestByCounty) {
                                InspectionDataService.facilityLevelByMeanScores("1", "All", function(resultFirstAll, resultLatestAll) {

                                    for (var i = 0; i < resultFirstByCounty.length; i++) {
                                        if (resultFirstByCounty[i]._id.level == "Level 2") {
                                            dataArrayLevel2 = { y: resultFirstByCounty[i].ps, count: resultFirstByCounty[i].count };
                                        }
                                        if (resultFirstByCounty[i]._id.level == "Level 3") {
                                            dataArrayLevel3 = { y: resultFirstByCounty[i].ps, count: resultFirstByCounty[i].count };
                                        }
                                        if (resultFirstByCounty[i]._id.level == "Level 4") {
                                            dataArrayLevel4 = { y: resultFirstByCounty[i].ps, count: resultFirstByCounty[i].count };
                                        }
                                        if (resultFirstByCounty[i]._id.level == "Level 5") {
                                            dataArrayLevel5 = { y: resultFirstByCounty[i].ps, count: resultFirstByCounty[i].count };
                                        }
                                    }
                                    var dataArrayLevel4_5 = {};

                                    dataArrayLevel4_5.count = dataArrayLevel4.count + dataArrayLevel5.count;

                                    if (dataArrayLevel4.y == 0 || dataArrayLevel5.y == 0) {
                                        dataArrayLevel4_5.y = (dataArrayLevel4.y + dataArrayLevel5.y) / 1;
                                    } else {
                                        dataArrayLevel4_5.y = ((dataArrayLevel4.y * dataArrayLevel4.count) + (dataArrayLevel5.y * dataArrayLevel5.count)) / dataArrayLevel4_5.count;
                                    }
                                    if (resultFirstAll[0] != undefined) {
                                        dataArrayAllLevel = { y: resultFirstAll[0].ps, count: resultFirstAll[0].count };
                                    }

                                    for (var i = 0; i < resultLatestByCounty.length; i++) {
                                        if (resultLatestByCounty[i]._id.level == "Level 2") {
                                            dataArrayLevel2Latest = { y: resultLatestByCounty[i].ps, count: resultLatestByCounty[i].count };
                                        }
                                        if (resultLatestByCounty[i]._id.level == "Level 3") {
                                            dataArrayLevel3Latest = { y: resultLatestByCounty[i].ps, count: resultLatestByCounty[i].count };
                                        }
                                        if (resultLatestByCounty[i]._id.level == "Level 4") {
                                            dataArrayLevel4Latest = { y: resultLatestByCounty[i].ps, count: resultLatestByCounty[i].count };
                                        }
                                        if (resultLatestByCounty[i]._id.level == "Level 5") {
                                            dataArrayLevel5Latest = { y: resultLatestByCounty[i].ps, count: resultLatestByCounty[i].count };
                                        }
                                    }

                                    var dataArrayLevel4_5Latest = { y: 0, count: 0 };
                                    dataArrayLevel4_5Latest.count = dataArrayLevel4Latest.count + dataArrayLevel5Latest.count;

                                    if (dataArrayLevel4Latest.y == 0 || dataArrayLevel5Latest.y == 0) {
                                        dataArrayLevel4_5Latest.y = (dataArrayLevel4Latest.y + dataArrayLevel5Latest.y) / 1;
                                    } else {
                                        dataArrayLevel4_5Latest.y = ((dataArrayLevel4Latest.y * dataArrayLevel4Latest.count) + (dataArrayLevel5Latest.y * dataArrayLevel5Latest.count)) / dataArrayLevel4_5Latest.count;
                                    }

                                    if (resultLatestAll[0] != undefined) {
                                        dataArrayAllLevelLatest = { y: resultLatestAll[0].ps, count: resultLatestAll[0].count };
                                    }


                                    var level2Array = [{
                                            name: '1st Inspection (N=' + total_facility_level2 + ')',
                                            data: [level21, level22, level23, dataArrayLevel2],
                                            color: 'rgba(68, 114, 196,1)'
                                        },
                                        {
                                            name: 'Latest Inspection (N=' + total_facility_level2_latest + ')',
                                            data: [level21Latest, level22Latest, level23Latest, dataArrayLevel2Latest],
                                            color: 'rgba(237, 125, 49,1)'
                                        }
                                    ];

                                    var level3Array = [{
                                            name: '1st Inspection (N=' + total_facility_level3 + ')',
                                            data: [level31, level32, level33, dataArrayLevel3],
                                            color: 'rgba(68, 114, 196,1)'
                                        },
                                        {
                                            name: 'Latest Inspection (N=' + total_facility_level3_latest + ')',
                                            data: [level31Latest, level32Latest, level33Latest, dataArrayLevel3Latest],
                                            color: 'rgba(237, 125, 49,1)'
                                        }
                                    ];

                                    var level4_5Array = [{
                                            name: '1st Inspection (N=' + total_facility_level4_5 + ')',
                                            data: [Level41_51, Level42_52, Level43_53, dataArrayLevel4_5],
                                            color: 'rgba(68, 114, 196,1)'
                                        },
                                        {
                                            name: 'Latest Inspection (N=' + total_facility_level4_5_latest + ')',
                                            data: [Level41_51Latest, Level42_52Latest, Level43_53Latest, dataArrayLevel4_5Latest],
                                            color: 'rgba(237, 125, 49,1)'
                                        }
                                    ];

                                    var levelAllArray = [{
                                            name: '1st Inspection (N=' + total_facility_All + ')',
                                            data: [levelAllKakamega, levelAllKilifi, levelAllMeru, dataArrayAllLevel],
                                            color: 'rgba(68, 114, 196,1)'
                                        },
                                        {
                                            name: 'Latest Inspection (N=' + total_facility_All_latest + ')',
                                            data: [levelAllKakamegaLatest, levelAllKilifiLatest, levelAllMeruLatest, dataArrayAllLevelLatest],
                                            color: 'rgba(237, 125, 49,1)'
                                        }
                                    ];

                                    var seriesArray = [];
                                    seriesArray.push(level2Array);
                                    seriesArray.push(level3Array);
                                    seriesArray.push(level4_5Array);
                                    seriesArray.push(levelAllArray);

                                    sendResponse(xAxisArray, seriesArray);
                                });
                            });
                        });
                    });

                } else {
                    InspectionDataService.facilityLevelByMeanScores(hfType, county, function(resultFirst, resultLatest) {

                        MeanScoreByLevel(hfType, county, resultFirst, resultLatest, function(seriesArrayByLevel) {
                            var countyName = CountyService.getCounty(county);
                            var xAxisArray = [countyName];
                            console.log("seriesArrayByLevel------test");
                            console.log(seriesArrayByLevel);
                            sendResponse(xAxisArray, seriesArrayByLevel)
                        });
                    });
                }
            } else {
                if (county == "All") {

                    InspectionDataService.facilityLevelByMeanScores(hfType, county, function(resultFirst, resultLatest) {

                        MeanScoreByOwnership(hfType, county, resultFirst, resultLatest, function(seriesArrayByLevel) {
                            var xAxisArray = ['All Counties'];
                            console.log("seriesArrayByLevelMeanscore");
                            console.log(seriesArrayByLevel);
                            sendResponse(xAxisArray, seriesArrayByLevel)
                        });
                    });
                } else if (county == "By County") {
                    xAxisArray = CountyService.getAll();
                    xAxisArray.push("All");
                    InspectionDataService.facilityLevelByMeanScores(hfType, county, function(resultFirst, resultLatest) {
                        InspectionDataService.facilityLevelByMeanScores("1", county, function(resultFirstAll, resultLatestAll) {

                            function getPercByOwnershipByCounty(data, ownership, county) {
                                for (i in data) {
                                    if (ownership == data[i]._id.ownership &&
                                        county == data[i]._id.county) {
                                        var tmp = { y: data[i].ps, count: data[i].count };
                                        return tmp;
                                    }
                                }
                                return { y: 0, count: 0 };
                            };

                            function getPercByOwnershipAll(data, county) {
                                for (i in data) {
                                    if (county == data[i]._id) {
                                        var tmp = { y: data[i].ps, count: data[i].count };
                                        return tmp;
                                    }
                                }
                                return { y: 0, count: 0 };
                            };


                            var public1 = getPercByOwnershipByCounty(resultFirst, "Public", "Kakamega");
                            var public2 = getPercByOwnershipByCounty(resultFirst, "Public", "Kilifi");
                            var public3 = getPercByOwnershipByCounty(resultFirst, "Public", "Meru");

                            var private1 = getPercByOwnershipByCounty(resultFirst, "Private", "Kakamega");
                            var private2 = getPercByOwnershipByCounty(resultFirst, "Private", "Kilifi");
                            var private3 = getPercByOwnershipByCounty(resultFirst, "Private", "Meru");

                            var All1 = getPercByOwnershipAll(resultFirstAll, "Kakamega");
                            var All2 = getPercByOwnershipAll(resultFirstAll, "Kilifi");
                            var All3 = getPercByOwnershipAll(resultFirstAll, "Meru");

                            var total_facility_public = public1.count + public2.count + public3.count;
                            var total_facility_private = private1.count + private2.count + private3.count;
                            var total_facility_all = All1.count + All2.count + All3.count;




                            var public1latest = getPercByOwnershipByCounty(resultLatest, "Public", "Kakamega");
                            var public2latest = getPercByOwnershipByCounty(resultLatest, "Public", "Kilifi");
                            var public3latest = getPercByOwnershipByCounty(resultLatest, "Public", "Meru");

                            var private1latest = getPercByOwnershipByCounty(resultLatest, "Private", "Kakamega");
                            var private2latest = getPercByOwnershipByCounty(resultLatest, "Private", "Kilifi");
                            var private3latest = getPercByOwnershipByCounty(resultLatest, "Private", "Meru");

                            var All1latest = getPercByOwnershipAll(resultLatestAll, "Kakamega");
                            var All2latest = getPercByOwnershipAll(resultLatestAll, "Kilifi");
                            var All3latest = getPercByOwnershipAll(resultLatestAll, "Meru");

                            var total_facility_public_latest = public1latest.count + public2latest.count + public3latest.count;
                            var total_facility_private_latest = private1latest.count + private2latest.count + private3latest.count;
                            var total_facility_all_latest = All1latest.count + All2latest.count + All3latest.count;

                            InspectionDataService.facilityLevelByMeanScores(hfType, "All", function(resultFirstByCounty, resultLatestByCounty) {
                                InspectionDataService.facilityLevelByMeanScores("1", "All", function(resultFirstAll, resultLatestAll) {

                                    var dataArrayPublic = dataArrayPrivate = dataArrayAllOwnership = { y: 0, count: 0 };
                                    var dataArrayPublicLatest = dataArrayPrivateLatest = dataArrayAllOwnershipLatest = { y: 0, count: 0 };

                                    for (var i = 0; i < resultFirstByCounty.length; i++) {
                                        if (resultFirstByCounty[i]._id.ownership == "Public") {
                                            dataArrayPublic = { y: resultFirstByCounty[i].ps, count: resultFirstByCounty[i].count };
                                        }
                                        if (resultFirstByCounty[i]._id.ownership == "Private") {
                                            dataArrayPrivate = { y: resultFirstByCounty[i].ps, count: resultFirstByCounty[i].count };
                                        }
                                    }

                                    if (resultFirstAll[0] != undefined) {
                                        dataArrayAllOwnership = { y: resultFirstAll[0].ps, count: resultFirstAll[0].count };
                                    }


                                    for (var i = 0; i < resultLatestByCounty.length; i++) {
                                        if (resultLatestByCounty[i]._id.ownership == "Public") {
                                            dataArrayPublicLatest = { y: resultLatestByCounty[i].ps, count: resultLatestByCounty[i].count };
                                        }
                                        if (resultLatestByCounty[i]._id.ownership == "Private") {
                                            dataArrayPrivateLatest = { y: resultLatestByCounty[i].ps, count: resultLatestByCounty[i].count };
                                        }
                                    }

                                    if (resultLatestAll[0] != undefined) {
                                        dataArrayAllOwnershipLatest = { y: resultLatestAll[0].ps, count: resultLatestAll[0].count };
                                    }


                                    var publicArray = [{
                                            name: '1st Inspection (N=' + total_facility_public + ')',
                                            data: [public1, public2, public3, dataArrayPublic],
                                            color: 'rgba(68, 114, 196,1)'
                                        },
                                        {
                                            name: 'Latest Inspection (N=' + total_facility_public_latest + ')',
                                            data: [public1latest, public2latest, public3latest, dataArrayPublicLatest],
                                            color: 'rgba(237, 125, 49,1)'
                                        }
                                    ];

                                    var privateArray = [{
                                            name: '1st Inspection (N=' + total_facility_private + ')',
                                            data: [private1, private2, private3, dataArrayPrivate],
                                            color: 'rgba(68, 114, 196,1)'
                                        },
                                        {
                                            name: 'Latest Inspection (N=' + total_facility_private_latest + ')',
                                            data: [private1latest, private2latest, private3latest, dataArrayPrivateLatest],
                                            color: 'rgba(237, 125, 49,1)'
                                        }
                                    ];

                                    var ownershipAllArray = [{
                                            name: '1st Inspection (N=' + total_facility_all + ')',
                                            data: [All1, All2, All3, dataArrayAllOwnership],
                                            color: 'rgba(68, 114, 196,1)'
                                        },
                                        {
                                            name: 'Latest Inspection (N=' + total_facility_all_latest + ')',
                                            data: [All1latest,
                                                All2latest, All3latest, dataArrayAllOwnershipLatest
                                            ],
                                            color: 'rgba(237, 125, 49,1)'
                                        }
                                    ];

                                    var seriesArray = [];
                                    seriesArray.push(publicArray);
                                    seriesArray.push(privateArray);
                                    seriesArray.push(ownershipAllArray);

                                    sendResponse(xAxisArray, seriesArray);
                                });
                            });
                        });
                    });

                } else {
                    InspectionDataService.facilityLevelByMeanScores(hfType, county, function(resultFirst, resultLatest) {

                        MeanScoreByOwnership(hfType, county, resultFirst, resultLatest, function(seriesArrayByLevel) {
                            var countyName = CountyService.getCounty(county);
                            var xAxisArray = [countyName];
                            console.log("seriesArrayByLevel------test");
                            console.log(seriesArrayByLevel);
                            sendResponse(xAxisArray, seriesArrayByLevel)
                        });
                    });
                }
            }
        }

        function facilityLevelByCounty(hfType, county, resultFirst, resultLatest, callback) {
            var countyName = CountyService.getCounty(county);
            var total_facility_all = 0;
            val0 = { y: 0, count: 0 };
            val1 = { y: 0, count: 0 };
            val2 = { y: 0, count: 0 };
            val3 = { y: 0, count: 0 };
            val4 = { y: 0, count: 0 };

            for (var i = 0; i < resultFirst.length; i++) {

                if (resultFirst[i]._id.county == countyName) {

                    total_facility_all += resultFirst[i].count;

                    if (resultFirst[i]._id.risk == 'Non-Compliant') {
                        val0.count = resultFirst[i].count;
                    } else if (resultFirst[i]._id.risk == 'Minimally Compliant') {
                        val1.count = resultFirst[i].count;
                    } else if (resultFirst[i]._id.risk == 'Partially Compliant') {
                        val2.count = resultFirst[i].count;
                    } else if (resultFirst[i]._id.risk == 'Substantially Compliant') {
                        val3.count = resultFirst[i].count;
                    } else if (resultFirst[i]._id.risk == 'Fully Compliant') {
                        val4.count = resultFirst[i].count;
                    }
                }
            }

            if (total_facility_all != 0) {
                val0.y = (100 * val0.count) / total_facility_all;
                val1.y = (100 * val1.count) / total_facility_all;
                val2.y = (100 * val2.count) / total_facility_all;
                val3.y = (100 * val3.count) / total_facility_all;
                val4.y = (100 * val4.count) / total_facility_all;
            }

            var dataArrayFirst = [val0, val1, val2, val3, val4];
            var total_facility_latest = 0;
            var val0 = { y: 0, count: 0 };
            var val1 = { y: 0, count: 0 };
            var val2 = { y: 0, count: 0 };
            var val3 = { y: 0, count: 0 };
            var val4 = { y: 0, count: 0 };

            for (var i = 0; i < resultLatest.length; i++) {

                if (resultLatest[i]._id.county == countyName) {

                    total_facility_latest += resultLatest[i].count;

                    if (resultLatest[i]._id.risk == 'Non-Compliant') {
                        val0.count = resultLatest[i].count;
                    } else if (resultLatest[i]._id.risk == 'Minimally Compliant') {
                        val1.count = resultLatest[i].count;
                    } else if (resultLatest[i]._id.risk == 'Partially Compliant') {
                        val2.count = resultLatest[i].count;
                    } else if (resultLatest[i]._id.risk == 'Substantially Compliant') {
                        val3.count = resultLatest[i].count;
                    } else if (resultLatest[i]._id.risk == 'Fully Compliant') {
                        val4.count = resultLatest[i].count;
                    }
                }
            }

            if (total_facility_latest != 0) {
                val0.y = (100 * val0.count) / total_facility_latest;
                val1.y = (100 * val1.count) / total_facility_latest;
                val2.y = (100 * val2.count) / total_facility_latest;
                val3.y = (100 * val3.count) / total_facility_latest;
                val4.y = (100 * val4.count) / total_facility_latest;
            }
            var dataArrayLatest = [val0, val1, val2, val3, val4];
            seriesArray = [{ name: '1st Inspection (N=' + total_facility_all + ')', data: dataArrayFirst, color: 'rgba(68, 114, 196,1)' },
                { name: 'Latest Inspection (N=' + total_facility_latest + ')', data: dataArrayLatest, color: 'rgba(237, 125, 49,1)' }
            ];
            callback(seriesArray);
        }

        function facilityLevelByLevel(hfType, county, firstInsp, latestInsp, callback) {
            var countyName = CountyService.getCounty(county);
            var levels = ["Level 2", "Level 3", "Level 4 & 5", "All"]
            var resultFirst = [];
            var resultLatest = [];

            if (countyName != "All") {
                for (var i = 0; i < firstInsp.length; i++) {
                    if (firstInsp[i]._id.county == countyName) {
                        resultFirst.push(firstInsp[i]);
                    }
                }
                for (var i = 0; i < latestInsp.length; i++) {
                    if (latestInsp[i]._id.county == countyName) {
                        resultLatest.push(latestInsp[i]);
                    }
                }
            } else {
                resultFirst = firstInsp;
                resultLatest = latestInsp;
            }



            var seriesArrayByLevel = [];
            for (var j = 0; j < levels.length; j++) {

                if (levels[j] == "All") {
                    var total_facility_all = 0;
                    var val0 = { y: 0, count: 0 };
                    var val1 = { y: 0, count: 0 };
                    var val2 = { y: 0, count: 0 };
                    var val3 = { y: 0, count: 0 };
                    var val4 = { y: 0, count: 0 };

                    for (var i = 0; i < resultFirst.length; i++) {

                        total_facility_all += resultFirst[i].count;

                        if (resultFirst[i]._id.risk == 'Non-Compliant') {
                            val0.count += resultFirst[i].count;
                        } else if (resultFirst[i]._id.risk == 'Minimally Compliant') {
                            val1.count += resultFirst[i].count;
                        } else if (resultFirst[i]._id.risk == 'Partially Compliant') {
                            val2.count += resultFirst[i].count;
                        } else if (resultFirst[i]._id.risk == 'Substantially Compliant') {
                            val3.count += resultFirst[i].count;
                        } else if (resultFirst[i]._id.risk == 'Fully Compliant') {
                            val4.count += resultFirst[i].count;
                        }
                    }
                    if (total_facility_all != 0) {
                        val0.y = (100 * val0.count) / total_facility_all;
                        val1.y = (100 * val1.count) / total_facility_all;
                        val2.y = (100 * val2.count) / total_facility_all;
                        val3.y = (100 * val3.count) / total_facility_all;
                        val4.y = (100 * val4.count) / total_facility_all;
                    }

                    var dataArrayFirst = [val0, val1, val2, val3, val4];
                    var total_facility_latest = 0;
                    val0 = { y: 0, count: 0 };
                    val1 = { y: 0, count: 0 };
                    val2 = { y: 0, count: 0 };
                    val3 = { y: 0, count: 0 };
                    val4 = { y: 0, count: 0 };

                    for (var i = 0; i < resultLatest.length; i++) {

                        total_facility_latest += resultLatest[i].count;

                        if (resultLatest[i]._id.risk == 'Non-Compliant') {
                            val0.count += resultLatest[i].count;
                        } else if (resultLatest[i]._id.risk == 'Minimally Compliant') {
                            val1.count += resultLatest[i].count;
                        } else if (resultLatest[i]._id.risk == 'Partially Compliant') {
                            val2.count += resultLatest[i].count;
                        } else if (resultLatest[i]._id.risk == 'Substantially Compliant') {
                            val3.count += resultLatest[i].count;
                        } else if (resultLatest[i]._id.risk == 'Fully Compliant') {
                            val4.count += resultLatest[i].count;
                        }
                    }

                    if (total_facility_latest != 0) {
                        val0.y = (100 * val0.count) / total_facility_latest;
                        val1.y = (100 * val1.count) / total_facility_latest;
                        val2.y = (100 * val2.count) / total_facility_latest;
                        val3.y = (100 * val3.count) / total_facility_latest;
                        val4.y = (100 * val4.count) / total_facility_latest;
                    }


                    var dataArrayLatest = [val0, val1, val2, val3, val4];
                    var seriesArrayAll = [{ name: '1st Inspection (N=' + total_facility_all + ')', data: dataArrayFirst, color: 'rgba(68, 114, 196,1)' },
                        { name: 'Latest Inspection (N=' + total_facility_latest + ')', data: dataArrayLatest, color: 'rgba(237, 125, 49,1)' }
                    ];

                    seriesArrayByLevel.push(seriesArrayAll);

                } else {
                    var total_facility_all = 0;
                    var val0 = { y: 0, count: 0 };
                    var val1 = { y: 0, count: 0 };
                    var val2 = { y: 0, count: 0 };
                    var val3 = { y: 0, count: 0 };
                    var val4 = { y: 0, count: 0 };

                    for (var i = 0; i < resultFirst.length; i++) {
                        if (levels[j] == "Level 2" || levels[j] == "Level 3") {
                            if (resultFirst[i]._id.level == levels[j]) {
                                total_facility_all += resultFirst[i].count;

                                if (resultFirst[i]._id.risk == 'Non-Compliant') {
                                    val0.count += resultFirst[i].count;
                                } else if (resultFirst[i]._id.risk == 'Minimally Compliant') {
                                    val1.count += resultFirst[i].count;
                                } else if (resultFirst[i]._id.risk == 'Partially Compliant') {
                                    val2.count += resultFirst[i].count;
                                } else if (resultFirst[i]._id.risk == 'Substantially Compliant') {
                                    val3.count += resultFirst[i].count;
                                } else if (resultFirst[i]._id.risk == 'Fully Compliant') {
                                    val4.count += resultFirst[i].count;
                                }
                            }
                        } else {
                            //for level 4 and level 5 
                            //purpose of this code to merger level 4 and 5 data
                            if (resultFirst[i]._id.level == "Level 4" || resultFirst[i]._id.level == "Level 5") {
                                total_facility_all += resultFirst[i].count;
                                if (resultFirst[i]._id.risk == 'Non-Compliant') {
                                    val0.count += resultFirst[i].count;
                                } else if (resultFirst[i]._id.risk == 'Minimally Compliant') {
                                    val1.count += resultFirst[i].count;
                                } else if (resultFirst[i]._id.risk == 'Partially Compliant') {
                                    val2.count += resultFirst[i].count;
                                } else if (resultFirst[i]._id.risk == 'Substantially Compliant') {
                                    val3.count += resultFirst[i].count;
                                } else if (resultFirst[i]._id.risk == 'Fully Compliant') {
                                    val4.count += resultFirst[i].count;
                                }
                            }
                        }
                    }
                    if (total_facility_all != 0) {
                        val0.y = (100 * val0.count) / total_facility_all;
                        val1.y = (100 * val1.count) / total_facility_all;
                        val2.y = (100 * val2.count) / total_facility_all;
                        val3.y = (100 * val3.count) / total_facility_all;
                        val4.y = (100 * val4.count) / total_facility_all;
                    }

                    var dataArrayFirst = [val0, val1, val2, val3, val4];
                    var total_facility_latest = 0;
                    val0 = { y: 0, count: 0 };
                    val1 = { y: 0, count: 0 };
                    val2 = { y: 0, count: 0 };
                    val3 = { y: 0, count: 0 };
                    val4 = { y: 0, count: 0 };


                    for (var i = 0; i < resultLatest.length; i++) {

                        if (levels[j] == "Level 2" || levels[j] == "Level 3") {

                            if (resultLatest[i]._id.level == levels[j]) {

                                total_facility_latest += resultLatest[i].count;

                                if (resultLatest[i]._id.risk == 'Non-Compliant') {
                                    val0.count += resultLatest[i].count;
                                } else if (resultLatest[i]._id.risk == 'Minimally Compliant') {
                                    val1.count += resultLatest[i].count;
                                } else if (resultLatest[i]._id.risk == 'Partially Compliant') {
                                    val2.count += resultLatest[i].count;
                                } else if (resultLatest[i]._id.risk == 'Substantially Compliant') {
                                    val3.count += resultLatest[i].count;
                                } else if (resultLatest[i]._id.risk == 'Fully Compliant') {
                                    val4.count += resultLatest[i].count;
                                }
                            }
                        } else {
                            //for level 4 and level 5 
                            //purpose of this code to merger level 4 and 5 data
                            if (resultLatest[i]._id.level == "Level 4" || resultLatest[i]._id.level == "Level 5") {
                                total_facility_latest += resultLatest[i].count;
                                if (resultLatest[i]._id.risk == 'Non-Compliant') {
                                    val0.count += resultLatest[i].count;
                                } else if (resultLatest[i]._id.risk == 'Minimally Compliant') {
                                    val1.count += resultLatest[i].count;
                                } else if (resultLatest[i]._id.risk == 'Partially Compliant') {
                                    val2.count += resultLatest[i].count;
                                } else if (resultLatest[i]._id.risk == 'Substantially Compliant') {
                                    val3.count += resultLatest[i].count;
                                } else if (resultLatest[i]._id.risk == 'Fully Compliant') {
                                    val4.count += resultLatest[i].count;
                                }
                            }
                        }
                    }

                    if (total_facility_latest != 0) {
                        val0.y = (100 * val0.count) / total_facility_latest;
                        val1.y = (100 * val1.count) / total_facility_latest;
                        val2.y = (100 * val2.count) / total_facility_latest;
                        val3.y = (100 * val3.count) / total_facility_latest;
                        val4.y = (100 * val4.count) / total_facility_latest;
                    }
                    var dataArrayLatest = [val0, val1, val2, val3, val4];
                    var seriesArrayLevel = [{ name: '1st Inspection (N=' + total_facility_all + ')', data: dataArrayFirst, color: 'rgba(68, 114, 196,1)' }, { name: 'Latest Inspection (N=' + total_facility_latest + ')', data: dataArrayLatest, color: 'rgba(237, 125, 49,1)' }];

                    seriesArrayByLevel.push(seriesArrayLevel);
                }
                if (j == levels.length - 1) {
                    callback(seriesArrayByLevel);
                }
            }
        }

        function facilityLevelByOwnership(hfType, county, firstInsp, latestInsp, callback) {
            var countyName = CountyService.getCounty(county);
            var ownership = ["Public", "Private", "All"]
            var resultFirst = [];
            var resultLatest = [];

            if (countyName != "All") {
                for (var i = 0; i < firstInsp.length; i++) {
                    if (firstInsp[i]._id.county == countyName) {
                        resultFirst.push(firstInsp[i]);
                    }
                }
                for (var i = 0; i < latestInsp.length; i++) {
                    if (latestInsp[i]._id.county == countyName) {
                        resultLatest.push(latestInsp[i]);
                    }
                }
            } else {
                console.log("countyName else");
                resultFirst = firstInsp;
                resultLatest = latestInsp;
            }

            var seriesArrayByOwnership = [];
            for (var j = 0; j < ownership.length; j++) {

                if (ownership[j] == "All") {
                    var total_facility_all = 0;
                    var val0 = { y: 0, count: 0 };
                    var val1 = { y: 0, count: 0 };
                    var val2 = { y: 0, count: 0 };
                    var val3 = { y: 0, count: 0 };
                    var val4 = { y: 0, count: 0 };

                    for (var i = 0; i < resultFirst.length; i++) {

                        total_facility_all += resultFirst[i].count;

                        if (resultFirst[i]._id.risk == 'Non-Compliant') {
                            val0.count += resultFirst[i].count;
                        } else if (resultFirst[i]._id.risk == 'Minimally Compliant') {
                            val1.count += resultFirst[i].count;
                        } else if (resultFirst[i]._id.risk == 'Partially Compliant') {
                            val2.count += resultFirst[i].count;
                        } else if (resultFirst[i]._id.risk == 'Substantially Compliant') {
                            val3.count += resultFirst[i].count;
                        } else if (resultFirst[i]._id.risk == 'Fully Compliant') {
                            val4.count += resultFirst[i].count;
                        }
                    }
                    if (total_facility_all != 0) {
                        val0.y = (100 * val0.count) / total_facility_all;
                        val1.y = (100 * val1.count) / total_facility_all;
                        val2.y = (100 * val2.count) / total_facility_all;
                        val3.y = (100 * val3.count) / total_facility_all;
                        val4.y = (100 * val4.count) / total_facility_all;
                    }

                    var dataArrayFirst = [val0, val1, val2, val3, val4];
                    var total_facility_latest = 0;
                    val0 = { y: 0, count: 0 };
                    val1 = { y: 0, count: 0 };
                    val2 = { y: 0, count: 0 };
                    val3 = { y: 0, count: 0 };
                    val4 = { y: 0, count: 0 };

                    for (var i = 0; i < resultLatest.length; i++) {

                        total_facility_latest += resultLatest[i].count;
                        if (resultLatest[i]._id.risk == 'Non-Compliant') {
                            val0.count += resultLatest[i].count;
                        } else if (resultLatest[i]._id.risk == 'Minimally Compliant') {
                            val1.count += resultLatest[i].count;
                        } else if (resultLatest[i]._id.risk == 'Partially Compliant') {
                            val2.count += resultLatest[i].count;
                        } else if (resultLatest[i]._id.risk == 'Substantially Compliant') {
                            val3.count += resultLatest[i].count;
                        } else if (resultLatest[i]._id.risk == 'Fully Compliant') {
                            val4.count += resultLatest[i].count;
                        }
                    }

                    if (total_facility_latest != 0) {
                        val0.y = (100 * val0.count) / total_facility_latest;
                        val1.y = (100 * val1.count) / total_facility_latest;
                        val2.y = (100 * val2.count) / total_facility_latest;
                        val3.y = (100 * val3.count) / total_facility_latest;
                        val4.y = (100 * val4.count) / total_facility_latest;
                    }


                    var dataArrayLatest = [val0, val1, val2, val3, val4];

                    var seriesArrayAll = [{ name: '1st Inspection (N=' + total_facility_all + ')', data: dataArrayFirst, color: 'rgba(68, 114, 196,1)' },
                        { name: 'Latest Inspection (N=' + total_facility_latest + ')', data: dataArrayLatest, color: 'rgba(237, 125, 49,1)' }
                    ];


                    seriesArrayByOwnership.push(seriesArrayAll);
                } else {
                    var total_facility_all = 0;
                    var val0 = { y: 0, count: 0 };
                    var val1 = { y: 0, count: 0 };
                    var val2 = { y: 0, count: 0 };
                    var val3 = { y: 0, count: 0 };
                    var val4 = { y: 0, count: 0 };

                    for (var i = 0; i < resultFirst.length; i++) {

                        if (resultFirst[i]._id.ownership == ownership[j]) {
                            total_facility_all += resultFirst[i].count;

                            if (resultFirst[i]._id.risk == 'Non-Compliant') {
                                val0.count += resultFirst[i].count;
                            } else if (resultFirst[i]._id.risk == 'Minimally Compliant') {
                                val1.count += resultFirst[i].count;
                            } else if (resultFirst[i]._id.risk == 'Partially Compliant') {
                                val2.count += resultFirst[i].count;
                            } else if (resultFirst[i]._id.risk == 'Substantially Compliant') {
                                val3.count += resultFirst[i].count;
                            } else if (resultFirst[i]._id.risk == 'Fully Compliant') {
                                val4.count += resultFirst[i].count;
                            }
                        }
                    }

                    if (total_facility_all != 0) {
                        val0.y = (100 * val0.count) / total_facility_all;
                        val1.y = (100 * val1.count) / total_facility_all;
                        val2.y = (100 * val2.count) / total_facility_all;
                        val3.y = (100 * val3.count) / total_facility_all;
                        val4.y = (100 * val4.count) / total_facility_all;
                    }

                    var dataArrayFirst = [val0, val1, val2, val3, val4];
                    var total_facility_latest = 0;
                    val0 = { y: 0, count: 0 };
                    val1 = { y: 0, count: 0 };
                    val2 = { y: 0, count: 0 };
                    val3 = { y: 0, count: 0 };
                    val4 = { y: 0, count: 0 };

                    for (var i = 0; i < resultLatest.length; i++) {
                        if (resultLatest[i]._id.ownership == ownership[j]) {
                            total_facility_latest += resultLatest[i].count;

                            if (resultLatest[i]._id.risk == 'Non-Compliant') {
                                val0.count += resultLatest[i].count;
                            } else if (resultLatest[i]._id.risk == 'Minimally Compliant') {
                                val1.count += resultLatest[i].count;
                            } else if (resultLatest[i]._id.risk == 'Partially Compliant') {
                                val2.count += resultLatest[i].count;
                            } else if (resultLatest[i]._id.risk == 'Substantially Compliant') {
                                val3.count += resultLatest[i].count;
                            } else if (resultLatest[i]._id.risk == 'Fully Compliant') {
                                val4.count += resultLatest[i].count;
                            }
                        }
                    }

                    if (total_facility_latest != 0) {
                        val0.y = (100 * val0.count) / total_facility_latest;
                        val1.y = (100 * val1.count) / total_facility_latest;
                        val2.y = (100 * val2.count) / total_facility_latest;
                        val3.y = (100 * val3.count) / total_facility_latest;
                        val4.y = (100 * val4.count) / total_facility_latest;
                    }

                    var dataArrayLatest = [val0, val1, val2, val3, val4];
                    var seriesArrayOwnership = [{ name: '1st Inspection (N=' + total_facility_all + ')', data: dataArrayFirst, color: 'rgba(68, 114, 196,1)' },
                        { name: 'Latest Inspection (N=' + total_facility_latest + ')', data: dataArrayLatest, color: 'rgba(237, 125, 49,1)' }
                    ];

                    seriesArrayByOwnership.push(seriesArrayOwnership);
                }
                if (j == ownership.length - 1) {
                    callback(seriesArrayByOwnership);
                }
            }
        }


        function MeanScoreByLevel(hfType, county, firstInsp, latestInsp, callback) {
            var countyName = CountyService.getCounty(county);
            var resultFirst = [];
            var resultLatest = [];
            console.log("county Name----" + countyName);
            if (countyName != "All") {
                for (var i = 0; i < firstInsp.length; i++) {
                    if (firstInsp[i]._id.county == countyName) {
                        resultFirst.push(firstInsp[i]);
                    }
                }
                for (var i = 0; i < latestInsp.length; i++) {
                    if (latestInsp[i]._id.county == countyName) {
                        resultLatest.push(latestInsp[i]);
                    }
                }
            } else {
                resultFirst = firstInsp;
                resultLatest = latestInsp;
            }

            var dataArrayLevel2_first = { y: 0, count: 0 };
            var dataArrayLevel3_first = { y: 0, count: 0 };
            var dataArrayLevel4_first = { y: 0, count: 0 };
            var dataArrayLevel5_first = { y: 0, count: 0 };
            var dataArrayLevel4_5_first = { y: 0, count: 0 };

            for (var i = 0; i < resultFirst.length; i++) {
                if (resultFirst[i]._id.level == "Level 2") {
                    dataArrayLevel2_first = { y: resultFirst[i].ps, count: resultFirst[i].count };
                }
                if (resultFirst[i]._id.level == "Level 3") {
                    dataArrayLevel3_first = { y: resultFirst[i].ps, count: resultFirst[i].count };
                }
                if (resultFirst[i]._id.level == "Level 4") {
                    dataArrayLevel4_first = { y: resultFirst[i].ps, count: resultFirst[i].count };
                }
                if (resultFirst[i]._id.level == "Level 5") {
                    dataArrayLevel5_first = { y: resultFirst[i].ps, count: resultFirst[i].count };
                }
            }
            /*if(resultAll[0]!=undefined){
              dataArrayAllLevel={y:resultAll[0].ps,count:resultAll[0].count};
            }*/


            dataArrayLevel4_5_first.count = dataArrayLevel4_first.count + dataArrayLevel5_first.count;
            if (dataArrayLevel4_first.y == 0 || dataArrayLevel5_first.y == 0) {
                dataArrayLevel4_5_first.y = (dataArrayLevel4_first.y + dataArrayLevel5_first.y) / 1;
            } else {
                dataArrayLevel4_5_first.y = ((dataArrayLevel4_first.y * dataArrayLevel4_first.count) + (dataArrayLevel5_first.y * dataArrayLevel5_first.count)) / dataArrayLevel4_5_first.count;
            }


            var dataArrayLevel2_latest = { y: 0, count: 0 };
            var dataArrayLevel3_latest = { y: 0, count: 0 };
            var dataArrayLevel4_latest = { y: 0, count: 0 };
            var dataArrayLevel5_latest = { y: 0, count: 0 };
            var dataArrayLevel4_5_latest = { y: 0, count: 0 };

            for (var i = 0; i < resultLatest.length; i++) {
                if (resultLatest[i]._id.level == "Level 2") {
                    dataArrayLevel2_latest = { y: resultLatest[i].ps, count: resultLatest[i].count };
                }
                if (resultLatest[i]._id.level == "Level 3") {
                    dataArrayLevel3_latest = { y: resultLatest[i].ps, count: resultLatest[i].count };
                }
                if (resultLatest[i]._id.level == "Level 4") {
                    dataArrayLevel4_latest = { y: resultLatest[i].ps, count: resultLatest[i].count };
                }
                if (resultLatest[i]._id.level == "Level 5") {
                    dataArrayLevel5_latest = { y: resultLatest[i].ps, count: resultLatest[i].count };
                }
            }
            /*if(resultAll[0]!=undefined){
              dataArrayAllLevel={y:resultAll[0].ps,count:resultAll[0].count};
            }*/


            dataArrayLevel4_5_latest.count = dataArrayLevel4_latest.count + dataArrayLevel5_latest.count;
            if (dataArrayLevel4_latest.y == 0 || dataArrayLevel5_latest.y == 0) {
                dataArrayLevel4_5_latest.y = (dataArrayLevel4_latest.y + dataArrayLevel5_latest.y) / 1;
            } else {
                dataArrayLevel4_5_latest.y = ((dataArrayLevel4_latest.y * dataArrayLevel4_latest.count) + (dataArrayLevel5_latest.y * dataArrayLevel5_latest.count)) / dataArrayLevel4_5_latest.count;
            }

            var dataArrayLevelAll_first = { y: 0, count: 0 };
            dataArrayLevelAll_first.count = dataArrayLevel2_first.count + dataArrayLevel3_first.count + dataArrayLevel4_5_first.count;
            if (dataArrayLevelAll_first.count != 0) {
                dataArrayLevelAll_first.y = ((dataArrayLevel2_first.y * dataArrayLevel2_first.count) + (dataArrayLevel3_first.y * dataArrayLevel3_first.count) + (dataArrayLevel4_5_first.y * dataArrayLevel4_5_first.count)) / dataArrayLevelAll_first.count;
            }

            var dataArrayLevelAll_latest = { y: 0, count: 0 };
            dataArrayLevelAll_latest.count = dataArrayLevel2_latest.count + dataArrayLevel3_latest.count + dataArrayLevel4_5_latest.count;
            if (dataArrayLevelAll_latest.count != 0) {
                dataArrayLevelAll_latest.y = ((dataArrayLevel2_latest.y * dataArrayLevel2_latest.count) + (dataArrayLevel3_latest.y * dataArrayLevel3_latest.count) + (dataArrayLevel4_5_latest.y * dataArrayLevel4_5_latest.count)) / dataArrayLevelAll_latest.count;
            }

            seriesArrayByLevel = [];

            seriesArrayByLevel.push([{ name: '1st Inspection (N=' + dataArrayLevel2_first.count + ')', data: [dataArrayLevel2_first], color: 'rgba(68, 114, 196,1)' },
                { name: 'Latest Inspection (N=' + dataArrayLevel2_latest.count + ')', data: [dataArrayLevel2_latest], color: 'rgba(237, 125, 49,1)' }
            ]);
            seriesArrayByLevel.push([{ name: '1st Inspection (N=' + dataArrayLevel3_first.count + ')', data: [dataArrayLevel3_first], color: 'rgba(68, 114, 196,1)' },
                { name: 'Latest Inspection (N=' + dataArrayLevel3_latest.count + ')', data: [dataArrayLevel3_latest], color: 'rgba(237, 125, 49,1)' }
            ]);
            seriesArrayByLevel.push([{ name: '1st Inspection (N=' + dataArrayLevel4_5_first.count + ')', data: [dataArrayLevel4_5_first], color: 'rgba(68, 114, 196,1)' },
                { name: 'Latest Inspection (N=' + dataArrayLevel4_5_latest.count + ')', data: [dataArrayLevel4_5_latest], color: 'rgba(237, 125, 49,1)' }
            ]);
            seriesArrayByLevel.push([{ name: '1st Inspection (N=' + dataArrayLevelAll_first.count + ')', data: [dataArrayLevelAll_first], color: 'rgba(68, 114, 196,1)' },
                { name: 'Latest Inspection (N=' + dataArrayLevelAll_latest.count + ')', data: [dataArrayLevelAll_latest], color: 'rgba(237, 125, 49,1)' }
            ]);


            callback(seriesArrayByLevel);

        }

        function MeanScoreByOwnership(hfType, county, firstInsp, latestInsp, callback) {
            var countyName = CountyService.getCounty(county);
            var resultFirst = [];
            var resultLatest = [];
            console.log("county Name----" + countyName);
            if (countyName != "All") {
                for (var i = 0; i < firstInsp.length; i++) {
                    if (firstInsp[i]._id.county == countyName) {
                        resultFirst.push(firstInsp[i]);
                    }
                }
                for (var i = 0; i < latestInsp.length; i++) {
                    if (latestInsp[i]._id.county == countyName) {
                        resultLatest.push(latestInsp[i]);
                    }
                }
            } else {
                resultFirst = firstInsp;
                resultLatest = latestInsp;
            }

            var dataArrayPublic_first = { y: 0, count: 0 };
            var dataArrayPrivate_first = { y: 0, count: 0 };


            for (var i = 0; i < resultFirst.length; i++) {
                if (resultFirst[i]._id.ownership == "Public") {
                    dataArrayPublic_first = { y: resultFirst[i].ps, count: resultFirst[i].count };
                }
                if (resultFirst[i]._id.ownership == "Private") {
                    dataArrayPrivate_first = { y: resultFirst[i].ps, count: resultFirst[i].count };
                }
            }


            var dataArrayPublic_latest = { y: 0, count: 0 };
            var dataArrayPrivate_latest = { y: 0, count: 0 };

            for (var i = 0; i < resultLatest.length; i++) {
                if (resultLatest[i]._id.ownership == "Public") {
                    dataArrayPublic_latest = { y: resultLatest[i].ps, count: resultLatest[i].count };
                }
                if (resultLatest[i]._id.ownership == "Private") {
                    dataArrayPrivate_latest = { y: resultLatest[i].ps, count: resultLatest[i].count };
                }
            }

            var dataArrayOwnershipAll_first = { y: 0, count: 0 };
            dataArrayOwnershipAll_first.count = dataArrayPublic_first.count + dataArrayPrivate_first.count;
            if (dataArrayOwnershipAll_first.count != 0) {
                dataArrayOwnershipAll_first.y = ((dataArrayPublic_first.y * dataArrayPublic_first.count) + (dataArrayPrivate_first.y * dataArrayPrivate_first.count)) / dataArrayOwnershipAll_first.count;
            }

            var dataArrayOwnershipAll_latest = { y: 0, count: 0 };
            dataArrayOwnershipAll_latest.count = dataArrayPublic_latest.count + dataArrayPrivate_latest.count;
            if (dataArrayOwnershipAll_latest.count != 0) {
                dataArrayOwnershipAll_latest.y = ((dataArrayPublic_latest.y * dataArrayPublic_latest.count) + (dataArrayPrivate_latest.y * dataArrayPrivate_latest.count)) / dataArrayOwnershipAll_latest.count;
            }
            console.log("dataArrayPublic_latest");
            console.log(dataArrayOwnershipAll_first)

            seriesArrayByOwnership = [];

            seriesArrayByOwnership.push([{ name: '1st Inspection (N=' + dataArrayPublic_first.count + ')', data: [dataArrayPublic_first], color: 'rgba(68, 114, 196,1)' }, { name: 'Latest Inspection (N=' + dataArrayPublic_latest.count + ')', data: [dataArrayPublic_latest], color: 'rgba(237, 125, 49,1)' }]);
            seriesArrayByOwnership.push([{ name: '1st Inspection (N=' + dataArrayPrivate_first.count + ')', data: [dataArrayPrivate_first], color: 'rgba(68, 114, 196,1)' }, { name: 'Latest Inspection (N=' + dataArrayPrivate_latest.count + ')', data: [dataArrayPrivate_latest], color: 'rgba(237, 125, 49,1)' }]);
            seriesArrayByOwnership.push([{ name: '1st Inspection (N=' + dataArrayOwnershipAll_first.count + ')', data: [dataArrayOwnershipAll_first], color: 'rgba(68, 114, 196,1)' }, { name: 'Latest Inspection (N=' + dataArrayOwnershipAll_latest.count + ')', data: [dataArrayOwnershipAll_latest], color: 'rgba(237, 125, 49,1)' }]);


            callback(seriesArrayByOwnership);

        }

        function sendResponse(categoryArray, seriesArray) {
            res.send({
                categoryArray: categoryArray,
                seriesArray: seriesArray,
            });
        }
    },

    exportFigureAsPDF: function(req, res) {
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
                res.setHeader('Content-disposition', 'attachment; filename=Facility_Level_Progress_Figure_' + (CountyService.formateDate()) + '.pdf');
                out.stream.pipe(res);
            }, 2000);

        }).catch(function(e) {
            console.log("end pdf figures");
            res.end(e.message);
        });
    },

    inspectionProgressDataBank: function(req, res) {
        res.view('reports/inspectionProgressReportDataBank');
    },

    exportDatabank: function(req, res) {

        var county = CountyService.getCounty(req.param("county"));
        var subCounty = req.param("subCounty");

        var conditionArray = [];

        conditionArray.push({ m_insp_completed: "Yes", is_deleted: false, p_insp_number: { $exists: true } });
        if (county != "All") {
            conditionArray.push({ _county: county });
        }

        if (subCounty != "All") {
            conditionArray.push({ _subcounty: subCounty });
        }

        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');

        var cursor = collection.find({
            $and: conditionArray
        }, { _id: 0, "_hfid": 1, "_hfname": 1, "_hfid": 1, "p_insp_number": 1, "_county": 1, "_subcounty": 1, "total_ps": 1, "_date": 1, "m_followup_action": 1, "m_date_nextvisit": 1 });
        cursor.toArray(function(err, result) {

            for (var i = 0; i < result.length; i++) {
                if (result[i]._date != undefined) {
                    var date = new Date(result[i]._date);

                    /*var month = date.getMonth() + 1;
         var dt=date.getDate();
         result[i]._date = (dt > 9 ? dt : "0" + dt) + "/" + (month > 9 ? month : "0" + month) + "/" + date.getFullYear();
       */
                    result[i]._date = date
                }
                if (result[i].m_date_nextvisit != undefined) {
                    var array = result[i].m_date_nextvisit.split("/");
                    result[i].m_date_nextvisit = new Date(array[1] + "-" + array[0] + "-" + array[2]);
                }
            }

            var filteredProgressData = [];

            var params = req.allParams();

            // group data by facility id
            var groupedData = _.groupBy(result, function(obj) {
                return obj._hfid;
            });

            for (i in groupedData) {
                var obj = groupedData[i];

                var key = ['_date', 'm_followup_action'];


                for (i in obj) {

                    for (k in key) {
                        var tmp = key[k];

                        if (obj[i][tmp] == undefined) {
                            obj[i][tmp] = "N/A";
                        }
                    }
                }

                console.log(obj.length + "==========" + obj[0].p_insp_number);

                if (obj.length == 1 && obj[0].p_insp_number == 1) {

                    if (obj[0].total_ps == undefined) {
                        obj[0].total_ps = null;
                    } else {
                        obj[0].total_ps = Math.round(obj[0].total_ps);
                    }
                    filteredProgressData.push({
                        'Facility ID': obj[0]._hfid,
                        'Facility Name': obj[0]._hfname,
                        'County': obj[0]._county,
                        'MeanScoreResult': obj[0].total_ps,
                        'Date': obj[0]._date,
                        'Follow-up Action': obj[0].m_followup_action,
                        "Next Inspection Date": obj[0].m_date_nextvisit,
                        'MeanScoreResult1': null,
                        'Date1': null,
                        'Follow-up Action1': '',
                        "Next Inspection Date1": null,
                        'MeanScoreResult2': null,
                        'Date2': null,
                        'Follow-up Action2': '',
                        "Next Inspection Date2": null
                    });
                } else if (obj.length == 2) {
                    console.log(obj);
                    var index1, index2;
                    for (var i = 0; i < obj.length; i++) {

                        if (obj[i].p_insp_number == 1) {
                            index1 = i;
                        } else if (obj[i].p_insp_number == 2) {
                            index2 = i;
                        }
                    }
                    if (obj[index1].total_ps == undefined) {
                        obj[index1].total_ps = null;
                    } else {
                        obj[index1].total_ps = Math.round(obj[index1].total_ps);
                    }
                    if (obj[index2].total_ps == undefined) {
                        obj[index2].total_ps = null;
                    } else {
                        obj[index2].total_ps = Math.round(obj[index2].total_ps);
                    }

                    filteredProgressData.push({
                        'Facility ID': obj[index1]._hfid,
                        'Facility Name': obj[index1]._hfname,
                        'County': obj[index1]._county,
                        'MeanScoreResult': obj[index1].total_ps,
                        'Date': obj[index1]._date,
                        'Follow-up Action': obj[index1].m_followup_action,
                        "Next Inspection Date": obj[index1].m_date_nextvisit,
                        'MeanScoreResult1': obj[index2].total_ps,
                        'Date1': obj[index2]._date,
                        'Follow-up Action1': obj[index2].m_followup_action,
                        "Next Inspection Date1": obj[index2].m_date_nextvisit,
                        'MeanScoreResult2': null,
                        'Date2': null,
                        'Follow-up Action2': '',
                        "Next Inspection Date2": null
                    });

                } else if (obj.length == 3) {
                    var index1, index2, index3;
                    for (var i = 0; i < obj.length; i++) {

                        if (obj[i].p_insp_number == 1) {
                            index1 = i;
                        } else if (obj[i].p_insp_number == 2) {
                            index2 = i;
                        } else if (obj[i].p_insp_number == 3) {
                            index3 = i;
                        }
                    }

                    if (obj[index1].total_ps == undefined) {
                        obj[index1].total_ps = null;
                    } else {
                        obj[index1].total_ps = Math.round(obj[index1].total_ps);
                    }

                    if (obj[index2].total_ps == undefined) {
                        obj[index2].total_ps = null;
                    } else {
                        obj[index2].total_ps = Math.round(obj[index2].total_ps);
                    }

                    if (obj[index3].total_ps == undefined) {
                        obj[index3].total_ps = null;
                    } else {
                        obj[index3].total_ps = Math.round(obj[index3].total_ps);
                    }


                    filteredProgressData.push({
                        'Facility ID': obj[index1]._hfid,
                        'Facility Name': obj[index1]._hfname,
                        'County': obj[index1]._county,
                        'MeanScoreResult': obj[index1].total_ps,
                        'Date': obj[index1]._date,
                        'Follow-up Action': obj[index1].m_followup_action,
                        "Next Inspection Date": obj[index1].m_date_nextvisit,
                        'MeanScoreResult1': obj[index2].total_ps,
                        'Date1': obj[index2]._date,
                        'Follow-up Action1': obj[index2].m_followup_action,
                        "Next Inspection Date1": obj[index2].m_date_nextvisit,
                        'MeanScoreResult2': obj[index3].total_ps,
                        'Date2': obj[index3]._date,
                        'Follow-up Action2': obj[index3].m_followup_action,
                        "Next Inspection Date2": obj[index3].m_date_nextvisit
                    });
                }

            }
            console.log(filteredProgressData);
            var data = filteredProgressData;

            var xl = require('excel4node');
            var wb = new xl.Workbook();
            var ws;

            ws = wb.addWorksheet('Inspection Progress');

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

            var numberCenterStyle = wb.createStyle({
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
            var headerLeftStyle = wb.createStyle({
                alignment: {
                    vertical: ['center'],
                    horizontal: ['left']
                },
                font: {
                    color: 'black',
                    size: 11,
                    bold: true,
                }
            });
            var pngFileName1 = "/assets/images/moh_logo.png";


            ws.row(sheetRow).setHeight(70);
            ws.cell(sheetRow, 1, sheetRow++, 15, true).string('KePSIE Monitoring System, Ministry of Health')
                .style({ alignment: { horizontal: ['center'], vertical: ['center'] }, font: { color: 'black', size: 13, bold: true } });

            ws.cell(sheetRow, 1, sheetRow++, 15, true).string('Inspection Progress')
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
            ws.cell(sheetRow, 1, sheetRow++, 15, true).string(' County: ' + county + ' | Sub-County: ' + subCounty + ' ')
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
            ws.cell(sheetRow, 1, sheetRow++, 15, true).string('Notes: R = Reinspection')
                .style({ alignment: { horizontal: ['left'] }, font: { color: 'black', size: 11 } });

            ws.cell(sheetRow, 4, sheetRow, 7, true).string('First Inspection')
                .style({ alignment: { horizontal: ['center'] }, font: { color: 'black', size: 11, bold: true } });

            ws.cell(sheetRow, 8, sheetRow, 11, true).string('Second Inspection')
                .style({ alignment: { horizontal: ['center'] }, font: { color: 'black', size: 11, bold: true } });

            ws.cell(sheetRow, 12, sheetRow++, 15, true).string('Third Inspection')
                .style({ alignment: { horizontal: ['center'] }, font: { color: 'black', size: 11, bold: true } });


            ws.cell(sheetRow, 1).string("Facility ID").style(headerLeftStyle);
            ws.cell(sheetRow, 2).string("Facility Name").style(headerLeftStyle);
            ws.cell(sheetRow, 3).string("County").style(headerCenterStyle);
            ws.cell(sheetRow, 4).string("Mean Score Result").style(headerCenterStyle);
            ws.cell(sheetRow, 5).string("Date").style(headerCenterStyle);
            ws.cell(sheetRow, 6).string("Follow-up Action").style(headerCenterStyle);
            ws.cell(sheetRow, 7).string("Next Inspection Date").style(headerCenterStyle);
            ws.cell(sheetRow, 8).string("Mean Score Result").style(headerCenterStyle);
            ws.cell(sheetRow, 9).string("Date").style(headerCenterStyle);
            ws.cell(sheetRow, 10).string("Follow-up Action").style(headerCenterStyle);
            ws.cell(sheetRow, 11).string("Next Inspection Date").style(headerCenterStyle);
            ws.cell(sheetRow, 12).string("Mean Score Result").style(headerCenterStyle);
            ws.cell(sheetRow, 13).string("Date").style(headerCenterStyle);
            ws.cell(sheetRow, 14).string("Follow-up Action").style(headerCenterStyle);
            ws.cell(sheetRow, 15).string("Next Inspection Date").style(headerCenterStyle);

            sheetRow++;

            for (i in data) {

                var obj = data[i];

                ws.cell(sheetRow, 1).number(obj['Facility ID']).style(normalLeftStyle);

                ws.cell(sheetRow, 2).string(obj['Facility Name']).style(normalLeftStyle);

                ws.cell(sheetRow, 3).string(obj['County']).style(normalCenterStyle);

                if (obj['MeanScoreResult'] != null) {
                    obj['MeanScoreResult'] = obj['MeanScoreResult'] / 100;
                    ws.cell(sheetRow, 4).number(obj['MeanScoreResult']).style(numberCenterStyle);
                }

                if (obj['Date'] != undefined) {
                    ws.cell(sheetRow, 5).date(obj['Date']).style(normalCenterStyle);
                }
                ws.cell(sheetRow, 6).string(obj['Follow-up Action']).style(normalCenterStyle);

                if (obj['Next Inspection Date'] != undefined) {
                    ws.cell(sheetRow, 7).date(obj['Next Inspection Date']).style(normalCenterStyle);
                }

                if (obj['MeanScoreResult1'] != null) {
                    obj['MeanScoreResult1'] = obj['MeanScoreResult1'] / 100;
                    ws.cell(sheetRow, 8).number(obj['MeanScoreResult1']).style(numberCenterStyle);
                }

                if (obj['Date1'] != undefined) {
                    ws.cell(sheetRow, 9).date(obj['Date1']).style(normalCenterStyle);
                }

                ws.cell(sheetRow, 10).string(obj['Follow-up Action1']).style(normalCenterStyle);

                if (obj['Next Inspection Date1'] != undefined) {
                    ws.cell(sheetRow, 11).date(obj['Next Inspection Date1']).style(normalCenterStyle);
                }

                if (obj['MeanScoreResult2'] != null) {
                    obj['MeanScoreResult2'] = obj['MeanScoreResult2'] / 100;
                    ws.cell(sheetRow, 12).number(obj['MeanScoreResult2']).style(numberCenterStyle);
                }

                if (obj['Date2'] != undefined) {
                    ws.cell(sheetRow, 13).date(obj['Date2']).style(normalCenterStyle);
                }
                ws.cell(sheetRow, 14).string(obj['Follow-up Action2']).style(normalCenterStyle);

                if (obj['Next Inspection Date2'] != undefined) {
                    ws.cell(sheetRow, 15).date(obj['Next Inspection Date2']).style(normalCenterStyle);
                }

                sheetRow++;
            }

            ws.column(1).setWidth(15);
            ws.column(2).setWidth(40);
            ws.column(3).setWidth(15);
            ws.column(4).setWidth(15);
            ws.column(5).setWidth(20);
            ws.column(6).setWidth(15);
            ws.column(7).setWidth(15);
            ws.column(8).setWidth(20);
            ws.column(9).setWidth(15);
            ws.column(10).setWidth(15);
            ws.column(11).setWidth(20);
            ws.column(12).setWidth(15);
            ws.column(13).setWidth(15);
            ws.column(14).setWidth(15);
            ws.column(15).setWidth(15);
            ws.column(15).setWidth(15);
            ws.row(6).filter({});
            console.log("finish");

            setTimeout(sendExcelFile, 1000);

            function sendExcelFile() {
                wb.write(xlsxFileName, function(err, stats) {
                    if (err) {
                        console.error(err);
                    }

                    var fileName = "";

                    fileName = 'Inspection_Progress_' + (CountyService.formateDate()) + ".xlsx";

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

    //inspection progress and planning action end



    inspectionProgressMap: function(req, res) {
        res.view('reports/inspectionProgressReportMap');
    },

    getTableFilterValues: function(req, res) {
        var loggedInUser = req.session.loggedInUser;
        var countyList = CountyService.getCounties(loggedInUser);
        var subCountyList = CountyService.getSubCountiesByCounties(countyList);
        res.send({
            countyList: countyList,
            subCountyList: subCountyList,
        });
    },


    getAggregateTableData: function(req, res) {

        // get data from request

        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');

        var conditionString = {};

        if (req.param.county == "All" && req.param.subCounty == "All") {
            conditionString = { wave: "$p_wave", followup_action: "$m_followup_action", completed: "$m_visit_completed" };
        } else {
            conditionString = {
                wave: "$p_wave",
                followup_action: "$m_followup_action",
                completed: "$m_visit_completed",
                county: "$_county",
                subCounty: "$_subcounty"
            };

        }

        var cursor1 = collection.aggregate({
            $group: {
                _id: conditionString,
                count: { "$sum": 1 }
            }
        }, { $project: { wave: 1, followup_action: 1, completed: 1, county: 1, subCounty: 1, count: 1 } });
        cursor1.toArray(function(err, result) {

            res.json(result);

        });

    },


    exportTableAsPDF: function(req, res) {

        var logourl = sails.config.logoURL;
        var subCounty = req.param("selectSubCounty");
        var county = req.param("selectCounty");
        var reportType = req.param("reportType");


        // prepare html
        var html = "<html><head><link rel='icon' href='/wb-favicon.png'/><title>KePSIE | PDF</title><style> ";
        html = html + ".centerCell{text-align:center} table {border:1px solid #e7ecf1;width:98%}.header1 a {font-size: 14px;background-color: #31708f;color: white;padding: 5px 5px 4px 5px;text-decoration: none;display: block;font-weight: bold;}.header1 {margin-bottom: 10px;font-size: 13px;background-color: #31708f;color: white;padding: 3px;border-radius: 5px 5px 0 0!important;width:100%}.table thead tr th {font-size: 13px;font-weight: bold;padding: 6px;border: 1px solid #e7ecf1;} .table tfoot tr th {font-size: 13px;font-weight: bold;padding: 6px;border: 1px solid #e7ecf1;} table tbody tr td {border: 1px solid #e7ecf1 !important;padding: 4px;line-height: 1.42857;vertical-align: top;} td{font-size:13px} th{font-size:13px}.pageOneMain {height: 100%;width: 100%;display: table;}.pageOneWrapper {display: table-cell;height: 100%;vertical-align: middle;}.pageOneH1 {text-align: center;color : #31708f;}.pageOneH3 {text-align: center;color : #31708f;}";
        html = html + "thead {display: table-row-group;} tfoot {display: table-row-group;} .countyHeader {margin-bottom:0px; float: left;padding: 7px;background-color: rgb(49, 112, 143);color: white;padding-left: 10px;padding-right: 25px;border-radius: 5px 5px 0px 0px !important;display: none;}";
        html = html + "table{margin-bottom: 10px;} table td{font-size: 13px} .countyHeader{font-size: 13px}</style></head><body style='font-family:\"Open Sans, sans-serif\"'>"
        html = html + '<center><img src=' + logourl + ' width="120px" height="120px"></center>';
        if (reportType == "Facility") {
            html = html + '<div class="header1" style="width:1091px"><a class="secLink" href="javascript:void(0)">Inspector Progress: Facility Report </a></div>';
        } else {
            html = html + '<div class="header1" style="width:1024px"><a class="secLink" href="javascript:void(0)">Inspector Progress: Aggregate Report </a></div>';
        }
        html = html + "<table><tr><td> County: " + county + "</td> <td style='width: 300px%'> Subcounty: " + subCounty + " </td></tr></table>";
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
            res.setHeader('Content-disposition', 'attachment; filename=Inspection_Progress_' + (CountyService.formateDate()) + '.pdf');
            out.stream.pipe(res);
        }).catch(function(e) {
            res.end(e.message);
        });
    },

}