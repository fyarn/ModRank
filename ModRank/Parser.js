var fs = require('fs');

//parses and records lists based off given database
function Parser(database)
{
    database = trimVariablesFrom(database);
    record('master', database);
    record('subs', sortBySubscriptions(database));
    record('faves', sortByFavorited(database));
    record('views', sortByViews(database));
    record('unsubs', sortByUnsubscribes(database));
    record('comments', sortByComments(database));
    return database;

    function sortBySubscriptions(database) {
        return database.sort(function (a, b) {
            if (a.subscriptions < b.subscriptions)
                return -1;
            else if (a.subscriptions > b.subscriptions)
                return 1;
            else
                return 0;
        })
    }

    function sortByFavorited(database) {
        return database.forEach(function (obj) {
            obj = {
                "title": obj.title,
                "favorited": obj.favorites
            }
        }).sort(function (a, b) {
            if (a.favorited < b.favorited)
                return -1;
            else if (a.favorited > b.favorited)
                return 1;
            else
                return 0;
        })
    }

    function sortByViews(database) {
        return database.forEach(function (obj) {
            obj = {
                "title": obj.title,
                "views": obj.views
            }
        }).sort(function (a, b) {
            if (a.views < b.views)
                return -1;
            else if (a.views > b.views)
                return 1;
            else
                return 0;
        })
    }

    function sortByUnsubscribes(database) {
        return database.forEach(function (obj) {
            obj = {
                "title": obj.title,
                "unsubscribes": obj.unsubscribes
            }
        }).sort(function (a, b) {
            if (a.unsubscribes < b.unsubscribes)
                return -1;
            else if (a.unsubscribes > b.unsubscribes)
                return 1;
            else
                return 0;
        })
    }

    function sortByComments(database) {
        return database.forEach(function (obj) {
            obj = {
                "title": obj.title,
                "num_comments_public": obj.num_comments_public
            }
        }).sort(function (a, b) {
            if (a.num_comments_public < b.num_comments_public)
                return -1;
            else if (a.num_comments_public > b.num_comments_public)
                return 1;
            else
                return 0;
        })
    }

    function trimVariablesFrom(db) {
        ret = []
        for (var i = 0; i < db.length; i++) {
            ret.push({
                "preview_url": db[i].preview_url,
                "title": db[i].title,
                "num_comments_public": db[i].num_comments_public,
                "subscriptions": db[i].subscriptions,
                "favorited": db[i].favorited,
                "views": db[i].views,
                "unsubscribes": db[i].lifetime_subscriptions - db[i].subscriptions
            });
        }

        return ret;
    }

    function record(dest, payload) {
        fs.writeFile('../protected/'+dest+'.json', JSON.stringify(payload));
    }
}

module.exports = Parser;