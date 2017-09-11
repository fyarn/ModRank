﻿var fs = require('fs');
var ModInfo = require('./models/ModInfo');

function cache(app) {
    var master = app.get('masterDB');
    var subs = app.get('subsDB');
    var favs = app.get('favsDB');
    var views = app.get('viewsDB');
    var unsubscribes = app.get('unsubsDB');
    var comments = app.get('commentsDB');

    //all of these are 1 indexed (getMostSubsItem(1) returns the first best item)
    cache.prototype.getMostSubsItem = function (index = 1) {
        return this.getItem(subs[index - 1].id);
    };

    cache.prototype.getMostFavsItem = function (index = 1) {
        return this.getItem(favs[index - 1].id);
    };

    cache.prototype.getMostViewsItem = function (index = 1) {
        return this.getItem(views[index - 1].id);
    };

    cache.prototype.getMostUnsubscribesItem = function (index = 1) {
        return this.getItem(unsubscribes[index - 1].id);
    };

    cache.prototype.getMostCommentsItem = function (index = 1) {
        return this.getItem(comments[index - 1].id);
    };

    cache.prototype.getItem = function (id) {
        if (typeof id === "string") {
            if (id.startsWith('https://steamcommunity.com/sharedfiles/filedetails/?id=')
                || id.startsWith('http://steamcommunity.com/sharedfiles/filedetails/?id=')) {
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

        var record = master.find(function (value) { return value.id === id; });
        if (record === undefined) {
            console.log("Record is undefined");
            return null;
        }
        var favsRank = favs.find(function (value) { return value.id === id; }).rank;
        var favsPercent = (favsRank / favs.length * 100).toFixed(2);
        var subsRank = subs.find(function (value) { return value.id === id; }).rank;
        var subsPercent = (subsRank / subs.length * 100).toFixed(2);
        var unsubscribesRank = unsubscribes.find(function (value) { return value.id === id; }).rank;
        var unsubscribesPercent = (unsubscribesRank / unsubscribes.length * 100).toFixed(2);
        var viewsRank = views.find(function (value) { return value.id === id; }).rank;
        var viewsPercent = (viewsRank / views.length * 100).toFixed(2);
        var commentsRank = comments.find(function (value) { return value.id === id; }).rank;
        var commentsPercent = (commentsRank / comments.length * 100).toFixed(2);

        return new ModInfo(id, record.title, record.num_comments_public, record.subscriptions,
            record.favorited, record.views, record.unsubscribes, record.preview_url, favsRank,
            favsPercent, subsRank, subsPercent, unsubscribesRank, unsubscribesPercent, viewsRank,
            viewsPercent, commentsRank, commentsPercent);
    };
}

module.exports = cache;