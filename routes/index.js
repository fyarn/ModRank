var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    var list = app.get('masterDB');
    var cache = app.get('Cacher');

    res.render("index", {
        title: 'ModRank',
        llen: list.length ? list.length : 0,

        favoritesTop1: cache.getMostFavsItem(1),
        subscriptionsTop1: cache.getMostSubsItem(1),
        viewsTop1: cache.getMostViewsItem(1),
        commentsTop1: cache.getMostCommentsItem(1),
        unsubscribesTop1: cache.getMostUnsubscribesItem(1),

        favoritesTop2: cache.getMostFavsItem(2),
        subscriptionsTop2: cache.getMostSubsItem(2),
        viewsTop2: cache.getMostViewsItem(2),
        commentsTop2: cache.getMostCommentsItem(2),
        unsubscribesTop2: cache.getMostUnsubscribesItem(2),

        favoritesTop3: cache.getMostFavsItem(3),
        subscriptionsTop3: cache.getMostSubsItem(3),
        viewsTop3: cache.getMostViewsItem(3),
        commentsTop3: cache.getMostCommentsItem(3),
        unsubscribesTop3: cache.getMostUnsubscribesItem(3)
    });
});

module.exports = router;
