var fs = require('fs');
var Cache = require('./Cache');

//parses and records lists based off given database
function parser(database, app)
{
    database = trimVariablesFrom(database);
    record('master', database);
    record('subs', sortBySubscriptions(database));
    record('favs', sortByFavorited(database));
    record('views', sortByViews(database));
    record('unsubs', sortByUnsubscribes(database));
    record('comments', sortByComments(database));
    if (app.get('Cacher') === undefined) {
        app.set('Cacher', new Cache(app));
    }

    function sortBySubscriptions(database) {
        var db = [];
        database.forEach(function (obj) {
            db.push({
                id: obj.id,
                subscriptions: obj.subscriptions,
                hits: obj.subscriptions,
                name: obj.title,
                img: obj.preview_url,
                rank: -1
            });
        });

        db.sort(function (a, b) {
            if (a.subscriptions < b.subscriptions)
                return 1;
            else if (a.subscriptions > b.subscriptions)
                return -1;
            else
                return 0;
        });

        var rank = 1;
        for (var i = 0; i < db.length; i++) {
            db[i].rank = rank++;
            if (i > 0 && db[i].subscriptions === db[i - 1].subscriptions) {
                db[i].rank = db[i - 1].rank;
            }
        }
        return db;
    }

    function sortByFavorited(database) {
        var db = [];
        database.forEach(function (obj) {
            db.push({
                id: obj.id,
                favorited: obj.favorited,
                hits: obj.favorited,
                name: obj.title,
                img: obj.preview_url,
                rank: -1
            });
        });

        db.sort(function (a, b) {
            if (a.favorited < b.favorited)
                return 1;
            else if (a.favorited > b.favorited)
                return -1;
            else
                return 0;
        });

        var rank = 1;
        for (var i = 0; i < db.length; i++) {
            db[i].rank = rank++;
            if (i > 0 && db[i].favorited === db[i - 1].favorited) {
                db[i].rank = db[i - 1].rank;
            }
        }

        return db;
    }

    function sortByViews(database) {
        var db = [];
        database.forEach(function (obj) {
            db.push({
                id: obj.id,
                views: obj.views,
                hits: obj.views,
                name: obj.title,
                img: obj.preview_url,
                rank: -1
            });
        });

        db.sort(function (a, b) {
            if (a.views < b.views)
                return 1;
            else if (a.views > b.views)
                return -1;
            else
                return 0;
        });

        var rank = 1;
        for (var i = 0; i < db.length; i++) {
            db[i].rank = rank++;
            if (i > 0 && db[i].views === db[i - 1].views) {
                db[i].rank = db[i - 1].rank;
            }
        }

        return db;
    }

    function sortByUnsubscribes(database) {
        var db = [];
        database.forEach(function (obj) {
            db.push({
                id: obj.id,
                unsubscribes: obj.unsubscribes,
                hits: obj.unsubscribes,
                name: obj.title,
                img: obj.preview_url,
                rank: -1
            });
        });

        db.sort(function (a, b) {
            if (a.unsubscribes < b.unsubscribes)
                return 1;
            else if (a.unsubscribes > b.unsubscribes)
                return -1;
            else
                return 0;
        });

        var rank = 1;
        for (var i = 0; i < db.length; i++) {
            db[i].rank = rank++;
            if (i > 0 && db[i].unsubscribes === db[i - 1].unsubscribes) {
                db[i].rank = db[i - 1].rank;
            }
        }

        return db;
    }

    function sortByComments(database) {
        var db = [];
        database.forEach(function (obj) {
            db.push({
                id: obj.id,
                num_comments_public: obj.num_comments_public,
                hits: obj.num_comments_public,
                name: obj.title,
                img: obj.preview_url,
                rank: -1
            });
        });

        db.sort(function (a, b) {
            if (a.num_comments_public < b.num_comments_public)
                return 1;
            else if (a.num_comments_public > b.num_comments_public)
                return -1;
            else
                return 0;
        });

        var rank = 1;
        for (var i = 0; i < db.length; i++) {
            db[i].rank = rank++;
            if (i > 0 && db[i].num_comments_public === db[i - 1].num_comments_public) {
                db[i].rank = db[i - 1].rank;
            }
        }

        return db;
    }

    function trimVariablesFrom(db) {
        ret = [];
        for (var i = 0; i < db.length; i++) {
            var subs = db[i].lifetime_subscriptions;
            //check for undefined subscriptions
            if (typeof subs !== "number" || isNaN(subs)) {
                continue;
            }
            // prevent / by 0 error
            subs = subs === 0 ? 1 : subs;
            // calculate subs as a percentage of unsubscribers
            subs = parseFloat(((subs - db[i].subscriptions) / subs * 100).toFixed(2));
            ret.push({
                "id": parseInt(db[i].publishedfileid),
                "title": db[i].title,
                "num_comments_public": db[i].num_comments_public,
                "subscriptions": db[i].subscriptions,
                "favorited": db[i].favorited,
                "views": db[i].views,
                "unsubscribes": subs, 
                "preview_url": db[i].preview_url
            });
        }
        return ret;
    }

    function record(dest, payload) {
        app.set(dest + "DB", payload);
    }
}

module.exports = parser;