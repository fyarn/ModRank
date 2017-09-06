var express = require('express');
var router = express.Router();
var sanitizer = require('sanitize')();

/* GET users listing. */
router.get('/', function (req, res) {
    require('../UpdateDB')(app, false);
    var cache = app.get('Cacher');
    var id = sanitizer.value(req.query.id, /((\d+)+)|([Rr][Aa][Nn][Dd]([Oo][Mm])?)/);
    var item = cache.getItem(id);

    if (item === null) {
        var title = "ModRank - Not Found"
        // set locals, only providing error in development
        var message = "Item not found.";
        // render the error page
        res.status(404);
        res.render('error', {
            status: 404,
            message: message,
            title: title
        });
    }
    else {
        res.render('items', {
            title: 'ModRank - ' + item.id,
            id: item.id,
            itemTitle: item.title,
            comments: item.num_comments_public,
            subs: item.subscriptions,
            favs: item.favorited,
            views: item.views,
            unsubscribes: item.unsubscribes,
            img: item.preview_url,
            favsRank: item.favsRank,
            favsPercent: Math.round(item.favsPercent),
            subsRank: item.subsRank,
            subsPercent: Math.round(item.subsPercent),
            unsubscribesRank: item.unsubscribesRank,
            unsubscribesPercent: Math.round(item.unsubscribesPercent),
            viewsRank: item.viewsRank,
            viewsPercent: Math.round(item.viewsPercent),
            commentsRank: item.commentsRank,
            commentsPercent: Math.round(item.commentsPercent)
        });
    }
});

module.exports = router;
