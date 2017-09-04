var fs = require('fs');

//get stored variables
var prefs = JSON.parse(fs.readFileSync('../protected/prefs.json', 'utf-8'));
var devKey = prefs.DevKey;
var updateIntervalInMS = prefs.UpdateIntervalInMS;

//if time to update (default 1 day)
if (new Date() - fs.statSync('../protected/db.json').ctime > updateIntervalInMS) {

}