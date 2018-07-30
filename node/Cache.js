let mongojs = require('mongojs');
let mongoist = require("mongoist");

class Cache {
  constructor(app, steamid) {
    this.app = app;
    this.steamid = steamid;
    this.master = app.get('masterDB');
    this.subs = app.get('subsDB');
    this.favs = app.get('favsDB');
    this.views = app.get('viewsDB');
    this.unsubscribes = app.get('unsubsDB');
    this.comments = app.get('commentsDB');
    this.db = mongoist(mongojs(this.app.get('DBConnection')))[`Steam_App_${this.steamid}`];
  }

  //all of these are 1 indexed (getMostSubsItem(1) returns the first best item)
  getMostSubsItem(index = 1) {
    return this.subs[index - 1];
  }

  getMostFavsItem(index = 1) {
    return this.favs[index - 1];
  }

  getMostViewsItem(index = 1) {
    return this.views[index - 1];
  }

  getMostUnsubscribesItem(index = 1) {
    return this.unsubscribes[index - 1];
  }

  getMostCommentsItem(index = 1) {
    return this.comments[index - 1];
  }

  async getItem(id) {
    if (typeof id === "string") {
      if (id.startsWith('https://steamcommunity.com/sharedfiles/filedetails/?id=') ||
        id.startsWith('http://steamcommunity.com/sharedfiles/filedetails/?id=')) {
        id = parseInt(id.split('=')[1]);
      } else if (id.toLowerCase() === 'rand' || id.toLowerCase() === 'random') {
        id = this.master[Math.floor(Math.random() * this.master.length)].id;
      } else {
        id = parseInt(id);
      }
    }
    
    return await this.db.findOne({ id: id });
  }

  async getItems(ids) {
    return await Promise.all(ids.map(async id => this.getItem(id)));
  }
}

module.exports = Cache;