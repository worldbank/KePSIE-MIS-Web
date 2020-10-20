var nodemailer = require('nodemailer');
var fs = require('fs');
var transporter = nodemailer.createTransport("SMTP",{
    service: 'Gmail',
    auth: {
        user: 'kepsienoreply@gmail.com',
        pass: 'kepsie12345'
    }
});    

module.exports = {

    crudMail:function(receiver,action,loginurl,user,randomPassword,ciphertext) {

        console.log("crudMail");
        var msg;
        var subjectline;

        if(action=="updated"){
            msg="Dear "+user.name+

            ",<br><br>Your account has been updated in the KePSIE Inspection Monitoring System."+

            "<br><br>Click on the following link: <a href="+sails.config.routesPrefix+" target='_blank'>"+sails.config.routesPrefix+"</a>"+

            "<br><br>Username: "+user.email+

            "<br><br>Please contact us at kenyapatientsafety@gmail.com with any questions, issues, or requests."+
            
            "<br><br>Thank you."+ 

            "<br><br>Best Regards,"+
            "<br>KePSIE Team";

            subjectline='[KePSIE Inspection Monitoring System] Kepsie Notification';
        }
        else if(action=="deleted"){
            msg= "Dear "+user.name+

            ",<br><br>Your account has been deleted from the KePSIE Inspection Monitoring System."+

            "<br><br>Username: "+user.email+

            "<br><br>Please contact us at kenyapatientsafety@gmail.com with any questions, issues, or requests."+
            
            "<br><br>Thank you."+ 

            "<br><br>Best Regards,"+
            "<br>KePSIE Team";

            subjectline='[KePSIE Inspection Monitoring System] Kepsie Notification';
        }

        else if(action=="added"){
            msg= "Dear "+user.name+

            ",<br><br>Your account has been created in the KePSIE Inspection Monitoring System."+

            "<br><br>Click on the following link: <a href="+sails.config.routesPrefix+" target='_blank'>"+sails.config.routesPrefix+"</a>"+

            "<br><br>Username: "+user.email+
            "<br>Password: "+randomPassword+

            "<br><br>Please contact us at kenyapatientsafety@gmail.com with any questions, issues, or requests."+
            "<br><br>Thank you."+ 

            "<br><br>Best Regards,"+
            "<br>KePSIE Team";

            subjectline='Welcome to the KePSIE Inspection Monitoring System';
        }

        else if(action=="reset password"){
        //console.log("username in reset: "+user);
        msg= 
        "You can reset your password by clicking on this link: <a href='"+sails.config.routesPrefix+"/changePassword?id=" + ciphertext.toString() + "'>Click here to reset your password</a>"+

        "<br><br>Thank you."+ 

        "<br><br>Best Regards,"+
        "<br>KePSIE Team";

        subjectline='Reset password, Click on link to reset your password';
    }

    var mailOptions = {
                            from: 'kepsienoreply@gmail.com', // sender address
                            to: receiver, // list of receivers
                            subject: subjectline, // Subject line
                            html: msg
                        };

                        transporter.sendMail(mailOptions, function(error, info){
                            if(error){
                                return console.log(error);
                            }
                            return ;
                        });    

                    },

                    mailIndividualReport:function(emailData,callback){

                        var userListTO=emailData.toReceiver;

                        var toReceiver="";
                        if(userListTO!=undefined){
                            for (var j = 0; j < userListTO.length; j++) {
                                toReceiver+=userListTO[j]+",";
                            }
                        }


                        var userListCC=emailData.ccReceiver;
                        var ccReceiver="";
                        if(userListCC!=undefined){
                            for (var j = 0; j < userListCC.length; j++) {
                                ccReceiver+=userListCC[j]+",";
                            }

                        }

                        var userListBCC=emailData.bccReceiver;
                        var bccReceiver="";
                        if(userListBCC!=undefined){
                            for (var j = 0; j < userListBCC.length; j++) {
                                bccReceiver+=userListBCC[j]+",";
                            }
                        }

                        var mailOptions = {
    from: 'kepsienoreply@gmail.com', // sender address
    //to: userList[0].email, // list of receivers
    to: toReceiver,
    cc: ccReceiver,
    bcc:bccReceiver,

subject:emailData.subject, // Subject line
html:emailData.content,
attachments: [{ 
    filePath: '.tmp/'+emailData.mailReportHeader+'.pdf',
}]

};
// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }

    callback();

});







},


AskExpert:function(uniqueEmail,uniqueName,loginurl,dt) {


   for (var i = 0; i < uniqueEmail.length; i++) {


      var mailOptions = {
from: 'kepsienoreply@gmail.com', // sender address
to: uniqueEmail[i], // list of receivers
subject: '[KePSIE Inspection Monitoring System] Request for JHIC Clarification', // Subject line

html: "<body style='font-family: calibri,sans-serif;font-size:14px'>Dear "+uniqueName[i]+

",<br><br>You have received a request from an inspector for clarification on the Joint Health Inspection Checklist."+
" Please see details of the query and kindly respond using the link below by <i>"+dt+

"</i>.<br><br>Link: <i><a href="+sails.config.routesPrefix+" target='_blank'>"+sails.config.routesPrefix+"</a></i>"+

"<br><br>Sincerely,"+
"<br>KePSIE Team</body>" 
};
// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
});  
}
},

expertAnswer:function(toReceiver,asked_query_Email,name,loginurl){

    console.log(asked_query_Email);

    var mailOptions = {
                            from: 'kepsienoreply@gmail.com', // sender address
                            to: toReceiver,
                            cc: asked_query_Email, // list of receivers
                            subject: '[KePSIE Inspection Monitoring System] Issue Resolved', // Subject line
                            html: "<body style='font-family: calibri,sans-serif;font-size:14px'> Dear "+name+",<br><br>Thank you for submitting a question through the KePSIE Monitoring System's \"Ask the Expert\" function."+
                            " Your question has already been answered. "+
                            " <br><br>Please log in to see details of the response here: <i> <a href="+sails.config.routesPrefix+" target='_blank'>"+sails.config.routesPrefix+"</a></i> <br><br>Sincerely,<br>KePSIE Team" 
                        };

                        transporter.sendMail(mailOptions, function(error, info){
                            if(error){
                                return console.log(error);
                            }
                        });    

                    },

                    FacilitySendEmail:function(failedCount,insertCount,failedRecordArr,duplicateRecordArr,name,callback){
                        console.log(failedCount+"-------"+insertCount+"--------"+name);
                        var receiver=name;
                        var html= "Hi, <br/><br/>Please find below summary of the data upload. <br/> <br/> Number of Health Facilities Saved: "+insertCount+".";

                        if(duplicateRecordArr.length>0) {
                           html = html + "<br/><br/> Number of Health Facilities Failed to Save becauseof duplicate records in csv: "+duplicateRecordArr.length+". <br/><br/>The Following facilities have not been saved because of duplicate records in csv: "+duplicateRecordArr.toString()+".<br/>"; 
                        }

                        if(failedCount > 0) {
                            html = html + "<br/><br/> Number of Health Facilities Failed to Save: "+failedCount+". <br/><br/>The Following facilities have not been saved: "+failedRecordArr.toString()+".<br/><br/> Thank you.";
                        } else {
                            html = html + "<br/><br/> Thank you.";
                        }

                        var mailOptions = {
                        from: 'kepsienoreply@gmail.com', // sender address
                        to: receiver, // list of receivers
                        subject: 'KePSIE - Health Facility Data Upload', // Subject line
                        html : html,
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                        console.log(error);
                        console.log(info);
                        if(error){
                            callback(false)
                        }else{
                            callback(true);
                        }
                    });    

                },

                facilityClosure_1:function(facilityList,dt,loginurl){

                    console.log("facilityClosure_1");

                    User.find({role :["Counties - CEC","Counties - CDH"],county:facilityList._county,is_deleted: "false"}).exec(function(err, userList) {

                        var emailReceiverList=" ";

                        for (var j = 0; j < userList.length; j++) {
                            emailReceiverList+=userList[j].email+",";
                        }

                        User.find({role :"Counties - Focal points",county:facilityList._county,is_deleted: "false"}).exec(function(err, userList) {

                            var ccReceiverList=" ";

                            for (var j = 0; j < userList.length; j++) {
                                ccReceiverList+=userList[j].email+",";
                            }

                            User.find({
                                
                                or : [{
                                    role :"WB -Supervisors",county:facilityList._county,
                                    is_deleted: "false"},
                                    {
                                        role :"Admin",
                                        is_deleted: "false"}

                                        ]
                                    }).exec(function(err, userListBCC) {

                                        var bccReceiverList=" ";

                                        for (var j = 0; j < userListBCC.length; j++) {
                                            bccReceiverList+=userListBCC[j].email+",";
                                        }
                                        

                                        var mailOptions = {
    from: 'kepsienoreply@gmail.com', // sender address
    to: emailReceiverList,
    cc: ccReceiverList,
    bcc:bccReceiverList,

        subject: '[KePSIE Monitoring System] Physical Closure not Completed', // Subject line
        html: "<i>***This is a system-generated email***</i><br><br><body style='font-family: calibri,sans-serif;font-size:14px'>Dear All,"+
        "<br><br>Based on the result of joint inspection conducted on "+facilityList._date+", facility "+ facilityList._hfname+
        ", with MFL code "+ facilityList._hfid+" was notified for closure. The facility is supposed to close within 24 hours after closure notice"+
        " is received. However, no action has been taken in the system to record physical closure yet."+ 

        "<br><br>If the facility has not been closed yet, please proceed to physically close it. If the facility has"+
        " already been closed, please access the following link to record your action in the system: "+
        "<br>Link: <a href="+sails.config.routesPrefix+" target='_blank'>"+sails.config.routesPrefix+"</a>"+
        "<br><br>"+dt+"" 
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }

    }); 
});
                                });
                    });

                },

                FacilityClosure_2:function(result,closureDetail,date_close_by,date_appeal_by,name,designation,dt,emailReceiverList,attachment,loginurl){
                    var attachedFiles=[];
                    
                    if(result.p_market_id!=undefined){
                        attachedFiles.push({ 
                            filePath: ".tmp/facilityList.pdf",
                        })

                    }
                    attachedFiles.push(attachment)
                    var loggedInUser=name;
                    User.find({
                        or : [{
                            role :"Counties - Focal points",county:result._county,
                            is_deleted: "false"},
                            {
                                role :'MOH Coordinator',
                                is_deleted: "false"},
                                {
                                    role :'B&Cs - Licensing decision-makers',
                                    group:["Clinical Officers Council","Nursing Council of Kenya","Medical Practitioners and Dentists Board"],
                                    is_deleted: "false"}

                                    ]}).exec(function(err, userList) {


                                        var ccReceiverList=loggedInUser.email+",";

                                        for (var j = 0; j < userList.length; j++) {
                                            ccReceiverList+=userList[j].email+",";
                                        }

                                        User.find({
                                            or : [{
                                                role :"WB -Supervisors",county:result._county,
                                                is_deleted: "false"},
                                                {
                                                    role :"Admin",
                                                    is_deleted: "false"}

                                                    ]

                                                }).exec(function(err, userListBCC) {

                                                    var bccReceiverList=" ";

                                                    for (var j = 0; j < userListBCC.length; j++) {
                                                        bccReceiverList+=userListBCC[j].email+",";
                                                    }

                                                    var mflNumber=" ";

                                                    if(result._mfl!=undefined){
                                                        mflNumber=result._mfl;
                                                    }


                                                    var mailOptions = {
    from: 'kepsienoreply@gmail.com', // sender address
    to: emailReceiverList,
    cc: ccReceiverList,
    bcc:bccReceiverList,

    subject: '[KePSIE Monitoring System] Facility Closure Notice', // Subject line
    html: "<body style='font-family: calibri,sans-serif;font-size:14px'>Dear "+result._county+"  CEC and CDH,"+
    "<br><br>According to the result of the joint inspection conducted on "+result._date+", the facility "+ result._hfname+", "+
    "MFL number: "+ mflNumber+", was notified for closure, due to the following reason: "+closureDetail.reason+". Please find attached the summary of the inspection report. The full report will be available in the KePSIE monitoring system. We are also including information on the number and type of facilities that are close to "+ result._hfname+" for your reference. "+ 

    "<br><br>The next action is to proceed to physically close the facility by "+date_close_by+". If the county government or the relevant Boards and Councils "+
    "decides to appeal this closure notice, please do so by "+date_appeal_by+" . "+
    " <br><br>Sincerely, <br>"+loggedInUser.name+
    "<br>Joint Health Inspector"+"<br>"+dt+"" ,

    attachments: attachedFiles

};
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        if(result.p_market_id!=undefined){
            fs.unlink(".tmp/facilityList.pdf", function(err){
                if (err) throw err;
                console.log('successfully deleted .tmp/attachment.pdf');
            });
        }
    });
});
                                            });
                                },

                                FacilityClosure_3:function(_date,updated,ms_date_closed,dt){

                                    User.find({role :["Counties - CEC","Counties - CDH"],county:updated._county,is_deleted: "false"}).exec(function(err, userList) {

                                        var emailReceiverList=" ";

                                        for (var j = 0; j < userList.length; j++) {
                                            emailReceiverList+=userList[j].email+",";
                                        }

                        //inspector email fron facilty 
                        emailReceiverList+=updated.s1a_3e;

                        User.find({role :"Counties - Focal points",county:updated._county,is_deleted: "false"}).exec(function(err, userList) {

                            var ccReceiverList=" ";

                            for (var j = 0; j < userList.length; j++) {
                                ccReceiverList+=userList[j].email+",";
                            }

                            User.find({
                                or : [{
                                    role :"WB -Supervisors",county:updated._county,
                                    is_deleted: "false"},
                                    {
                                        role :"Admin",
                                        is_deleted: "false"}

                                        ]


                                    }).exec(function(err, userListBCC) {

                                        var bccReceiverList=" ";

                                        for (var j = 0; j < userListBCC.length; j++) {
                                            bccReceiverList+=userListBCC[j].email+",";
                                        }
                                        

                                        var mailOptions = {
    from: 'kepsienoreply@gmail.com', // sender address
    to: emailReceiverList,
    cc: ccReceiverList,
    bcc:bccReceiverList,

    subject: '[KePSIE Monitoring System] Physical Closure', // Subject line
    html: "<body style='font-family: calibri,sans-serif;font-size:14px'>Dear All,"+
    "<br><br>Based on the result of joint inspection conducted on "+_date+", we have "+
    "physically closed facility "+updated._hfname+" with MFL code " +updated._hfid+" on "+ms_date_closed+"."+
    "<br><br>Sincerely,<br><i>County CEC/Director for Health<br>"+dt+"</i></body>"


};
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }

    }); 
});
                                });
                    });
                                },

                                FacilityClosure_4:function(departmentName,_date,updated,ms_date_closed_dep,dt){

                                    User.find({role :["Counties - CEC","Counties - CDH"],county:updated._county,is_deleted: "false"}).exec(function(err, userList) {

                                        var emailReceiverList=" ";

                                        for (var j = 0; j < userList.length; j++) {
                                            emailReceiverList+=userList[j].email+",";
                                        }

                        //inspector email fron facilty 
                        emailReceiverList+=updated.s1a_3e;

                        User.find({role :"Counties - Focal points",county:updated._county,is_deleted: "false"}).exec(function(err, userList) {

                            var ccReceiverList=" ";

                            for (var j = 0; j < userList.length; j++) {
                                ccReceiverList+=userList[j].email+",";
                            }

                            User.find({
                                or : [{
                                    role :"WB -Supervisors",county:updated._county,
                                    is_deleted: "false"},
                                    {
                                        role :"Admin",
                                        is_deleted: "false"}

                                        ]

                                    }).exec(function(err, userListBCC) {

                                        var bccReceiverList=" ";

                                        for (var j = 0; j < userListBCC.length; j++) {
                                            bccReceiverList+=userListBCC[j].email+",";
                                        }
                                        
                                        var mailOptions = {
    from: 'kepsienoreply@gmail.com', // sender address
    to: emailReceiverList,
    cc: ccReceiverList,
    bcc:bccReceiverList,

subject: 'KePSIE Monitoring System] Physical Closure:'+departmentName, // Subject line
html: "<body style='font-family: calibri,sans-serif;font-size:14px'>Dear All,"+
"<br><br>Based on the result of joint inspection conducted on "+_date+", we have "+
"physically closed department "+departmentName+" in the facility " +updated._hfname+" with MFL code "+updated._hfid+" on "+ms_date_closed_dep+"."+
"<br><br>Sincerely,<br><i>County CEC/Director for Health<br>"+dt+"</i>"


};
// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }

}); 
});
                                });
                    });
                                },

                                FacilityClosure_5:function(_date,updated,appealReason,dt){

                                    User.find({role :["Counties - CEC","Counties - CDH"],county:updated._county,is_deleted: "false"}).exec(function(err, userList) {

                                        var emailReceiverList=" ";

                                        for (var j = 0; j < userList.length; j++) {
                                            emailReceiverList+=userList[j].email+",";
                                        }

                        //inspector email fron facilty 
                        emailReceiverList+=updated.s1a_3e;

                        User.find({role :"Counties - Focal points",county:updated._county,is_deleted: "false"}).exec(function(err, userList) {

                            var ccReceiverList=" ";

                            for (var j = 0; j < userList.length; j++) {
                                ccReceiverList+=userList[j].email+",";
                            }

                            User.find({
                                or : [{
                                    role :"WB -Supervisors",county:updated._county,
                                    is_deleted: "false"},
                                    {
                                        role :"Admin",
                                        is_deleted: "false"}

                                        ]

                                    }).exec(function(err, userListBCC) {

                                        var bccReceiverList=" ";

                                        for (var j = 0; j < userListBCC.length; j++) {
                                            bccReceiverList+=userListBCC[j].email+",";
                                        }


                                        var mailOptions = {
    from: 'kepsienoreply@gmail.com', // sender address
    to: emailReceiverList,
    cc: ccReceiverList,
    bcc:bccReceiverList,

subject: '[KePSIE Monitoring System] Appeal', // Subject line
html: "<body style='font-family: calibri,sans-serif;font-size:14px'>Dear All,"+
"<br><br>Based on the result of joint inspection conducted on "+_date+", "+
"facility "+updated._hfname+" with MFL code " +updated._hfid+" was notified for closure."+
" Due to "+appealReason+", we have decided to appeal this closure notice, so the facility "+
"should remain open."+

"<br><br>Sincerely,<br><i>County CEC/Director for Health<br>"+dt+"</i></body>"


};
// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }

}); 
});
                                });
                    });
                                },

                                FacilityClosure_6:function(_date,updated,appealReason,dt){

                                    User.find({role :["Counties - CEC","Counties - CDH"],county:updated._county,is_deleted: "false"}).exec(function(err, userList) {

                                        var emailReceiverList=" ";

                                        for (var j = 0; j < userList.length; j++) {
                                            emailReceiverList+=userList[j].email+",";
                                        }

                        //inspector email fron facilty 
                        emailReceiverList+=updated.s1a_3e;

                        User.find({role :"Counties - Focal points",county:updated._county,is_deleted: "false"}).exec(function(err, userList) {

                            var ccReceiverList=" ";

                            for (var j = 0; j < userList.length; j++) {
                                ccReceiverList+=userList[j].email+",";
                            }

                            User.find({
                                or : [{
                                    role :"WB -Supervisors",county:updated._county,
                                    is_deleted: "false"},
                                    {
                                        role :"Admin",
                                        is_deleted: "false"}

                                        ]
                                    }).exec(function(err, userListBCC) {

                                        var bccReceiverList=" ";

                                        for (var j = 0; j < userListBCC.length; j++) {
                                            bccReceiverList+=userListBCC[j].email+",";
                                        }


                                        var mailOptions = {
    from: 'kepsienoreply@gmail.com', // sender address
    to: emailReceiverList,
    cc: ccReceiverList,
    bcc:bccReceiverList,
subject: '[KePSIE Monitoring System] Appeal', // Subject line
html: "<body style='font-family: calibri,sans-serif;font-size:14px'>Dear All,"+
"<br><br>Based on the result of joint inspection conducted on "+_date+", "+
"facility "+updated._hfname+" with MFL code " +updated._hfid+" was notified for closure."+
" Due to "+appealReason+", we have decided to appeal this closure notice, so the facility "+
"should remain open."+

"<br><br>Sincerely,<br><i>County CEC/Director for Health<br>"+dt+"</i></body>"


};
// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }

}); 
});
                                });
                    });
                                },

                                FacilityClosure_7:function(facilityList,closureDetail,dt,loginurl){

                                    User.find({role :["Counties - CEC","Counties - CDH"],county:facilityList._county,is_deleted: "false"}).exec(function(err, userList) {

                                        var emailReceiverList=" ";

                                        for (var j = 0; j < userList.length; j++) {
                                            emailReceiverList+=userList[j].email+",";
                                        }

                                        User.find({role :"Counties - Focal points",county:facilityList._county,is_deleted: "false"}).exec(function(err, userList) {

                                            var ccReceiverList=" ";

                                            for (var j = 0; j < userList.length; j++) {
                                                ccReceiverList+=userList[j].email+",";
                                            }

                                            User.find({
                                                or : [{
                                                    role :"WB -Supervisors",county:facilityList._county,
                                                    is_deleted: "false"},
                                                    {
                                                        role :"Admin",
                                                        is_deleted: "false"}

                                                        ]

                                                    }).exec(function(err, userListBCC) {

                                                        var bccReceiverList=" ";

                                                        for (var j = 0; j < userListBCC.length; j++) {
                                                            bccReceiverList+=userListBCC[j].email+",";
                                                        }


                                                        var mailOptions = {
    from: 'kepsienoreply@gmail.com', // sender address
    to: emailReceiverList,
    cc: ccReceiverList,
    bcc:bccReceiverList,

subject: 'Subject: [KePSIE Monitoring System] Physical Closure not Completed '+ closureDetail.departmentName, // Subject line
html: "<i>***This is a system-generated email***</i><br><br><body style='font-family: sans-serif;font-size:14px'>Dear All,"+
"<br><br>Based on the result of joint inspection conducted on "+facilityList._date+", "+closureDetail.departmentName+ " in facility"+
" "+ facilityList._hfname+" with MFL code "+ facilityList._hfid+" was  notified for closure. The department is supposed to close within 24 hours after closure notice"+
" is received. However, no action has been taken in the system to record physical closure yet."+ 

"<br><br>If the department has not been closed yet, please proceed to physically close it. If the department has"+
" already been closed, please access the following link to record your action in the system:"+
"<br>Link: <i><a href="+sails.config.routesPrefix+" target='_blank'>"+sails.config.routesPrefix+"</a> "+
"<br><br>"+dt+"</i>" 
};
// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }

});
});
                                                });
                                    });
                                },

                                FacilityClosure_8:function(closureDetail,result,dt,designation,date_close_by,name,attachment,emailReceiverList,loginurl){


                                    var loggedInUser=name;
                                    User.find({
                                        or : [{
                                            role :"Counties - Focal points",county:result._county,
                                            is_deleted: "false"},
                                            {
                                                role :'MOH Coordinator',
                                                is_deleted: "false"},
                                                {
                                                    role :'B&Cs - Licensing decision-makers',
                                                    group:["Pharmacy and Poisons Board","Medical Laboratory Technicians and Technologists Board",
                                                    "Radiation Protection Board","Nutritionists and Dieticians Institute","Medical Practitioners and Dentists Board"],
                                                    is_deleted: "false"}

                                                    ]}).exec(function(err, userList) {

                                                        var ccReceiverList=loggedInUser.email+",";

                                                        for (var j = 0; j < userList.length; j++) {
                                                            ccReceiverList+=userList[j].email+",";
                                                        }

                                                        User.find({
                                                            or : [{
                                                                role :"WB -Supervisors",county:result._county,
                                                                is_deleted: "false"},
                                                                {
                                                                    role :"Admin",
                                                                    is_deleted: "false"}

                                                                    ]

                                                                }).exec(function(err, userListBCC) {

                                                                    var bccReceiverList=" ";

                                                                    for (var j = 0; j < userListBCC.length; j++) {
                                                                        bccReceiverList+=userListBCC[j].email+",";
                                                                    }

                                                                 var mflNumber=" ";

                                                                 if(result._mfl!=undefined){
                                                                    mflNumber=result._mfl;
                                                                }



                                                                var mailOptions = {
    from: 'kepsienoreply@gmail.com', // sender address
    to: emailReceiverList,
    cc: ccReceiverList,
    bcc:bccReceiverList,

subject: '[KePSIE Monitoring System] Closure Notice: '+ closureDetail.departmentName , // Subject line
html: "<body style='font-family: calibri,sans-serif;font-size:14px'>Dear "+result._county+"  CEC and CDH,"+
"<br><br>According to the result of joint inspection conducted on "+result._date+", the "+ closureDetail.departmentName+" in the facility "+ result._hfname+
", with MFL code: "+ mflNumber+" was notified for closure due to lack of registration/license."+ 

"<br><br>The CEC’s next action is to proceed to physically close this department by "+date_close_by+"."+

"<br><br>Sincerely,<br><i>"+loggedInUser.name+
designation+"<br>"+dt+"</i>" ,

attachments: [attachment]

};
// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }

});
});
                                                            });
                                                },

                                                FacilityClosure_9:function(updated,ms_date,dt){

                                                    User.find({role :["Counties - CEC","Counties - CDH"],county:updated._county,is_deleted: "false"}).exec(function(err, userList) {

                                                        var emailReceiverList=" ";

                                                        for (var j = 0; j < userList.length; j++) {
                                                            emailReceiverList+=userList[j].email+",";
                                                        }

                        //inspector email fron facilty 
                        emailReceiverList+=updated.s1a_3e;

                        User.find({role :"Counties - Focal points",county:updated._county,is_deleted: "false"}).exec(function(err, userList) {

                            var ccReceiverList=" ";

                            for (var j = 0; j < userList.length; j++) {
                                ccReceiverList+=userList[j].email+",";
                            }

                            User.find({
                                or : [{
                                    role :"WB -Supervisors",county:updated._county,
                                    is_deleted: "false"},
                                    {
                                        role :"Admin",
                                        is_deleted: "false"}

                                        ]

                                    }).exec(function(err, userListBCC) {

                                        var bccReceiverList=" ";

                                        for (var j = 0; j < userListBCC.length; j++) {
                                            bccReceiverList+=userListBCC[j].email+",";
                                        }
                                        

                                        var mailOptions = {
    from: 'kepsienoreply@gmail.com', // sender address
    to: emailReceiverList,
    cc: ccReceiverList,
    bcc:bccReceiverList,

subject: '[KePSIE Monitoring System] Reopening of Closed Facility', // Subject line
html: "<body style='font-family: calibri,sans-serif;font-size:14px'>Dear All,"+
"<br><br>For your information, the facility "+ updated._hfname +" with MFL code "+ updated._hfid +", closed after the joint inspection conducted on "+ms_date+" has been reopened.<br><br>"+dt+""


};
// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }

}); 
});
                                });
                    });
                                                },

                                                FacilityClosure_10:function(updated,ms_date,dt){
                                                    User.find({role :["Counties - CEC","Counties - CDH"],county:updated._county,is_deleted: "false"}).exec(function(err, userList) {

                                                        var emailReceiverList=" ";

                                                        for (var j = 0; j < userList.length; j++) {
                                                            emailReceiverList+=userList[j].email+",";
                                                        }

                        //inspector email fron facilty 
                        emailReceiverList+=updated.s1a_3e;

                        User.find({role :"Counties - Focal points",county:updated._county,is_deleted: "false"}).exec(function(err, userList) {

                            var ccReceiverList=" ";

                            for (var j = 0; j < userList.length; j++) {
                                ccReceiverList+=userList[j].email+",";
                            }

                            User.find({
                                or : [{
                                    role :"WB -Supervisors",county:updated._county,
                                    is_deleted: "false"},
                                    {
                                        role :"Admin",
                                        is_deleted: "false"}

                                        ]

                                    }).exec(function(err, userListBCC) {

                                        var bccReceiverList=" ";

                                        for (var j = 0; j < userListBCC.length; j++) {
                                            bccReceiverList+=userListBCC[j].email+",";
                                        }


                                        var mailOptions = {
    from: 'kepsienoreply@gmail.com', // sender address
    to: emailReceiverList,
    cc: ccReceiverList,
    bcc:bccReceiverList,

subject: '[KePSIE Monitoring System] Reopening of Closed Department', // Subject line
html: "<body style='font-family: calibri,sans-serif;font-size:14px'>Dear All,"+
"<br><br>For your information, the facility "+ updated._hfname +" with MFL code "+ updated._hfid +", closed after the joint inspection conducted on "+ms_date+" has been reopened.<br><br>"+dt+""


};
// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }

}); 
});
});
});
                                                },
    weeklyClosureEmail:function(detail,callback){

       var county=detail.county;
       var department=detail.indicator;

       var fromDate = detail.fromDate;
       var toDate = detail.toDate;

       var fromDateArray = fromDate.split("-");
       var toDateArray = toDate.split("-");
       var fromDateObj = new Date(fromDateArray[2], parseInt(fromDateArray[1])-1, parseInt(fromDateArray[0]));
       var toDateObj = new Date(toDateArray[2], parseInt(toDateArray[1])-1, parseInt(toDateArray[0])+1);

       department_array=[];

       if(Array.isArray(department)){
          department_array=department;
      }else{
          department_array.push(department);
      }

    var conditionStringFacility={ "is_deleted" : false,'m_insp_completed': "Yes","_date": {"$gte": fromDateObj, "$lt": toDateObj}};
    var conditionStringDepartment={ "is_deleted" : false,'m_insp_completed': "Yes","_date": {"$gte": fromDateObj, "$lt": toDateObj}};
    var conditionString = {"is_deleted":false,"m_insp_completed": "Yes","_date": {"$gte": fromDateObj, "$lt": toDateObj}};

    if(county!="All"){
        conditionStringFacility._county=CountyService.getCounty(county);
        conditionStringDepartment._county=CountyService.getCounty(county);
        conditionString._county=CountyService.getCounty(county);
    }
    if(department!="All"){
          conditionStringDepartment["departmentClosureDetails.departmentName"]={$in:department_array};
      }
        var conditionArray=[];
    if(department=="All"){
        conditionArray=[ { f_close_reglic:2},{pharm_close:2},
        {lab_close:2},{rad_close:2},{nutri_close:2}];
    }else if(department=="Facility"){
        conditionArray=[{f_close_reglic:2}];
    }else{
        var graceVar=CountyService.getGracedDeptVar();  
        for(d in department_array){
            console.log(department_array[d]);
            if(department_array[d]=="Facility"){
                conditionArray.push({f_close_reglic:2});                            
            }else{
                var tmp={};
                tmp[graceVar[department_array[d]]]=2;
                conditionArray.push(tmp);                       
            }
        }
    }

      var mongo = require('mongodb');
      var collection = MongoService.getDB().collection('facility');

      var grace = collection.aggregate([{$match:  {"is_deleted":false,
    "m_insp_completed": "Yes", $or: conditionArray
  }},
  /*{$sort: {p_insp_number: 1}},
  {$group: {_id: "$_hfid",
  latest: {$last: "$$ROOT"}}},*/
  {$sort: {"_date": -1}}]);

  var cursor=collection.aggregate([
    {$match:conditionStringFacility},
    /*{
                  $sort: {
                    p_insp_number: 1
                  }
                }, {
                  $group: {
                    _id: "$_hfid",latest: {
                      $last: "$$ROOT"
                    }
                  }
                },*/
    {$unwind:'$FacilityClosureDetails'},
    {$sort: {"_date": -1}}]);


  var cursor1=collection.aggregate([
    {$match:conditionStringDepartment},
    /*{
                  $sort: {
                    p_insp_number: 1
                  }
                }, {
                  $group: {
                    _id: "$_hfid",latest: {
                      $last: "$$ROOT"
                    }
                  }
      },*/
    {$unwind:'$departmentClosureDetails'},
    {$sort: {"_date": -1}}]);


        cursor.toArray(function(err, resultFacility) {
            for (var i = 0; i < resultFacility.length; i++) {
                  //resultFacility[i]=resultFacility[i].latest;
                  delete resultFacility[i].departmentClosureDetails;
                }
            cursor1.toArray(function(err, resultDepartment) {
                for (var i = 0; i < resultDepartment.length; i++) {
                  //resultDepartment[i]=resultDepartment[i].latest;
                  delete resultDepartment[i].FacilityClosureDetails;
                }
                grace.toArray(function(err, graceFacility) {
                  var data;
                if(department=="All"){  
                    data=resultFacility;
                    data=data.concat(resultDepartment);
                    
                }else if(department=="Facility"){

                    data=resultFacility;
                    
                }else{
                    var flag=0;
                    for(d in department_array){
                        console.log(department_array[d]);
                        if(department_array[d]=="Facility"){

                            flag=1;
                            console.log("set flag here: "+flag);
                            break;
                        }else{
                            flag=0;
                        }

                    }
                    if(flag==1){
                        data=resultFacility;

                        data=data.concat(resultDepartment);
                    }else{
                        data=resultDepartment;

                    }
                }
      if(graceFacility!=undefined){
            console.log("graceFacility.length");
            console.log(graceFacility.length);
            for (var i = 0; i < graceFacility.length; i++) {
                //graceFacility[i]=graceFacility[i].latest;
                delete graceFacility[i]['FacilityClosureDetails'];
                delete graceFacility[i]['departmentClosureDetails'];
            }
            data=data.concat(graceFacility);
        }
                                            
       data.sort(function(a,b) { 
        return new Date(b._date).getTime()- new Date(a._date).getTime() 
    });

   var xl = require('excel4node');
   var wb = new xl.Workbook();
   var ws;

   ws = wb.addWorksheet('Summary of actions and status');

   var http = require('http');
   var fs = require('fs');
   var xlsxFileName = ".tmp/closure_summary_"+new Date()+".xlsx";
   var sheetRow = 1;

    //styles
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
            horizontal:['center']
        },
        font: {
            color: 'black',
            size: 11,
            bold: true,
        }
    });

    ws.row(sheetRow).setHeight(70);

    ws.cell(sheetRow,1,sheetRow++,16,true).string('KePSIE Monitoring System, Ministry of Health')
    .style({alignment : {horizontal:['center'],vertical:['center']}, font: {color: 'black',size: 13,bold: true}});

    ws.cell(sheetRow,1,sheetRow++,16,true).string('Summary of actions and status ')
    .style({alignment : {horizontal:['center']}, font: {color: 'white',size: 13,bold: true}, fill: {
        type: "pattern",
        patternType : "solid",
        fgColor: "#31708f",
        bgColor: "#31708f"
    }});
    ws.cell(sheetRow,1,sheetRow++,16,true).string(' County:'+CountyService.getCounty(county)+' | Facility/Department:'+department_array)
    .style({alignment : {horizontal:['center']}, font: {color: 'white',size: 12,bold: true}, fill: {
        type: "pattern",
        patternType : "solid",
        fgColor: "#31708f",
        bgColor: "#31708f"
    }});

     var headerList=["No","County","Facility ID","Facility Name","Subcounty",
    "Nearest Market","Closure Type",
    "Reason","Date of Inpsection","Inspector","Status","Date of Physical Closure",
    "Date Appeal","Appeal Reason","Date Reopen","Comment"];

  for(var i=0;i<headerList.length;i++){

        console.log(headerList[i]);

        ws.cell(sheetRow,i+1).string(headerList[i]).style(headerCenterStyle);
    }
    sheetRow++;
    var no=0;
    for(i in data) {
        console.log("data : "+i);
        var obj = data[i];
        if (! obj['_subcounty']) {
          obj['_subcounty']='';
        }
        if (! obj['p_nearest_market']) {
          obj['p_nearest_market']='';
        }
        
        if(obj['FacilityClosureDetails']){
            //add Facility data in sheet 
            //var reasonName=CountyService.getReasonName(obj['FacilityClosureDetails']['ms_close_r']);

            var clsrReason=obj["FacilityClosureDetails"]["ms_close_r"];
            if(clsrReason["inspector"]!=undefined){
                for (var j = 0; j < clsrReason["inspector"].length;j++){

                    clsrReason["inspector"][j]=CountyService.getReasonName(clsrReason["inspector"][j]);
                }
            }

            if(clsrReason["admin"]!=undefined){
                for (var j = 0; j < clsrReason["admin"].length;j++){

                    clsrReason["admin"][j]=CountyService.getReasonName(clsrReason["admin"][j]);
                }
            }
            var reasonName="";

            if(clsrReason["inspector"]!=undefined){
                reasonName+="Inspector: "+clsrReason["inspector"]+"\n";
            }

            if(clsrReason["admin"]!=undefined){
                reasonName+="Admin: "+clsrReason["admin"];
            }

            var applead,reopen,status;

            if(obj['FacilityClosureDetails']['ms_appeal']==1){
                applead="Yes";
            }else{
                applead="No";
            }

            if(obj['FacilityClosureDetails']['ms_closed']==1){
                status="Closed";
            }else{
                status="";
            }
            

            if(obj['FacilityClosureDetails']['ms_reopen']==1){
                reopen="Yes";
            }else{
                reopen="";
            }
            if(! obj['FacilityClosureDetails']['ms_appealDate']){
                obj['FacilityClosureDetails']['ms_appealDate']='';
            }
            
            if(! obj['FacilityClosureDetails']['ms_closedDate']){
                obj['FacilityClosureDetails']['ms_closedDate']='';
            }

            if(! obj['FacilityClosureDetails']['ms_reopenedDate']){
                obj['FacilityClosureDetails']['ms_reopenedDate']='';
            }

            if(! obj['FacilityClosureDetails']['ms_appeal_r']){
                obj['FacilityClosureDetails']['ms_appeal_r']='';
            }

            if(! obj['FacilityClosureDetails']['ms_other_note']){
              obj['FacilityClosureDetails']['ms_other_note']='';
            } 

            var Overdue=0;
            var parts =obj['FacilityClosureDetails']['date_close_by'].split('/');
            var closedDate = new Date(parts[2],parts[1]-1,parts[0]); 
            
            /*var oneDay = 24*60*60*1000; 
            
            if(new Date()> closedDate)
            {
                Overdue = Math.round(Math.abs((new Date().getTime()-closedDate.getTime())/(oneDay)));
            }*/
            
             no=no+1;
       
        obj['_date']= CountyService.formateSpecificDate(obj['_date']);
        ws.cell(sheetRow,1).number(no).style(normalCenterStyle);

        ws.cell(sheetRow,2).string(obj['_county']).style(normalCenterStyle);

        ws.cell(sheetRow,3).number(obj['_hfid']).style(normalCenterStyle);

        ws.cell(sheetRow,4).string(obj['_hfname']).style(normalCenterStyle);

        ws.cell(sheetRow,5).string(obj['_subcounty']).style(normalCenterStyle);

        ws.cell(sheetRow,6).string(obj['p_nearest_market']).style(normalCenterStyle);

        ws.cell(sheetRow,7).string('Facility').style(normalCenterStyle);

        ws.cell(sheetRow,8).string(reasonName).style(normalCenterStyle);

        ws.cell(sheetRow,9).string(obj['_date']).style(normalCenterStyle);

        ws.cell(sheetRow,10).string(obj['_inspectorname']).style(normalCenterStyle);

        ws.cell(sheetRow,11).string(status).style(normalCenterStyle);

        ws.cell(sheetRow,12).string(obj['FacilityClosureDetails']['ms_closedDate']).style(normalCenterStyle);

        //ws.cell(sheetRow,10).number(Overdue).style(normalCenterStyle);

        //ws.cell(sheetRow,11).string(applead).style(normalCenterStyle);

        ws.cell(sheetRow,13).string(obj['FacilityClosureDetails']['ms_appealDate']).style(normalCenterStyle);

        ws.cell(sheetRow,14).string(obj['FacilityClosureDetails']['ms_appeal_r']).style(normalCenterStyle);

        //ws.cell(sheetRow,14).string(reopen).style(normalCenterStyle);

        ws.cell(sheetRow,15).string(obj['FacilityClosureDetails']['ms_reopenedDate']).style(normalCenterStyle);

        ws.cell(sheetRow,16).string(obj['FacilityClosureDetails']['ms_other_note']).style(normalCenterStyle);
     
        }else if(obj['departmentClosureDetails']){
            //add Department data in sheet 
            var applead,reopen,status;

            var dept_var=CountyService.getClosureDeptVar();
            var dept_name=obj['departmentClosureDetails']['departmentName'];

            /*if(obj[dept_var[dept_name]]==1){
                status="Closed";
            }else{
                status="";
            }*/

             if(obj['departmentClosureDetails']['ms_closed_dep']==1){
              status="Closed";
            }else{
              status="";
            }

            if(obj['departmentClosureDetails']['ms_appeal_dep']==1){
                applead="Yes";
            }else{
                applead="No";
            }
            if(obj['departmentClosureDetails']['ms_reopen_dep']==1){
                reopen="Yes";
            }else{
                reopen="";
            }


            if(! obj['departmentClosureDetails']['ms_appealDate_dep']){
                obj['departmentClosureDetails']['ms_appealDate_dep']='';
            }
            if(! obj['departmentClosureDetails']['ms_reopenedDate_dep']){
                obj['departmentClosureDetails']['ms_reopenedDate_dep']='';
            }
            if(! obj['departmentClosureDetails']['ms_closedDate_dep']){
                obj['departmentClosureDetails']['ms_closedDate_dep']='';
            }

            if(! obj['departmentClosureDetails']['ms_appeal_r_dep']){
                obj['departmentClosureDetails']['ms_appeal_r_dep']='';
            }

            if(! obj['departmentClosureDetails']['ms_other_note_dep']){
              obj['departmentClosureDetails']['ms_other_note_dep']='';
            } 

            obj['_date']= CountyService.formateSpecificDate(obj['_date']);
            
            //var reasonName=CountyService.getReasonNameForDepartment(obj['departmentClosureDetails']['ms_close_dep_r']);
            


            var clsrReason=obj["departmentClosureDetails"]["ms_close_dep_r"];
            if(clsrReason["inspector"]!=undefined){
                for (var j = 0; j < clsrReason["inspector"].length;j++){

                    clsrReason["inspector"][j]=CountyService.getReasonNameForDepartment(clsrReason["inspector"][j]);

                }
            }

            if(clsrReason["admin"]!=undefined){
                for (var j = 0; j < clsrReason["admin"].length;j++){

                    clsrReason["admin"][j]=CountyService.getReasonNameForDepartment(clsrReason["admin"][j]);

                }
            }

            var reasonName="";

            if(clsrReason["inspector"]!=undefined){
                reasonName+="Inspector: "+clsrReason["inspector"]+"\n";
            }

            if(clsrReason["admin"]!=undefined){
                reasonName+="Admin: "+clsrReason["admin"];
            }


            var Overdue=0;
            var parts =obj['departmentClosureDetails']['date_close_dep_by'].split('/');
            var closedDate = new Date(parts[2],parts[1]-1,parts[0]); 
            
            /*var oneDay = 24*60*60*1000; 
            
            if(new Date()> closedDate)
            {
                Overdue = Math.round(Math.abs((new Date().getTime()-closedDate.getTime())/(oneDay)));
            }*/

          no=no+1;
        ws.cell(sheetRow,1).number(no).style(normalCenterStyle);
        
        ws.cell(sheetRow,2).string(obj['_county']).style(normalCenterStyle);

        ws.cell(sheetRow,3).number(obj['_hfid']).style(normalCenterStyle);

        ws.cell(sheetRow,4).string(obj['_hfname']).style(normalCenterStyle);

        ws.cell(sheetRow,5).string(obj['_subcounty']).style(normalCenterStyle);

        ws.cell(sheetRow,6).string(obj['p_nearest_market']).style(normalCenterStyle);

        ws.cell(sheetRow,7).string(obj['departmentClosureDetails']['departmentName']).style(normalCenterStyle);

        ws.cell(sheetRow,8).string(reasonName).style(normalCenterStyle);

        ws.cell(sheetRow,9).string(obj['_date']).style(normalCenterStyle);

        ws.cell(sheetRow,10).string(obj['_inspectorname']).style(normalCenterStyle);

        ws.cell(sheetRow,11).string(status).style(normalCenterStyle);

        ws.cell(sheetRow,12).string(obj['departmentClosureDetails']['ms_closedDate_dep']).style(normalCenterStyle);

        //ws.cell(sheetRow,10).number(Overdue).style(normalCenterStyle);

        //ws.cell(sheetRow,11).string(applead).style(normalCenterStyle);

        ws.cell(sheetRow,13).string(obj['departmentClosureDetails']['ms_appealDate_dep']).style(normalCenterStyle);

        ws.cell(sheetRow,14).string(obj['departmentClosureDetails']['ms_appeal_r_dep']).style(normalCenterStyle);

        //ws.cell(sheetRow,14).string(reopen).style(normalCenterStyle);

        ws.cell(sheetRow,15).string(obj['departmentClosureDetails']['ms_reopenedDate_dep']).style(normalCenterStyle);

        ws.cell(sheetRow,16).string(obj['departmentClosureDetails']['ms_other_note_dep']).style(normalCenterStyle);

        }else{
            //add Department data in sheet 
            var graceVarArr=CountyService.getGracedDeptVarArr();
            var graceName=CountyService.getGracedDeptName();
            obj['_date']= CountyService.formateSpecificDate(obj['_date']);
            var flag=0
            for (var g = 0; g < graceVarArr.length; g++) {
                var graceVar=graceVarArr[g];
                console.log("graceVar");
                console.log(graceVar+"========"+obj['_date']);
                
                if(obj[graceVar]==2){
                    console.log("inside if");
                    var status="Graced";

                    if(flag==1){
                        sheetRow++;
                    }

                    var clsrType= graceName[graceVar];


                    no=no+1;

            ws.cell(sheetRow,1).number(no).style(normalCenterStyle);
            
            ws.cell(sheetRow,2).string(obj['_county']).style(normalCenterStyle);

            ws.cell(sheetRow,3).number(obj['_hfid']).style(normalCenterStyle);

            ws.cell(sheetRow,4).string(obj['_hfname']).style(normalCenterStyle);

            ws.cell(sheetRow,5).string(obj['_subcounty']).style(normalCenterStyle);

            ws.cell(sheetRow,6).string(obj['p_nearest_market']).style(normalCenterStyle);

            ws.cell(sheetRow,7).string(clsrType).style(normalCenterStyle);

            ws.cell(sheetRow,8).string("").style(normalCenterStyle);

            ws.cell(sheetRow,9).string(obj['_date']).style(normalCenterStyle);

            ws.cell(sheetRow,10).string(obj['_inspectorname']).style(normalCenterStyle);

            ws.cell(sheetRow,11).string(status).style(normalCenterStyle);

            ws.cell(sheetRow,12).string("").style(normalCenterStyle);

            ws.cell(sheetRow,13).string("").style(normalCenterStyle);

            ws.cell(sheetRow,14).string("").style(normalCenterStyle);

            ws.cell(sheetRow,15).string("").style(normalCenterStyle);

            ws.cell(sheetRow,16).string("").style(normalCenterStyle);

                    flag=1;
                }
            } 
        }
        sheetRow++;
    }
   ws.column(1).setWidth(15);
   ws.column(2).setWidth(20);
   ws.column(3).setWidth(20);
   ws.column(4).setWidth(30);
   ws.column(5).setWidth(15);
   ws.column(6).setWidth(15);
   ws.column(7).setWidth(15);
   ws.column(8).setWidth(15);
   ws.column(9).setWidth(20);
   ws.column(10).setWidth(20);
   ws.column(11).setWidth(15);
   ws.column(12).setWidth(30);
   ws.column(13).setWidth(15);
   ws.column(14).setWidth(15);
   ws.column(15).setWidth(15);
   ws.column(16).setWidth(15);



   setTimeout(sendExcelFile,1000);

   function sendExcelFile() {
     wb.write(xlsxFileName, function (err, stats) {
      if (err) {
       console.error(err);
   }

   var fileName = "";

   fileName = 'Summary_Of_Actions_and_Status_'+(CountyService.formateDate())+".xlsx";


            //weekly email
            var nodemailer = require('nodemailer');

            var transporter = nodemailer.createTransport("SMTP",{
                service: 'Gmail',
                auth: {
                    user: 'kepsienoreply@gmail.com',
                    pass: 'kepsie12345'

                }
            }); 
            var userListTO=detail.toReceiver;
            var toReceiver="";
            if(userListTO!=undefined){
                for (var j = 0; j < userListTO.length; j++) {
                    toReceiver+=userListTO[j]+",";
                }
            }
            var userListCC=detail.ccReceiver;
            var ccReceiver="";
            if(userListCC!=undefined){
                for (var j = 0; j < userListCC.length; j++) {
                    ccReceiver+=userListCC[j]+",";
                }
            }

            var userListBCC=detail.bccReceiver;
            var bccReceiver="";
            if(userListBCC!=undefined){
                for (var j = 0; j < userListBCC.length; j++) {
                    bccReceiver+=userListBCC[j]+",";
                }
            }

            var mailOptions = {
    from: 'kepsienoreply@gmail.com', // sender address
    //to: userList[0].email, // list of receivers
    to: toReceiver,
    cc: ccReceiver,
    bcc:bccReceiver,
    

    subject:detail.subject , // Subject line
    html:detail.content,

    attachments: [{ 
        filePath: xlsxFileName,
    }]

    
};
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        fs.unlink(xlsxFileName, function(err){
            if (err) throw err;

            callback();
        });

        
    });
});
 }

});
});
});
}
}