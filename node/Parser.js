var mongojs = require('mongojs');
var Cache = require('./Cache');
let mongoist = require('mongoist');
const CACHED_ITEM_COUNT = 6; // one for each ranking and the cache object

//parses and records lists based off given database
class Parser {
  constructor(app, appid, useDB) {
    this.db = mongoist(mongojs(app.get('DBConnection')))['Steam_App_' + appid];
    this.useDB = useDB;
    this.collectionQueueLength = 0;
    this.collectionCount = 0;
    this.app = app;
    this.appid = appid;
  }

  async consume(input) {
    let updateTime = new Date();
    if (!this.useDB) {
      console.log("setting last_update to " + updateTime);
      await this.db.findAndModify({
        query: {
          id: "last_update"
        },
        upsert: true,
        update: {
          $set: {
            last_update: updateTime
          }
        },
      });
    }

    this.collectionQueueLength = input.length;
    this.collectionCount = CACHED_ITEM_COUNT;
    if (this.useDB) {
      return this.BackfillRankings();
    }

    const data = this.trimVariablesFrom(input);
    data.forEach(datum => {
      this.db.findAndModify({
        query: {
          id: datum.id
        },
        upsert: true,
        update: {
          $set: {
            id: datum.id,
            title: datum.title,
            preview_url: datum.preview_url
          },
          $push: {
            history: {
              updated: updateTime,
              comments: datum.comments,
              subscriptions: datum.subscriptions,
              favorites: datum.favorited,
              views: datum.views,
              unsubscribes: datum.unsubscribes,
            }
          }
        }
      }).then(_ => this.BackfillRankings(), err => console.error(err));
    });
  }

  trimVariablesFrom(data) {
    const ret = [];
    for (var i = 0; i < data.length; i++) {
      const unsubs = this.validateUnsubs(data[i].lifetime_subscriptions, data[i].subscriptions);
      if (unsubs === false) {
        this.collectionQueueLength--;
        continue;
      }

      ret.push({
        "id": parseInt(data[i].publishedfileid),
        "title": data[i].title,
        "comments": data[i].num_comments_public,
        "subscriptions": data[i].subscriptions,
        "favorited": data[i].favorited,
        "views": data[i].views,
        "unsubscribes": unsubs,
        "preview_url": data[i].preview_url
      });
    }
    return ret;
  }

  validateUnsubs(total, subs) {
    //check for undefined subscriptions
    if (typeof total !== "number" || isNaN(total)) {
      return false;
    }
    // prevent / by 0 error
    total = total || 1;
    // calculate unsubs as a percentage of unsubscribers
    const ret = parseFloat(((total - subs) / total * 100).toFixed(2));
    if (ret === undefined) {
      console.warn('undefined ret: ' + (total - subs) + ' / ' + total);
    }
    return ret;
  }

  async BackfillRankings() {
    if (--this.collectionQueueLength == 0 || this.useDB) {
      this.record('master', await this.db.find({
        id: {
          $type: "number"
        }
      }));

      let docs = await this.db.findAsCursor({
          id: {
            $type: "number"
          }
        })
        .sort({
          "history.0.subscriptions": -1
        }).toArray();
      this.record('subs', await this.rank("subscriptions", docs));

      docs = await this.db.findAsCursor({
        id: {
          $type: "number"
        }
      }).sort({
        "history.0.views": -1
      }).toArray();
      this.record('views', await this.rank("views", docs));

      docs = await this.db.findAsCursor({
        id: {
          $type: "number"
        }
      }).sort({
        "history.0.comments": -1
      }).toArray();
      this.record('comments', await this.rank("comments", docs));

      docs = await this.db.findAsCursor({
        id: {
          $type: "number"
        }
      }).sort({
        "history.0.unsubscribes": 1
      }).toArray();
      this.record('unsubs', await this.rank("unsubscribes", docs));

      docs = await this.db.findAsCursor({
        id: {
          $type: "number"
        }
      }).sort({
        "history.0.favorites": -1
      }).toArray();
      this.record('favs', await this.rank("favorites", docs));

      this.app.set('Cache', new Cache(this.app, this.appid));
      console.log('Cache loaded');
    }
  }

  async rank(filter, docs) {
    let rank = 1;
    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i];
      let prev;
      if (i > 0) {
        prev = docs[i - 1];
      }
      doc.history[0].rank = rank++;
      if (i > 0 && doc.history[0][filter] === prev.history[0][filter]) {
        doc.history[0].rank = prev.history[0].rank;
      }
      await this.db.findAndModify({
        query: {
          id: doc.id
        },
        update: {
          $set: {
            [`history.0.${filter}Rank`]: doc.history[0].rank,
            [`history.0.${filter}Percent`]: (doc.history[0].rank / docs.length * 100).toFixed(2)
          }
        },
      });
    }

    return docs;
  }

  record(dest, payload) {
    console.log(dest);
    this.app.set(dest + "DB", payload);
  }
}

module.exports = Parser;