var express = require('express');
var router = express.Router();
function item(app) {
    /* GET users listing. */
    router.get('/', function (req, res, next) {
        require('../UpdateDB')(app);
        var cache = app.get('Cache');

        var item = cache.getItem(req.query.id)

        res.render('items', {
            title: 'ModRank - ' + req.query.id,
            id: req.query.id,
            itemTitle: item.title,
            comments: item.num_comments_public,
            subs: item.subscriptions,
            favs: item.favorited,
            views: item.views,
            unsubscribes: item.unsubscribes,
            img: item.preview_url,
            favsRank: item.favsRank,
            favsPercent: item.favsPercent,
            subsRank: item.subsRank,
            subsPercent: item.subsPercent,
            unsubscribesRank: item.unsubscribesRank,
            unsubscribesPercent: item.unsubscribesPercent,
            viewsRank: item.viewsRank,
            viewsPercent: item.viewsPercent,
            commentsRank: item.commentsRank,
            commentsPercent: item.commentsPercent
        });
    });
}

module.exports = router;
