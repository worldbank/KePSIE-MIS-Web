
//var nodemailer = require('nodemailer');

module.exports = {
	getInspectorNames: function(loggedInUser, county, callback) {
    var getInspectorNames = [];
    var collection = MongoService.getDB().collection('facility');
    
    if(county.value=="All") {


     var cursor = collection.aggregate([{$match:{is_deleted:false}},{$group:{_id:'$_inspectorid',name : { $first: '$_inspectorname'}}},{ $match : { _id : { $ne : null } } }]);
     cursor.toArray(function(err1, inspector) {
      console.log("inspector");
      console.log(inspector[0]);

      
      callback(inspector);
    });
     
   } else {

    var cursor = collection.aggregate([{$match:{_county:county.value,is_deleted:false}},
      {$group:{_id:'$_inspectorid',name : { $first: '$_inspectorname'}}},{ $match : { _id : { $ne : null } } }]);
    cursor.toArray(function(err1, inspector) {
     console.log("inspector");
     console.log(inspector[0]);
     

     callback(inspector);
   });
    
  }
   /* }else if( countyLevelUser.indexOf(loggedInUser.role)!=-1){

      var cursor = collection.aggregate([{$match:{_county:county.value,is_deleted:false}},{$group:{_id:'$_inspectorid',name : { $first: '$_inspectorname'}}},{ $match : { _id : { $ne : null } } }]);
      cursor.toArray(function(err1, inspector) {
       console.log("inspector");
       console.log(inspector[0]);
       

       callback(inspector);
     });*/

    /*} else {
      callback([{name:loggedInUser.name,_id:loggedInUser.inspectorId}]);
    }*/
  },
  getInspectorNamesByCounty: function(loggedInUser, county, callback) {
    var getInspectorNames = [];
    var collection = MongoService.getDB().collection('facility');
    

    var countyLevelUser=UserService.getCountyUser();
    var nationalLevelUser=UserService.getNationalUser();
    var cursor;

    if(loggedInUser.role!="Inspector"){
     if(county.value=="All") {


       var cursor = collection.aggregate([{$match:{is_deleted:false}},{$group:{_id:'$_inspectorid',name : { $first: '$_inspectorname'}}},{ $match : { _id : { $ne : null } } }]);
       cursor.toArray(function(err1, inspector) {
        console.log("inspector");
        console.log(inspector[0]);
        callback(inspector);
        
      });
       
     } else {

      var cursor = collection.aggregate([{$match:{_county:county.value,is_deleted:false}},
        {$group:{_id:'$_inspectorid',name : { $first: '$_inspectorname'}}},{ $match : { _id : { $ne : null } } }]);
      cursor.toArray(function(err1, inspector) {
       console.log("inspector");
       console.log(inspector[0]);
       
       callback(inspector);
       
     });
      
    }
  }else {


   callback([{name:loggedInUser.name,_id:loggedInUser.inspectorId}]);
   
 }


 
 
 
},


getInspectionPeriods: function(loggedInUser, county,inspector, callback) {
  var getInspectorNames = [];
  var collection = MongoService.getDB().collection('facility');
  console.log("loggedInUser.role : "+loggedInUser.role);

  console.log("inspector------- "+inspector.name);

      console.log("inside p_period");
      collection.distinct('p_period', function(err, docs) {
        console.log("inside result1");
        var monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        docs.sort(function(a,b){
            return new Date(b) - new Date(a);
        });
        /*for (var i = 0; i < docs.length; i++) {
          docs[i]=monthNames[docs[i].getMonth()]+"-"+docs[i].getFullYear();
        }*/
        
        callback(docs);
      });           
   

      },

      getInspectionPeriodsByRole: function(loggedInUser, county,inspector, callback) {
        var getInspectorNames = [];
        var collection = MongoService.getDB().collection('facility');
        console.log("loggedInUser.role : "+loggedInUser.role);

        console.log("inspector------- "+inspector.name);

      //  if(loggedInUser.role=="Admin" || loggedInUser.role=="Report Viewer(National)") {
       if(county.value=="All" && inspector.name=="All" ) {
        console.log("inside p_period");
        collection.distinct('p_period', function(err, docs) {
          console.log("inside result1");
          console.log(docs);
          callback(docs);
        });           
      } else if(inspector.name=="All"){
        collection.distinct('p_period',{_county:county.value}, function(err, docs) {
          console.log("inside result1");
          console.log(docs);
          callback(docs);
        });
      } else if(county.value=="All"){
        collection.distinct('p_period',{_inspectorname:inspector.name}, function(err, docs) {
          console.log("inside result1");
          console.log(docs);
          callback(docs);
        });
      }else{

        collection.distinct('p_period',{_county:county.value,_inspectorname:inspector.name}, function(err, docs) {
          console.log("inside result1");
          console.log(docs);
          callback(docs);
        });

      } 

    },

//       crudMail:function(receiver,action,loginurl,user) {

//         console.log("crudMail");
//         var msg;
//         //console.log("username in crud: "+user.name);
//         if(action=="updated"){
//          msg="Dear "+user.name+

// ",<br><br>Your account has been updated in the KePSIE Inspection Monitoring System."+

// "<br><br>Type KePSIE in your web browser or click on the following link: <a href="+loginurl+" target='_blank'>"+loginurl+"</a>"+

// "<br><br>Username: "+user.email+

// "<br><br>Please contact us at kepsie@worldbank.org with any questions or issues with the system."+

// "<br><br>Thank you."+ 

// "<br><br>Best Regards,"+
// "<br>KePSIE Team";
//        }else if(action=="deleted"){
//          msg= "Dear "+user.name+

// ",<br><br>Your account has been deleted from the KePSIE Inspection Monitoring System."+

// "<br><br>Username: "+user.email+

// "<br><br>Please contact us at kepsie@worldbank.org with any questions or issues with the system."+

// "<br><br>Thank you."+ 

// "<br><br>Best Regards,"+
// "<br>KePSIE Team";
//        }

//        var transporter = nodemailer.createTransport("SMTP",{
//         service: 'Gmail',
//         auth: {
//    user: 'kenyapatientsafety@gmail.com',
//    pass: 'patientsafety'

    
//  }
//       });    

//        var mailOptions = {
//                                 from: 'kepsienoreply@gmail.com', // sender address
//                                 to: receiver, // list of receivers
//                                 subject: 'Kepsie Notification', // Subject line
//                                 html: msg
//                               };

//                               transporter.sendMail(mailOptions, function(error, info){
//                                 if(error){
//                                   return console.log(error);
//                                 }
//                                 return ;
//                               });    

//                             },

updateUser: function(userId, user, callback) {

  console.log("update user service");

  User.update(userId,user,function userCreated(err,user){

    console.log("user updated");
    callback(user);
  });

},
getQualityOfficersNames: function(loggedInUser, county, callback) {
  var getQualityOfficersNames = [];
  var collection = MongoService.getDB().collection('facility');
  var userRole=['Admin','WB -Supervisors',
  'MOH Coordinator'];

  if (userRole.indexOf(loggedInUser.role)!=-1) {
    if(county.value=="All") {
   var cursor = collection.aggregate([{$match:{is_deleted:false}},{$group:{_id:'$q_qoid',name : { $first: '$q_qoname'}}},{ $match : { _id : { $ne : null } } }]);
   cursor.toArray(function(err1, officer) {
    console.log("officer");
    console.log(officer[0]);


    callback(officer);
  });
 } else {
  var cursor = collection.aggregate([{$match:{_county:county.value,is_deleted:false}},{$group:{_id:'$q_qoid',name : { $first: '$q_qoname'}}},{ $match : { _id : { $ne : null } } }]);
  cursor.toArray(function(err1, officer) {
   console.log("officer");
   console.log(officer[0]);


   callback(officer);
 });
}
} else {
  callback([{name:loggedInUser.name,_id:loggedInUser.inspectorId}]);
}
},
getCountyUser:function(){

  return ["Counties - CEC","Counties - CDH",
  'Counties - Focal points',
  'Report Viewer(County)',
  'Limited'];

},
getNationalUser:function(){

  return  [
  'Admin','Report Viewer(National)','B&Cs - ITEG','B&Cs - Licensing decision-makers',
  'B&Cs - Other B&Cs members','MOH Coordinator','WB -Supervisors','WB - HIA Team',
  'WB - Research team','High-level - KTF, WB','Steering Committee','Logistics Firm'];
},

getPendingActionFAQ:function(req,callback){

var newQueNotifyUser=['Admin','B&Cs - ITEG','B&Cs - Licensing decision-makers','MOH Coordinator'];

if(newQueNotifyUser.indexOf(req.session.loggedInUser.role)!=-1) {

 var conditionString={ status : { $eq : "Pending"},is_deleted:false};

 var newQueNotifyUser=['B&Cs - ITEG','B&Cs - Licensing decision-makers'];

 if(newQueNotifyUser.indexOf(req.session.loggedInUser.role)!=-1){
  conditionString.board={$in:[req.session.loggedInUser.group]};
}

var collection = MongoService.getDB().collection('askexpert');

var cursor  = collection.find(conditionString); 
var faqArr = [];

cursor.toArray(function (err, result) {

  if (err) {
    console.log(err);
  } else {
   var customResult = {};

   for(i =0; i < result.length;i++) {
    customResult = {};
    customResult.text = "New Question Asked by "+result[i].createdBy;
    customResult.type = "AskExpert";
    customResult.id = result[i]._id;
    customResult.createdAt = result[i].createdAt;
    faqArr.push(customResult);
  }

  faqArr.sort(function(a,b) { 
    return new Date(b.createdAt).getTime()- new Date(a.createdAt).getTime() 
  });
  req.session.actions = faqArr;
  callback(req.session);

}
});
}else{
  callback(req.session);
}
},

/*getPendingActionClosure:function(callback){

 var collection = MongoService.getDB().collection('facility');
 
 var cursor  =  collection.aggregate(
  { "$match" : { "FacilityClosureDetails" : { "$elemMatch" : { "ms_close" :1}},
    "is_deleted":false}},
  { "$unwind" : "$FacilityClosureDetails"},
  { $project : { _hfname : 1 , 'FacilityClosureDetails.ms_date' : 1 } }
  );
 var closureArr = [];

 cursor.toArray(function (err, result) {

  if (err) {
    console.log(err);
  } else {
   var customResult = {};

   for(i =0; i < result.length;i++) {
    customResult = {};
    customResult.text = "Closure Request for "+result[i]._hfname;
    customResult.type = "Closure";
    customResult.createdAt = result[i].FacilityClosureDetails.ms_date;
    closureArr.push(customResult);
  }
  
  console.log(result.length);
  
  console.log("returning");
  callback(closureArr);

}
});
},*/

/*getPendingActionClosureIssues:function(callback){

  var collection = MongoService.getDB().collection('otherissues');
  var cursor  = collection.find({is_deleted:false}); 
  var issueArr = [];

  cursor.toArray(function (err, result) {

    if (err) {
      console.log(err);
    } else {
     var customResult = {};

     for(i =0; i < result.length;i++) {
      customResult = {};
      customResult.text = "Issue Reported by "+result[i].inspectorName;
      customResult.type = "ClosureIssue";
      customResult.createdAt = result[i].createdAt;
      issueArr.push(customResult);
    }
    
    console.log(result.length);
    
    console.log("returning");
    callback(issueArr);

  }
});


},*/


/*
getPendingActionDepartmentClosure:function(callback){

  var collection = MongoService.getDB().collection('facility');
  var cursor  =  collection.aggregate(
    { "$match" : { "departmentClosureDetails" : { "$elemMatch" : { "ms_close_dep" :1}},
    "is_deleted":false}},
    { "$unwind" : "$departmentClosureDetails"},
    { $project : { '_hfname' : 1 , 'departmentClosureDetails.departmentName' : 1,
    'departmentClosureDetails.ms_date' : 1 } }
    );

  var issueArr = [];

  cursor.toArray(function (err, result) {

    if (err) {
      console.log(err);
    } else {
     var customResult = {};

     for(i =0; i < result.length;i++) {
      customResult = {};
      customResult.text = result[i].departmentClosureDetails.departmentName+" Department Closure for "+result[i]._hfname;
      customResult.type = "DepartmentClosure";
      customResult.createdAt = result[i].departmentClosureDetails.ms_date;
      issueArr.push(customResult);
    }
    
    console.log(issueArr);
    
    console.log("returning");
    callback(issueArr);

  }
});

}*/

}