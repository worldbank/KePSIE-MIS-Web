/**
 * InspectionData Service
 *
 * @description : Server-side logic for managing the summary reports/figures/map
 * @author : Jay Pastagia
 */

module.exports = {

    getAll: function() {

    },

    getById: function(id, callback) {
        var mongo = require('mongodb');

        console.log("id here: " + id);

        var o_id = new mongo.ObjectID(id);
        var collection = MongoService.getDB().collection('facility');
        var cursor = collection.find({ _id: o_id });
        cursor.toArray(function(err, result) {

            console.log(result[0]._hfid);

            var progress = 0;

            if (result[0].p_insp_number != 1) {
                var second_last_insp = result[0].p_insp_number - 1;
                var cur = collection.find({ _hfid: result[0]._hfid, p_insp_number: second_last_insp });
                cur.toArray(function(err, previousInsp) {
                    callback(result[0], previousInsp[0]);
                });

            } else {
                callback(result[0], null);
            }
        });
    },

    countByFacilityClosed: function(county, subcounty, ownership, level, callback) {
        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');
        var conditionString = { "latest.f_physclose": 1 };
        if (county != "All") {
            conditionString["latest._county"] = county;
            //conditionString = conditionString + '"latest._county":"'+county+'",';
        }
        if (subcounty != "All") {
            conditionString["latest._subcounty"] = subcounty;
            //conditionString = conditionString + '"latest._subcounty":"'+subcounty+'",';
        }
        if (level != "All") {
            conditionString["latest._level"] = level;
            //conditionString = conditionString + '"latest._level":"'+level+'" ,';
        }

        var cursor;
        // if(conditionString!='"m_closed":"No","is_deleted":false') {
        console.log("closed conditionString");
        console.log(conditionString);
        cursor = collection.aggregate([
            { $match: { is_deleted: false, m_insp_completed: "Yes" } },

            { $sort: { p_insp_number: 1 } },
            {
                $group: {
                    _id: "$_hfid",
                    inspection: { $max: "$p_insp_number" },
                    latest: { $last: "$$ROOT" }
                }
            },
            { $match: conditionString },
            { "$group": { _id: "$latest._ownership", count: { $sum: 1 } } }
        ], { allowDiskUse: true });


        cursor.toArray(function(err, result) {
            var finalResult = [];
            var total = 0;

            if (result != undefined) {

                var flag = 0;
                var flag1 = 0;

                //prepare result

                for (c in result) {
                    total += result[c].count;
                }

                var publicResult = {};
                var privateResult = {};
                for (i in result) {

                    if (result[i]._id == "Public") {
                        flag = 1;
                        var perc = (100 * parseInt(result[i].count)) / total;
                        publicResult = { "key": result[i]._id, "count": result[i].count, "value": perc.toFixed(2) };
                    } else if (result[i]._id == "Private") {
                        flag1 = 1;
                        var perc = (100 * parseInt(result[i].count)) / total;
                        privateResult = { "key": result[i]._id, "count": result[i].count, "value": perc.toFixed(2) };
                    }
                }
                if (flag == 0) {
                    publicResult = {
                        "key": "Public",
                        "count": 0,
                        "value": 0
                    };
                }
                if (flag1 == 0) {
                    privateResult = {
                        "key": "Private",
                        "count": 0,
                        "value": 0
                    };
                }

                finalResult.push(publicResult);
                finalResult.push(privateResult);

            } else {
                finalResult = [{
                        "key": "Public",
                        "count": 0,
                        "value": 0
                    },
                    {
                        "key": "Private",
                        "count": 0,
                        "value": 0
                    }
                ];
            }

            callback(finalResult);
        });
    },

    getDataByLevel: function(type, county, callback) {

        var mongo = require('mongodb');
        var groupColumn;
        var collection = MongoService.getDB().collection('facility');
        var array = [];
        var cursor;

        //decide the group by columns
        var conditionString = "";
        var name = "";
        if (county == 1) {
            name = "Kakamega";
        } else if (county == 2) {
            name = "Kilifi";
        } else if (county == 3) {
            name = "Meru";
        }

        console.log("inside getDataByLevel");
        console.log(name);

        if (name != "") {
            cursor = collection.aggregate([{
                    $match: {
                        "is_deleted": false,
                        "m_insp_completed": "Yes",
                        "_county": name
                    }
                },
                { $sort: { p_insp_number: 1 } },
                { $group: { _id: "$_hfid", latest: { $last: "$$ROOT" } } },
                {
                    $group: {
                        _id: {
                            risk_c: "$latest.risk_c",
                            level: "$latest._level"
                        },
                        total: { $sum: 1 }
                    }
                },
                {
                    "$group": {
                        "_id": "$_id.level",
                        "category": {
                            "$push": {
                                "name": "$_id.risk_c",
                                "count": "$total"
                            },
                        },
                        "count": { "$sum": "$total" }
                    }
                },
                { "$sort": { "count": -1 } },
            ], { allowDiskUse: true });
        } else {
            cursor = collection.aggregate([
                { $match: { "is_deleted": false, "m_insp_completed": "Yes" } },
                { $sort: { p_insp_number: 1 } },
                { $group: { _id: "$_hfid", latest: { $last: "$$ROOT" } } },
                {
                    $group: {
                        _id: {
                            risk_c: "$latest.risk_c",
                            level: "$latest._level"
                        },
                        total: { $sum: 1 }
                    }
                },
                {
                    "$group": {
                        "_id": "$_id.level",
                        "category": {
                            "$push": {
                                "name": "$_id.risk_c",
                                "count": "$total"
                            },
                        },
                        "count": { "$sum": "$total" }
                    }
                },
                { "$sort": { "count": -1 } },
            ], { allowDiskUse: true });
        }


        cursor.toArray(function(err, result) {

            var finalResult = [];
            var total = 0;
            var total45 = 0;
            var level2 = [],
                level3 = [],
                level4 = [],
                level5 = [],
                level45 = [];
            levelAll = [];
            var l45NonY = 0,
                l45MinY = 0,
                l45ParY = 0,
                l45SubY = 0,
                l45FulY = 0;
            var l45NonCount = 0,
                l45MinCount = 0,
                l45ParCount = 0,
                l45SubCount = 0,
                l45FulCount = 0;
            var level4Flag = false,
                level5Flag = false;

            var valueArr = [];
            var valNonTot = { y: 0, count: 0 },
                valMinTot = { y: 0, count: 0 },
                valParTot = { y: 0, count: 0 },
                valSubTot = { y: 0, count: 0 },
                valFulTot = { y: 0, count: 0 };
            var valNon45 = { y: 0, count: 0 },
                valMin45 = { y: 0, count: 0 },
                valPar45 = { y: 0, count: 0 },
                valSub45 = { y: 0, count: 0 },
                valFul45 = { y: 0, count: 0 };
            var non = 0,
                min = 0,
                par = 0,
                sub = 0,
                ful = 0;

            var l2Result = {};
            var l3Result = {};
            var l45Result = {};

            console.log("level2 Object: " + l2Result);


            //find total
            for (var i in result) {
                var valNon = { y: 0, count: 0 },
                    valMin = { y: 0, count: 0 },
                    valPar = { y: 0, count: 0 },
                    valSub = { y: 0, count: 0 },
                    valFul = { y: 0, count: 0 };
                if (result[i]._id == "Level 2") {
                    console.log("inside l2");
                    var category = result[i].category;
                    total += result[i].count;
                    console.log("total--" + total);
                    for (var j in category) {
                        console.log("inside l2 cat");
                        var item = category[j];
                        if (item.name == "Non-Compliant") {
                            valNon.y = (100 * parseInt(item.count)) / result[i].count;
                            valNon.count = item.count;
                            non += item.count;
                        } else if (item.name == "Minimally Compliant") {
                            valMin.y = (100 * parseInt(item.count)) / result[i].count;
                            valMin.count = item.count;
                            min += item.count;
                        } else if (item.name == "Partially Compliant") {
                            valPar.y = (100 * parseInt(item.count)) / result[i].count;
                            valPar.count = item.count;
                            par += item.count;
                        } else if (item.name == "Substantially Compliant") {
                            valSub.y = (100 * parseInt(item.count)) / result[i].count;
                            valSub.count = item.count;
                            sub += item.count;
                        } else if (item.name == "Fully Compliant") {
                            valFul.y = (100 * parseInt(item.count)) / result[i].count;
                            valFul.count = item.count;
                            ful += item.count;
                        }
                    }
                    level2.push(valNon);
                    level2.push(valMin);
                    level2.push(valPar);
                    level2.push(valSub);
                    level2.push(valFul);

                    l2Result.count = result[i].count;
                    l2Result.array = level2;
                    console.log("push level2------" + total + "-----" + name);
                    console.log(l2Result);


                } else if (result[i]._id == "Level 3") {
                    var category = result[i].category;
                    total += result[i].count;
                    console.log("inside l3");
                    for (j in category) {
                        console.log("inside l3 cat");
                        var item = category[j];
                        if (item.name == "Non-Compliant") {
                            valNon.y = (100 * parseInt(item.count)) / result[i].count;
                            valNon.count = item.count;
                            non += item.count;
                        } else if (item.name == "Minimally Compliant") {
                            valMin.y = (100 * parseInt(item.count)) / result[i].count;
                            valMin.count = item.count;
                            min += item.count;
                        } else if (item.name == "Partially Compliant") {
                            valPar.y = (100 * parseInt(item.count)) / result[i].count;
                            valPar.count = item.count;
                            par += item.count;
                        } else if (item.name == "Substantially Compliant") {
                            valSub.y = (100 * parseInt(item.count)) / result[i].count;
                            valSub.count = item.count;
                            sub += item.count;
                        } else if (item.name == "Fully Compliant") {
                            valFul.y = (100 * parseInt(item.count)) / result[i].count;
                            valFul.count = item.count;
                            ful += item.count;
                        }
                    }
                    level3.push(valNon);
                    level3.push(valMin);
                    level3.push(valPar);
                    level3.push(valSub);
                    level3.push(valFul);
                    console.log("push level3------" + total);

                    l3Result.count = result[i].count;
                    l3Result.array = level3;

                } else if (result[i]._id == "Level 4") {
                    level4Flag = true;
                    var category = result[i].category;
                    total += result[i].count;
                    total45 += result[i].count;
                    console.log("inside 4");
                    for (j in category) {
                        console.log("inside 45 cat");
                        var item = category[j];
                        if (item.name == "Non-Compliant") {
                            valNon.y = (100 * parseInt(item.count)) / result[i].count;
                            valNon.count = item.count;
                            l45NonY += valNon.y;
                            l45NonCount += valNon.count;
                            non += item.count;
                        } else if (item.name == "Minimally Compliant") {
                            valMin.y = (100 * parseInt(item.count)) / result[i].count;
                            valMin.count = item.count;
                            l45MinY += valMin.y;
                            l45MinCount += valMin.count;
                            min += item.count;
                        } else if (item.name == "Partially Compliant") {
                            valPar.y = (100 * parseInt(item.count)) / result[i].count;
                            valPar.count = item.count;
                            l45ParY += valPar.y;
                            l45ParCount += valPar.count;
                            par += item.count;
                        } else if (item.name == "Substantially Compliant") {
                            valSub.y = (100 * parseInt(item.count)) / result[i].count;
                            valSub.count = item.count;
                            l45SubY += valSub.y;
                            l45SubCount += valSub.count;
                            sub += item.count;
                        } else if (item.name == "Fully Compliant") {
                            valFul.y = (100 * parseInt(item.count)) / result[i].count;
                            valFul.count = item.count;
                            l45FulY += valFul.y;
                            l45FulCount += valFul.count;
                            ful += item.count;
                        }
                    }

                    /*level4.push(valNon);
                    level4.push(valMin);
                    level4.push(valPar);
                    level4.push(valSub);
                    level4.push(valFul);
                    console.log("push level45------"+total);
                    var l4Result = {};
                    l4Result.count = result[i].count;
                    l4Result.array= level4;
                    finalResult.push(l4Result);*/

                } else if (result[i]._id == "Level 5") {
                    level5Flag = true;
                    var category = result[i].category;
                    total += result[i].count;
                    total45 += result[i].count;
                    console.log("inside 5");
                    for (j in category) {
                        console.log("inside 5 cat");
                        var item = category[j];
                        if (item.name == "Non-Compliant") {
                            valNon.y = (100 * parseInt(item.count)) / result[i].count;
                            valNon.count = item.count;
                            l45NonY += valNon.y;
                            l45NonCount += valNon.count;
                            non += item.count;
                        } else if (item.name == "Minimally Compliant") {
                            valMin.y = (100 * parseInt(item.count)) / result[i].count;
                            valMin.count = item.count;
                            l45MinY += valMin.y;
                            l45MinCount += valMin.count;
                            min += item.count;
                        } else if (item.name == "Partially Compliant") {
                            valPar.y = (100 * parseInt(item.count)) / result[i].count;
                            valPar.count = item.count;
                            l45ParY += valPar.y;
                            l45ParCount += valPar.count;
                            par += item.count;
                        } else if (item.name == "Substantially Compliant") {
                            valSub.y = (100 * parseInt(item.count)) / result[i].count;
                            valSub.count = item.count;
                            l45SubY += valSub.y;
                            l45SubCount += valSub.count;
                            sub += item.count;
                        } else if (item.name == "Fully Compliant") {
                            valFul.y = (100 * parseInt(item.count)) / result[i].count;
                            valFul.count = item.count;
                            l45FulY += valFul.y;
                            l45FulCount += valFul.count;
                            ful += item.count;
                        }
                    }

                    /*level5.push(valNon);
                    level5.push(valMin);
                    level5.push(valPar);
                    level5.push(valSub);
                    level5.push(valFul);
                    console.log("push level5------"+total);
                    var l5Result = {};
                    l5Result.count = result[i].count;
                    l5Result.array= level5;
                    finalResult.push(l5Result);*/

                } else {

                    var category = result[i].category;
                    total += result[i].count;
                    console.log("total--" + total);
                    for (var j in category) {
                        var item = category[j];
                        if (item.name == "Non-Compliant") {
                            non += item.count;
                        } else if (item.name == "Minimally Compliant") {
                            min += item.count;
                        } else if (item.name == "Partially Compliant") {
                            par += item.count;
                        } else if (item.name == "Substantially Compliant") {
                            sub += item.count;
                        } else if (item.name == "Fully Compliant") {
                            ful += item.count;
                        }
                    }
                }
            }

            valNon45.y = (100 * parseInt(l45NonCount)) / total45;
            valMin45.y = (100 * parseInt(l45MinCount)) / total45;
            valPar45.y = (100 * parseInt(l45ParCount)) / total45;
            valSub45.y = (100 * parseInt(l45SubCount)) / total45;
            valFul45.y = (100 * parseInt(l45FulCount)) / total45;


            valNon45.count = l45NonCount;
            valMin45.count = l45MinCount;
            valPar45.count = l45ParCount;
            valSub45.count = l45SubCount;
            valFul45.count = l45FulCount;

            //level 4 and level 5 combine
            level45.push(valNon45);
            level45.push(valMin45);
            level45.push(valPar45);
            level45.push(valSub45);
            level45.push(valFul45);

            var l45Result = {};
            l45Result.count = total45;
            l45Result.array = level45;


            console.log("l45Result here========");
            console.log(l45Result);

            if (l2Result.count == undefined) {
                l2Result = {
                    count: 0,
                    array: [{ y: 0, count: 0 },
                        { y: 0, count: 0 },
                        { y: 0, count: 0 },
                        { y: 0, count: 0 },
                        { y: 0, count: 0 }
                    ]
                };

            }
            if (l3Result.count == undefined) {
                l3Result = {
                    count: 0,
                    array: [{ y: 0, count: 0 },
                        { y: 0, count: 0 },
                        { y: 0, count: 0 },
                        { y: 0, count: 0 },
                        { y: 0, count: 0 }
                    ]
                };

            }
            if (l45Result.count == undefined) {
                l45Result = {
                    count: 0,
                    array: [{ y: 0, count: 0 },
                        { y: 0, count: 0 },
                        { y: 0, count: 0 },
                        { y: 0, count: 0 },
                        { y: 0, count: 0 }
                    ]
                };

            }


            finalResult.push(l2Result);
            finalResult.push(l3Result);
            finalResult.push(l45Result);

            console.log("callback------");
            if (total == 0) {
                valNonTot.y = 0;
                valNonTot.count = non;

                valMinTot.y = 0;
                valMinTot.count = min;

                valParTot.y = 0;
                valParTot.count = par;

                valSubTot.y = 0;
                valSubTot.count = sub;

                valFulTot.y = 0;
                valFulTot.count = ful;
            } else {
                valNonTot.y = (100 * non) / total;
                valNonTot.count = non;

                valMinTot.y = (100 * min) / total;
                valMinTot.count = min;

                valParTot.y = (100 * par) / total;
                valParTot.count = par;

                valSubTot.y = (100 * sub) / total;
                valSubTot.count = sub;

                valFulTot.y = (100 * ful) / total;
                valFulTot.count = ful;
            }

            levelAll.push(valNonTot);
            levelAll.push(valMinTot);
            levelAll.push(valParTot);
            levelAll.push(valSubTot);
            levelAll.push(valFulTot);
            var lAllResult = {};
            lAllResult.count = total;
            lAllResult.array = levelAll;
            console.log("lAllResult");
            console.log(lAllResult);
            finalResult.push(lAllResult);

            callback(finalResult);
        });
    },
    getDataByOwnership: function(type, county, callback) {

        var mongo = require('mongodb');
        var groupColumn;
        var collection = MongoService.getDB().collection('facility');
        var array = [];
        var cursor;
        //decide the group by columns
        var conditionString = "";
        var name = "";
        if (county == 1) {
            name = "Kakamega";
        } else if (county == 2) {
            name = "Kilifi";
        } else if (county == 3) {
            name = "Meru";
        }
        if (name != "") {
            cursor = collection.aggregate([
                { $match: { "is_deleted": false, "m_insp_completed": "Yes", "_county": name } },
                { $sort: { p_insp_number: 1 } },
                { $group: { _id: "$_hfid", latest: { $last: "$$ROOT" } } },
                {
                    $group: {
                        _id: {
                            risk_c: "$latest.risk_c",
                            ownership: "$latest._ownership"
                        },
                        total: { $sum: 1 }
                    }
                },
                {
                    "$group": {
                        "_id": "$_id.ownership",
                        "category": {
                            "$push": {
                                "name": "$_id.risk_c",
                                "count": "$total"
                            },
                        },
                        "count": { "$sum": "$total" }
                    }
                },
                { "$sort": { "count": -1 } },
            ], { allowDiskUse: true });
        } else {
            cursor = collection.aggregate([
                { $match: { "is_deleted": false, "m_insp_completed": "Yes" } },
                { $sort: { p_insp_number: 1 } },
                { $group: { _id: "$_hfid", latest: { $last: "$$ROOT" } } },
                {
                    $group: {
                        _id: {
                            risk_c: "$latest.risk_c",
                            ownership: "$latest._ownership"
                        },
                        total: { $sum: 1 }
                    }
                },
                {
                    "$group": {
                        "_id": "$_id.ownership",
                        "category": {
                            "$push": {
                                "name": "$_id.risk_c",
                                "count": "$total"
                            },
                        },
                        "count": { "$sum": "$total" }
                    }
                },
                { "$sort": { "count": -1 } },
            ], { allowDiskUse: true });
        }
        //To Do : include section 13 as well after got the data
        //execute aggregate query

        cursor.toArray(function(err, result) {
            console.log("mayur --check result here:");
            console.log(result);
            var finalResult = [];
            var total = 0;

            var private = [],
                public = [],
                ownershipAll = [];


            console.log("result------");
            console.log(result);
            var valueArr = [];
            var valNonTot = { y: 0, count: 0 },
                valMinTot = { y: 0, count: 0 },
                valParTot = { y: 0, count: 0 },
                valSubTot = { y: 0, count: 0 },
                valFulTot = { y: 0, count: 0 };
            var non = 0,
                min = 0,
                par = 0,
                sub = 0,
                ful = 0;

            var privateResult = {};
            var publicResult = {};
            //find total
            for (var i in result) {
                var valNon = { y: 0, count: 0 },
                    valMin = { y: 0, count: 0 },
                    valPar = { y: 0, count: 0 },
                    valSub = { y: 0, count: 0 },
                    valFul = { y: 0, count: 0 };
                if (result[i]._id == "Private") {
                    console.log("inside l2");
                    var category = result[i].category;
                    total += result[i].count;
                    console.log("total--" + total);
                    for (var j in category) {
                        console.log("inside l2 cat");
                        var item = category[j];
                        if (item.name == "Non-Compliant") {
                            valNon.y = (100 * parseInt(item.count)) / result[i].count;
                            valNon.count = item.count;
                            non += item.count;
                        } else if (item.name == "Minimally Compliant") {
                            valMin.y = (100 * parseInt(item.count)) / result[i].count;
                            valMin.count = item.count;
                            min += item.count;
                        } else if (item.name == "Partially Compliant") {
                            valPar.y = (100 * parseInt(item.count)) / result[i].count;
                            valPar.count = item.count;
                            par += item.count;
                        } else if (item.name == "Substantially Compliant") {
                            valSub.y = (100 * parseInt(item.count)) / result[i].count;
                            valSub.count = item.count;
                            sub += item.count;
                        } else if (item.name == "Fully Compliant") {
                            valFul.y = (100 * parseInt(item.count)) / result[i].count;
                            valFul.count = item.count;
                            ful += item.count;
                        }
                    }
                    private.push(valNon);
                    private.push(valMin);
                    private.push(valPar);
                    private.push(valSub);
                    private.push(valFul);
                    console.log("push level2------" + total);

                    privateResult.count = result[i].count;
                    privateResult.array = private;



                } else if (result[i]._id == "Public") {
                    var category = result[i].category;
                    total += result[i].count;
                    console.log("inside l3");
                    for (j in category) {
                        console.log("inside l3 cat");
                        var item = category[j];
                        if (item.name == "Non-Compliant") {
                            valNon.y = (100 * parseInt(item.count)) / result[i].count;
                            valNon.count = item.count;
                            non += item.count;
                        } else if (item.name == "Minimally Compliant") {
                            valMin.y = (100 * parseInt(item.count)) / result[i].count;
                            valMin.count = item.count;
                            min += item.count;
                        } else if (item.name == "Partially Compliant") {
                            valPar.y = (100 * parseInt(item.count)) / result[i].count;
                            valPar.count = item.count;
                            par += item.count;
                        } else if (item.name == "Substantially Compliant") {
                            valSub.y = (100 * parseInt(item.count)) / result[i].count;
                            valSub.count = item.count;
                            sub += item.count;
                        } else if (item.name == "Fully Compliant") {
                            valFul.y = (100 * parseInt(item.count)) / result[i].count;
                            valFul.count = item.count;
                            ful += item.count;
                        }
                    }
                    public.push(valNon);
                    public.push(valMin);
                    public.push(valPar);
                    public.push(valSub);
                    public.push(valFul);
                    console.log("push level3------" + total);

                    publicResult.count = result[i].count;
                    publicResult.array = public;


                } else {
                    var category = result[i].category;
                    total += result[i].count;
                    console.log("total--" + total);
                    for (var j in category) {
                        var item = category[j];
                        if (item.name == "Non-Compliant") {
                            non += item.count;
                        } else if (item.name == "Minimally Compliant") {
                            min += item.count;
                        } else if (item.name == "Partially Compliant") {
                            par += item.count;
                        } else if (item.name == "Substantially Compliant") {
                            sub += item.count;
                        } else if (item.name == "Fully Compliant") {
                            ful += item.count;
                        }
                    }
                }

            }
            console.log("callback------");

            if (total == 0) {
                valNonTot.y = 0;
                valNonTot.count = non;

                valMinTot.y = 0;
                valMinTot.count = min;

                valParTot.y = 0;
                valParTot.count = par;

                valSubTot.y = 0;
                valSubTot.count = sub;

                valFulTot.y = 0;
                valFulTot.count = ful;
            } else {

                valNonTot.y = (100 * non) / total;
                valNonTot.count = non;

                valMinTot.y = (100 * min) / total;
                valMinTot.count = min;

                valParTot.y = (100 * par) / total;
                valParTot.count = par;

                valSubTot.y = (100 * sub) / total;
                valSubTot.count = sub;

                valFulTot.y = (100 * ful) / total;
                valFulTot.count = ful;
            }

            ownershipAll.push(valNonTot);
            ownershipAll.push(valMinTot);
            ownershipAll.push(valParTot);
            ownershipAll.push(valSubTot);
            ownershipAll.push(valFulTot);

            var allResult = {};
            allResult.count = total;
            allResult.array = ownershipAll;

            if (publicResult.count == undefined) {
                publicResult = {
                    count: 0,
                    array: [{ y: 0, count: 0 },
                        { y: 0, count: 0 },
                        { y: 0, count: 0 },
                        { y: 0, count: 0 },
                        { y: 0, count: 0 }
                    ]
                };
            }

            if (privateResult.count == undefined) {
                privateResult = {
                    count: 0,
                    array: [{ y: 0, count: 0 },
                        { y: 0, count: 0 },
                        { y: 0, count: 0 },
                        { y: 0, count: 0 },
                        { y: 0, count: 0 }
                    ]
                };
            }


            finalResult.push(publicResult);
            finalResult.push(privateResult);
            finalResult.push(allResult);
            callback(finalResult);
        });
    },

    countByRiskCategory: function(county, subcounty, ownership, level, callback) {
        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');

        var conditionString = "";
        conditionString = conditionString + '"latest.is_deleted":false,';
        if (county != "All") {
            conditionString = conditionString + '"latest._county":{ "$regex": "' + county + '" },';
        }
        if (subcounty != "All") {
            conditionString = conditionString + '"latest._subcounty":{ "$regex": "' + subcounty + '" },';
        }
        if (ownership != "All") {
            conditionString = conditionString + '"latest._ownership":{ "$regex": "' + ownership + '" },';
        }
        if (level != "All") {
            conditionString = conditionString + '"latest._level":{ "$regex": "' + level + '" },';
        }
        conditionString = conditionString.replace(/,\s*$/, "");
        var cursor;
        // if(conditionString!="") {
        conditionString = "{" + conditionString + "}";
        conditionString = JSON.parse(conditionString);
        cursor = collection.aggregate([
            { $match: { is_deleted: false, m_insp_completed: "Yes" } },
            { $sort: { p_insp_number: 1 } },
            {
                $group: {
                    _id: "$_hfid",
                    inspection: { $max: "$p_insp_number" },
                    latest: { $last: "$$ROOT" }
                }
            },
            { $match: conditionString },
            { "$group": { _id: "$latest.risk_c", count: { $sum: 1 } } }
        ], { allowDiskUse: true });
        /*} else {
        	cursor = collection.aggregate([
        		{"$group" : {_id:"$risk_c", count:{$sum:1}}}
        		]);
        }
        */
        cursor.toArray(function(err, result) {
            var finalResult = [];
            var total = 0;

            var risk1, risk2, risk3, risk4, risk5;

            console.log("result------");
            console.log(result);
            //find total
            for (i in result) {

                //var	perc = (100 * parseInt(result[risk1].count))/total;
                finalResult.push(({
                    "key": result[i]._id,
                    "count": result[i].count
                        //, "value":perc.toFixed(2)
                }));

            }

            callback(finalResult);
        });
    },

    aggregate: function(req, county, subcounty, ownership, level, callback) {
        console.log(county + " " + subcounty + " " + ownership + " " + level + " ");
        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');
        var avgString = "";
        var conditionString = "";
        var countByConditionString = "";
        conditionString = conditionString + '"latest.is_deleted":false,';
        if (county != "All") {
            conditionString = conditionString + '"latest._county":{ "$regex": "' + county + '" },';
        }
        if (subcounty != "All") {
            conditionString = conditionString + '"latest._subcounty":{ "$regex": "' + subcounty + '" },';
        }
        if (ownership != "All") {
            conditionString = conditionString + '"latest._ownership":{ "$regex": "' + ownership + '" },';
        }
        if (level != "All") {
            conditionString = conditionString + '"latest._level":{ "$regex": "' + level + '" },';
        }
        conditionString = conditionString.replace(/,\s*$/, "");


        countByConditionString = countByConditionString + '"latest.is_deleted":false,"latest.m_insp_completed":"Yes",';
        if (county != "All") {
            countByConditionString = countByConditionString + '"latest._county":{ "$regex": "' + county + '" },';
        }
        if (subcounty != "All") {
            countByConditionString = countByConditionString + '"latest._subcounty":{ "$regex": "' + subcounty + '" },';
        }
        if (ownership != "All") {
            countByConditionString = countByConditionString + '"latest._ownership":{ "$regex": "' + ownership + '" },';
        }
        if (level != "All") {
            countByConditionString = countByConditionString + '"latest._level":{ "$regex": "' + level + '" },';
        }
        countByConditionString = countByConditionString.replace(/,\s*$/, "");
        countByConditionString = "{" + countByConditionString + "}";
        countByConditionString = JSON.parse(countByConditionString);

        function nextChar(c) {
            return String.fromCharCode(c.charCodeAt(0) + 1);
        }

        //prepare avg string
        //level-1
        for (var i = 2; i < 14; i++) {

            avgString = avgString + '"s' + i + '_os": { "$avg": "$latest.s' + i + '_os" },';
            avgString = avgString + '"s' + i + '_ms": { "$avg": "$latest.s' + i + '_ms" },';
            avgString = avgString + '"s' + i + '_ps": { "$avg": "$latest.s' + i + '_ps" },';

            var labelAlp = 'a';
            var nextLabel = req.__('s' + i + labelAlp);

            //level-2
            while (nextLabel != ('s' + i + labelAlp)) {

                avgString = avgString + '"s' + i + labelAlp + '_os": { "$avg": "$latest.s' + i + labelAlp + '_os" },';
                avgString = avgString + '"s' + i + labelAlp + '_ms": { "$avg": "$latest.s' + i + labelAlp + '_ms" },';
                avgString = avgString + '"s' + i + labelAlp + '_ps": { "$avg": "$latest.s' + i + labelAlp + '_ps" },';

                var labelNum = "1";
                var nextLabel1 = req.__('s' + i + labelAlp + "_" + labelNum);

                //level-3
                while (nextLabel1 != ('s' + i + labelAlp + "_" + labelNum)) {

                    avgString = avgString + '"s' + i + labelAlp + '_' + labelNum + '_os": { "$avg": "$latest.s' + i + labelAlp + '_' + labelNum + '_os" },';
                    avgString = avgString + '"s' + i + labelAlp + '_' + labelNum + '_ms": { "$avg": "$latest.s' + i + labelAlp + '_' + labelNum + '_ms" },';
                    avgString = avgString + '"s' + i + labelAlp + '_' + labelNum + '_ps": { "$avg": "$latest.s' + i + labelAlp + '_' + labelNum + '_ps" },';

                    var labelAlp1 = "a";
                    var nextLabel2 = req.__('s' + i + labelAlp + "_" + labelNum + labelAlp1);

                    //level-4
                    while (nextLabel2 != ('s' + i + labelAlp + "_" + labelNum + labelAlp1)) {

                        avgString = avgString + '"s' + i + labelAlp + '_' + labelNum + labelAlp1 + '_os": { "$avg": "$latest.s' + i + labelAlp + '_' + labelNum + labelAlp1 + '_os" },';
                        avgString = avgString + '"s' + i + labelAlp + '_' + labelNum + labelAlp1 + '_ms": { "$avg": "$latest.s' + i + labelAlp + '_' + labelNum + labelAlp1 + '_ms" },';
                        avgString = avgString + '"s' + i + labelAlp + '_' + labelNum + labelAlp1 + '_ps": { "$avg": "$latest.s' + i + labelAlp + '_' + labelNum + labelAlp1 + '_ps" },';

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
        avgString = avgString.replace(/,\s*$/, "");
        avgString = JSON.parse('{"_id": null,' + avgString + '}');

        if (conditionString != "") {
            conditionString = "{" + conditionString + "}";
            conditionString = JSON.parse(conditionString);

            console.log("check here:");
            console.log(conditionString);


            cursor = collection.aggregate([
                { $match: { "is_deleted": false, "m_insp_completed": "Yes" } },
                { $sort: { p_insp_number: 1 } },
                {
                    $group: {
                        _id: "$_hfid",
                        inspection: { $max: "$p_insp_number" },
                        latest: { $last: "$$ROOT" }
                    }
                },
                { $project: { latest: 1 } }, { $match: conditionString }, { $group: avgString }
            ], { allowDiskUse: true });
        }

        cursor.toArray(function(err, result) {

            console.log("check result here:");
            console.log(result);


            collection.aggregate([
                { $match: { "is_deleted": false, "m_insp_completed": "Yes" } },
                { $sort: { p_insp_number: 1 } },
                {
                    $group: {
                        _id: "$_hfid",
                        latest: { $last: "$$ROOT" }
                    }
                },
                { $match: countByConditionString },
                { $project: { count: 1 } },
            ], { allowDiskUse: true }, function(error, totalResult) {


                numOfDocs = totalResult.length;
                console.log(result[0] + "  " + numOfDocs);
                callback(result[0], numOfDocs);
            });
            //}
        });
    },

    getPercentageOfFacilities: function(type, county, callback) {

        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');
        var groupColumn;


        var cur = collection.aggregate([
            { $match: { is_deleted: false, m_insp_completed: "Yes" } },
            { $group: { _id: "$_hfid", inspection: { $max: "$p_insp_number" } } }
        ]);


        cur.toArray(function(err, resultTotalDocument) {

            var totalDocument = resultTotalDocument.length;

            console.log("totalDocument");
            console.log(totalDocument);

            //decide the group by columns
            if (type == "1" && county == "All") {
                groupColumn = "$risk_c";
            } else if (type == "2" && county == "All") {
                groupColumn = { "level": "$_level", "risk": "$risk_c" };
            } else if (type == "3" && county == "All") {
                groupColumn = { "ownership": "$_ownership", "risk": "$risk_c" };
            } else if (type == "4" && county == "All") {
                groupColumn = "$risk_c";
            } else if (type == "1" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
                groupColumn = { "county": "$_county", "risk": "$risk_c" };
            } else if (type == "2" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
                groupColumn = { "level": "$_level", "county": "$_county", "risk": "$risk_c" };
            } else if (type == "3" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
                groupColumn = { "ownership": "$_ownership", "county": "$_county", "risk": "$risk_c" };
            } else if (type == "4" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
                groupColumn = { "risk": "$risk_c", "county": "$_county" };
            }

            //execute aggregate query
            var cursor = collection.aggregate([
                { $match: { is_deleted: false, "m_insp_completed": "Yes" } },
                { $sort: { p_insp_number: 1 } },
                {
                    $group: {
                        _id: "$_hfid",
                        inspection: { $max: "$p_insp_number" },
                        risk_c: { $last: '$risk_c' },
                        _level: { $last: '$_level' },
                        _ownership: { $last: '$_ownership' },
                        _county: { $last: '$_county' }
                    }
                },
                { $project: { inspection: 1, hf_id: 1, risk_c: 1, _level: 1, _ownership: 1, _county: 1 } },

                { $group: { _id: groupColumn, count: { $sum: 1 } } },
                { $project: { "count": 1, "percentage": { "$multiply": [{ "$divide": [100, totalDocument] }, "$count"] } } }
            ], { allowDiskUse: true });
            cursor.toArray(function(err, result) {
                console.log("query result");
                console.log(result);
                callback(result);
            });
        });
    },

    getPercentageOfMeanScores: function(type, county, callback) {

        var mongo = require('mongodb');
        var groupColumn;
        var collection = MongoService.getDB().collection('facility');
        var array = [];

        //decide the group by columns
        if (type == "1" && county == "All") {
            groupColumn = null;
        } else if (type == "2" && county == "All") {
            groupColumn = "$_level";
        } else if (type == "3" && county == "All") {
            groupColumn = "$_ownership";
        } else if (type == "4" && county == "All") {
            groupColumn = "$risk_c";
        } else if (type == "1" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
            groupColumn = "$_county";
        } else if (type == "2" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
            groupColumn = { "level": "$_level", "county": "$_county" };
        } else if (type == "3" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
            groupColumn = { "ownership": "$_ownership", "county": "$_county" };
        } else if (type == "4" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
            groupColumn = { "risk": "$risk_c", "county": "$_county" };
        }

        //To Do : include section 13 as well after got the data
        //execute aggregate query
        /*var cursor = collection.aggregate([{$match:{is_deleted:false,m_insp_completed:"Yes"}},
        	{ $sort : {  p_insp_number: 1 } },
        	{$group: {_id: "$_hfid", inspection: {$max: "$p_insp_number"},
        	risk_c : {$last: '$risk_c'},_level:{$last: '$_level'},_ownership:{$last: '$_ownership'},_county:{$last: '$_county'},
        	s2_ps:{$last: '$s2_ps'},s3_ps:{$last: '$s3_ps'},s4_ps:{$last: '$s4_ps'},
        	s5_ps:{$last: '$s5_ps'},s6_ps:{$last: '$s6_ps'},s7_ps:{$last: '$s7_ps'},
        	s8_ps:{$last: '$s8_ps'},s9_ps:{$last: '$s9_ps'},s10_ps:{$last: '$s10_ps'},
        	s11_ps:{$last: '$s11_ps'},s12_ps:{$last: '$s12_ps'},s13_ps:{$last: '$s13_ps'}}},
        	{$project: { inspection: 1, hf_id:1,risk_c :1,_level:1,_ownership:1,_county:1,
        		s2_ps:1,s3_ps:1,s4_ps:1,s5_ps:1,s6_ps:1,s7_ps:1,s8_ps:1,s9_ps:1,s10_ps:1,
        		s11_ps:1,s12_ps:1,s13_ps:1}},


        		{$group: {_id:groupColumn, count:{$sum:1},
        		ps : {$avg:{$avg : ["$s2_ps","$s3_ps","$s4_ps","$s5_ps","$s6_ps","$s7_ps","$s8_ps","$s9_ps",
        		"$s10_ps","$s11_ps","$s12_ps","$s13_ps"]}}}}]);*/

        var cursor = collection.aggregate([{
                $match: {
                    is_deleted: false,
                    m_insp_completed: "Yes"
                }
            },
            { $sort: { p_insp_number: 1 } },
            {
                $group: {
                    _id: "$_hfid",
                    inspection: { $max: "$p_insp_number" },
                    risk_c: { $last: '$risk_c' },
                    _level: { $last: '$_level' },
                    _ownership: { $last: '$_ownership' },
                    _county: { $last: '$_county' },
                    total_ps: { $last: '$total_ps' }
                }
            },
            { $match: { total_ps: { "$ne": null } } },
            {
                $project: {
                    inspection: 1,
                    hf_id: 1,
                    risk_c: 1,
                    _level: 1,
                    _ownership: 1,
                    _county: 1,
                    total_ps: 1
                }
            },
            {
                $group: {
                    _id: groupColumn,
                    count: { $sum: 1 },
                    ps: { $avg: "$total_ps" }
                }
            }
        ], { allowDiskUse: true });
        cursor.toArray(function(err, result) {

            callback(result);
        });
    },
    getCountBySection: function(county, callback) {

        var mongo = require('mongodb');
        var groupColumn;
        var collection = MongoService.getDB().collection('facility');
        var array = [];

        //decide the group by columns
        if (county == "All") {
            groupColumn = "$_level";
        } else if ((county == "1" || county == "2" || county == "3" || county == "By County")) {
            groupColumn = { "level": "$_level", "county": "$_county" };
        }

        var cursor = collection.aggregate([
            { $match: { is_deleted: false, m_insp_completed: "Yes" } },
            { $sort: { p_insp_number: 1 } },
            {
                $group: {
                    _id: "$_hfid",
                    inspection: { $max: "$p_insp_number" },
                    risk_c: { $last: '$risk_c' },
                    _level: { $last: '$_level' },
                    _ownership: { $last: '$_ownership' },
                    _county: { $last: '$_county' },
                    s2_ps: { $last: '$s2_ps' },
                    s3_ps: { $last: '$s3_ps' },
                    s4_ps: { $last: '$s4_ps' },
                    s5_ps: { $last: '$s5_ps' },
                    s6_ps: { $last: '$s6_ps' },
                    s7_ps: { $last: '$s7_ps' },
                    s8_ps: { $last: '$s8_ps' },
                    s9_ps: { $last: '$s9_ps' },
                    s10_ps: { $last: '$s10_ps' },
                    s11_ps: { $last: '$s11_ps' },
                    s12_ps: { $last: '$s12_ps' },
                    s13_ps: { $last: '$s13_ps' },
                    total_ps: { $last: '$total_ps' }
                }
            },
            { $match: { total_ps: { "$ne": null } } },

            {
                $project: {
                    inspection: 1,
                    hf_id: 1,
                    risk_c: 1,
                    _level: 1,
                    _ownership: 1,
                    _county: 1,
                    s2_ps: 1,
                    s3_ps: 1,
                    s4_ps: 1,
                    s5_ps: 1,
                    s6_ps: 1,
                    s7_ps: 1,
                    s8_ps: 1,
                    s9_ps: 1,
                    s10_ps: 1,
                    s11_ps: 1,
                    s12_ps: 1,
                    s13_ps: 1,
                    total_ps: 1
                }
            },

            {
                $group: {
                    _id: groupColumn,
                    "os2": { "$sum": { "$cond": [{ "$ifNull": ["$s2_ps", false] }, 1, 0] } },
                    "os3": { "$sum": { "$cond": [{ "$ifNull": ["$s3_ps", false] }, 1, 0] } },
                    "os4": { "$sum": { "$cond": [{ "$ifNull": ["$s4_ps", false] }, 1, 0] } },
                    "os5": { "$sum": { "$cond": [{ "$ifNull": ["$s5_ps", false] }, 1, 0] } },
                    "os6": { "$sum": { "$cond": [{ "$ifNull": ["$s6_ps", false] }, 1, 0] } },
                    "os7": { "$sum": { "$cond": [{ "$ifNull": ["$s7_ps", false] }, 1, 0] } },
                    "os8": { "$sum": { "$cond": [{ "$ifNull": ["$s8_ps", false] }, 1, 0] } },
                    "os9": { "$sum": { "$cond": [{ "$ifNull": ["$s9_ps", false] }, 1, 0] } },
                    "os10": { "$sum": { "$cond": [{ "$ifNull": ["$s10_ps", false] }, 1, 0] } },
                    "os11": { "$sum": { "$cond": [{ "$ifNull": ["$s11_ps", false] }, 1, 0] } },
                    "os12": { "$sum": { "$cond": [{ "$ifNull": ["$s12_ps", false] }, 1, 0] } },
                    "os13": { "$sum": { "$cond": [{ "$ifNull": ["$s13_ps", false] }, 1, 0] } },

                    "total_os": { "$sum": { "$cond": [{ "$ifNull": ["$total_ps", false] }, 1, 0] } },

                }
            },
            {
                $project: {

                    "os2": 1,
                    "os3": 1,
                    "os4": 1,
                    "os5": 1,
                    "os6": 1,
                    "os7": 1,
                    "os8": 1,
                    "os9": 1,
                    "os10": 1,
                    "os11": 1,
                    "os12": 1,
                    "os13": 1,
                    "mean_os": "$total_os",
                }
            }
        ], { allowDiskUse: true });

        cursor.toArray(function(err, result) {

            console.log("result Hereee======");
            console.log(result);

            /*if(result!=undefined){
            	var key=["os2","os3","os4","os5","os6","os7","os8","os9",
            	"os10","os11","os12","os13"];
            	for (var i = 0; i < result.length; i++) {
            		for (var k = 0; k < key.length; k++) {
            			if(result[i][key[k]]==null){
            				result[i][key[k]]=0;
            			}
            		}	
            	}
            }*/
            callback(result);
        });

    },

    getPercentageOfMeanScoresByUnit: function(type, county, callback) {

        var mongo = require('mongodb');
        var groupColumn;
        var collection = MongoService.getDB().collection('facility');
        var array = [];

        //decide the group by columns
        if (type == "1" && county == "All") {
            groupColumn = null;
        } else if (type == "2" && county == "All") {
            groupColumn = "$_level";
        } else if (type == "3" && county == "All") {
            groupColumn = "$_ownership";
        } else if (type == "4" && county == "All") {
            groupColumn = "$risk_c";
        } else if (type == "1" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
            groupColumn = "$_county";
        } else if (type == "2" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
            groupColumn = { "level": "$_level", "county": "$_county" };
        } else if (type == "3" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
            groupColumn = { "ownership": "$_ownership", "county": "$_county" };
        } else if (type == "4" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
            groupColumn = { "risk": "$risk_c", "county": "$_county" };
        }

        var cursor = collection.aggregate([
            { $match: { is_deleted: false, m_insp_completed: "Yes" } },
            { $sort: { p_insp_number: 1 } },
            {
                $group: {
                    _id: "$_hfid",
                    inspection: { $max: "$p_insp_number" },
                    risk_c: { $last: '$risk_c' },
                    _level: { $last: '$_level' },
                    _ownership: { $last: '$_ownership' },
                    _county: { $last: '$_county' },
                    s2_ps: { $last: '$s2_ps' },
                    s3_ps: { $last: '$s3_ps' },
                    s4_ps: { $last: '$s4_ps' },
                    s5_ps: { $last: '$s5_ps' },
                    s6_ps: { $last: '$s6_ps' },
                    s7_ps: { $last: '$s7_ps' },
                    s8_ps: { $last: '$s8_ps' },
                    s9_ps: { $last: '$s9_ps' },
                    s10_ps: { $last: '$s10_ps' },
                    s11_ps: { $last: '$s11_ps' },
                    s12_ps: { $last: '$s12_ps' },
                    s13_ps: { $last: '$s13_ps' },
                    total_ps: { $last: '$total_ps' }
                }
            },
            { $match: { total_ps: { "$ne": null } } },
            {
                $project: {
                    inspection: 1,
                    hf_id: 1,
                    risk_c: 1,
                    _level: 1,
                    _ownership: 1,
                    _county: 1,
                    s2_ps: 1,
                    s3_ps: 1,
                    s4_ps: 1,
                    s5_ps: 1,
                    s6_ps: 1,
                    s7_ps: 1,
                    s8_ps: 1,
                    s9_ps: 1,
                    s10_ps: 1,
                    s11_ps: 1,
                    s12_ps: 1,
                    s13_ps: 1
                }
            },
            {
                $group: {
                    _id: groupColumn,
                    count: { $sum: 1 },
                    s2_ps: { $avg: "$s2_ps" },
                    s3_ps: { $avg: "$s3_ps" },
                    s4_ps: { $avg: "$s4_ps" },
                    s5_ps: { $avg: "$s5_ps" },
                    s6_ps: { $avg: "$s6_ps" },
                    s7_ps: { $avg: "$s7_ps" },
                    s8_ps: { $avg: "$s8_ps" },
                    s9_ps: { $avg: "$s9_ps" },
                    s10_ps: { $avg: "$s10_ps" },
                    s11_ps: { $avg: "$s11_ps" },
                    s12_ps: { $avg: "$s12_ps" },
                    s13_ps: { $avg: "$s13_ps" }
                }
            }
        ], { allowDiskUse: true });
        cursor.toArray(function(err, result) {

            console.log("result Hereee======");
            console.log(result);

            /*if(result!=undefined){
            	var key=["s2_ps","s3_ps","s4_ps","s5_ps","s6_ps","s7_ps","s8_ps","s9_ps",
            	"s10_ps","s11_ps","s12_ps","s13_ps"];
            	for (var i = 0; i < result.length; i++) {
            		for (var k = 0; k < key.length; k++) {
            			if(result[i][key[k]]==null){
            				result[i][key[k]]=null;
            			}
            		}	
            	}
            }*/
            callback(result);
        });
    },


    getJHICsectionScore: function(type, county, callback) {
        var mongo = require('mongodb');
        var groupColumn;


        var collection = MongoService.getDB().collection('facility');
        var array = [];

        //decide the group by columns
        if (type == "All" && county == "All") {
            groupColumn = null;
        } else if (type == "2" && county == "All") {
            groupColumn = "$_level";
        } else if (type == "3" && county == "All") {
            groupColumn = "$_ownership";
        } else if (type == "4" && county == "All") {
            groupColumn = "$risk_c";
        } else if (type == "All" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
            groupColumn = "$_county";
        } else if (type == "2" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
            groupColumn = { "level": "$_level", "county": "$_county" };
        } else if (type == "3" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
            groupColumn = { "ownership": "$_ownership", "county": "$_county" };
        } else if (type == "4" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
            groupColumn = { "risk": "$risk_c", "county": "$_county" };
        }




        /*var cursor = collection.aggregate([
			{$match:{is_deleted:false,m_insp_completed:"Yes",total_ps:{"$exists":true}}},
			{ $sort : {  p_insp_number: 1 } },
			{$group: {_id: "$_hfid", inspection: {$max: "$p_insp_number"},
			risk_c : {$last: '$risk_c'},_level:{$last: '$_level'},_ownership:{$last: '$_ownership'},_county:{$last: '$_county'},
			s2_ps:{$last: '$s2_ps'},s3_ps:{$last: '$s3_ps'},s4_ps:{$last: '$s4_ps'},
			s5_ps:{$last: '$s5_ps'},s6_ps:{$last: '$s6_ps'},s7_ps:{$last: '$s7_ps'},
			s8_ps:{$last: '$s8_ps'},s9_ps:{$last: '$s9_ps'},s10_ps:{$last: '$s10_ps'},
			s11_ps:{$last: '$s11_ps'},s12_ps:{$last: '$s12_ps'},s13_ps:{$last: '$s13_ps'},
			total_ps:{$last: '$total_ps'},
			s2_os:{$last: '$s2_os'},s3_os:{$last: '$s3_os'},s4_os:{$last: '$s4_os'},
			s5_os:{$last: '$s0a_2a'},s6_os:{$last: '$s0a_2b'},s7_os:{$last: '$s0a_2c'},
			s8_os:{$last: '$s0a_2d'},s9_os:{$last: '$s0a_2e'},s10_os:{$last: '$s0a_2f'},
			s11_os:{$last: '$s0a_2g'},s12_os:{$last: '$s0a_2h'},s13_os:{$last: '$s0a_2i'}}},

			{$project: { inspection: 1, hf_id:1,risk_c :1,_level:1,_ownership:1,_county:1,
				s2_ps:1,s3_ps:1,s4_ps:1,s5_ps:1,s6_ps:1,s7_ps:1,s8_ps:1,s9_ps:1,s10_ps:1,
				s11_ps:1,s12_ps:1,s13_ps:1,
				s2_os:1,s3_os:1,s4_os:1,s5_os:1,s6_os:1,s7_os:1,s8_os:1,s9_os:1,s10_os:1,
				s11_os:1,s12_os:1,s13_os:1,total_ps:1
			}},

			{$group: {_id:groupColumn,"os2":{"$sum":1}, "os3":{"$sum":1},
			"os4":{"$sum":1},"os5":{"$sum":"$s5_os"},"os6":{"$sum":"$s6_os"},
			"os7":{"$sum":"$s7_os"},"os8":{"$sum":"$s8_os"},
			"os9":{"$sum":"$s9_os"},
			"os10":{"$sum":"$s10_os"},"os11":{"$sum":"$s11_os"},
			"os12":{"$sum":"$s12_os"},
			"os13":{"$sum":"$s13_os"},
			"total_ps":{"$avg": '$total_ps'},
			
			"ms2":{"$avg":"$s2_ps"}, "ms3":{"$avg":"$s3_ps"},"ms4":{"$avg":"$s4_ps"},
			"ms5":{"$avg":"$s5_ps"},"ms6":{"$avg":"$s6_ps"},"ms7":{"$avg":"$s7_ps"},
			"ms8":{"$avg":"$s8_ps"},"ms9":{"$avg":"$s9_ps"},"ms10":{"$avg":"$s10_ps"},
			"ms11":{"$avg":"$s11_ps"},"ms12":{"$avg":"$s12_ps"},"ms13":{"$avg":"$s13_ps"},
			
		}},
		{$project:{

			"os2":1, "os3":1,
			"os4":1,"os5":1,"os6":1,
			"os7":1,"os8":1,
			"os9":1,
			"os10":1,"os11":1,
			"os12":1,
			"os13":1,
			"ms2":1, "ms3":1,"ms4":1,
			"ms5":1,"ms6":1,"ms7":1,
			"ms8":1,"ms9":1,"ms10":1,
			"ms11":1,"ms12":1,"ms13":1,
			"mean_os":{"$sum":"$os2"},
			
			"mean_ms" : "$total_ps"}
	}
	]);*/
        /*"mean_os" : {$avg:{$avg : ["$os2","$os3","$os4",
        		"$os5","$os6","$os7","$os8","$os9","$os10","$os11",
        		"$os12","$os13"]}},*/

        var cursor = collection.aggregate([
            { $match: { is_deleted: false, m_insp_completed: "Yes" } },
            { $sort: { p_insp_number: 1 } },
            {
                $group: {
                    _id: "$_hfid",
                    inspection: { $max: "$p_insp_number" },
                    risk_c: { $last: '$risk_c' },
                    _level: { $last: '$_level' },
                    _ownership: { $last: '$_ownership' },
                    _county: { $last: '$_county' },
                    s2_ps: { $last: '$s2_ps' },
                    s3_ps: { $last: '$s3_ps' },
                    s4_ps: { $last: '$s4_ps' },
                    s5_ps: { $last: '$s5_ps' },
                    s6_ps: { $last: '$s6_ps' },
                    s7_ps: { $last: '$s7_ps' },
                    s8_ps: { $last: '$s8_ps' },
                    s9_ps: { $last: '$s9_ps' },
                    s10_ps: { $last: '$s10_ps' },
                    s11_ps: { $last: '$s11_ps' },
                    s12_ps: { $last: '$s12_ps' },
                    s13_ps: { $last: '$s13_ps' },
                    total_ps: { $last: '$total_ps' }
                }
            },
            {
                $project: {
                    inspection: 1,
                    hf_id: 1,
                    risk_c: 1,
                    _level: 1,
                    _ownership: 1,
                    _county: 1,
                    s2_ps: 1,
                    s3_ps: 1,
                    s4_ps: 1,
                    s5_ps: 1,
                    s6_ps: 1,
                    s7_ps: 1,
                    s8_ps: 1,
                    s9_ps: 1,
                    s10_ps: 1,
                    s11_ps: 1,
                    s12_ps: 1,
                    s13_ps: 1,
                    total_ps: 1
                }
            },
            { $match: { total_ps: { "$ne": null } } },
            {
                $group: {
                    _id: groupColumn,
                    "os2": { "$sum": { "$cond": [{ "$ifNull": ["$s2_ps", false] }, 1, 0] } },
                    "os3": { "$sum": { "$cond": [{ "$ifNull": ["$s3_ps", false] }, 1, 0] } },
                    "os4": { "$sum": { "$cond": [{ "$ifNull": ["$s4_ps", false] }, 1, 0] } },
                    "os5": { "$sum": { "$cond": [{ "$ifNull": ["$s5_ps", false] }, 1, 0] } },
                    "os6": { "$sum": { "$cond": [{ "$ifNull": ["$s6_ps", false] }, 1, 0] } },
                    "os7": { "$sum": { "$cond": [{ "$ifNull": ["$s7_ps", false] }, 1, 0] } },
                    "os8": { "$sum": { "$cond": [{ "$ifNull": ["$s8_ps", false] }, 1, 0] } },
                    "os9": { "$sum": { "$cond": [{ "$ifNull": ["$s9_ps", false] }, 1, 0] } },
                    "os10": { "$sum": { "$cond": [{ "$ifNull": ["$s10_ps", false] }, 1, 0] } },
                    "os11": { "$sum": { "$cond": [{ "$ifNull": ["$s11_ps", false] }, 1, 0] } },
                    "os12": { "$sum": { "$cond": [{ "$ifNull": ["$s12_ps", false] }, 1, 0] } },
                    "os13": { "$sum": { "$cond": [{ "$ifNull": ["$s13_ps", false] }, 1, 0] } },

                    "total_os": { "$sum": { "$cond": [{ "$ifNull": ["$total_ps", false] }, 1, 0] } },
                    "total_ps": { "$avg": '$total_ps' },
                    "ms2": { "$avg": "$s2_ps" },
                    "ms3": { "$avg": "$s3_ps" },
                    "ms4": { "$avg": "$s4_ps" },
                    "ms5": { "$avg": "$s5_ps" },
                    "ms6": { "$avg": "$s6_ps" },
                    "ms7": { "$avg": "$s7_ps" },
                    "ms8": { "$avg": "$s8_ps" },
                    "ms9": { "$avg": "$s9_ps" },
                    "ms10": { "$avg": "$s10_ps" },
                    "ms11": { "$avg": "$s11_ps" },
                    "ms12": { "$avg": "$s12_ps" },
                    "ms13": { "$avg": "$s13_ps" },

                }
            },
            {
                $project: {

                    "os2": 1,
                    "os3": 1,
                    "os4": 1,
                    "os5": 1,
                    "os6": 1,
                    "os7": 1,
                    "os8": 1,
                    "os9": 1,
                    "os10": 1,
                    "os11": 1,
                    "os12": 1,
                    "os13": 1,
                    "ms2": 1,
                    "ms3": 1,
                    "ms4": 1,
                    "ms5": 1,
                    "ms6": 1,
                    "ms7": 1,
                    "ms8": 1,
                    "ms9": 1,
                    "ms10": 1,
                    "ms11": 1,
                    "ms12": 1,
                    "ms13": 1,
                    "mean_os": "$total_os",
                    "mean_ms": "$total_ps"
                }
            }
        ], { allowDiskUse: true });
        cursor.toArray(function(err, result) {
            callback(result);
        });

    },


    getJHICsectionScoreForAll: function(type, county, callback) {

        var mongo = require('mongodb');
        var groupColumn;
        var index;
        var tmp = [];
        if (type == "All" && county == "By County") {
            groupColumn = null;
        } else if (type == "2" && county == "All") {
            groupColumn = null;

        } else if (type == "3" && county == "All") {
            groupColumn = null;

        } else if (type == "2" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
            groupColumn = "$_county";
        } else if (type == "3" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
            groupColumn = "$_county";
        }


        var collection = MongoService.getDB().collection('facility');

        /*var cursor = collection.aggregate([
				{$match:{is_deleted:false,m_insp_completed:"Yes",total_ps:{"$exists":true}}},
				{ $sort : {  p_insp_number: 1 } },
				{$group: {_id: "$_hfid", inspection: {$max: "$p_insp_number"},
				risk_c : {$last: '$risk_c'},_level:{$last: '$_level'},_ownership:{$last: '$_ownership'},_county:{$last: '$_county'},
				s2_ps:{$last: '$s2_ps'},s3_ps:{$last: '$s3_ps'},s4_ps:{$last: '$s4_ps'},
				s5_ps:{$last: '$s5_ps'},s6_ps:{$last: '$s6_ps'},s7_ps:{$last: '$s7_ps'},
				s8_ps:{$last: '$s8_ps'},s9_ps:{$last: '$s9_ps'},s10_ps:{$last: '$s10_ps'},
				s11_ps:{$last: '$s11_ps'},s12_ps:{$last: '$s12_ps'},s13_ps:{$last: '$s13_ps'},
				total_ps:{$last: '$total_ps'},
				s2_os:{$last: '$s2_os'},s3_os:{$last: '$s3_os'},s4_os:{$last: '$s4_os'},
				s5_os:{$last: '$s0a_2a'},s6_os:{$last: '$s0a_2b'},s7_os:{$last: '$s0a_2c'},
				s8_os:{$last: '$s0a_2d'},s9_os:{$last: '$s0a_2e'},s10_os:{$last: '$s0a_2f'},
				s11_os:{$last: '$s0a_2g'},s12_os:{$last: '$s0a_2h'},s13_os:{$last: '$s0a_2i'}}},



				{$project: { inspection: 1, hf_id:1,risk_c :1,_level:1,_ownership:1,_county:1,
					s2_ps:1,s3_ps:1,s4_ps:1,s5_ps:1,s6_ps:1,s7_ps:1,s8_ps:1,s9_ps:1,s10_ps:1,
					s11_ps:1,s12_ps:1,s13_ps:1,
					s2_os:1,s3_os:1,s4_os:1,s5_os:1,s6_os:1,s7_os:1,s8_os:1,s9_os:1,s10_os:1,
					s11_os:1,s12_os:1,s13_os:1,total_ps:1
				}},

				{$group: {_id:groupColumn,"os2":{"$sum":1}, "os3":{"$sum":1},
				"os4":{"$sum":1},"os5":{"$sum":"$s5_os"},"os6":{"$sum":"$s6_os"},
				"os7":{"$sum":"$s7_os"},"os8":{"$sum":"$s8_os"},
				"os9":{"$sum":"$s9_os"},
				"os10":{"$sum":"$s10_os"},"os11":{"$sum":"$s11_os"},
				"os12":{"$sum":"$s12_os"},
				"os13":{"$sum":"$s13_os"},
				"total_ps":{"$avg": '$total_ps'},
				"ms2":{"$avg":"$s2_ps"}, "ms3":{"$avg":"$s3_ps"},"ms4":{"$avg":"$s4_ps"},
				"ms5":{"$avg":"$s5_ps"},"ms6":{"$avg":"$s6_ps"},"ms7":{"$avg":"$s7_ps"},
				"ms8":{"$avg":"$s8_ps"},"ms9":{"$avg":"$s9_ps"},"ms10":{"$avg":"$s10_ps"},
				"ms11":{"$avg":"$s11_ps"},"ms12":{"$avg":"$s12_ps"},"ms13":{"$avg":"$s13_ps"},

			}},
			{$project:{

				"os2":1, "os3":1,
				"os4":1,"os5":1,"os6":1,
				"os7":1,"os8":1,
				"os9":1,
				"os10":1,"os11":1,
				"os12":1,
				"os13":1,
				"ms2":1, "ms3":1,"ms4":1,
				"ms5":1,"ms6":1,"ms7":1,
				"ms8":1,"ms9":1,"ms10":1,
				"ms11":1,"ms12":1,"ms13":1,
				"mean_os":{"$sum":"$os2"},
				"mean_ms" : "$total_ps"}
		}
		]);
		*/

        var cursor = collection.aggregate([
            { $match: { is_deleted: false, m_insp_completed: "Yes" } },
            { $sort: { p_insp_number: 1 } },
            {
                $group: {
                    _id: "$_hfid",
                    inspection: { $max: "$p_insp_number" },
                    risk_c: { $last: '$risk_c' },
                    _level: { $last: '$_level' },
                    _ownership: { $last: '$_ownership' },
                    _county: { $last: '$_county' },
                    s2_ps: { $last: '$s2_ps' },
                    s3_ps: { $last: '$s3_ps' },
                    s4_ps: { $last: '$s4_ps' },
                    s5_ps: { $last: '$s5_ps' },
                    s6_ps: { $last: '$s6_ps' },
                    s7_ps: { $last: '$s7_ps' },
                    s8_ps: { $last: '$s8_ps' },
                    s9_ps: { $last: '$s9_ps' },
                    s10_ps: { $last: '$s10_ps' },
                    s11_ps: { $last: '$s11_ps' },
                    s12_ps: { $last: '$s12_ps' },
                    s13_ps: { $last: '$s13_ps' },
                    total_ps: { $last: '$total_ps' }
                }
            },
            { $match: { total_ps: { "$ne": null } } },

            {
                $project: {
                    inspection: 1,
                    hf_id: 1,
                    risk_c: 1,
                    _level: 1,
                    _ownership: 1,
                    _county: 1,
                    s2_ps: 1,
                    s3_ps: 1,
                    s4_ps: 1,
                    s5_ps: 1,
                    s6_ps: 1,
                    s7_ps: 1,
                    s8_ps: 1,
                    s9_ps: 1,
                    s10_ps: 1,
                    s11_ps: 1,
                    s12_ps: 1,
                    s13_ps: 1,
                    total_ps: 1
                }
            },

            {
                $group: {
                    _id: groupColumn,
                    "os2": { "$sum": { "$cond": [{ "$ifNull": ["$s2_ps", false] }, 1, 0] } },
                    "os3": { "$sum": { "$cond": [{ "$ifNull": ["$s3_ps", false] }, 1, 0] } },
                    "os4": { "$sum": { "$cond": [{ "$ifNull": ["$s4_ps", false] }, 1, 0] } },
                    "os5": { "$sum": { "$cond": [{ "$ifNull": ["$s5_ps", false] }, 1, 0] } },
                    "os6": { "$sum": { "$cond": [{ "$ifNull": ["$s6_ps", false] }, 1, 0] } },
                    "os7": { "$sum": { "$cond": [{ "$ifNull": ["$s7_ps", false] }, 1, 0] } },
                    "os8": { "$sum": { "$cond": [{ "$ifNull": ["$s8_ps", false] }, 1, 0] } },
                    "os9": { "$sum": { "$cond": [{ "$ifNull": ["$s9_ps", false] }, 1, 0] } },
                    "os10": { "$sum": { "$cond": [{ "$ifNull": ["$s10_ps", false] }, 1, 0] } },
                    "os11": { "$sum": { "$cond": [{ "$ifNull": ["$s11_ps", false] }, 1, 0] } },
                    "os12": { "$sum": { "$cond": [{ "$ifNull": ["$s12_ps", false] }, 1, 0] } },
                    "os13": { "$sum": { "$cond": [{ "$ifNull": ["$s13_ps", false] }, 1, 0] } },

                    "total_os": { "$sum": { "$cond": [{ "$ifNull": ["$total_ps", false] }, 1, 0] } },
                    "total_ps": { "$avg": '$total_ps' },
                    "ms2": { "$avg": "$s2_ps" },
                    "ms3": { "$avg": "$s3_ps" },
                    "ms4": { "$avg": "$s4_ps" },
                    "ms5": { "$avg": "$s5_ps" },
                    "ms6": { "$avg": "$s6_ps" },
                    "ms7": { "$avg": "$s7_ps" },
                    "ms8": { "$avg": "$s8_ps" },
                    "ms9": { "$avg": "$s9_ps" },
                    "ms10": { "$avg": "$s10_ps" },
                    "ms11": { "$avg": "$s11_ps" },
                    "ms12": { "$avg": "$s12_ps" },
                    "ms13": { "$avg": "$s13_ps" },

                }
            },
            {
                $project: {

                    "os2": 1,
                    "os3": 1,
                    "os4": 1,
                    "os5": 1,
                    "os6": 1,
                    "os7": 1,
                    "os8": 1,
                    "os9": 1,
                    "os10": 1,
                    "os11": 1,
                    "os12": 1,
                    "os13": 1,
                    "ms2": 1,
                    "ms3": 1,
                    "ms4": 1,
                    "ms5": 1,
                    "ms6": 1,
                    "ms7": 1,
                    "ms8": 1,
                    "ms9": 1,
                    "ms10": 1,
                    "ms11": 1,
                    "ms12": 1,
                    "ms13": 1,
                    "mean_os": "$total_os",
                    /*"mean_os" : {$avg:{$avg : ["$os2","$os3","$os4",
                    "$os5","$os6","$os7","$os8","$os9","$os10","$os11",
                    "$os12","$os13"]}},*/
                    "mean_ms": "$total_ps"
                }
            }
        ], { allowDiskUse: true });

        cursor.toArray(function(err, result) {


            if (county != "By County" && county != "All") {
                //if(result.length!=1){
                for (var i = 0; i < result.length; i++) {
                    if (result[i]._id == CountyService.getCounty(county)) {

                        tmp.push(result[i]);

                    }

                }


                callback(tmp);
                /*}else{
                	callback(result);
                }*/
            } else {

                callback(result);

            }
        });





    },



    prepareTabledata: function(req, index1, index2, index3, index4, result, resp, index, callback) {

        console.log("here resp");
        console.log(result);
        console.log("index");
        console.log(index);

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

            resp["index"] = indexArr;
            index = "index";
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

            result["index1"] = index1Arr;
            index1 = "index1";
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

            result["index2"] = index2Arr;
            index2 = "index2";
        }
        /*if(index3==undefined){
        	var index3Arr={os2:"N/A",ms2:"N/A",os3:"N/A",ms3:"N/A",os4:"N/A",ms4:"N/A",os5:"N/A",ms5:"N/A",
        	os6:"N/A",ms6:"N/A",os7:"N/A",ms7:"N/A",os8:"N/A",ms8:"N/A",os9:"N/A",ms9:"N/A",os10:"N/A",ms10:"N/A",os11:"N/A",ms11:"N/A",os12:"N/A",ms12:"N/A",os13:"N/A",ms13:"N/A",mean_os:"N/A",mean_ms:"N/A",}

        	result["index3"]=index3Arr;
        	index3="index3";
        }
        if(index4==undefined){
        	var index4Arr={os2:"N/A",ms2:"N/A",os3:"N/A",ms3:"N/A",os4:"N/A",ms4:"N/A",os5:"N/A",ms5:"N/A",
        	os6:"N/A",ms6:"N/A",os7:"N/A",ms7:"N/A",os8:"N/A",ms8:"N/A",os9:"N/A",ms9:"N/A",os10:"N/A",ms10:"N/A",os11:"N/A",ms11:"N/A",os12:"N/A",ms12:"N/A",os13:"N/A",ms13:"N/A",mean_os:"N/A",mean_ms:"N/A",}

        	result["index4"]=index4Arr;
        	index4="index4";
        }*/
        console.log("flow1");
        result["index4_5"] = {};
        if (index3 != undefined && index4 != undefined) {
            console.log("flow1============");
            console.log(result[index3]);
            console.log(result[index4]);

            for (var i = 2; i <= 13; i++) {
                if (result[index3]["os" + i] != null && result[index4]["os" + i] != null) {

                    result["index4_5"]["os" + i] = (result[index3]["os" + i] + result[index4]["os" + i]);
                    result["index4_5"]["ms" + i] = ((result[index3]["ms" + i] * result[index3]["os" + i]) + (result[index4]["ms" + i] * result[index4]["os" + i])) / result["index4_5"]["os" + i];
                } else if (result[index3]["os" + i] == null && result[index4]["os" + i] == null) {

                    result["index4_5"]["os" + i] = "N/A";
                    result["index4_5"]["ms" + i] = "N/A";

                } else if (result[index4]["os" + i] == null) {
                    result["index4_5"]["os" + i] = result[index3]["os" + i];
                    result["index4_5"]["ms" + i] = result[index3]["ms" + i];
                } else if (result[index3][key] == null) {
                    result["index4_5"]["os" + i] = result[index4]["os" + i];
                    result["index4_5"]["ms" + i] = result[index4]["ms" + i];
                }
            }
            if (result[index3]["mean_os"] != null && result[index4]["mean_os"] != null) {

                result["index4_5"]["mean_os"] = (result[index3]["mean_os"] + result[index4]["mean_os"]);
                result["index4_5"]["mean_ms"] = ((result[index3]["mean_ms"] * result[index3]["mean_os"]) + (result[index4]["mean_ms"] * result[index4]["mean_os"])) / result["index4_5"]["mean_os"];
            } else if (result[index3]["mean_os"] == null && result[index4]["mean_os"] == null) {

                result["index4_5"]["mean_os"] = "N/A";
                result["index4_5"][
                    ["mean_ms"]
                ] = "N/A";

            } else if (result[index4]["mean_os"] == null) {
                result["index4_5"]["mean_os"] = result[index3]["mean_os"];
                result["index4_5"][
                    ["mean_ms"]
                ] = result[index3][
                    ["mean_ms"]
                ];
            } else if (result[index3][key] == null) {
                result["index4_5"]["mean_os"] = result[index4]["mean_os"];
                result["index4_5"][
                    ["mean_ms"]
                ] = result[index4][
                    ["mean_ms"]
                ];
            }

            /*for (var key in result[index3]) {
            	console.log(key);
            	if(result[index3][key]!=null && result[index4][key]!=null){

            		result["index4_5"][key]= (result[index3][key] + result[index4][key])/2;

            	}else if(result[index3][key]==null && result[index4][key]==null){

            		result["index4_5"][key]= "N/A";

            	}else if(result[index4][key]==null){
            		result["index4_5"][key]= result[index3][key]; 
            	}else if(result[index3][key]==null){
            		result["index4_5"][key]= result[index4][key]; 
            	}

            }*/
            index3 = "index4_5";

        } else if (index4 == undefined && index3 == undefined) {
            result["index4_5"] = {
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

            index3 = "index4_5";
        } else if (index3 == undefined) {
            index3 = index4;
        }

        var headerData = [];
        var summaryData = [];
        var subHeaderData = [];
        var footData = [];

        headerData.push({ title: "All" });
        headerData.push({ title: "Level 2" });
        headerData.push({ title: "Level 3" });
        headerData.push({ title: "Level 4 & 5" });
        //headerData.push({title: "Level 5"});

        console.log("merge level 4 and 5===========" + index3);
        console.log(result[index3]);

        subHeaderData.push({ title: "Observations" }, { title: "Mean" }, { title: "Observations" }, { title: "Mean" }, { title: "Observations" }, { title: "Mean" }, { title: "Observations" }, { title: "Mean" });

        summaryData.push(
            [req.__("s2"), String(resp[index].os2), String(resp[index].ms2) + "%", String(result[index1].os2), String(result[index1].ms2) + "%", String(result[index2].os2), String(result[index2].ms2) + "%", String(result[index3].os2), String(result[index3].ms2) + "%"],

            [req.__("s3"), String(resp[index].os3), String(resp[index].ms3) + "%", String(result[index1].os3), String(result[index1].ms3) + "%", String(result[index2].os3), String(result[index2].ms3) + "%", String(result[index3].os3), String(result[index3].ms3) + "%"],

            [req.__("s4"), String(resp[index].os4), String(resp[index].ms4) + "%", String(result[index1].os4), String(result[index1].ms4) + "%", String(result[index2].os4), String(result[index2].ms4) + "%", String(result[index3].os4), String(result[index3].ms4) + "%"],

            [req.__("s5"), String(resp[index].os5), String(resp[index].ms5) + "%", String(result[index1].os5), String(result[index1].ms5) + "%", String(result[index2].os5), String(result[index2].ms5) + "%", String(result[index3].os5), String(result[index3].ms5) + "%"],

            [req.__("s6"), String(resp[index].os6), String(resp[index].ms6) + "%", String(result[index1].os6), String(result[index1].ms6) + "%", String(result[index2].os6), String(result[index2].ms6) + "%", String(result[index3].os6), String(result[index3].ms6) + "%"],

            [req.__("s7"), String(resp[index].os7), String(resp[index].ms7) + "%", String(result[index1].os7), String(result[index1].ms7) + "%", String(result[index2].os7), String(result[index2].ms7) + "%", String(result[index3].os7), String(result[index3].ms7) + "%"],

            [req.__("s8"), String(resp[index].os8), String(resp[index].ms8) + "%", String(result[index1].os8), String(result[index1].ms8) + "%", String(result[index2].os8), String(result[index2].ms8) + "%", String(result[index3].os8), String(result[index3].ms8) + "%"],

            [req.__("s9"), String(resp[index].os9), String(resp[index].ms9) + "%", String(result[index1].os9), String(result[index1].ms9) + "%", String(result[index2].os9), String(result[index2].ms9) + "%", String(result[index3].os9), String(result[index3].ms9) + "%"],

            [req.__("s10"), String(resp[index].os10), String(resp[index].ms10) + "%", String(result[index1].os10), String(result[index1].ms10) + "%", String(result[index2].os10), String(result[index2].ms10) + "%", String(result[index3].os10), String(result[index3].ms10) + "%"],

            [req.__("s11"), String(resp[index].os11), String(resp[index].ms11) + "%", String(result[index1].os11), String(result[index1].ms11) + "%", String(result[index2].os11), String(result[index2].ms11) + "%", String(result[index3].os11), String(result[index3].ms11) + "%"],

            [req.__("s12"), String(resp[index].os12), String(resp[index].ms12) + "%", String(result[index1].os12), String(result[index1].ms12) + "%", String(result[index2].os12), String(result[index2].ms12) + "%", String(result[index3].os12), String(result[index3].ms12) + "%"],

            [req.__("s13"), String(resp[index].os13), String(resp[index].ms13) + "%", String(result[index1].os13), String(result[index1].ms13) + "%", String(result[index2].os13), String(result[index2].ms13) + "%", String(result[index3].os13), String(result[index3].ms13) + "%"]);

        footData.push({ score: String(resp[index].mean_os) }, { score: "" + String(resp[index].mean_ms) + "%" }, { score: String(result[index1].mean_os) }, { score: "" + String(result[index1].mean_ms) + "%" },

            { score: String(result[index2].mean_os) }, { score: "" + String(result[index2].mean_ms) + "%" }, { score: String(result[index3].mean_os) }, { score: "" + String(result[index3].mean_ms) + "%" });

        var tmp = {
            headerData: headerData,
            subHeaderData: subHeaderData,
            summaryData: summaryData,
            footData: footData
        };
        callback(tmp);
    },

    prepareTableDataByOwnerShip: function(req, index1, index2, result, resp, index, callback) {


        console.log("indexxxxxx");
        console.log(index);



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

            resp["index"] = indexArr;
            index = "index";
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

            result["index1"] = index1Arr;
            index1 = "index1";
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

            result["index2"] = index2Arr;
            index2 = "index2";
        }

        var headerData = [];
        var summaryData = [];
        var subHeaderData = [];
        var footData = [];

        headerData.push({ title: "All" });
        headerData.push({ title: "Public" });
        headerData.push({ title: "Private" });

        subHeaderData.push({ title: "Observations" }, { title: "Mean" }, { title: "Observations" }, { title: "Mean" }, { title: "Observations" }, { title: "Mean" });

        summaryData.push(
            [req.__("s2"), String(resp[index].os2), String(resp[index].ms2) + "%", String(result[index1].os2), String(result[index1].ms2) + "%", String(result[index2].os2), String(result[index2].ms2) + "%"],

            [req.__("s3"), String(resp[index].os3), String(resp[index].ms3) + "%", String(result[index1].os3), String(result[index1].ms3) + "%", String(result[index2].os3), String(result[index2].ms3) + "%"],

            [req.__("s4"), String(resp[index].os4), String(resp[index].ms4) + "%", String(result[index1].os4), String(result[index1].ms4) + "%", String(result[index2].os4), String(result[index2].ms4) + "%"],

            [req.__("s5"), String(resp[index].os5), String(resp[index].ms5) + "%", String(result[index1].os5), String(result[index1].ms5) + "%", String(result[index2].os5), String(result[index2].ms5) + "%"],

            [req.__("s6"), String(resp[index].os6), String(resp[index].ms6) + "%", String(result[index1].os6), String(result[index1].ms6) + "%", String(result[index2].os6), String(result[index2].ms6) + "%"],

            [req.__("s7"), String(resp[index].os7), String(resp[index].ms7) + "%", String(result[index1].os7), String(result[index1].ms7) + "%", String(result[index2].os7), String(result[index2].ms7) + "%"],

            [req.__("s8"), String(resp[index].os8), String(resp[index].ms8) + "%", String(result[index1].os8), String(result[index1].ms8) + "%", String(result[index2].os8), String(result[index2].ms8) + "%"],

            [req.__("s9"), String(resp[index].os9), String(resp[index].ms9) + "%", String(result[index1].os9), String(result[index1].ms9) + "%", String(result[index2].os9), String(result[index2].ms9) + "%"],

            [req.__("s10"), String(resp[index].os10), String(resp[index].ms10) + "%", String(result[index1].os10), String(result[index1].ms10) + "%", String(result[index2].os10), String(result[index2].ms10) + "%"],

            [req.__("s11"), String(resp[index].os11), String(resp[index].ms11) + "%", String(result[index1].os11), String(result[index1].ms11) + "%", String(result[index2].os11), String(result[index2].ms11) + "%"],

            [req.__("s12"), String(resp[index].os12), String(resp[index].ms12) + "%", String(result[index1].os12), String(result[index1].ms12) + "%", String(result[index2].os12), String(result[index2].ms12) + "%"],

            [req.__("s13"), String(resp[index].os13), String(resp[index].ms13) + "%", String(result[index1].os13), String(result[index1].ms13) + "%", String(result[index2].os13), String(result[index2].ms13) + "%"]);

        footData.push({ score: String(resp[index].mean_os) }, { score: "" + String(resp[index].mean_ms) + "%" }, { score: String(result[index1].mean_os) }, { score: "" + String(result[index1].mean_ms) + "%" },

            { score: String(result[index2].mean_os) }, { score: "" + String(result[index2].mean_ms) + "%" });

        var tmp = {
            headerData: headerData,
            subHeaderData: subHeaderData,
            summaryData: summaryData,
            footData: footData
        };
        callback(tmp);
    },





    formatDataForFigure: function(county, result, callback) {

        console.log("start formatDataForFigure ");

        console.log(result);

        var dataArray = [];
        var finalResult = "";


        function getPercByLevelByCountyByRisk(level, risk, county) {
            for (i in result) {
                if (level == result[i]._id.level && risk == result[i]._id.risk &&
                    county == result[i]._id.county) {
                    var data = { y: result[i].percentage, count: result[i].count };
                    return data;
                }
            }
            return { y: 0, count: 0 };
        };

        var level20 = getPercByLevelByCountyByRisk("Level 2", 'Non-Compliant', CountyService.getCounty(county));
        var level30 = getPercByLevelByCountyByRisk("Level 3", 'Non-Compliant', CountyService.getCounty(county));
        var level40 = getPercByLevelByCountyByRisk("Level 4", 'Non-Compliant', CountyService.getCounty(county));
        var level50 = getPercByLevelByCountyByRisk("Level 5", 'Non-Compliant', CountyService.getCounty(county));

        /*var total0 = parseFloat(level20.y)+level30.y+level40.y+level50.y;

        if(total0!=0){
        	level20.y = (100*parseFloat(level20.y))/total0;
        	level30.y = (100*level30.y)/total0;
        	level40.y = (100*level40.y)/total0;
        	level50.y = (100*level50.y)/total0;
        }*/

        var level21 = getPercByLevelByCountyByRisk("Level 2", 'Minimally Compliant', CountyService.getCounty(county));
        var level31 = getPercByLevelByCountyByRisk("Level 3", 'Minimally Compliant', CountyService.getCounty(county));
        var level41 = getPercByLevelByCountyByRisk("Level 4", 'Minimally Compliant', CountyService.getCounty(county));
        var level51 = getPercByLevelByCountyByRisk("Level 5", 'Minimally Compliant', CountyService.getCounty(county));



        /*var total1 = level21.y+level31.y+level41.y+level51.y;
        if(total1!=0){
        	level21.y = (100*level21.y)/total1;
        	level31.y = (100*level31.y)/total1;
        	level41.y = (100*level41.y)/total1;
        	level51.y = (100*level51.y)/total1;
        }*/




        var level22 = getPercByLevelByCountyByRisk("Level 2", 'Partially Compliant', CountyService.getCounty(county));
        var level32 = getPercByLevelByCountyByRisk("Level 3", 'Partially Compliant', CountyService.getCounty(county));
        var level42 = getPercByLevelByCountyByRisk("Level 4", 'Partially Compliant', CountyService.getCounty(county));
        var level52 = getPercByLevelByCountyByRisk("Level 5", 'Partially Compliant', CountyService.getCounty(county));
        /*var total2 = level22.y+level32.y+level42.y+level52.y;
        if(total2!=0){
        	level22.y = (100*level22.y)/total2;
        	level32.y = (100*level32.y)/total2;
        	level42.y = (100*level42.y)/total2;
        	level52.y = (100*level52.y)/total2;
        }*/



        var level23 = getPercByLevelByCountyByRisk("Level 2", 'Substantially Compliant', CountyService.getCounty(county));
        var level33 = getPercByLevelByCountyByRisk("Level 3", 'Substantially Compliant', CountyService.getCounty(county));
        var level43 = getPercByLevelByCountyByRisk("Level 4", 'Substantially Compliant', CountyService.getCounty(county));
        var level53 = getPercByLevelByCountyByRisk("Level 5", 'Substantially Compliant', CountyService.getCounty(county));
        /*var total3 = level23.y+level33.y+level43.y+level53.y;

        if(total3!=0){
        	level23.y = (100*level23.y)/total3;
        	level33.y = (100*level33.y)/total3;
        	level43.y = (100*level43.y)/total3;
        	level53.y = (100*level53.y)/total3;

        }*/


        var level24 = getPercByLevelByCountyByRisk("Level 2", 'Fully Compliant', CountyService.getCounty(county));
        var level34 = getPercByLevelByCountyByRisk("Level 3", 'Fully Compliant', CountyService.getCounty(county));
        var level44 = getPercByLevelByCountyByRisk("Level 4", 'Fully Compliant', CountyService.getCounty(county));
        var level54 = getPercByLevelByCountyByRisk("Level 5", 'Fully Compliant', CountyService.getCounty(county));
        /*var total4 = level24.y+level34.y+level44.y+level54.y;

	

        if(total4!=0){
        	level24.y = (100*level24.y)/total4;
        	level34.y = (100*level34.y)/total4;
        	level44.y = (100*level44.y)/total4;
        	level54.y = (100*level54.y)/total4;
        }*/




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

        console.log(level20);
        var tmp = [];
        tmp.push(level20);
        tmp.push(level21);
        tmp.push(level22);
        tmp.push(level23);
        tmp.push(level24);

        finalResult = finalResult + '"level2" :' + tmp;


        finalResult = finalResult.replace(/NaN/g, "0");



        finalResult = finalResult.replace(/,\s*$/, "");
        finalResult = "{" + finalResult + "}";
        console.log("jay finalResult");
        var stringify = JSON.stringify(finalResult)

        finalResult = JSON.parse(stringify);

        console.log("formatDataForFigure");
        console.log(finalResult["level2"]);

        /*var  level2=[level20,level21,level22,level23,level24];
        var  level3=[level30,level31,level32,level33,level34];
        var  level4=[level40,level41,level42,level43,level44];
        var  level5=[level50,level51,level52,level53,level54];*/

        var c1 = [level20, level30, level40_50];
        var c2 = [level21, level31, level41_51];
        var c3 = [level22, level32, level42_52];
        var c4 = [level23, level33, level43_53];
        var c5 = [level24, level34, level44_54];

        callback(c1, c2, c3, c4, c5);
    },



    formatDataForFigureByOwnership: function(county, result, callback) {

        var finalResult = "";

        function getPercByOwnershipByCountyByRisk(ownership, risk, county) {
            for (i in result) {
                if (ownership == result[i]._id.ownership && risk == result[i]._id.risk &&
                    county == result[i]._id.county) {
                    var data = { y: result[i].percentage, count: result[i].count };
                    return data;
                }
            }
            return { y: 0, count: 0 };
        };

        var public0 = getPercByOwnershipByCountyByRisk("Public", 'Non-Compliant', CountyService.getCounty(county));
        var private0 = getPercByOwnershipByCountyByRisk("Private", 'Non-Compliant', CountyService.getCounty(county));



        var public1 = getPercByOwnershipByCountyByRisk("Public", 'Minimally Compliant', CountyService.getCounty(county));
        var private1 = getPercByOwnershipByCountyByRisk("Private", 'Minimally Compliant', CountyService.getCounty(county));



        var public2 = getPercByOwnershipByCountyByRisk("Public", "Partially Compliant", CountyService.getCounty(county));
        var private2 = getPercByOwnershipByCountyByRisk("Private", "Partially Compliant", CountyService.getCounty(county));



        var public3 = getPercByOwnershipByCountyByRisk("Public", "Substantially Compliant", CountyService.getCounty(county));
        var private3 = getPercByOwnershipByCountyByRisk("Private", "Substantially Compliant", CountyService.getCounty(county));


        var public4 = getPercByOwnershipByCountyByRisk("Public", "Fully Compliant", CountyService.getCounty(county));
        var private4 = getPercByOwnershipByCountyByRisk("Private", "Fully Compliant", CountyService.getCounty(county));


        var total0 = public0.y + public1.y + public2.y + public3.y + public4.y;

        if (total0 != 0) {
            public0.y = (100 * public0.y) / total0;
            public1.y = (100 * public1.y) / total0;
            public2.y = (100 * public2.y) / total0;
            public3.y = (100 * public3.y) / total0;
            public4.y = (100 * public4.y) / total0;
        }



        var total1 = private0.y + private1.y + private2.y + private3.y + private4.y;

        if (total1 != 0) {
            private0.y = (100 * private0.y) / total1;
            private1.y = (100 * private1.y) / total1;
            private2.y = (100 * private2.y) / total1;
            private3.y = (100 * private3.y) / total1;
            private4.y = (100 * private4.y) / total1;
        }

        var c1 = [public0, private0];
        var c2 = [public1, private1];
        var c3 = [public2, private2];
        var c4 = [public3, private3];
        var c5 = [public4, private4];

        callback(c1, c2, c3, c4, c5);


    },

    meanScoreByUnitByCountyFormatData: function(result, county, callback) {

        var dataArrayLevel2, dataArrayLevel3, dataArrayLevel4, dataArrayLevel5 = [];
        var dataLevel4 = [];
        var countLevel4 = 0;
        var dataLevel5 = [];
        var countLevel5 = 0;
        var seriesArray = [];
        var Level4Facility = [];
        var Level5Facility = [];

        console.log("inside meanScoreByUnitByCountyFormatData");
        console.log(county);

        InspectionDataService.getCountBySection(county, function(countBySection) {
            console.log(county);
            console.log("countBySection here...........");
            console.log(countBySection);
            for (var i = 0; i < countBySection.length; i++) {

                if (countBySection[i]._id.level == "Level 4") {

                    Level4Facility = [countBySection[i].os2, countBySection[i].os3,
                        countBySection[i].os4, countBySection[i].os5, countBySection[i].os6, countBySection[i].os7,
                        countBySection[i].os8, countBySection[i].os9, countBySection[i].os10, countBySection[i].os11,
                        countBySection[i].os12, countBySection[i].os13
                    ];
                }

                if (countBySection[i]._id.level == "Level 5") {

                    Level5Facility = [countBySection[i].os2, countBySection[i].os3,
                        countBySection[i].os4, countBySection[i].os5, countBySection[i].os6, countBySection[i].os7,
                        countBySection[i].os8, countBySection[i].os9, countBySection[i].os10, countBySection[i].os11,
                        countBySection[i].os12, countBySection[i].os13
                    ];
                }
            }
            for (var i = 0; i < result.length; i++) {

                if (result[i]._id.county == CountyService.getCounty(county)) {
                    if (result[i]._id.level == "Level 2") {
                        dataArrayLevel2 = [{
                            name: "Level 2 (N=" + result[i].count + ")",
                            data: [result[i].s2_ps, result[i].s3_ps,
                                result[i].s4_ps, result[i].s5_ps, result[i].s6_ps, result[i].s7_ps,
                                result[i].s8_ps, result[i].s9_ps, result[i].s10_ps, result[i].s11_ps,
                                result[i].s12_ps, result[i].s13_ps
                            ],
                            color: 'rgba(49, 112, 143,1)'
                        }];
                    }
                    if (result[i]._id.level == "Level 3") {
                        dataArrayLevel3 = [{
                            name: "Level 3 (N=" + result[i].count + ")",
                            data: [result[i].s2_ps, result[i].s3_ps,
                                result[i].s4_ps, result[i].s5_ps, result[i].s6_ps, result[i].s7_ps,
                                result[i].s8_ps, result[i].s9_ps, result[i].s10_ps, result[i].s11_ps,
                                result[i].s12_ps, result[i].s13_ps
                            ],
                            color: 'rgba(49, 112, 143,1)'
                        }];
                    }
                    if (result[i]._id.level == "Level 4") {
                        countLevel4 = result[i].count;
                        dataLevel4 = [result[i].s2_ps, result[i].s3_ps,
                            result[i].s4_ps, result[i].s5_ps, result[i].s6_ps, result[i].s7_ps,
                            result[i].s8_ps, result[i].s9_ps, result[i].s10_ps, result[i].s11_ps,
                            result[i].s12_ps, result[i].s13_ps
                        ];
                    }

                    if (result[i]._id.level == "Level 5") {
                        countLevel5 = result[i].count;
                        dataLevel5 = [result[i].s2_ps, result[i].s3_ps,
                            result[i].s4_ps, result[i].s5_ps, result[i].s6_ps, result[i].s7_ps,
                            result[i].s8_ps, result[i].s9_ps, result[i].s10_ps, result[i].s11_ps,
                            result[i].s12_ps, result[i].s13_ps
                        ];
                    }
                }
            }
            var dataLevel4_5 = [];

            var countLevel4_5 = 0;
            console.log("dataLevel");
            console.log(dataLevel4);
            console.log(dataLevel5);
            if (dataLevel4.length == 0 && dataLevel5.length == 0) {
                countLevel4_5 = 0;
                dataLevel4_5 = [];
                countLevel4_5 = 0;
            } else if (dataLevel4.length == 0) {
                countLevel4_5 = countLevel5;
                dataLevel4_5 = dataLevel5;
            } else if (dataLevel5.length == 0) {
                countLevel4_5 = countLevel4;
                dataLevel4_5 = dataLevel4;
            } else {
                console.log(Level4Facility);
                countLevel4_5 = countLevel4 + countLevel5;
                for (var i = 0; i < dataLevel4.length; i++) {
                    console.log("Avg here......." + Level4Facility[i]);
                    var totalFacility = Level4Facility[i] + Level5Facility[i];
                    if (totalFacility != 0) {
                        dataLevel4_5[i] = ((dataLevel4[i] * Level4Facility[i] + dataLevel5[i] * Level5Facility[i]) / totalFacility);
                        console.log(dataLevel4_5[i]);
                    }
                }
                console.log(dataLevel4_5);
            }

            if (dataArrayLevel2 == undefined) {
                dataArrayLevel2 = [{
                    name: "Level 2 (N=0)",
                    data: [],
                    color: 'rgba(49, 112, 143,1)'
                }];
            }
            if (dataArrayLevel3 == undefined) {
                dataArrayLevel3 = [{
                    name: "Level 3 (N=0)",
                    data: [],
                    color: 'rgba(49, 112, 143,1)'
                }];
            }
            console.log(dataLevel4_5);
            var dataArrayLevel4_5 = [{
                name: "Level 4 & 5 (N=" + countLevel4_5 + ")",
                data: dataLevel4_5,
                color: 'rgba(49, 112, 143,1)'
            }];


            var dataArray = [];
            xAxisArray = CountyService.getUnit();
            InspectionDataService.getPercentageOfMeanScoresByUnit("1", county, function(result) {
                var finalResult = "";
                if (result) {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i]._id == CountyService.getCounty(county)) {
                            dataArray = [{
                                name: "All Levels (N=" + result[i].count + ")",
                                data: [result[i].s2_ps, result[i].s3_ps,
                                    result[i].s4_ps, result[i].s5_ps, result[i].s6_ps, result[i].s7_ps,
                                    result[i].s8_ps, result[i].s9_ps, result[i].s10_ps, result[i].s11_ps,
                                    result[i].s12_ps, result[i].s13_ps
                                ],
                                color: 'rgba(49, 112, 143,1)'
                            }];
                        }
                    }
                }
                console.log(dataArray.length);
                if (dataArray.length == 0) {
                    dataArray = [{ name: "All Levels (N=0)", data: [], color: 'rgba(49, 112, 143,1)' }];
                }
                console.log("check level inside service.......................");
                console.log(dataArrayLevel4_5);

                seriesArray.push(dataArrayLevel2);
                seriesArray.push(dataArrayLevel3);
                seriesArray.push(dataArrayLevel4_5);
                seriesArray.push(dataArray);
                callback(seriesArray);
            });
        });
    },

    meanScoreByUnitAllFormatData: function(result, county, callback) {

        var dataArrayLevel2, dataArrayLevel3, dataArrayLevel4, dataArrayLevel5 = [];
        var dataLevel4 = [];
        var countLevel4 = 0;
        var dataLevel5 = [];
        var countLevel5 = 0;
        var seriesArray = [];
        var dataLevel4_5 = [];
        var countLevel4_5 = 0;
        var Level4Facility = [];
        var Level5Facility = [];
        InspectionDataService.getCountBySection(county, function(countBySection) {
            console.log(county);
            console.log("countBySection here...........All");
            console.log(countBySection);
            for (var i = 0; i < countBySection.length; i++) {

                if (countBySection[i]._id == "Level 4") {

                    Level4Facility = [countBySection[i].os2, countBySection[i].os3,
                        countBySection[i].os4, countBySection[i].os5, countBySection[i].os6, countBySection[i].os7,
                        countBySection[i].os8, countBySection[i].os9, countBySection[i].os10, countBySection[i].os11,
                        countBySection[i].os12, countBySection[i].os13
                    ];
                }

                if (countBySection[i]._id == "Level 5") {

                    Level5Facility = [countBySection[i].os2, countBySection[i].os3,
                        countBySection[i].os4, countBySection[i].os5, countBySection[i].os6, countBySection[i].os7,
                        countBySection[i].os8, countBySection[i].os9, countBySection[i].os10, countBySection[i].os11,
                        countBySection[i].os12, countBySection[i].os13
                    ];
                }
            }
            for (var i = 0; i < result.length; i++) {
                if (result[i]._id == "Level 2") {
                    dataArrayLevel2 = [{
                        name: "Level 2 (N=" + result[i].count + ")",
                        data: [result[i].s2_ps, result[i].s3_ps,
                            result[i].s4_ps, result[i].s5_ps, result[i].s6_ps, result[i].s7_ps,
                            result[i].s8_ps, result[i].s9_ps, result[i].s10_ps, result[i].s11_ps,
                            result[i].s12_ps, result[i].s13_ps
                        ],
                        color: 'rgba(49, 112, 143,1)'
                    }];
                }
                if (result[i]._id == "Level 3") {
                    dataArrayLevel3 = [{
                        name: "Level 3 (N=" + result[i].count + ")",
                        data: [result[i].s2_ps, result[i].s3_ps,
                            result[i].s4_ps, result[i].s5_ps, result[i].s6_ps, result[i].s7_ps,
                            result[i].s8_ps, result[i].s9_ps, result[i].s10_ps, result[i].s11_ps,
                            result[i].s12_ps, result[i].s13_ps
                        ],
                        color: 'rgba(49, 112, 143,1)'
                    }];
                }

                if (result[i]._id == "Level 4") {
                    countLevel4 = result[i].count;
                    dataLevel4 = [result[i].s2_ps, result[i].s3_ps,
                        result[i].s4_ps, result[i].s5_ps, result[i].s6_ps, result[i].s7_ps,
                        result[i].s8_ps, result[i].s9_ps, result[i].s10_ps, result[i].s11_ps,
                        result[i].s12_ps, result[i].s13_ps
                    ];
                }

                if (result[i]._id == "Level 5") {
                    countLevel5 = result[i].count;
                    dataLevel5 = [result[i].s2_ps, result[i].s3_ps,
                        result[i].s4_ps, result[i].s5_ps, result[i].s6_ps, result[i].s7_ps,
                        result[i].s8_ps, result[i].s9_ps, result[i].s10_ps, result[i].s11_ps,
                        result[i].s12_ps, result[i].s13_ps
                    ];
                }
            }

            if (dataLevel4.length == 0 && dataLevel5.length == 0) {
                countLevel4_5 = 0;
                dataLevel4_5 = [];
                countLevel4_5 = 0;
            } else if (dataLevel4.length == 0) {
                countLevel4_5 = countLevel5;
                dataLevel4_5 = dataLevel5;
            } else if (dataLevel5.length == 0) {
                countLevel4_5 = countLevel4;
                dataLevel4_5 = dataLevel4;
            } else {
                /*countLevel4_5=countLevel4+countLevel5;
                for(var i=0;i<dataLevel4.length;i++){
                	dataLevel4_5[i]= ( dataLevel4[i]+dataLevel5[i] )/2;
                }*/


                console.log(Level4Facility);
                console.log(dataLevel4);
                console.log(dataLevel5);
                console.log(Level5Facility);
                countLevel4_5 = countLevel4 + countLevel5;
                for (var i = 0; i < dataLevel4.length; i++) {
                    console.log("Avg here......." + Level4Facility[i]);
                    var totalFacility = Level4Facility[i] + Level5Facility[i];
                    if (totalFacility != 0) {
                        dataLevel4_5[i] = ((dataLevel4[i] * Level4Facility[i] + dataLevel5[i] * Level5Facility[i]) / totalFacility);
                        console.log(dataLevel4_5[i]);
                    }
                }
                console.log(countLevel4_5);

            }

            if (dataArrayLevel2 == undefined) {
                dataArrayLevel2 = [{
                    name: "Level 2 (N=0)",
                    data: [],
                    color: 'rgba(49, 112, 143,1)'
                }];
            }
            if (dataArrayLevel3 == undefined) {
                dataArrayLevel3 = [{
                    name: "Level 3 (N=0)",
                    data: [],
                    color: 'rgba(49, 112, 143,1)'
                }];
            }

            console.log(dataLevel4_5);
            var dataArrayLevel4_5 = [{
                name: "Level 4 & 5 (N=" + countLevel4_5 + ")",
                data: dataLevel4_5,
                color: 'rgba(49, 112, 143,1)'
            }];


            var dataArray = [];
            xAxisArray = CountyService.getUnit();
            InspectionDataService.getPercentageOfMeanScoresByUnit("1", county, function(result) {
                var finalResult = "";

                if (result) {
                    for (var i = 0; i < result.length; i++) {

                        dataArray = [{
                            name: "All Levels (N=" + result[i].count + ")",
                            data: [result[i].s2_ps, result[i].s3_ps,
                                result[i].s4_ps, result[i].s5_ps, result[i].s6_ps, result[i].s7_ps,
                                result[i].s8_ps, result[i].s9_ps, result[i].s10_ps, result[i].s11_ps,
                                result[i].s12_ps, result[i].s13_ps
                            ],
                            color: 'rgba(49, 112, 143,1)'
                        }];
                    }
                }
                seriesArray.push(dataArrayLevel2);
                seriesArray.push(dataArrayLevel3);
                seriesArray.push(dataArrayLevel4_5);
                seriesArray.push(dataArray);

                callback(seriesArray);
            });
        });
    },

    meanScoreByUnitByOwnerShipAllFormatData: function(result, county, callback) {

        var dataArrayPublic, dataArrayPrivate;

        var seriesArray = [];

        for (var i = 0; i < result.length; i++) {
            if (result[i]._id == "Public") {
                dataArrayPublic = [{
                    name: "Public (N=" + result[i].count + ")",
                    data: [result[i].s2_ps, result[i].s3_ps,
                        result[i].s4_ps, result[i].s5_ps, result[i].s6_ps, result[i].s7_ps,
                        result[i].s8_ps, result[i].s9_ps, result[i].s10_ps, result[i].s11_ps,
                        result[i].s12_ps, result[i].s13_ps
                    ],
                    color: 'rgba(49, 112, 143,1)'
                }];
            }
            if (result[i]._id == "Private") {
                dataArrayPrivate = [{
                    name: "Private (N=" + result[i].count + ")",
                    data: [result[i].s2_ps, result[i].s3_ps,
                        result[i].s4_ps, result[i].s5_ps, result[i].s6_ps, result[i].s7_ps,
                        result[i].s8_ps, result[i].s9_ps, result[i].s10_ps, result[i].s11_ps,
                        result[i].s12_ps, result[i].s13_ps
                    ],
                    color: 'rgba(49, 112, 143,1)'
                }];
            }
        }

        if (dataArrayPublic == undefined) {
            dataArrayPublic = [{
                name: "Public (N=0)",
                data: [],
                color: 'rgba(49, 112, 143,1)'
            }];
        }
        if (dataArrayPrivate == undefined) {
            dataArrayPrivate = [{
                name: "Private (N=0)",
                data: [],
                color: 'rgba(49, 112, 143,1)'
            }];
        }


        var dataArray;
        xAxisArray = CountyService.getUnit();
        InspectionDataService.getPercentageOfMeanScoresByUnit("1", county, function(result) {
            var finalResult = "";

            if (result) {
                for (var i = 0; i < result.length; i++) {

                    dataArray = [{
                        name: "All Ownerships (N=" + result[i].count + ")",
                        data: [result[i].s2_ps, result[i].s3_ps,
                            result[i].s4_ps, result[i].s5_ps, result[i].s6_ps, result[i].s7_ps,
                            result[i].s8_ps, result[i].s9_ps, result[i].s10_ps, result[i].s11_ps,
                            result[i].s12_ps, result[i].s13_ps
                        ],
                        color: 'rgba(49, 112, 143,1)'
                    }];

                }

            }

            if (dataArray == undefined) {
                dataArray = [{ name: "All Ownerships (N=0)", data: [], color: 'rgba(49, 112, 143,1)' }];

            }

            seriesArray.push(dataArrayPublic);
            seriesArray.push(dataArrayPrivate);

            seriesArray.push(dataArray);

            callback(seriesArray);
        });
    },

    meanScoreByUnitByOwnerShipFormatData: function(result, county, callback) {
        var dataArrayPublic, dataArrayPrivate;
        var seriesArray = [];

        console.log("test here");

        console.log(dataArrayPublic);

        console.log(dataArrayPrivate);

        for (var i = 0; i < result.length; i++) {
            if (result[i]._id.county == CountyService.getCounty(county)) {
                if (result[i]._id.ownership == "Public") {
                    dataArrayPublic = [{
                        name: "Public (N=" + result[i].count + ")",
                        data: [result[i].s2_ps, result[i].s3_ps,
                            result[i].s4_ps, result[i].s5_ps, result[i].s6_ps, result[i].s7_ps,
                            result[i].s8_ps, result[i].s9_ps, result[i].s10_ps, result[i].s11_ps,
                            result[i].s12_ps, result[i].s13_ps
                        ],
                        color: 'rgba(49, 112, 143,1)'
                    }];
                }
                if (result[i]._id.ownership == "Private") {
                    dataArrayPrivate = [{
                        name: "Private (N=" + result[i].count + ")",
                        data: [result[i].s2_ps, result[i].s3_ps,
                            result[i].s4_ps, result[i].s5_ps, result[i].s6_ps, result[i].s7_ps,
                            result[i].s8_ps, result[i].s9_ps, result[i].s10_ps, result[i].s11_ps,
                            result[i].s12_ps, result[i].s13_ps
                        ],
                        color: 'rgba(49, 112, 143,1)'
                    }];

                }

            }
        }
        if (dataArrayPublic == undefined) {
            dataArrayPublic = [{
                name: "Public (N=0)",
                data: [],
                color: 'rgba(49, 112, 143,1)'
            }];
        }
        if (dataArrayPrivate == undefined) {
            dataArrayPrivate = [{
                name: "Private (N=0)",
                data: [],
                color: 'rgba(49, 112, 143,1)'
            }];
        }

        var dataArray;
        xAxisArray = CountyService.getUnit();
        InspectionDataService.getPercentageOfMeanScoresByUnit("1", county, function(result) {
            var finalResult = "";
            if (result) {
                for (var i = 0; i < result.length; i++) {
                    if (result[i]._id == CountyService.getCounty(county)) {
                        dataArray = [{
                            name: "All Ownerships (N=" + result[i].count + ")",
                            data: [result[i].s2_ps, result[i].s3_ps,
                                result[i].s4_ps, result[i].s5_ps, result[i].s6_ps, result[i].s7_ps,
                                result[i].s8_ps, result[i].s9_ps, result[i].s10_ps, result[i].s11_ps,
                                result[i].s12_ps, result[i].s13_ps
                            ],
                            color: 'rgba(49, 112, 143,1)'
                        }];
                    }
                }
            }
            if (dataArray == undefined) {
                dataArray = [{ name: "All Ownerships (N=0)", data: [], color: 'rgba(49, 112, 143,1)' }];

            }
            seriesArray.push(dataArrayPublic);
            seriesArray.push(dataArrayPrivate);

            seriesArray.push(dataArray);
            callback(seriesArray);
        });

    },
    getGracePeriodRenewData: function(county, ownership, level, callback) {

        var condObj = {
            "is_deleted": false,
            "m_insp_completed": "Yes"
        };

        var county = CountyService.getCounty(county);
        if (county != "All") {
            condObj._county = county;
        }
        if (level != "All") {
            condObj._level = level;
        }
        if (ownership != "All") {
            condObj._ownership = ownership;
        }


        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');
        var graceCursor = collection.aggregate([{
            $match: condObj
        }, {
            $group: {
                _id: null,
                f_licenses: { "$sum": { "$cond": [{ "$eq": ["$f_close", 2] }, 1, 0] } },
                lab_licenses: { "$sum": { "$cond": [{ "$eq": ["$lab_close", 2] }, 1, 0] } },
                pharm_licenses: { "$sum": { "$cond": [{ "$eq": ["$pharm_close", 2] }, 1, 0] } },
                rad_licenses: { "$sum": { "$cond": [{ "$eq": ["$rad_close", 2] }, 1, 0] } },

                f_renewed: {
                    "$sum": {
                        "$cond": [{
                            "$and": [{ "$eq": ["$_insp_type", 201] },
                                { "$eq": ["$f_close", 0] }
                            ]
                        }, 1, 0]
                    }
                },
                lab_renewed: {
                    "$sum": {
                        "$cond": [{
                            "$and": [{ "$eq": ["$_insp_type", 202] },
                                { "$eq": ["$reinsp_dept_10", 1] }, { "$eq": ["$lab_close", 0] }
                            ]
                        }, 1, 0]
                    }
                },
                pharm_renewed: {
                    "$sum": {
                        "$cond": [{
                            "$and": [{ "$eq": ["$_insp_type", 202] },
                                { "$eq": ["$reinsp_dept_9", 1] }, { "$eq": ["$pharm_close", 0] }
                            ]
                        }, 1, 0]
                    }
                },
                rad_renewed: {
                    "$sum": {
                        "$cond": [{
                            "$and": [{ "$eq": ["$_insp_type", 202] },
                                { "$eq": ["$reinsp_dept_11", 1] }, { "$eq": ["$rad_close", 0] }
                            ]
                        }, 1, 0]
                    }
                },


                f_invalid: {
                    "$sum": {
                        "$cond": [{
                            "$and": [{ "$eq": ["$_insp_type", 201] },
                                { "$eq": ["$f_close", 1] }
                            ]
                        }, 1, 0]
                    }
                },
                lab_invalid: {
                    "$sum": {
                        "$cond": [{
                            "$and": [{ "$eq": ["$_insp_type", 202] },
                                { "$eq": ["$reinsp_dept_10", 1] }, { "$eq": ["$lab_close", 1] }
                            ]
                        }, 1, 0]
                    }
                },
                pharm_invalid: {
                    "$sum": {
                        "$cond": [{
                            "$and": [{ "$eq": ["$_insp_type", 202] },
                                { "$eq": ["$reinsp_dept_9", 1] }, { "$eq": ["$pharm_close", 1] }
                            ]
                        }, 1, 0]
                    }
                },
                rad_invalid: {
                    "$sum": {
                        "$cond": [{
                            "$and": [{ "$eq": ["$_insp_type", 202] },
                                { "$eq": ["$reinsp_dept_11", 1] }, { "$eq": ["$rad_close", 1] }
                            ]
                        }, 1, 0]
                    }
                },
            }
        }]);

        graceCursor.toArray(function(err, facilityList) {

            var dataArrayLicenses = [0, 0, 0, 0];
            var dataArrayRenewed = [0, 0, 0, 0];
            var dataArrayInvalid = [0, 0, 0, 0];

            if (facilityList[0] != undefined) {

                dataArrayLicenses[0] = facilityList[0].f_licenses;
                dataArrayLicenses[1] = facilityList[0].lab_licenses;
                dataArrayLicenses[2] = facilityList[0].pharm_licenses;
                dataArrayLicenses[3] = facilityList[0].rad_licenses;

                dataArrayRenewed[0] = facilityList[0].f_renewed;
                dataArrayRenewed[1] = facilityList[0].lab_renewed;
                dataArrayRenewed[2] = facilityList[0].pharm_renewed;
                dataArrayRenewed[3] = facilityList[0].rad_renewed;

                dataArrayInvalid[0] = facilityList[0].f_invalid;
                dataArrayInvalid[1] = facilityList[0].lab_invalid;
                dataArrayInvalid[2] = facilityList[0].pharm_invalid;
                dataArrayInvalid[3] = facilityList[0].rad_invalid;

            }

            var scoreByDept = {
                dataArrayLicenses: dataArrayLicenses,
                dataArrayRenewed: dataArrayRenewed,
                dataArrayInvalid: dataArrayInvalid
            }
            console.log("scoreByDept 3-month grace period");
            console.log(scoreByDept);

            callback(scoreByDept);
        });

    },
    next_insp_detail: function(callback) {
        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');
        var cursor = collection.aggregate([{
            $match: {
                is_deleted: false,
                _insp_type: 101,
                m_insp_completed: "Yes"
            }
        }, { $group: { _id: "$m_followup_action", count: { $sum: 1 } } }]);
        cursor.toArray(function(err, next_insp) {
            console.log("next_insp[0]._id");
            callback(next_insp);
        });
    },

    facilityLevelByRiskCategory: function(type, county, callback) {
        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');
        var groupColumn;


        var cur = collection.aggregate([
            { $match: { is_deleted: false, m_insp_completed: "Yes" } },
            { $group: { _id: "$_hfid", inspection: { $max: "$p_insp_number" } } }
        ]);


        cur.toArray(function(err, resultTotalDocument) {

            var totalDocument = resultTotalDocument.length;

            console.log("totalDocument");
            console.log(totalDocument);

            //decide the group by columns
            if (type == "1" && county == "All") {
                groupColumn = "$risk_c";
            } else if (type == "2" && county == "All") {
                groupColumn = { "level": "$_level", "risk": "$risk_c" };
            } else if (type == "3" && county == "All") {
                groupColumn = { "ownership": "$_ownership", "risk": "$risk_c" };
            } else if (type == "1" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
                groupColumn = { "county": "$_county", "risk": "$risk_c" };
            } else if (type == "2" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
                groupColumn = { "level": "$_level", "county": "$_county", "risk": "$risk_c" };
            } else if (type == "3" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
                groupColumn = { "ownership": "$_ownership", "county": "$_county", "risk": "$risk_c" };
            }

            //execute aggregate query
            var cursorLatestInsp = collection.aggregate([
                { $match: { is_deleted: false, "m_insp_completed": "Yes", "latest_inspection": 1 } },
                /*{ $sort : {  p_insp_number: 1 } },
				{$group: {_id: "$_hfid", inspection: {$max: "$p_insp_number"},
				risk_c : {$last: '$risk_c'},_level:{$last: '$_level'},_ownership:{$last: '$_ownership'},_county:{$last: '$_county'}}},
				{$project: { inspection: 1, hf_id:1,risk_c :1,_level:1,_ownership:1,_county:1}},
*/
                { $group: { _id: groupColumn, count: { $sum: 1 } } },
                { $project: { "count": 1, "percentage": { "$multiply": [{ "$divide": [100, totalDocument] }, "$count"] } } }
            ]);

            var cursorFirstInsp = collection.aggregate([
                { $match: { is_deleted: false, "m_insp_completed": "Yes", "_insp_type": 101 } },
                { $group: { _id: groupColumn, count: { $sum: 1 } } },
                { $project: { "count": 1, "percentage": { "$multiply": [{ "$divide": [100, totalDocument] }, "$count"] } } }
            ]);

            cursorLatestInsp.toArray(function(err, resultLast) {
                cursorFirstInsp.toArray(function(err, resultFirst) {
                    callback(resultFirst, resultLast);
                });
            });
        });
    },
    facilityLevelByMeanScores: function(type, county, callback) {

        var mongo = require('mongodb');
        var groupColumn;
        var collection = MongoService.getDB().collection('facility');
        var array = [];

        //decide the group by columns
        if (type == "1" && county == "All") {
            groupColumn = null;
        } else if (type == "2" && county == "All") {
            groupColumn = { "level": "$_level" };
        } else if (type == "3" && county == "All") {
            groupColumn = { "ownership": "$_ownership" };
        } else if (type == "4" && county == "All") {
            groupColumn = "$risk_c";
        } else if (type == "1" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
            groupColumn = "$_county";
        } else if (type == "2" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
            groupColumn = { "level": "$_level", "county": "$_county" };
        } else if (type == "3" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
            groupColumn = { "ownership": "$_ownership", "county": "$_county" };
        } else if (type == "4" && (county == "1" || county == "2" || county == "3" || county == "By County")) {
            groupColumn = { "risk": "$risk_c", "county": "$_county" };
        }

        /*	var cursor = collection.aggregate([{$match:{is_deleted:false,
        				m_insp_completed:"Yes"}},
        				{ $sort : {  p_insp_number: 1 } },
        				{$group: {_id: "$_hfid", inspection: {$max: "$p_insp_number"},
        				risk_c : {$last: '$risk_c'},_level:{$last: '$_level'},_ownership:{$last: '$_ownership'},_county:{$last: '$_county'},
        				total_ps:{$last: '$total_ps'}}},
        				{$match:{total_ps:{"$ne":null}}},
        				{$project: { inspection: 1, hf_id:1,risk_c :1,_level:1,_ownership:1,_county:1,
        					total_ps:1}},
        					{$group: {_id:groupColumn, count:{$sum:1},
        					ps : {$avg:"$total_ps"}}}
        					]);
        			cursor.toArray(function(err, result) {

        				callback(result);
        			});*/
        var cursorLatestInsp = collection.aggregate([
            { $match: { is_deleted: false, "m_insp_completed": "Yes", "latest_inspection": 1 } },
            { $match: { total_ps: { "$ne": null } } },
            {
                $group: {
                    _id: groupColumn,
                    count: { $sum: 1 },
                    ps: { $avg: "$total_ps" }
                }
            }
        ]);

        var cursorFirstInsp = collection.aggregate([
            { $match: { is_deleted: false, "m_insp_completed": "Yes", "_insp_type": 101 } },
            { $match: { total_ps: { "$ne": null } } },
            {
                $group: {
                    _id: groupColumn,
                    count: { $sum: 1 },
                    ps: { $avg: "$total_ps" }
                }
            }
        ]);

        cursorLatestInsp.toArray(function(err, resultLast) {
            cursorFirstInsp.toArray(function(err, resultFirst) {
                console.log("Facility level MeanScore")
                console.log(resultLast);
                callback(resultFirst, resultLast);
            });
        });
    },
    closureStatus: function(county, ownership, level, callback) {
        var condObj = {
            "is_deleted": false,
            "m_insp_completed": "Yes",
        };

        var county = CountyService.getCounty(county);
        if (county != "All") {
            condObj._county = county;
        }
        if (level != "All") {
            condObj._level = level;
        }
        if (ownership != "All") {
            condObj._ownership = ownership;
        }
        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');
        var facilityCloserReq = collection.aggregate([{
            $match: condObj
        }, {
            $group: {
                _id: null,
                f_close: { "$sum": { "$cond": [{ "$eq": ["$f_close", 1] }, 1, 0] } },
                pharm_close: { "$sum": { "$cond": [{ "$eq": ["$pharm_close", 1] }, 1, 0] } },
                lab_close: { "$sum": { "$cond": [{ "$eq": ["$lab_close", 1] }, 1, 0] } },
                rad_close: { "$sum": { "$cond": [{ "$eq": ["$rad_close", 1] }, 1, 0] } },
                nutri_close: { "$sum": { "$cond": [{ "$eq": ["$nutri_close", 1] }, 1, 0] } },
            }
        }]);

        var facilityClosed = collection.aggregate([{
            $match: condObj
        }, {
            $group: {
                _id: null,
                f_closed: { "$sum": { "$cond": [{ "$eq": ["$f_physclose", 1] }, 1, 0] } },
                pharm_closed: { "$sum": { "$cond": [{ "$eq": ["$pharm_physclose", 1] }, 1, 0] } },
                lab_closed: { "$sum": { "$cond": [{ "$eq": ["$lab_physclose", 1] }, 1, 0] } },
                rad_closed: { "$sum": { "$cond": [{ "$eq": ["$rad_physclose", 1] }, 1, 0] } },
                nutri_closed: { "$sum": { "$cond": [{ "$eq": ["$nutri_physclose", 1] }, 1, 0] } }
            }
        }]);

        facilityCloserReq.toArray(function(err, facilityCloserReq) {

            var closureReqStatics = {
                facility: 0,
                Pharmacy: 0,
                Laboratory: 0,
                Radiology: 0,
                Nutrition: 0
            };

            if (facilityCloserReq[0] != undefined) {
                closureReqStatics.facility = facilityCloserReq[0].f_close;
                closureReqStatics.Pharmacy = facilityCloserReq[0].pharm_close;
                closureReqStatics.Laboratory = facilityCloserReq[0].lab_close;
                closureReqStatics.Radiology = facilityCloserReq[0].rad_close;
                closureReqStatics.Nutrition = facilityCloserReq[0].nutri_close;
            }

            facilityClosed.toArray(function(err, facilityClosedResult) {

                var closureStatics = {
                    facilityClosed: 0,
                    Pharmacy: 0,
                    Laboratory: 0,
                    Radiology: 0,
                    Nutrition: 0
                };

                if (facilityClosedResult[0] != undefined) {
                    closureStatics.facilityClosed = facilityClosedResult[0].f_closed;
                    closureStatics.Pharmacy = facilityClosedResult[0].pharm_closed;
                    closureStatics.Laboratory = facilityClosedResult[0].lab_closed;
                    closureStatics.Radiology = facilityClosedResult[0].rad_closed;
                    closureStatics.Nutrition = facilityClosedResult[0].nutri_closed;
                }
                callback(closureReqStatics, closureStatics);
            });
        });
    }
}