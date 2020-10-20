var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = sails.config.mongoURL;
var db = null;

MongoClient.connect(url, function(err, dbObj) {
  assert.equal(null, err);
  db = dbObj;
  console.log("Connection successfull with mongodb server.");
});

module.exports = {

	getDB : function() {
		return db;
	}

}

function init() {

var getInspectionData = function(db, callback) {
   var cursor =db.collection('facility').find( );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
   });
};


getInspectionData(db, function() {
     console.log("done...");
  });

}