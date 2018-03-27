var fs = require('fs');
var mongojs = require('mongojs');

function cache(app, appid) {
    this.master = mongojs('mydb')["Steam_App_" + appid];
    this.subs = app.get('subsDB');
    this.favs = app.get('favsDB');
    this.views = app.get('viewsDB');
    this.unsubscribes = app.get('unsubsDB');
    this.comments = app.get('commentsDB');

    //all of these are 1 indexed (getMostSubsItem(1) returns the first best item)
    cache.prototype.getMostSubsItem = function (index = 1) {
        return this.subs[index - 1];
    };

    cache.prototype.getMostFavsItem = function (index = 1) {
        return this.favs[index - 1];
    };

    cache.prototype.getMostViewsItem = function (index = 1) {
        return this.views[index - 1];
    };

    cache.prototype.getMostUnsubscribesItem = function (index = 1) {
        return this.unsubscribes[index - 1];
    };

    cache.prototype.getMostCommentsItem = function (index = 1) {
        return this.comments[index - 1];
    };

    cache.prototype.getItem = function (id, cb) {
        if (typeof id === "string") {
            if (id.startsWith('https://steamcommunity.com/sharedfiles/filedetails/?id=') ||
                id.startsWith('http://steamcommunity.com/sharedfiles/filedetails/?id=')) {
                id = parseInt(id.split('=')[1]);
            }
            else if (id.toLowerCase() === 'rand' || id.toLowerCase() === 'random')
            {
                //get random id
                id = app.get('masterDB')[Math.floor(Math.random() * master.length)].id;
            }
            else {
                id = parseInt(id);
            }
        }

        master.findOne({ id: id }, cb);
    };

    cache.prototype.getItems = function (ids, cb) {
        for (var id in ids) {
            if (typeof id === "string") {
                if (id.startsWith('https://steamcommunity.com/sharedfiles/filedetails/?id=') ||
                id.startsWith('http://steamcommunity.com/sharedfiles/filedetails/?id=')) {
                    id = parseInt(id.split('=')[1]);
                }
                else if (id.toLowerCase() === 'rand' || id.toLowerCase() === 'random')
                {
                    //get random id
                    id = app.get('masterDB')[Math.floor(Math.random() * master.length)].id;
                }
                else {
                    id = parseInt(id);
                }
            }
        }

        master.find({ id: {$in: ids} }, cb);
    };
}

module.exports = cache;
