var fs = require('fs');

function Cache(app) {
    var master = app.get('master');
    var subs = app.get('subs');
    var favs = app.get('faves');
    var views = app.get('views');
    var unsubscribes = app.get('unsubs');
    var comments = app.get('comments');

    function getItem(id) {
        var record = master.find(function (value) { return value.id == id });

        var favsRank = favs.find(function (value) { return value.id == id });
        var favsPercent = favsRank / favs.length;
        var subsRank = subs.find(function (value) { return value.id == id });
        var subsPercent = subsRank / subs.length;
        var unsubscribesRank = unsubscribes.find(function (value) { return value.id == id });
        var unsubscribesPercent = unsubscribesRank / unsubscribes.length;
        var viewsRank = views.find(function (value) { return value.id == id });
        var viewsPercent = viewsRank / views.length;
        var commentsRank = comments.find(function (value) { return value.id == id });
        var commentsPercent = commentsRank / comments.length;

        var ret = {
            id: record.id,
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
        }
    }
}

module.exports = Cache;