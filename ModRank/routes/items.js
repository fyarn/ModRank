var express = require('express');
var router = express.Router();
var sanitizer = require('sanitize')();

/* GET users listing. */
router.get('/items', function (req, res) {
    require('../UpdateDB')(app, false);
    var cache = app.get('Cache');
    console.log("cache: " + JSON.stringify(cache));
    var id = (sanitizer.value(req.query.id, 'int')).toString();
    var item = cache.getItem(id);
    console.log("got id " + item.id);

    if (item === undefined) {
        res.status(404).send('Item not found.')
    }
    else {
        console.log('rendering ' + JSON.stringify(item));
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
