var fs = require('fs');

function Cache(app) {
    var master = app.get('masterDB');
    var subs = app.get('subsDB');
    var favs = app.get('favsDB');
    var views = app.get('viewsDB');
    var unsubscribes = app.get('unsubsDB');
    var comments = app.get('commentsDB');
    Cache.prototype.getItem = function (id) {
        if (typeof(id) == "") {
            id = parseInt(id);
        }
        var record = master.find(function (value) { return value.id === id; });
        if (record === undefined) {
            console.log("record is undefined")
            return null;
        };
        var favsRank = favs.findIndex(function (value) { return value.id === id; });
        var favsPercent = favsRank / favs.length * 100;
        var subsRank = subs.findIndex(function (value) { return value.id === id; });
        var subsPercent = subsRank / subs.length * 100;
        var unsubscribesRank = unsubscribes.findIndex(function (value) { return value.id === id; });
        var unsubscribesPercent = unsubscribesRank / unsubscribes.length * 100;
        var viewsRank = views.findIndex(function (value) { return value.id === id; });
        var viewsPercent = viewsRank / views.length * 100;
        var commentsRank = comments.findIndex(function (value) { return value.id === id; });
        var commentsPercent = commentsRank / comments.length * 100;

        return {
            id: id,
            title: record.title,
            num_comments_public: record.num_comments_public,
            subscriptions: record.subscriptions,
            favorited: record.favorited,
            views: record.views,
            unsubscribes: record.unsubscribes,
            preview_url: record.preview_url,
            favsRank: favsRank,
            favsPercent: favsPercent,
            subsRank: subsRank,
            subsPercent: subsPercent,
            unsubscribesRank: unsubscribesRank,
            unsubscribesPercent: unsubscribesPercent,
            viewsRank: viewsRank,
            viewsPercent: viewsPercent,
            commentsRank: commentsRank,
            commentsPercent: commentsPercent
        };
    };
}

module.exports = Cache;