var fs = require('fs');
var request = require('request');
var Cache = require('./Cache');
var parse = require('./Parser');

function UpdateDB(app, forced) {
    //get stored variables
    var devKey = process.env.DevKey;
    // 10800000ms = refresh every 3 hours
    var updateIntervalInMS = 10800000;
    var results = [];
    var totalItemCount = -1;
    lastUpdate = app.get('lastUpdate');
    
    //if time to update (default 1 day) or file doesn't exist
    if (forced || lastUpdate === undefined || new Date().getTime() - lastUpdate > updateIntervalInMS) {
        app.set('lastUpdate', new Date().getTime());
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
        };
        requestUntillFilled(1);
    }

    function rufCallback() {
        console.log("Finished with " + results.length + " results");
        parse(results, app);
    }

    function requestUntillFilled(page) {
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
                    if (results.length >= totalItemCount) {
                        rufCallback();
                    }
                    else {
                        requestUntillFilled(page + 1);
                    }
                }
                else {
                    rufCallback();
                }
            }
        });
    }
}

module.exports = UpdateDB;