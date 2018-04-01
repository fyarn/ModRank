var fs = require('fs');
var mongojs = require('mongojs');
var Cache = require('./Cache');

//parses and records lists based off given database
function Parser(input, appid, app, cb, useDatabase=false)
{
    const CACHED_ITEM_COUNT = 6; // one for each ranking and the cache object
    var collectionQueueLength;
    var collectionCount;
    var db = mongojs(app.get('DBConnection'));
    appid = 'Steam_App_' + appid;
    var updateTime = new Date();
    UpdateCollection();
    
    //private methods
    function UpdateCollection() {
        //stringify because you can't have number collection titles
        if (!useDatabase) {
            console.log("setting last_update to " + updateTime);
            db[appid].findAndModify({
                query: { id: "last_update" },
                upsert: true,
                update: { $set: { last_update: updateTime } },
            }, UpdateCB);
        } else {
            UpdateCB();
        }
    }

    function UpdateCB() {
        collectionQueueLength = input.length;
        collectionCount = CACHED_ITEM_COUNT;
        if (useDatabase) {
            BackfillRankings();
        } else {
            data = trimVariablesFrom(input);
            data.forEach(datum => {
                db[appid].findAndModify({
                    query: { id: datum.id },
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
                }, (error, doc) => {
                    if (error) {
                        console.log(error);
                    }
                    BackfillRankings();
                });
            });
        }
    }
    
    function trimVariablesFrom(db) {
        ret = [];
        for (var i = 0; i < db.length; i++) {
            var unsubs = validateUnsubs(db[i].lifetime_subscriptions, db[i].subscriptions);
            if (!unsubs) {
                collectionQueueLength--;
                continue;
            }
            
            ret.push({
                "id": parseInt(db[i].publishedfileid),
                "title": db[i].title,
                "comments": db[i].num_comments_public,
                "subscriptions": db[i].subscriptions,
                "favorited": db[i].favorited,
                "views": db[i].views,
                "unsubscribes": unsubs,
                "preview_url": db[i].preview_url
            });
        }
        return ret;
    }
    
    function validateUnsubs(total, subs) {
        //check for undefined subscriptions
        if (typeof total !== "number" || isNaN(total)) {
            return false;
        }
        // prevent / by 0 error
        total = total || 1;
        // calculate unsubs as a percentage of unsubscribers
        return parseFloat(((total - subs) / total * 100).toFixed(2));
    }
    
    function BackfillRankings() {
        if (--collectionQueueLength == 0 || useDatabase) {
            new Promise(function(resolve, reject) {
                db[appid].find({ id: {$type: "number"} }, (err, docs) => {
                    err && console.log(err);
                    console.log('master');
                    record('master', docs);
                    parseSuccess(resolve);
                });
            }).then(() => new Promise((resolve, reject) => {
                db[appid].find({ id: {$type: "number"} }).sort({"history.0.subscriptions": -1}, (err, docs) => {
                    err && console.log(err);
                    rank("subscriptions", docs, (ranked) => { record('subs', ranked); console.log('subs'); parseSuccess(resolve);});
                });
            })).then(() => new Promise((resolve, reject) => {
                db[appid].find({ id: {$type: "number"} }).sort({"history.0.views": -1}, (err, docs) => {
                    err && console.log(err);
                    rank("views", docs, (ranked) => { record('views', ranked); console.log('views'); parseSuccess(resolve);});
                });
            })).then(() => new Promise((resolve, reject) => {
                db[appid].find({ id: {$type: "number"} }).sort({"history.0.comments": -1}, (err, docs) => {
                    err && console.log(err);
                    rank("comments", docs, (ranked) => { record('comments', ranked); console.log('comments'); parseSuccess(resolve);});
                });
            })).then(() => new Promise((resolve, reject) => {
                db[appid].find({ id: {$type: "number"} }).sort({"history.0.unsubscribes": 1}, (err, docs) => {
                    err && console.log(err);
                    rank("unsubscribes", docs, (ranked) => { record('unsubs', ranked); console.log('unsubs'); parseSuccess(resolve);});
                });
            })).then(() => new Promise((resolve, reject) => {
                db[appid].find({ id: {$type: "number"} }).sort({"history.0.favorites": -1}, (err, docs) => {
                    err && console.log(err);
                    rank("favorites", docs, (ranked) => { record('favs', ranked); console.log('favs'); parseSuccess(resolve);});
                });
            })).then(() => new Promise((resolve, reject) => {
                if (app.get('Cacher') === undefined) {
                    app.set('Cacher', new Cache(app, appid, () => {console.log('cache'); parseSuccess();}));
                }
            }));
        }
    }

    function parseSuccess(callback) {
        --collectionCount || cb();
        callback && callback();
    }

    function rank(filter, docs, callback) {
        var rank = 1;
        var ranks = docs.length;
        for (var i = 0; i < docs.length; i++) {
            var doc = docs[i];
            var l = i;
            var prev;
            var prevl;
            if (i > 0) {
                prev = docs[i-1];
            }
            doc.history[0].rank = rank++;
            if (i > 0 && doc.history[0][filter] === prev.history[0][filter]) {
                doc.history[0].rank = prev.history[0].rank;
            }
            db[appid].findAndModify({
                query: { id: doc.id },
                update: { 
                    $set: { 
                        [`history.${0}.${filter}Rank`]: doc.history[0].rank,
                        [`history.${0}.${filter}Percent`]: (doc.history[0].rank / docs.length * 100).toFixed(2)
                    }
                },
            }, (e, doc) => { 
                e && console.error(e);
                decrementAndCB();
            });
        }

        function decrementAndCB() {
            ranks--;
            if (!ranks) {
                callback(docs);
            }
        }
    }

    function record(dest, payload) {
        app.set(dest + "DB", payload);
    }
}

module.exports = Parser;