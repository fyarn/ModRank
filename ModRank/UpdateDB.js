var fs = require('fs');
var request = require('request');
var parse = require('./parser');

function UpdateDB(app) {
    //get stored variables
    var prefs = JSON.parse(fs.readFileSync('../protected/prefs.json', 'utf-8'));
    var devKey = prefs.DevKey;
    var updateIntervalInMS = prefs.UpdateIntervalInMS;
    var results = [];
    var totalItemCount = -1;

    //if time to update (default 1 day) or existing file doesn't exist
    if (!fs.existsSync('../protected/master.json') || (new Date() - fs.statSync('../protected/master.json').ctime > updateIntervalInMS)) {
        var options = {
            url: 'https://api.steampowered.com/IPublishedFileService/QueryFiles/v1',
            method: 'GET',
            qs: {
                'key': devKey,
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
        }
        requestUntillFilled(1);
    }
    return JSON.parse(fs.readFileSync('../protected/master.json'));

    function rufCallback() {
        console.log("Finished with " + results.length + " results");
        parse(results, app);
    }

    function requestUntillFilled(page) {
        options.qs.page = page;
        request(options, function (error, response, body) {
            if (!error) {
                body = JSON.parse(body);
                //if first call
                if (totalItemCount < 0) {
                    totalItemCount = body.response.total;
                    console.log("Total Items: " + totalItemCount)
                }

                results = results.concat(body.response.publishedfiledetails);
                console.log("Response Length: " + body.response.publishedfiledetails.length)
                console.log("Result Count: " + results.length)

                //if done
                if (results.length >= totalItemCount) {
                    rufCallback();
                }
                else {
                    console.log("Requesting page " + (page + 1))
                    requestUntillFilled(page + 1);
                }
            }
        });
    }
}

module.exports = UpdateDB;