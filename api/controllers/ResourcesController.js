/**
 * ResourcesController
 *
 * @description :: Server-side logic for managing resources
 * @author : Jay Pastagia
 */
var path=require('path');
var fs = require('fs'); 

 module.exports = {

 	resources: function(req,res) {

 		console.log("resources list========");

 		Resources.find({is_deleted:false}).exec(function(err, resourceList) {

 			res.view('reports/resources',{resources:resourceList});

 		});
 	},
 	upload: function  (req, res) {



 req.file('file').upload({
  dirname: require('path').resolve(sails.config.appPath, './assets/resource')
},function (err, uploadedFiles) {

 if (err) return res.negotiate(err);

 var filename=path.basename(uploadedFiles[0].fd);

 var filedir = uploadedFiles[0].fd;

 var fn=filedir.replace("assets",".tmp/public");

 var uploadLocation = filedir;
 var tempLocation = fn;

 fs.createReadStream(uploadLocation).pipe(fs.createWriteStream(tempLocation));

        // fs.createReadStream(sails.config.appPath+'/assets/upload/'+filename).pipe(unzip.Extract({
		// path: 'assets/upload' }));

    return res.json({
      path:filename,
      filename:uploadedFiles[0].filename

    });
  }); 

},
 	categoryList: function(req,res) {


 		var columns=["id", "name"];
 		var iDisplayStart=req.query.iDisplayStart;
 		var iDisplayLength=req.query.iDisplayLength;
 		console.log(iDisplayLength);
 		var showPage=parseInt(iDisplayStart/iDisplayLength)+1;
 		console.log(showPage);
 		var iSortCol_0=req.query.iSortCol_0;
 		var sSortDir_0=req.query.sSortDir_0;
 		var sSearch=req.query.sSearch;
 		var sortColumn="";
 		if(columns[iSortCol_0]=="id"){
 			sortColumn=""+"createdAt"+" "+"desc";
 		}else{
 			var sortColumn=""+columns[iSortCol_0]+" "+sSortDir_0;
 		}    

 		if(sSearch != ""){  

 			Resources.count({ where: {
 				'is_deleted': false,   $or: [
 				{'name': { 
 					'startsWith': sSearch 
 				}}
 				]
 			}}).exec(function(err, nos) {
 				Resources.find({
 					where:{
 						'is_deleted':false ,
 						$or: [
 						{'name': { 
 							'startsWith': sSearch 
 						}}
 						]
 					}
 				}).paginate({
 					page: showPage, limit: iDisplayLength
 				}).sort(sortColumn).exec(function(err, categories){
 					res.send({
 						"aaData":categories, "iTotalRecords": nos, "iTotalDisplayRecords": nos
 					});
 				});
 			});
 		}
 		else{
 			Resources.count({ where: {
 				'is_deleted': false
 			}}).exec(function(err, nos) {

 				if(iDisplayLength==-1){
 					showPage=0;
 					iDisplayLength=nos;
 				}

 				Resources.find({'is_deleted':false}).paginate({page: showPage, limit: iDisplayLength}).sort(sortColumn).exec(function foundUsers(err,categories){

 					res.send({"aaData":categories, "iTotalRecords": nos, "iTotalDisplayRecords": nos});
 				});
 			});
 		}


 	},

 	includeResources:function(req,res){

 		var clsrId=req.param('id');

 		Resources.find({id:clsrId,'is_deleted':false}).exec(function foundUsers(err,resources){

 		res.view('reports/includeResources',{resources:resources});
 	});
 	},

 	newCategory:function(req,res){

 		Resources.create(req.body,function categoryCreated(err,category){
 			if(err) {
 				return res.json(err);
 			}
 			return res.json(category);
 		});
 	},

 	editCategory:function(req,res) {
 		
 		var category=req.body;

 		Resources.update(category.id,category,function updated(err,category){

 			console.log(category);
 			res.redirect(sails.config.routesPrefix+'/resources');

 		});
 	},
 	deleteCategory:function(req,res) {
 		var category=req.body;
 		
 		Resources.update({id:category.id},{is_deleted:true},function updated(err,category){

 			res.view('reports/resources');

 		});
 	},
 	addSubList:function(req,res) {

 		var subList=req.body;
 		subList.subListId=parseInt(new Date().getTime());
 		subList.createdAt= new Date();
 		var categoryId=req.param('categoryId');

 		Resources.findOne(categoryId).exec(function(err, resourceList) {

 			if(resourceList.subList==undefined){

 				resourceList.subList=[];
 				resourceList.subList.push(subList);
 			}else{
 				resourceList.subList.push(subList);
 			}
 			resourceList.save();
 			res.json(resourceList);
 		});


 	},
 	categorySubList:function(req,res){


 		var columns=["id", "name"];
 		var iDisplayStart=req.query.iDisplayStart;
 		var iDisplayLength=req.query.iDisplayLength;
 		console.log(iDisplayLength);
 		var showPage=parseInt(iDisplayStart/iDisplayLength)+1;
 		console.log(showPage);
 		var iSortCol_0=req.query.iSortCol_0;
 		var sSortDir_0=req.query.sSortDir_0;
 		var sSearch=req.query.sSearch;
 		var sortColumn="";
 		var userRole = req.session.loggedInUser.role; 
        var filterRole = ["All"];
 		if(userRole != "Admin") {
 			filterRole.push(userRole);
 		}
 		if(columns[iSortCol_0]=="id"){
 			sortColumn=""+"createdAt"+" "+"desc";
 		}else{
 			var sortColumn=""+columns[iSortCol_0]+" "+sSortDir_0;
 		}    

 		var categoryId = req.param("categoryId");

 		console.log("category Id");
 		console.log(categoryId);

 		var mongo = require('mongodb');
 		var collection = MongoService.getDB().collection('resources');
 		var o_id = new mongo.ObjectID(categoryId);
        var cursor;
 		if(sSearch != ""){  

 			if(userRole != "Admin") {
 				 cursor=collection.aggregate([{$unwind:'$subList'},{$match:{ $or : [
                 // $regex can not work on numbers   {_hfid: { "$regex": sSearch}},
                 {"subList.name": { "$regex": sSearch}}],'_id':o_id,'subList.is_deleted':false}},
                 {$sort: {"subList.createdAt": -1}}]);
 			}else {
 				cursor=collection.aggregate([{$unwind:'$subList'},{$match:{ $or : [
                 // $regex can not work on numbers   {_hfid: { "$regex": sSearch}},
                 {"subList.name": { "$regex": sSearch}}],"subList.role": { "$in": filterRole},'_id':o_id,'subList.is_deleted':false}},
                 {$sort: {"subList.createdAt": -1}}]);
 			}

 			 

 			cursor.toArray(function(err, resultSubList) {

 				if(iDisplayLength==-1){
 					showPage=0;
 					iDisplayLength=resultSubList.length;
 				}


 				res.send({"aaData":resultSubList.slice(iDisplayStart, (iDisplayStart+iDisplayLength)),
 					"iTotalRecords": resultSubList.length, "iTotalDisplayRecords": resultSubList.length});
 			});
 		}
 		else{
 			
 			if(userRole != "Admin") {
 				cursor=collection.aggregate([{$unwind:'$subList'},{$match:{"subList.role": { "$in": filterRole},'_id':o_id,'subList.is_deleted':false}},
 				{$sort: {"subList.createdAt": -1}}]);
 			}else{
 				var cursor=collection.aggregate([{$unwind:'$subList'},{$match:{'_id':o_id,'subList.is_deleted':false}},
 				{$sort: {"subList.createdAt": -1}}]);
 			}

 			
 			cursor.toArray(function(err, resultSubList) {

 				console.log(resultSubList);


 				if(iDisplayLength==-1){
 					showPage=0;
 					iDisplayLength=resultSubList.length;
 				}

 				res.send({"aaData":resultSubList.slice(iDisplayStart, (iDisplayStart+iDisplayLength)),
 					"iTotalRecords": resultSubList.length, "iTotalDisplayRecords": resultSubList.length});
 			});

 		}
 	},

 	deleteSubList:function(req,res) {
 		var subList=req.body;
 		console.log("deleteSubList")
 		console.log(subList.subListId);

 		var mongo = require('mongodb');
 		var collection = MongoService.getDB().collection('resources');
 		var o_id = new mongo.ObjectID(subList.categoryId);

 		console.log(o_id);

 		var cursor= collection.update({_id:o_id,"subList.subListId":parseInt(subList.subListId)},
 			{ $set: { "subList.$.is_deleted" : true } }, function(err, updated) {

 				console.log("updated");
 				console.log(updated);

 				res.json(updated);
 			});
 	},

 	userCategorySubList:function(req,res) {

 		console.log("categorySubListView");

 		res.view('reports/categorySubList');
 	},

 	checkCategory:function(req,res) {

 		console.log("checkCategory---------");
 		console.log(req.body.categoryName);

 		Resources.findOne({name:req.body.categoryName,'is_deleted': false}).exec(function(err, category) {

 			return res.json(category);     
 		});

 	},

 	checkCategorySubList:function(req,res) {

 		console.log(req.body.categoryId+"=============="+req.body.categorySubListName);

 		var mongo = require('mongodb');
 		var collection = MongoService.getDB().collection('resources');
 		var o_id = new mongo.ObjectID(req.body.categoryId);

 		var cursor= collection.find({"_id" :o_id,'is_deleted': false,
 			subList:{ $elemMatch: { name: req.body.categorySubListName,  "is_deleted" : false}}}
 			);

 			 cursor.toArray(function(err, category) {

 				console.log("checkCategorySubList");

 			return res.json(category);     
 		});

 	},

 	editCategorySubList:function(req,res){
 		var subList=req.body;
 		console.log("editCategorySubList")
 		console.log(subList.subListId);

 		var mongo = require('mongodb');
 		var collection = MongoService.getDB().collection('resources');
 		var o_id = new mongo.ObjectID(req.param('id'));

 		console.log(o_id);

 		var cursor= collection.update({_id:o_id,"subList.subListId":parseInt(subList.subListId)},
 			{ $set: { "subList.$" : subList } }, function(err, updated) {

 				console.log("updated");
 				console.log(updated);

 				res.json(updated);
 			});
 	},

 	editCategorySubListName:function(req,res){
 		var subList=req.body;
 		console.log("editCategorySubList")
 		console.log(subList.subListId);

 		var mongo = require('mongodb');
 		var collection = MongoService.getDB().collection('resources');
 		var o_id = new mongo.ObjectID(req.param('id'));



 		console.log(o_id);

 		var cursor= collection.update({_id:o_id,"subList.subListId":parseInt(subList.subListId)},
 			{ $set: { "subList.$.name" : subList.name, "subList.$.description" : subList.description,"subList.$.link" : subList.link } }, function(err, updated) {

 				console.log("updated");
 				
 				res.json(updated);
 			});
 	},
 	editSubListLink:function(req,res){
 		var subList=req.body;
 		console.log("editSubListLink===========")
 		console.log(subList.subListId);
 		subList.subListId=parseInt(subList.subListId);
 		subList.is_deleted = false;
 		subList.updatedAt=new Date();
 		var mongo = require('mongodb');
 		var collection = MongoService.getDB().collection('resources');
 		var o_id = new mongo.ObjectID(req.param('id'));

 		

 		console.log(o_id);

 		var cursor= collection.update({_id:o_id,"subList.subListId":parseInt(subList.subListId)},
 			{ $set:{ "subList.$":subList }}, function(err, updated) {

 				res.json(updated);
 			});
 	},

 };

