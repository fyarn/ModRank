var fs = require('fs');
var request = require('request');
try {
    require.paths.push('/opt/app-root/src/');
    require.paths.push('/opt/app-root/src/modrank/');
    console.log(require.paths);
}
catch (e) {
}
var Cache = require('./cache');
var parse = require('./parser');

function UpdateDB(app, forced) {
    //get stored variables
    var prefs = JSON.parse(fs.readFileSync('../protected/prefs.json', 'utf-8'));
    var devKey = prefs.DevKey;
    var updateIntervalInMS = prefs.UpdateIntervalInMS;
    var results = [];
    var totalItemCount = -1;

    //if time to update (default 1 day) or file doesn't exist
    if (forced || !fs.existsSync('../protected/dbs/masterDB.json') || new Date() - fs.statSync('../protected/dbs/masterDB.json').ctime > updateIntervalInMS) {
        fs.writeFileSync('../protected/dbs/masterDB.json', '');
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
    else if (app.get('Cacher') === undefined) {
        set('masterDB');
        set('subsDB');
        set('favsDB');
        set('viewsDB');
        set('unsubsDB');
        set('commentsDB');
        app.set('Cacher', new Cache(app));
    }

    function set(path) {
        app.set(path, JSON.parse(fs.readFileSync('../protected/dbs/'+path+'.json')));
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
                    if (len !== undefined) {
                        console.log("Response Length: " + len);
                    }
                    console.log("Result Count: " + results.length);

                    //if done
                    if (results.length >= totalItemCount) {
                        rufCallback();
                    }
                    else {
                        console.log("Requesting page " + (page + 1));
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