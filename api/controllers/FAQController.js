/**
 * FAQController
 *
 * @description :: Server-side logic for managing FAQS
 * @author : Mayur Tanna
 */
var nodemailer = require('async');
module.exports = {
	 faq: function(req, res) {
      res.view('faq/viewallfaq'); 
     },
      add: function(req, res) {
      res.view('faq/addquestion'); 
     },

     import: function(req, res) {
     	GroupDetail.find({'is_deleted': "false"}).exec(function(err, group) {
 
    return res.view('faq/viewallexpertque',{
      groupDetail: group
    });
  });
     },

      importAll: function(req, res) {
     	console.log("import all");
     	var queList = req.body.list;
     
        var modelList  = [];

     	if(queList!=""){
 						AskExpert.find({where: {id : queList }}).exec(function(err, list) {
 							console.log("model");
	console.log(list);
 							 async.each(list, function(question, callback) {

    // Perform operation on file here.
    console.log('Processing model ');
    var model = {};
                                model.question = question.query;
 								var response = question.response;
 								var answer = "";
 								if(response != null && response != "") {
 										for(i =0;i<response.length;i++) {
 												answer += response[i].answer;
 										}
 										model.answer = answer;
 								}
 								
 								model.section = question.section;
 								model.is_deleted = false;
 								modelList.push(model);
   
      // Do work to process file here
      console.log('que processed');
      callback();
  
}, function(err) {
    // if any of the file processing produced an error, err would equal that error
    if( err ) {
      // One of the iterations produced an error.
      // All processing will now stop.
      console.log('A model failed to process');
    } else {
      console.log('All question have been processed successfully');
     console.log(modelList);
     	  FAQ.create(modelList,function(err,faqs){
         if(err) {
               return res.json("error");
         }else {
    	       res.json("ok");
         }    
     });

    }
});


});
 					
}
  
      },

      importOne: function(req, res) {
     	 var id = req.body.id;
     	 console.log("importOne"+id);
     	 AskExpert.findOne(id).exec(function(err, question) {
     	 	if(err) {
     	 		console.log(err);
     	 		res.json("error");
     	 	}
     	 	var model = {};
     	 	console.log("question");
     	 	console.log(question);
     	 	model.question = question.query;
     	 	model.category = question.section;
     	 	var response = question.response;
 								var answer = "";
 								if(response != null && response != "") {
 										for(i =0;i<response.length;i++) {
 												answer += response[i].answer;
 										}
 										model.answer = answer;
 										
 								}
 								model.is_deleted = false;
 								FAQ.create(model,function(err,question1){
         if(err) {
         	   console.log(err);
               return res.json("error");
         }else {
         	console.log("successfully created");
         	 
    	       res.json(question1); 
         }    
     });


    	            
    	 });
      },



      edit: function(req, res) {
      	res.view('faq/editquestion'); 
     },


     editdata : function(req,res) {
     			var queid= req.param('id');
                 FAQ.findOne(queid).exec(function(err, question) {
    	             console.log("inside edit"+question.id);
                 return res.json(question);
       });
     },

      update: function(req, res) {
      	console.log("update");
         var question= req.body;
         var id = question.id;
         console.log(id);
         question.modifiedBy= req.session.loggedInUser.name;
         question.is_deleted = false;

         FAQ.update(id,question,function(err,question){
         if(err) {
               return res.send("error");
         }else {
         	req.flash('faqUpdateMessage', 'Question edited successfully');
    	       return res.json(question);
         }    
     });
     },
      save: function(req, res) {
        console.log("save");
         var question= req.body;
         
         question.createdBy= req.session.loggedInUser.name;
         question.modifiedBy= req.session.loggedInUser.name;
         question.is_deleted = false;

         FAQ.create(question,function(err,question){
         if(err) {
               return res.json(question);
         }else {
         	req.flash('faqAddMessage', 'Question added successfully');
    	    res.json(question);
         }    
     });
     },

    delete: function(req, res) {
    	console.log("delete- que");
    var queId = req.body.id;
   console.log("id"+queId);
    FAQ.findOne(queId).exec(function(err, question) {
    	console.log("inside find"+question.id);
        question.is_deleted = "true";
        question.save(function(err) {
            if (err) {
                res.send("Error");
                console.log("Error");
            }else{
                            req.flash('faqDeletedMessage', 'Question deleted successfully');
                            return res.json(question);
                        }
                    });

    });
},

     getFAQs: function (req, res) { 
    console.log("getFAQs");
    var columns=["question"];
    var iDisplayStart=req.query.iDisplayStart;
    var iDisplayLength=req.query.iDisplayLength;
    console.log(iDisplayLength);
    var showPage=parseInt(iDisplayStart/iDisplayLength)+1;
    console.log(showPage);
    var iSortCol_0=req.query.iSortCol_0;
    var sSortDir_0=req.query.sSortDir_0;
    var sSearch=req.query.generalSearchText;
    var unit=req.query.unit;
    var sortColumn="";
    if(columns[iSortCol_0]=="id"){
      sortColumn=""+"createdAt"+" "+"desc";
    }else{
      var sortColumn=""+columns[iSortCol_0]+" "+sSortDir_0;
    }    

    if(sSearch != "" && (unit == "All" || unit == "")){  
      console.log(" search term");
      FAQ.count({ where: {'is_deleted': false,'question': { 'contains': sSearch }}}).exec(function(err, nos) {
        FAQ.find({ where: { 'is_deleted': false, 'question': { 'contains': sSearch  }}}).paginate({
          page: showPage, limit: iDisplayLength
        }).exec(function(err, faqs){
          res.send({
            "aaData":faqs, "iTotalRecords": nos, "iTotalDisplayRecords": nos
          });
        });
      });
    }else  if(sSearch != "" && (unit != "All" && unit != "")){  
      console.log(" search term");
      FAQ.count({ where: {'is_deleted': false,'question': { 'contains': sSearch  }}}).exec(function(err, nos) {
        FAQ.find({ where: { 'is_deleted': false,'question': { 'contains': sSearch  }, 'category': unit}}).paginate({
          page: showPage, limit: iDisplayLength
        }).exec(function(err, faqs){
          res.send({
            "aaData":faqs, "iTotalRecords": nos, "iTotalDisplayRecords": nos
          });
        });
      });
    }else  if(sSearch == "" && (unit != "All" && unit != "")){  
      console.log(" search term");
      FAQ.count({ where: {'is_deleted': false,'category': unit}}).exec(function(err, nos) {
        FAQ.find({ where: {'is_deleted': false, 'category': unit}}).paginate({
          page: showPage, limit: iDisplayLength
        }).exec(function(err, faqs){
          res.send({
            "aaData":faqs, "iTotalRecords": nos, "iTotalDisplayRecords": nos
          });
        });
      });
    } else{
    	console.log("no search term");
     FAQ.count({where: {'is_deleted': false}}).exec(function(err, nos) {
     	console.log("nos -- "+nos);
      if(iDisplayLength==-1){
        showPage=0;
        iDisplayLength=nos;
      }

      FAQ.find({where: {'is_deleted': false}}).paginate({page: showPage, limit: iDisplayLength}).exec(function(err,faqs){
       console.log("faqs");
       res.send({"aaData":faqs, "iTotalRecords": nos, "iTotalDisplayRecords": nos});
     });
    });
   }

 },
};

