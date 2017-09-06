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
    app.set('Cacher', new Cache(app));
    console.log("dbs created, cache set " + JSON.stringify(app.get('Cacher').getItem(1117784063)));

    function sortBySubscriptions(database) {
        var db = [];
        database.forEach(function (obj) {
            db.push({
                id: obj.id,
                subscriptions: obj.subscriptions
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

        return db;
    }

    function sortByFavorited(database) {
        var db = [];
        database.forEach(function (obj) {
            db.push({
                id: obj.id,
                favorited: obj.favorited
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

        return db;
    }

    function sortByViews(database) {
        var db = [];
        database.forEach(function (obj) {
            db.push({
                id: obj.id,
                views: obj.views
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

        return db;
    }

    function sortByUnsubscribes(database) {
        var db = [];
        database.forEach(function (obj) {
            db.push({
                id: obj.id,
                unsubscribes: obj.unsubscribes
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

        return db;
    }

    function sortByComments(database) {
        var db = [];
        database.forEach(function (obj) {
            db.push({
                id: obj.id,
                num_comments_public: obj.num_comments_public
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

        return db;
    }

    function trimVariablesFrom(db) {
        ret = [];
        for (var i = 0; i < db.length; i++) {
            ret.push({
                "id": parseInt(db[i].publishedfileid),
                "title": db[i].title,
                "num_comments_public": db[i].num_comments_public,
                "subscriptions": db[i].subscriptions,
                "favorited": db[i].favorited,
                "views": db[i].views,
                "unsubscribes": db[i].lifetime_subscriptions - db[i].subscriptions, 
                "preview_url": db[i].preview_url
            });
        }
        return ret;
    }

    function record(dest, payload) {
        app.set(dest + "DB", payload);
        fs.writeFile('/protected/dbs/' + dest +'DB.json', JSON.stringify(payload));
    }
}

module.exports = parser;