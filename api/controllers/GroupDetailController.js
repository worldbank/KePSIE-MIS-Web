/**
 * OtherIssuesController
 *
 * @description : Server-side logic for Group Management
 * @author : Jay Pastagia
 */
 module.exports = {
 	'all':function(req,res,next){
 		res.view('group/all');
 	},
 	'list':function(req,res,next){
 		var columns=["name","no_of_members"];
 		var iDisplayStart=req.query.iDisplayStart;
 		var iDisplayLength=req.query.iDisplayLength;
 		var showPage=parseInt(iDisplayStart/iDisplayLength)+1;
 		var iSortCol_0=req.query.iSortCol_0;
 		var sSortDir_0=req.query.sSortDir_0;
 		var sSearch=req.query.sSearch;
 		var sortColumn="";
 		if(iSortCol_0==undefined){
 			sortColumn=""+"createdAt"+" "+"desc";
 		}else{
 			sortColumn=""+columns[iSortCol_0]+" "+sSortDir_0;;
 		}  

 		if(sSearch != ""){     

 			GroupDetail.count({ where: {
 				'is_deleted': "false",'name': { 
 					'startsWith': sSearch 
 				}}}).exec(function(err, nos) {


 					GroupDetail.find({
 						where:{
 							'is_deleted': "false", "purpose" : "Ask the Expert",
 							'name': { 
 								'startsWith': sSearch 
 							}
 						}
 					}).paginate({
 						page: showPage, limit: iDisplayLength
 					}).sort(sortColumn).exec(function(err, users){
 						res.send({
 							"aaData":users, "iTotalRecords": nos, "iTotalDisplayRecords": nos
 						});
 					});
 				});
 			}
 			else{


 				GroupDetail.count({'is_deleted': "false"}).exec(function(err, nos) {

 					if(iDisplayLength==-1){
 						showPage=0;
 						iDisplayLength=nos;
 					}

 					GroupDetail.find({'is_deleted': "false"}).paginate({page: showPage, limit: iDisplayLength}).sort(sortColumn).exec(function foundUsers(err,users){


 						res.send({"aaData":users, "iTotalRecords": nos, "iTotalDisplayRecords": nos});
 					});
 				});
 			}

 		},
 		'new':function(req,res,next){
 			res.view('group/new');
 		},
 		'create':function(req,res,next){
 			var group= req.body;
 			group.is_deleted= "false",
 			group.createdBy= req.session.loggedInUser.name;
 			group.modifiedBy= req.session.loggedInUser.name;
 			
 			GroupDetail.create(group,function groupCreated(err,group){
 				console.log("memberList");
 				console.log(group.memberList);
 				if(group.memberList!=""){
 					var list=group.memberList.split(',');

 					for(var i=0;i<list.length;i++){
 						User.findOne(list[i]).exec(function(err, model) {
 							console.log("model");
 							console.log(model);
 							delete model.password;
              //  model.groupId.push(group.id);
              if(model.groupId==undefined){
              	model.groupId=[];
              	model.groupId.push(group.id);
              }else{
              	model.groupId.push(group.id);
              }
              console.log(model.groupName);
              if(model.groupName==undefined){
              	model.groupName=[];
              	model.groupName.push(group.name);
              }else{
              	model.groupName.push(group.name);
              }

           console.log(model.groupId);
           model.modifiedBy= req.session.loggedInUser.name;
           User.update(model.id,model,function userCreated(err,user){
           });
               });
 					}
 				}


req.flash('groupAddedMessage', 'Group added successfully');
return res.json(group);
});
 		},
 		'edit':function(req,res,next){
 			res.view('group/edit');
 		},
 		'detail':function(req,res,next){
 			var groupId = req.param('id');
 			console.log(groupId);
 			GroupDetail.findOne(groupId).exec(function(err, group) {
 				console.log(group);
 				return res.json(group);  
 			});
 		},
 		checkGroup : function(req,res){

 			GroupDetail.findOne({name:req.body.name,is_deleted: "false"}).exec(function(err, user) {

 				return res.json(user);     
 			});
 		},
 		'update':function(req,res,next){
 			var group= req.body;
      console.log(group);

 			group.modifiedBy= req.session.loggedInUser.name;

 			group.modifiedAt=new Date();
 			
 			GroupDetail.update(group.id,group,function groupCreated(err,grp){
 				var mongo = require('mongodb');
  
   var collection = MongoService.getDB().collection('user');
   var cursor = collection.update({ },{ $pull: { 'groupId':  req.body.id,'groupName':  req.body.name } },
   	{multi: true });

   if(group.memberList!=""){
   	var list=group.memberList.split(',');
   
   	for(var i=0;i<list.length;i++){
   		User.findOne(list[i]).exec(function(err, model) {
   			
   			delete model.password;
              //  model.groupId.push(group.id);
              if(model.groupId==undefined){
              	model.groupId=[];
              	model.groupId.push(group.id);
              }else{
              	model.groupId.push(group.id);
              }
              console.log(model.groupName);
              if(model.groupName==undefined){
              	model.groupName=[];
              	model.groupName.push(group.name);
              }else{
              	model.groupName.push(group.name);
              }
           
           console.log(model.groupId);
           model.modifiedBy= req.session.loggedInUser.name;
           User.update(model.id,model,function userCreated(err,user){
           });
                 
               });
   	}
   }
   req.flash('groupUpdatedMessage', 'Group updated successfully');
   return res.json(grp); 
 });

 		},

 		delete: function(req, res) {

 			var groupId = req.body.id;

 			GroupDetail.findOne(groupId).exec(function(err, group) {
 				group.is_deleted = "true";
 				group.save(function(err) {
 					if (err) {
 						res.send("Error");
 					}else{

 						var mongo = require('mongodb');
   
   var collection = MongoService.getDB().collection('user');
   var cursor = collection.update({ },{ $pull: { 'groupId':  req.body.id,'groupName':  req.body.name } },
   	{multi: true });

   req.flash('groupDeletedMessage', 'Group deleted successfully');
   return res.json(group);
 }
});

 			});
 		},

    'upload':function(req,res,next){
      res.view('upload');
    },

  }

