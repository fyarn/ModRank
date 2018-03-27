var fs = require('fs');
var mongojs = require('mongojs');
var Cache = require('./Cache');

//parses and records lists based off given database
function parser(input, appid, app, cb)
{
    var collectionQueueLength;
    var db = mongojs('mydb');
    UpdateCollection();
    
    //private methods
    function UpdateCollection() {
        //stringify because you can't have number collection titles
        appid = 'Steam_App_' + appid;
        var updateTime = new Date();
        app.set('lastUpdate', updateTime);
        collectionQueueLength = input.length;
        
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
                            subscribes: datum.subscriptions,
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
    
    function trimVariablesFrom(db) {
        ret = [];
        for (var i = 0; i < db.length; i++) {
            var unsubs = validateUnsubs(db[i].lifetime_subscriptions, db[i].subscriptions);
            if (!unsubs) {
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
        (--collectionQueueLength) ||
            new Promise(function(resolve, reject) {
                db[appid].find((err, docs) => {
                    err && reject(err);
                    console.log('master');
                    record('master', docs);
                    resolve();
                })
            }).then(() => new Promise((resolve, reject) => {
                db[appid].find().sort({"history.0.subscriptions": -1}, (err, docs) => {
                    err && reject(err);
                    console.log('subs');
                    record('subs', rank("subscriptions", docs));
                    resolve();
                });
            })).then(() => new Promise((resolve, reject) => {
                db[appid].find().sort({"history.0.views": -1}, (err, docs) => {
                    err && reject(err);
                    console.log('views');
                    record('views', rank("views", docs));
                    resolve();
                });
            })).then(() => new Promise((resolve, reject) => {
                db[appid].find().sort({"history.0.comments": -1}, (err, docs) => {
                    err && reject(err);
                    console.log('comments');
                    record('comments', rank("comments", docs));
                    resolve();
                });
            })).then(() => new Promise((resolve, reject) => {
                db[appid].find().sort({"history.0.unsubscribes": 1}, (err, docs) => {
                    err && reject(err);
                    console.log('unsubs');
                    record('unsubs', rank("unsubscribes", docs));
                    resolve();
                });
            })).then(() => new Promise((resolve, reject) => {
                db[appid].find().sort({"history.0.favorites": -1}, (err, docs) => {
                    err && reject(err);
                    console.log('favs');
                    record('favs', rank("favorites", docs));
                    resolve();
                });
            })).then(() => new Promise((resolve, reject) => {
                if (app.get('Cacher') === undefined) {
                    console.log('cache');
                    app.set('Cacher', new Cache(app, appid));
                }
                resolve(cb);
            }));
    }

function rank(filter, docs) {
    var rank = 1;
    for (var i = 0; i < docs.length; i++) {
        var doc = docs[i];
        var l = doc.history.length;
        var prev;
        var prevl;
        if (i > 0) {
            prev = docs[i-1];
            prevl = prev.history.length;
        }
        doc.history[l - 1].rank = rank++;
        if (i > 0 && doc.history[l - 1][filter] === prev.history[prevl - 1][filter]) {
            doc.history[l - 1].rank = prev.history[prevl - 1].rank;
        }
        db[appid].findAndModify({
            query: { id: doc.id },
            update: { 
                $set: { 
                    [`history.${l - 1}.${filter}Rank`]: doc.history[l - 1].rank,
                    [`history.${l - 1}.${filter}Percent`]: (doc.history[l - 1].rank / docs.length * 100).toFixed(2)
                }
            },
        }, (e, doc) => e && console.error(e));
    }
    return docs;
}

function record(dest, payload) {
    app.set(dest + "DB", payload);
}
}

module.exports = parser;