/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.http.html
 */

 module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Express middleware to use for every Sails request. To add custom          *
  * middleware to the mix, add a function to the middleware config object and *
  * add its key to the "order" array. The $custom key is reserved for         *
  * backwards-compatibility with Sails v0.9.x apps that use the               *
  * `customMiddleware` config option.                                         *
  *                                                                           *
  ****************************************************************************/

  middleware: {

    passportInit    : require('passport').initialize(),
    passportSession : require('passport').session(),

    order: [
    'startRequestTimer',
    'cookieParser',
    'session',
    'passportInit',     
    'passportSession', 
   
    'bodyParser',
    'handleBodyParserError',
    'compress',
    'methodOverride',
    'poweredBy',
     'myRequestLogger',
    'router',
    'www',
    'favicon',
    '404',
    '500'
    ],
    myRequestLogger : function(req, res, next) {

      var result = true;
      var url = req.url;
      var actCreate={};
      if ((url.indexOf("styles") > -1)
        || (url.indexOf("global") > -1)
        || (url.indexOf("js") > -1)
        || (url.indexOf("pages") > -1)
        || (url.indexOf("plugins") > -1)
        || (url.indexOf("view") > -1)
         || (url.indexOf("dashboard") > -1)
         || (url.indexOf("checkEmail") > -1)
          ||(url.indexOf("incUpdatePassword") > -1)
          ||(url.indexOf("changePassword") > -1)
          ||(url.indexOf("profile") > -1)
          ||(url.indexOf("updateProfilePic") > -1)
        || (url.indexOf("fonts") > -1) 
        || (url.indexOf("css") > -1)
        || (url.indexOf("images") > -1)
        || (url.indexOf("list") > -1)
        || (url.indexOf("all") > -1)
         || (url.indexOf("edit") > -1)
          /*|| (url.indexOf("add") > -1)*/
        || (url.indexOf("layouts") > -1)
        || (url.indexOf("audit") > -1)
        //|| (url.indexOf("log") > -1)
        || (url.indexOf("png") > -1)
        || (url.indexOf("jpg") > -1)) {
        result = false;
    }
    actCreate.username = "guest";
    actCreate.body = JSON.stringify(req.body);
    if(actCreate.body == undefined) {
      actCreate.body = "NA";
    }

   actCreate.query=JSON.stringify(req.query);
    actCreate.url=req._parsedUrl.pathname;
  var parsedurl=req._parsedUrl.pathname.split('/'); 
 // var action;
 var date=new Date();
 var hr=date.getHours();
var min=date.getMinutes(); 
var sec=date.getSeconds();
var dt=date.getDate();
if(hr<10){
   hr="0"+hr;
}
if(min<10){
   min="0"+min;
}
  if(sec<10){
     sec="0"+sec;
  }
if(dt<10){
  dt="0"+dt;
}

var mon=date.getMonth(); 
mon=mon+1;
if(mon<10){
  mon="0"+mon;
}
var yr=date.getFullYear();
   actCreate.date=dt+"/"+mon+"/"+yr+"      "+hr+":"+min+":"+sec;
 
  /*if (parsedurl.length>2) {
    actCreate.action=parsedurl[2];
  }else{
    actCreate.action=parsedurl[1];
  }*/

   actCreate.action=req._parsedUrl.pathname;
    
    if(result==true){

      if (req.session.loggedInUser != null) {
        actCreate.username = req.session.loggedInUser.name;
        actCreate.userid= req.session.loggedInUser.id;
      }
       actCreate.ipAddress=req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress;
  
// console.log("audit trail starts............................................");
     
//      
    
//       console.log("ipAddress : ");
//       console.log(actCreate.ipAddress);
//       console.log("");
//       console.log("url : ");
//       console.log(actCreate.url);
//       console.log("");
//        console.log("action  : ");
//       console.log(actCreate.action);
//       console.log("");
//     //  console.log(req.body);
//      console.log("body : ");
//       console.log(actCreate.body);
//         console.log("");
//          console.log("loggedInUser : ");
//       console.log(actCreate.username);
//       console.log("");
//        console.log("loggedInUserId : ");
//       console.log(actCreate.userid);
//       console.log("");
//        console.log("query : ");
//       console.log(actCreate.query);
//       console.log("");
//        console.log("Date : ");
//       console.log(actCreate.date);
//       console.log("");
// console.log("audit trail ends..............................................");
AuditLogs.create(actCreate).exec(function(err, model) {
          if (err) {
            console.log(err)
          }
        });
    }
    return next();
  },
}

  /***************************************************************************
  *                                                                          *
  * The number of seconds to cache flat files on disk being served by        *
  * Express static middleware (by default, these files are in `.tmp/public`) *
  *                                                                          *
  * The HTTP static cache is only active in a 'production' environment,      *
  * since that's the only time Express will cache flat-files.                *
  *                                                                          *
  ***************************************************************************/

  // cache: 31557600000
};
