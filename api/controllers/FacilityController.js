/**
 * FacilityController
 *
 * @description :: Server-side logic for managing Facilities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var winston = require('winston');
var async = require('async');
var Converter = require('csvtojson').Converter;

var path = require('path');
var unzip = require('unzip2');
var fs = require('fs');

module.exports = {

    viewall: function(req, res) {
        res.view('facility/viewall');
    },

    checkId: function(req, res) {

        Facility.find({
            _hfid: req.body.facilityId,
            m_insp_completed: "Yes",
            'is_deleted': false
        }).exec(function(err, facility) {

            return res.json(facility);
        });
    },

    getFacilityList: function(req, res) {
        winston.info('Start getFacilityList');
        var hfLevelData = [];
        var columns = ["_county", "_hfname", "p_insp_number", "_inspectorname", "_date"];
        var iDisplayStart = parseInt(req.query.iDisplayStart);
        var iDisplayLength = parseInt(req.query.iDisplayLength);

        var showPage = parseInt(iDisplayStart / iDisplayLength) + 1;

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
        var fromDateArray, fromDateObj, toDateArray, toDateObj = null;

        if (fromDate != "") {
            fromDateArray = fromDate.split("-");
            fromDateObj = new Date(fromDateArray[2], parseInt(fromDateArray[1]) - 1, parseInt(fromDateArray[0]));
        }
        if (fromDate != "") {
            toDateArray = toDate.split("-");
            toDateObj = new Date(toDateArray[2], parseInt(toDateArray[1]) - 1, parseInt(toDateArray[0]) + 1);
        }
        var collection = MongoService.getDB().collection('facility');
        var cursor;
        var loggedInUser = req.session.loggedInUser;

        var searchCondition = [{
            $or: [{
                _hfname: {
                    "$regex": sSearch,
                    "$options": "i"
                }
            }, {
                _inspectorname: {
                    "$regex": sSearch,
                    "$options": "i"
                }
            }, {
                _county: {
                    "$regex": sSearch,
                    "$options": "i"
                }
            }]
        }, {
            is_deleted: false
        }];

        if (fromDateObj != null && toDateObj != null) {

            searchCondition.push({
                _date: {
                    "$gte": fromDateObj,
                    "$lt": toDateObj
                }
            });
        }

        if (county == "All" && inspName == "All") {

        } else if (county == "All") {
            searchCondition.push({
                _inspectorname: inspName
            });

        } else if (inspName == "All") {

            searchCondition.push({
                _county: CountyService.getCounty(county)
            });
        } else {
            searchCondition.push({
                _county: CountyService.getCounty(county)
            });
            searchCondition.push({
                _inspectorname: inspName
            });
        }

        cursor = collection.find({
                $and: searchCondition
            }, {
                _id: 1,
                _inspectorname: 1,
                _hfname: 1,
                _county: 1,
                _date: 1,
                p_insp_number: 1
            })
            .sort(JSON.parse(sortColumn));
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
                winston.info('End getFacilityList');
            }
        });
    },

    upload: function(req, res) {
        winston.info('Start Facility upload');
        console.time('Upload Process Time :');
        var failedRecordArr = [];
        var insertCount = 0;
        var failedCount = 0;
        var totalCount = 0;
        var processCount = 0;
        var name = req.session.loggedInUser.email;
        var mongo = require('mongodb');
        var collection = MongoService.getDB().collection('facility');
        console.time('File Upload Time :');
        req.file('file').upload({
            maxBytes: 50000000,
	    dirname: path.resolve(sails.config.appPath, '.tmp/uploads/'),// Given file path to upload file in .tmp/uploads/ dir
        }, function(err, files) {
            console.timeEnd('File Upload Time :');
            console.log(err);
            if (err) {
                return res.json({
                    flag: 0
                });
            } else {
                var mycsv = files[0].fd;
                var converter = new Converter({
                    constructResult: false,
                    workerNum: 4,
                    checkType: true,
                    ignoreEmpty: false
                });

                var rowList = [];
                var out = [];
                var duplicateRecordArr = [];

                converter.on("record_parsed", function(row, rawRow, rowIndex) {
                    rowList.push(row);
                });

                converter.on("end_parsed", function(result) {

                    console.time('Remove Duplicate Loop :');
                    for (var i = 0; i < rowList.length; i++) {
                        var unique = true;
                        for (var j = 0; j < out.length; j++) {
                            if ((rowList[i]._hfid === out[j]._hfid) && (rowList[i].p_insp_number === out[j].p_insp_number)) {
                                duplicateRecordArr.push(out[j]._hfid);
                                out.splice(j, 1);
                            }
                        }
                        if (unique) {
                            out.push(rowList[i]);
                        }
                    }
                    console.timeEnd('Remove Duplicate Loop :');

                    console.log("rowlist length--------" + rowList.length);
                    console.log("out length--------" + out.length);
                    totalCount = out.length;
                    Facility.destroy().exec(function(err) {
                        if (err) {
                            console.log("Error in Facility collection destroy")
                            console.log(err);
                        } else {
                            console.time('async time :');
                            async.eachSeries(out, function(row, callback) {
                                var rowIndex = i;
                                if (row._date == '.') {
                                    row._date = null;
                                }
                                if (row.p_insp_number == '.') {
                                    row.p_insp_number = null;
                                }
                                console.time(row._hfid + ' Facility cleaning time :');
                                for (var k in row) {
                                    if (row[k] === '' || row[k] == null || row[k] == undefined) {
                                        delete row[k];
                                    }
                                }
                                console.timeEnd(row._hfid + ' Facility cleaning time :');
                                if (row._hfid != undefined && row.p_insp_number != undefined) {

                                    row['is_deleted'] = false;
                                    console.time(row._hfid + ' Facility insert time :');
                                    Facility.create(row).exec(function(err, result) {
                                        //  console.log("check id here===="+result.id);
                                        if (err) {
                                            console.log("row not inserted" + row._hfid);
                                            console.log(err);
                                            failedRecordArr.push(row._hfid);
                                            failedCount++;
                                            calculateTotalRecords();
                                            if (processCount == totalCount) {
                                                console.log(rowIndex + "--" + totalCount);
                                                sendEmail();
                                            }
                                        } else {
                                            insertCount++;
                                            calculateTotalRecords();
                                            if (processCount == totalCount) {
                                                console.log("inside insert send mail");
                                                console.log(rowIndex + "--" + totalCount);
                                                sendEmail();
                                            }
                                        }
                                        console.timeEnd(row._hfid + ' Facility insert time :');
                                        callback();
                                    });
                                } else {
                                    failedRecordArr.push(row._hfid);
                                    failedCount++;
                                    callback();
                                }

                            }, function(err) {
                                console.log("async complete");
                                console.timeEnd('async time :');
                            });
                        }
                    });
                });

                //read from file 
                require("fs").createReadStream("" + mycsv).pipe(converter);
                var fs = require('fs');
                var parse = require('csv-parse');

                var parser = parse({
                    delimiter: ','
                }, function(err, data) {
                    // console.log("-------------------lines"+parser.lines);
                    //totalCount = parser.lines - 1;
                    var totalCount1 = parser.lines - 1;
                    // console.log("-------------------"+totalCount);
                });

                fs.createReadStream(mycsv + '').pipe(parser);

                function calculateTotalRecords() {
                    processCount = insertCount + failedCount;
                }

                function sendEmail() {
                    winston.info("send email called");
                    console.time('Email Send Time :');
                    EmailService.FacilitySendEmail(failedCount, insertCount, failedRecordArr, duplicateRecordArr, name, function(flag) {
                        console.log("hereeeee");
                        console.timeEnd('Email Send Time :');
                        console.timeEnd('Upload Process Time :');
                        if (!flag) {
                            sendEmail();
                        }
                    });
                }
                return res.json({
                    flag: 1
                });
                winston.info('End Facility upload');
            }
        });

    },

    uploadSignature: function(req, res) {
        winston.info('Start uploadSignature')

        req.file('file').upload({
            maxBytes: 100000000,
            dirname: require('path').resolve(sails.config.appPath, './assets/signature')
        }, function(err, uploadedFiles) {

            if (err) return res.negotiate(err);

            var filename = path.basename(uploadedFiles[0].fd);

            var filedir = uploadedFiles[0].fd;

            var fn = filedir.replace("assets", ".tmp/public");

            var uploadLocation = filedir;
            var tempLocation = fn;

            fs.createReadStream(uploadLocation).pipe(fs.createWriteStream(tempLocation));

            fs.createReadStream(sails.config.appPath + '/assets/signature/' + filename).pipe(unzip.Extract({
                path: 'assets/signature'
            }));
            fs.createReadStream(sails.config.appPath + '/assets/signature/' + filename).pipe(unzip.Extract({
                path: sails.config.appPath + '/.tmp/public/signature'
            }));

            winston.info('End uploadSignature')

            fs.unlink(uploadLocation, function(err) {
                if (err) throw err;
                console.log(" deleted");
            });

            return res.json({
                path: filename,
                filename: uploadedFiles[0].filename
            });
            winston.info('End uploadSignature')
        });
    },

    delete: function(req, res) {

        var facilityId = req.body.id;

        winston.info('start delete facility id: ' + facilityId);
        Facility.findOne(facilityId).exec(function(err, facility) {

            facility.is_deleted = true;
            var deletedFacility = facility.id;
            console.log("deletedFacility ===== " + deletedFacility);
            //delete facility._id;

            FacilityHistory.create(facility).exec(function(err, result) {

                    if (deletedFacility != undefined && deletedFacility != null) {
                        console.log("deletedFacility inside if===== " + deletedFacility);
                        Facility.destroy({ id: deletedFacility }).exec(function(err) {
                            console.log("deletedFacility successfully");
                            req.flash('facilityDeletedMessage', 'Facility deleted successfully');
                            return res.json(facility);
                            winston.info('End delete facility');
                        });
                    }
                })
                /*facility.save(function(err) {
                 if (err) {
                  res.send("Error");
                  winston.warn('Facility save error Facility id: ' + facilityId);

                 } else {

                  req.flash('facilityDeletedMessage', 'Facility deleted successfully');
                  return res.json(facility);
                  winston.info('End delete facility');

                 }

                });*/

        });


    },

};
