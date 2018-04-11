let readFileSync = require('fs').readFileSync;
let console = require('console');
let request = require("request");
let Parser = require("./Parser");
let mongojs = require("mongojs");
let mongoist = require("mongoist");
let updateIntervalInMS = 10800000 * 4;

class SteamAPIWorker {
  constructor(app, steamid) {
    this.app = app;
    this.steamid = steamid;
    this.db = mongoist(mongojs(app.get('DBConnection')))['Steam_App_' + steamid];
    this.results = [];
    this.totalItemCount = -1;
    //get stored variables
    var devKey = process.env.DevKey;
    try {
      devKey = JSON.parse(readFileSync('./node/Protected/keys.json')).DevKey;
    } catch (err) {
      console.warn(err);
    }
    this.DevKey = devKey;
    this.forced = process.env.ForceUpdate !== undefined;
    this.debug = process.env.debug;
  }

  keepUpToDate() {
    this.update();
    setInterval(this.update, 1000 * 60 * 60);
  }

  async update(forced = false) {
    try {
      lastUpdateRecord = await this.db.findOne({
        id: "last_update"
      });
    } catch (err) {
      return console.error(err);
    }

    this.lastUpdate = lastUpdateRecord && lastUpdateRecord.last_update;
    console.log("Last Update: " + this.lastUpdate);

    //if time to update (default 12 hours) or file doesn't exist
    if (this.forced ||
      this.lastUpdate == null ||
      (!this.debug && new Date().getTime() - lastUpdate > updateIntervalInMS)) {
      let options = {
        url: 'https://api.steampowered.com/IPublishedFileService/QueryFiles/v1',
        method: 'GET',
        qs: {
          'key': this.DevKey,
          'query_type': 0,
          'page': 0, // incremented to 1 on first call
          'numperpage': '100',
          'creator_appid': this.steamid,
          'appid': this.steamid,
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
      this.requestUntillFilled(options);
      // if cache isn't already populated, condition on startup
    } else if (app.get('Cache') === undefined) {
      let docs = await db.find({
        $id: {
          $type: "number"
        }
      });
      this.parseRequests(docs, true);
    }
  }

  parseRequests(docs, useDB = false) {
    new Parser(this.app, this.steamid, useDB).consume(docs);
  }

  requestUntillFilled(options) {
    options.qs.page++;
    request(options, (err, response, body) => {
      if (err) {
        console.error(err);
      }

      body = JSON.parse(body);
      if (body.response.publishedfiledetails === undefined) {
        console.log("Finished with " + this.results.length + " results");
        return this.parseRequests(this.results);
      }

      //if first call
      if (this.totalItemCount < 0) {
        this.totalItemCount = body.response.total;
        console.log("Total Items: " + this.totalItemCount);
      }

      this.results = this.results.concat(body.response.publishedfiledetails);
      console.log("Result Count: " + this.results.length);

      //if done
      if (results.length >= totalItemCount) {
        console.log("Finished with " + this.results.length + " results");
        return this.parseRequests(this.results);
      }

      this.requestUntillFilled(options);
    });
  }
}

module.exports = SteamAPIWorker;