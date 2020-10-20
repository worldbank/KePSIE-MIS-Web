/**
 * New node file
 */
var CronJob = require('cron').CronJob;
var job = new CronJob('00 00 11 * * 1', function() {  //every monday 11:00 am
	
	
	console.log("==== Cron Start =>");
	//EmailService.weeklyClosureEmail();

	
}, function () {
    //This function is executed when the job stops
	  console.log("function stops ");
 }
  
  
);
job.start();
