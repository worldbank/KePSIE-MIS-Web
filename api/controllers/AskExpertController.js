/**
 * OtherIssuesController
 * 
 * @description : Server-side logic for managing Ask Expert Tab
 * @author : Jay Pastagia
 */
 var winston = require('winston');
 
 module.exports = {

 	askExperts : function(req, res) {

 		return res.view('questionAnswer');

 	},
 	newQuestion : function(req, res) {

 		return res.view('askExperts');
 	},

 	editQuery : function(req,res){
 		console.log("editQuery");
 		var eid=req.param('id');
 		winston.info('Start editQuery id: '+eid);
   
 		console.log(eid);

 		AskExpert.findOne(eid).exec(function(err, query){
 			if(err){
 				 winston.warn('Error editQuery id: '+eid);
 			}
 			console.log(query);
 			 winston.info('End editQuery id: '+eid);
   
 			return res.view('editQuery',{"queryDetail": query});
 			
 		});	
 	},

 	updateQuery:function(req,res){
 		var query= req.body;

 		var queryId=query.id;

 		 winston.info('Start updateQuery id: '+queryId);
   

		 query.modifiedBy = req.session.loggedInUser.name;
		 query.modifiedByEmail = req.session.loggedInUser.email;


		 if (query.otherBoard == "  ") {
		 	delete query.otherBoard;
		 }

		 if (query.otherSection == "  ") {
		 	delete query.otherSection;
		 }
		 if (query.othersub_section == "  ") {
		 	delete query.othersub_section;
		 }
		 if (query.othersub_sub_section == "  ") {
		 	delete query.othersub_sub_section;
		 }
 		

 		AskExpert.update(queryId,query,function queryUpdated(err,query){

 			if(err){
 				 winston.warn('Error updateQuery id: '+eid);
 			}
		    console.log("query updated");
		    winston.info('End updateQuery id: '+queryId);
		   
		   	res.json(query);
  		});
 	},

 	deleteQuestion : function(req,res){
 		var queryId = req.body.id;

 		console.log("query Id:"+queryId);
 		winston.info('Start deleteQuestion id: '+queryId);

 		AskExpert.findOne(queryId).exec(function(err, query) {
 			query.is_deleted = true;
 			query.save(function(err) {
 				if (err) {
 					winston.warn('Error deleteQuestion id: '+queryId);
   	
 					res.send("Error");
 				}else{
 					winston.info('End deleteQuestion id: '+queryId);
   	
 					req.flash('queryDeletedMessage', 'Query deleted successfully');
 					return res.json(query);
 				}
 			});
 		});
 	},
 	query : function(req, res) {

		/*
		 * when query asked specific role of user get individual email
		 * notification
		 */

		var query = req.body;

		winston.info('Start query (query asked) body: '+query);
   	

		var newQueNotifyUser = [ 'B&Cs - ITEG',
		 'B&Cs - Licensing decision-makers' ];
		var role=['Admin'];
		var mohIndex=query.board.indexOf('MOH Coordinator');

		if(mohIndex!=-1){
		 	query.board.splice(mohIndex, 0);
		 	role.push('MOH Coordinator');
		}

		User.find({
		 	or : [ {
		 		role : newQueNotifyUser,
		 		group : query.board,
		 		is_deleted : "false"
		 	}, {
		 		role : role,
		 		is_deleted : "false"
		 	} ]
		}).exec(function(err, user) {
		 	if (err) {
		 	
		 		 winston.warn('Error user find in query (query asked) err: '+err);
		 	}

		 	if(user) {
		 		for (var j = 0; j < user.length; j++) {
		 			emailReceiverList.push(user[j].email);
		 			emailReceiverName.push(user[j].name);
		 		}
		 	}
		 	winston.info("emailReceiverList acorging group");
		 	winston.info(emailReceiverList);
		});

		query.createdBy = req.session.loggedInUser.name;
		query.modifiedBy = req.session.loggedInUser.name;
		query.askedByEmail = req.session.loggedInUser.email;

		var emailReceiverList = [];
		var emailReceiverName = [];

		if (query.otherBoard == "  ") {
		 	delete query.otherBoard;
		}

		if (query.otherSection == "  ") {
		 	delete query.otherSection;
		}
		if (query.othersub_section == "  ") {
		 	delete query.othersub_section;
		}
		if (query.othersub_sub_section == "  ") {
		 	delete query.othersub_sub_section;
		}

		AskExpert.create(query, function queryCreated(err, query) {
		 	if (err) {
		 		winston.warn('Error query create in query (query asked) err: '+err);
		 		return res.json(query);
		 	}

		 	var dt = new Date();
		 	if (dt.getDay() == 6) {
		 		dt.setDate(dt.getDate() + 3);
		 	} else if (dt.getDay() == 5) {
		 		dt.setDate(dt.getDate() + 4);
		 	} else if (dt.getDay() == 4) {
		 		dt.setDate(dt.getDate() + 4);
		 	} else {
		 		dt.setDate(dt.getDate() + 2);
		 	}

		 	var month = dt.getMonth() + 1;

		 	if (month < 10) {
		 		month = "0" + month;
		 	}

		 	dt = dt.getDate() + "/" + month + "/" + dt.getFullYear();
		 	var uniqueEmail = [];
		 	var uniqueName = [];

		 	var origLen = emailReceiverList.length, found, x, y;

		 	for (x = 0; x < origLen; x++) {
		 		found = undefined;
		 		for (y = 0; y < uniqueEmail.length; y++) {
		 			if (emailReceiverList[x] === uniqueEmail[y]) {
		 				found = true;
		 				break;
		 			}
		 		}
		 		if (!found){
		 			uniqueEmail.push(emailReceiverList[x]);
		 			uniqueName.push(emailReceiverName[x]);
		 		}
		 	}

		 	
		 	var loginurl = sails.config.routesPrefix;

		 	var origLen = emailReceiverName.length, found, x, y;


		 	EmailService.AskExpert(uniqueEmail, uniqueName, loginurl, dt);

		 	winston.info('End query (query asked)');
   			UserService.getPendingActionFAQ(req,function(finalResult) {
		 	return res.json(query);
		 });
		 });
		},

		queAnslist : function(req, res, next) {

			winston.info('Start queAnslist ');
   	
			var unit = req.param("unit");
			console.log(unit);
			var generalSearchText = req.param("generalSearchText");
			var id = req.session.loggedInUser.id;

			User.findOne(id).exec(function(err, user) {

				if (err) {
					winston.warn('Error queAnslist in finding loggedInUser details ');
				}

					var usergrplist = user.groupName;
					var columns = [ "query", "status", "response" ];
					var iDisplayStart = req.query.iDisplayStart;
					var iDisplayLength = req.query.iDisplayLength;
					var showPage = parseInt(iDisplayStart
						/ iDisplayLength) + 1;
					var iSortCol_0 = req.query.iSortCol_0;
					var sSortDir_0 = req.query.sSortDir_0;
					var sSearch = "";
					var sortColumn = "";

					if (iSortCol_0 == undefined) {
						sortColumn = "" + "createdAt" + " " + "desc";
					} else {
						sortColumn = "" + columns[iSortCol_0] + " "+ sSortDir_0;
					}
					if (generalSearchText != ""
						&& generalSearchText != null) {
						sSearch = generalSearchText;
					}

				var mongo = require('mongodb');
				var collection = MongoService.getDB().collection(
					'askexpert');

				if ((unit == '' || unit == "All")) {

					var cursor = collection.find({
						$or : [ {
							query : {
								"$regex" : sSearch,
								"$options" : "i"
							}
						} ],"is_deleted":false 
					});

				} else {
					var cursor = collection.find({
						$and : [ {
							$or : [ {
								query : {
									"$regex" : sSearch,
									"$options" : "i"
								}
							} ]
						}, {
							section : {
								$in : unit
							},"is_deleted":false
						} ]
					});
				}

				cursor
				.toArray(function(err, result) {

					if (err) {
						console.log(err);
						winston.warn('Error queAnslist in finding query based on filter ');
   	
					} else {

						if (iDisplayLength == -1) {
							iDisplayLength = result.length;
						}
						winston.info('End queAnslist ');
						res.send({"aaData" : result.slice(iDisplayStart,
								(iDisplayStart + iDisplayLength)),
							"iTotalRecords" : result.length,
							"iTotalDisplayRecords" : result.length
						});
					}
				});
			});
		},
		answer : function(req, res) {

			winston.info('Start answer (query answer) queryId: '+req.param('id'));
   	

			AskExpert.findOne(req.param('id'))
			.exec(
				function(err, query) {

					if(err){
						winston.warn('Error answer (query answer) in finding query: '+err);
   	
					}
					var board = ""
					for (var l = 0; l < query.board.length; l++) {
						board += query.board[l];
						if(l<query.board.length-1){
							board +=", "
						}
					}
					query.board = board;
					var flag = true;
					var today = new Date(query.createdAt);
					var dd = today.getDate();
							var mm = today.getMonth() + 1; // January is 0!

							var yyyy = today.getFullYear();
							if (dd < 10) {
								dd = '0' + dd
							}
							if (mm < 10) {
								mm = '0' + mm
							}
							query.createdAt = dd + '/' + mm + '/' + yyyy;
							var loginUserId = req.session.loggedInUser.id;
							if (query.response != undefined) {

								for (var i = 0; i < query.response.length; i++) {

									if (query.response[i].expert_id == loginUserId
										&& query.response[i].is_deleted == false) {
										flag = false;
									}


								var today = new Date(query.response[i].date);
								var dd = today.getDate();
									var mm = today.getMonth() + 1; // January
									// is 0!

									var yyyy = today.getFullYear();
									if (dd < 10) {
										dd = '0' + dd
									}
									if (mm < 10) {
										mm = '0' + mm
									}
									query.response[i].date = dd + '/' + mm + '/' + yyyy;

									if (query.response[i].UpdatedAt_date != undefined) {
										var today = new Date(
											query.response[i].UpdatedAt_date);

										var dd = today.getDate();
										var mm = today.getMonth() + 1; // January
										// is 0!

										var yyyy = today.getFullYear();
										if (dd < 10) {
											dd = '0' + dd
										}
										if (mm < 10) {
											mm = '0' + mm
										}
										query.response[i].UpdatedAt_date = dd + '/' + mm + '/' + yyyy;
									}

								}
							}

							winston.info('End answer (query answer) queryId: '+req.param('id'));
   	
							res.view('answer', {
								queryDetail : query,
								showAnswerEditor : flag
							});
						});

		},
		viewAnswer : function(req, res) {

			winston.info('Start viewAnswer (query answer) queryId: '+req.param('id'));
   	

			AskExpert.findOne(req.param('id')).exec(
				function(err, query) {

					var board = "";
					for (var l = 0; l < query.board.length; l++) {
						board += query.board[l];
						if(l<query.board.length-1){
							board +=", "
						}
					}
					query.board = board;

					var today = new Date(query.createdAt);
					var dd = today.getDate();
							var mm = today.getMonth() + 1; // January is 0!

							var yyyy = today.getFullYear();
							if (dd < 10) {
								dd = '0' + dd
							}
							if (mm < 10) {
								mm = '0' + mm
							}
							query.createdAt = dd + '/' + mm + '/' + yyyy;

							if (query.response != undefined) {

								for (var i = 0; i < query.response.length; i++) {

									var today = new Date(query.response[i].date);
									var dd = today.getDate();
									var mm = today.getMonth() + 1; // January
									// is 0!

									var yyyy = today.getFullYear();
									if (dd < 10) {
										dd = '0' + dd
									}
									if (mm < 10) {
										mm = '0' + mm
									}
									query.response[i].date = dd + '/' + mm
									+ '/' + yyyy;

									if (query.response[i].UpdatedAt_date != undefined) {
										var today = new Date(
											query.response[i].UpdatedAt_date);

										var dd = today.getDate();
										var mm = today.getMonth() + 1; // January
										// is 0!

										var yyyy = today.getFullYear();
										if (dd < 10) {
											dd = '0' + dd
										}
										if (mm < 10) {
											mm = '0' + mm
										}
										query.response[i].UpdatedAt_date = dd
										+ '/' + mm + '/' + yyyy;
									}
								}
							}
							winston.info('End viewAnswer (query answer) queryId: '+req.param('id'));
   	
							res.view('answer', {
								queryDetail : query,
								showAnswerEditor : false
							});

						});
		},
		expertAnswer : function(req, res) {

			var mongo = require('mongodb');
			var collection = MongoService.getDB().collection('askexpert');
			var ObjectId = require('mongodb').ObjectID;

			winston.info('Start expertAnswer (query) queryId: '+req.body.id);
   	

			var QueResponse = {
				_id : "" + new Date().getTime() + "",
				expert_id : req.session.loggedInUser.id,
				name : req.session.loggedInUser.name,
				date : new Date(),
				answer : req.body.ans,
				is_deleted : false
			};

			collection.update(

			{
				_id : new ObjectId(req.body.id)
			}, {
				$push : {
					response : QueResponse
				},
				$set : {
					status : "Resolved"
				}
			}, function(err, updated) {
				if (err || !updated)
					
				winston.warn('Error expertAnswer (query) User not updated');
   	
				else
					console.log("User updated");

				AskExpert.findOne(req.body.id).exec(
					function(err, result) {
						var toReceiver = result.askedByEmail;
						var asked_query_Email = "";
						var name = result.modifiedBy;
						var loginurl = sails.config.routesPrefix;

						User.find({
							role : [ "Admin" ],
							is_deleted : "false"
						}).exec(
						function(err, userList) {

							var emailReceiverList = " ";

							for (var j = 0; j < userList.length; j++) {
								asked_query_Email += userList[j].email
								+ ",";
							}

							EmailService.expertAnswer(toReceiver,
								asked_query_Email, name, loginurl);

							winston.info('End expertAnswer (query) ');
   	
							UserService.getPendingActionFAQ(req,function(finalResult) {
							return res.json(updated);
							});
						});
					});
			});
			
		},

		checkForExpertGroup : function(req, res) {

			var grpId = req.body.id;
			var grpList = [];

				winston.info('Start checkForExpertGroup (query) grpId: '+req.body.id);
   	

			var mongo = require('mongodb');
			var collection = MongoService.getDB().collection('groupdetail');

			if (grpId == null || grpId == undefined) {
				return res.json({
					flag : 0
				});
			} else {

				for (var i = 0; i < grpId.length; i++) {

					var ObjectId = require('mongodb').ObjectID;

					grpList.push(new ObjectId(grpId[i]));
				}

				var cursor = collection.find({
					_id : {
						$in : grpList
					}
				});

				cursor.toArray(function(err, result) {

					var flag = 0;

					for (var i = 0; i < result.length; i++) {
						for (var j = 0; j < result[i].purpose.length; j++) {
							if (result[i].purpose[j] == "Ask the Expert") {
								flag = 1;
								break;

							}
						}
					}

					winston.info('End checkForExpertGroup (query) grpId: '+req.body.id);
   	
					return res.json({
						flag : flag
					});

				});

			}
		},

		deleteAnswer : function(req, res) {

			var flag = 0;

			var mongo = require('mongodb');
			var collection = MongoService.getDB().collection('askexpert');

			winston.info('Start deleteAnswer (query) questionId: '+req.body.questionId);
   	

			AskExpert.findOne(req.body.questionId).exec(function(err, query) {

				for (var i = 0; i < query.response.length; i++) {
					if (query.response[i]._id == req.body.answerId) {
						query.response[i].is_deleted = true;
					}
				}

				for (var i = 0; i < query.response.length; i++) {
					if (query.response[i].is_deleted == false) {
						flag = 1;
					}
				}

				if (flag == 1) {
					query.status = "Resolved";
				} else {
					query.status = "Pending";
				}

				query.save(function(err) {
					if (err) {
						winston.warn('Error deleteAnswer (query) query save ');
   	
						res.send("Error");

					} else {
						winston.info('End deleteAnswer (query) questionId: '+req.body.questionId);
   	
						return res.json(query);
					}
				});
			});

		},

		updateAnswer : function(req, res) {

			var mongo = require('mongodb');
			var collection = MongoService.getDB().collection('askexpert');

			winston.info('Start updateAnswer (query) questionId: '+req.body.questionId);
   	
			AskExpert.findOne(req.body.questionId).exec(
				function(err, query) {

					for (var i = 0; i < query.response.length; i++) {
						if (query.response[i]._id == req.body.answerId) {
							query.response[i].answer = req.body.answer;
							query.response[i].UpdatedBy_expert_id = req.session.loggedInUser.id;
							query.response[i].UpdatedBy_name = req.session.loggedInUser.name;
							query.response[i].UpdatedAt_date = new Date();
						}
					}
					query.save(function(err) {
						if (err) {
							winston.warn('Startrror updateAnswer (query) query save ');
   	
							res.send("Error");
						} else {
							winston.info('End updateAnswer (query) questionId: '+req.body.questionId);
   	
							return res.json(query);
						}
					});
				});
		},
		exportExcel:function(req,res) {
			var unit = req.param("section");
			unit = unit.replace(/'/g, '"');
			unit = JSON.parse(unit);
			console.log("unit here----"+typeof(unit));
			console.log(unit);
			var mongo = require('mongodb');
			var collection = MongoService.getDB().collection('askexpert');

				if ((unit == '' || unit == "All")) {
					var cursor = collection.find({
						"is_deleted":false 
					});
				} else {
					var cursor = collection.find({
						$and : [{
							section : {
								$in : unit
							},"is_deleted":false
						} ]
					});
				}
			cursor.toArray(function(err, result) {

				if (err) {
					console.log(err);
					winston.warn('Error queAnslist in finding query based on filter ');
				} else {
					  // prepare excel
				var http = require('http');
        		var fs = require('fs');
				var xlsxFileName = ".tmp/excelFile.xlsx";
		        var xl = require('excel4node');
		        var wb = new xl.Workbook();
		        var ws = wb.addWorksheet('Ask_Expert');
		        var sheetRow = 1;

		        // styles
		        var mainHeadingStyle
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


		        ws.row(sheetRow).setHeight(70);
		        // heading
		        ws.cell(sheetRow,1,sheetRow++,11,true).string('KePSIE Monitoring System, Ministry of Health')
		          .style({alignment : {horizontal:['center'],vertical:['center']}, font: {color: 'black',size: 13,bold: true}});
		        
		        ws.cell(sheetRow,1,sheetRow++,11,true).string('Ask the Expert')
			       .style({alignment : {horizontal:['center']}, font: {color: 'white',size: 13,bold: true}, fill: {
			        type: "pattern",
			        patternType : "solid",
			        fgColor: "#31708f",
			        bgColor: "#31708f"
			    }});
		        ws.cell(sheetRow,1,sheetRow++,11,true).string('Questions and Answers')
			       .style({alignment : {horizontal:['center']}, font: {color: 'white',size: 13,bold: true}, fill: {
			        type: "pattern",
			        patternType : "solid",
			        fgColor: "#31708f",
			        bgColor: "#31708f"
		      	}});

				ws.cell(sheetRow,1).string("Category/JHIC Section").style(headerCenterStyle);
		        ws.cell(sheetRow,2).string("JHIC Sub-section").style(headerCenterStyle);
		        ws.cell(sheetRow,3).string("JHIC Sub-sub-section").style(headerCenterStyle);
		        ws.cell(sheetRow,4).string("Expert(s)").style(headerCenterStyle);
		        ws.cell(sheetRow,5).string("Query").style(headerCenterStyle);
		        ws.cell(sheetRow,6).string("Date of Query").style(headerCenterStyle);
		        ws.cell(sheetRow,7).string("Status").style(headerCenterStyle);
		        ws.cell(sheetRow,8).string("Answer").style(headerCenterStyle);
		        ws.cell(sheetRow,9).string("Answered by (Organization of Expert)").style(headerCenterStyle);
		        ws.cell(sheetRow,10).string("Answered by (Name of Expert)").style(headerCenterStyle);
		        ws.cell(sheetRow,11).string("Date of Answer").style(headerCenterStyle);
		        ws.row(sheetRow).filter({});
        sheetRow++;

		async.eachSeries(result, function(obj, callback1) {

          var ans = "";	
		  
		  obj['query']=obj['query'].replace(/<(?:.|\n)*?>/gm, '');
          obj['query']=obj['query'].replace(/&nbsp;/gi,"");
 
          
        if(obj["status"]=="Resolved" && obj["response"] != undefined){
        	console.log("test1");
          async.eachSeries(obj["response"], function(row, callback) {
          	var response = row;
          	console.log("test2");
          	if(response["is_deleted"]==false){
          		response['answer']=response['answer'].replace(/<(?:.|\n)*?>/gm, '');
          		response['answer']=response['answer'].replace(/&nbsp;/gi,"");
          		var usrID= response["expert_id"];
          		if(response["UpdatedBy_expert_id"]!=undefined){
          			usrID= response["UpdatedBy_expert_id"];
          		}
          		User.findOne(usrID).exec(function(err,user){
                  
                if(err){
              	 	console.log(err);
              	}else{
              		
		          	ws.cell(sheetRow,1).string(obj['section']).style(normalCenterStyle);
		          	ws.cell(sheetRow,2).string(obj['sub_section']).style(normalCenterStyle);
		         	ws.cell(sheetRow,3).string(obj['sub_sub_section']).style(normalCenterStyle);
		          	ws.cell(sheetRow,4).string(obj['board']).style(normalCenterStyle);
		           	ws.cell(sheetRow,5).string(obj['query']).style(normalCenterStyle);
		          	ws.cell(sheetRow,6).date(obj['createdAt']).style(normalCenterStyle);
		          	ws.cell(sheetRow,7).string(obj['status']).style(normalCenterStyle);
		          	ws.cell(sheetRow,8).string(response['answer']).style(normalCenterStyle);
		           	ws.cell(sheetRow,9).string(user.organization).style(normalCenterStyle);
		          	ws.cell(sheetRow,10).string(user.name).style(normalCenterStyle);
		          	ws.cell(sheetRow,11).date(response['date']).style(normalCenterStyle);
          	
          			sheetRow++;
          		}
          	  });
          	}
          	callback();
          });
        }else{
        	ws.cell(sheetRow,1).string(obj['section']).style(normalCenterStyle);
          	ws.cell(sheetRow,2).string(obj['sub_section']).style(normalCenterStyle);
         	ws.cell(sheetRow,3).string(obj['sub_sub_section']).style(normalCenterStyle);
          	ws.cell(sheetRow,4).string(obj['board']).style(normalCenterStyle);
           	ws.cell(sheetRow,5).string(obj['query']).style(normalCenterStyle);
          	ws.cell(sheetRow,6).date(obj['createdAt']).style(normalCenterStyle);
          	ws.cell(sheetRow,7).string(obj['status']).style(normalCenterStyle);
          	
          sheetRow++;
        }
        callback1();
    });
		ws.column(1).setWidth(25);
      	ws.column(2).setWidth(25);
      	ws.column(3).setWidth(25);
      	ws.column(4).setWidth(20);
      	ws.column(5).setWidth(20);
      	ws.column(6).setWidth(20);
      	ws.column(7).setWidth(20);
      	ws.column(8).setWidth(20);
      	ws.column(9).setWidth(25);
     	ws.column(10).setWidth(25);
    	ws.column(11).setWidth(20);
       
        setTimeout(sendExcelFile,1000);

		        function sendExcelFile() {

				    wb.write(xlsxFileName, function (err, stats) {
				        if (err) {
				            console.error(err);
				        } 

				        var fs = require('fs');
				        
				        var fileName = "Ask_Expert_"+(CountyService.formateDate())+".xlsx";
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

			}
		});
		}
	};
