var fs = require('fs');
var mongojs = require('mongojs');

function cache(app, appid, cb) {
    mongojs('mydb')[appid].find({}, (err, docs) => {
        this.master = docs;
        cb && cb();
    });
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
                id = this.master[Math.floor(Math.random() * this.master.length)].id;
            }
            else {
                id = parseInt(id);
            }
        }
        var x = mongojs('mydb')[appid];
        x.findOne( {id: id}, (err, doc) => {
            cb(err, doc);
        });
    };

    cache.prototype.getItems = function (ids, callback) {
        ids = ids.map(id => {
            if (typeof id === "string") {
                if (id.startsWith('https://steamcommunity.com/sharedfiles/filedetails/?id=') ||
                id.startsWith('http://steamcommunity.com/sharedfiles/filedetails/?id=')) {
                    return parseInt(id.split('=')[1]);
                }
                else if (id.toLowerCase() === 'rand' || id.toLowerCase() === 'random')
                {
                    //get random id
                    return this.master[Math.floor(Math.random() * this.master.length)].id;
                }
                return parseInt(id);
            }
        });

        mongojs('mydb')[appid].find({ id: {$in: ids} }, callback);
    };
}

module.exports = cache;
