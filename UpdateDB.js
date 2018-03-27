var fs = require('fs');
var request = require('request');
var parse = require('./Parser');
var DevKey = JSON.parse(fs.readFileSync("./Protected/keys.json")).DevKey;

function DatabaseUpdater(app) {
   DatabaseUpdater.prototype.Update = function (appid, forced) {
      //get stored variables
      var contents = JSON.parse(fs.readFileSync('./Protected/keys.json'));
      var devKey = contents.DevKey;
      // 10800000ms = refresh every 3 hours
      var updateIntervalInMS = 10800000;
      var results = [];
      var totalItemCount = -1;
      lastUpdate = app.get('lastUpdate');

      //if time to update (default 1 day) or file doesn't exist
      if (forced || lastUpdate === undefined || new Date().getTime() - lastUpdate > updateIntervalInMS) {
         var options = {
            url: 'https://api.steampowered.com/IPublishedFileService/QueryFiles/v1',
            method: 'GET',
            qs: {
               'key': devKey || process.env.DevKey,
               'query_type': 0,
               'page': '1',
               'numperpage': '100',
               'creator_appid': 294100,
               'appid': 294100,
               'requiredtags': '',
               'excludedtags': '',
               'required_flags': '',
               'omitted_flags': '',
               'search_text': '',
               'filetype': 0,
               'child_publishedfileid': 0,
               'days': 7,
               'include_recent_votes_only': false,
               'required_kv_tags': {},
               'return_vote_data': true,
               'return_tags': true,
               'return_kv_tags': true,
               'return_previews': false,
               'return_children': true,
               'return_short_description': true,
               'return_for_sale_data': false,
               'return_playtime_stats': 7
            }
         };
         requestUntillFilled();
      }

      function rufCallback() {
         console.log("Finished with " + results.length + " results");
         parse(results, appid, app, () => console.log('done'));
      }

      function requestUntillFilled(page = 1) {
         options.qs.page = page;
         request(options, function (error, response, body) {
            if (!error) {
               body = JSON.parse(body);
               if (body.response.publishedfiledetails !== undefined) {
                  //if first call
                  if (totalItemCount < 0) {
                     totalItemCount = body.response.total;
                     console.log("Total Items: " + totalItemCount);
                  }

                  results = results.concat(body.response.publishedfiledetails);
                  var len = body.response.publishedfiledetails.length;
                  console.log("Result Count: " + results.length);

                  //if done
                  if (true || results.length >= totalItemCount) {
                     return rufCallback();
                  }
                  else {
                     requestUntillFilled(page + 1);
                  }
               }
               else {
                  return rufCallback();
               }
            }
         });
      }
   };
}
module.exports = DatabaseUpdater;
