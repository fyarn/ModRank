import {
  readFileSync
} from "fs";
import request from "request";
import parse from "./Parser";
import mongojs from "mongojs";
import mongoist from "mongoist";
import {log, warning, error} from "console";
import { builtinModules } from "module";

class SteamWorker {

  constructor(app, steamid) {
    this.app = app;
    this.steamid = steamid;
    this.db = mongoist(mongojs(app.get('DBConnection')))[steamid];
    this.updateIntervalInMS = 10800000 * 4;
    this.results = [];
    this.totalItemCount = -1;
  }

  async Update(forced = false) {
    //get stored variables
    var devKey = process.env.DevKey;
    try {
      devKey = JSON.parse(readFileSync('./Protected/keys.json')).DevKey;
    } catch (err) {
      error(err);
    }
    this.DevKey = devKey;

    try {
      lastUpdateRecord = await db.findOne({ id: "last_update" });
    } catch (err) {
      error(err);
    }
    this.lastUpdate = lastUpdateRecord && lastUpdateRecord.last_update;
    log("Last Update: " + this.lastUpdate);

    let forced = process.env.ForceUpdate !== undefined;
    let debug = process.env.debug;
    //if time to update (default 12 hours) or file doesn't exist
    if (forced ||
      lastUpdate == null ||
      (!debug && new Date().getTime() - lastUpdate > updateIntervalInMS)) {
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
      requestUntillFilled(options);
      // if cache isn't already populated, condition on startup
    } else if (app.get('Cacher') === undefined) {
      let docs = await db.find({ $id: { $type: "number" } });
      parseRequests(docs, true);
    }
  }

  parseRequests(docs, useDB = false) {
    parse(docs, this.steamid, this.app, () => console.log('Downloaded, parsing...'), useDB);
  }

  requestUntillFilled(options) {
    options.qs.page++;
    request(options, (err, response, body) => {
      if (err) {
        error(err);
      }

      body = JSON.parse(body);
      if (body.response.publishedfiledetails === undefined) {
        log("Finished with " + this.results.length + " results");
        return parseRequests(this.results);
      }

      //if first call
      if (this.totalItemCount < 0) {
        this.totalItemCount = body.response.total;
        log("Total Items: " + this.totalItemCount);
      }

      this.results = this.results.concat(body.response.publishedfiledetails);
      log("Result Count: " + this.results.length);

      //if done
      if (results.length >= totalItemCount) {
        log("Finished with " + this.results.length + " results");
        return parseRequests(this.results);
      }

      requestUntillFilled(options);
    });
  }
}

export default SteamWorker;