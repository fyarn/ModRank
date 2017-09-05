var express = require('express');
var router = express.Router();
var sanitizer = require('sanitize')();

/* GET users listing. */
router.get('/', function (req, res) {
    require('../UpdateDB')(app, false);
    var cache = app.get('Cacher');
    var id = sanitizer.value(req.query.id, 'int');
    var item = cache.getItem(id);

    if (item === undefined) {
        res.status(404).send('Item not found.');
    }
    else {
        res.render('items', {
            title: 'ModRank - ' + id,
            id: id,
            itemTitle: item.title,
            comments: item.num_comments_public,
            subs: item.subscriptions,
            favs: item.favorited,
            views: item.views,
            unsubscribes: item.unsubscribes,
            img: item.preview_url,
            favsRank: item.favsRank + 1,
            favsPercent: Math.round(item.favsPercent),
            subsRank: item.subsRank + 1,
            subsPercent: Math.round(item.subsPercent),
            unsubscribesRank: item.unsubscribesRank + 1,
            unsubscribesPercent: Math.round(item.unsubscribesPercent),
            viewsRank: item.viewsRank + 1,
            viewsPercent: Math.round(item.viewsPercent),
            commentsRank: item.commentsRank + 1,
            commentsPercent: Math.round(item.commentsPercent)
        });
    }
});

module.exports = router;
