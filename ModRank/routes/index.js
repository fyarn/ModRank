var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    require('../UpdateDB')(app, false);
    var list = app.get('masterDB');
    var cache = app.get('Cacher');

    res.render("index", {
        title: 'ModRank',
        llen: list.length ? list.length : 0,

        favTop: cache.getMostFavsItem(1),
        subTop: cache.getMostSubsItem(1),
        viewTop: cache.getMostViewsItem(1),
        commentTop: cache.getMostCommentsItem(1),
        unsubTop: cache.getMostUnsubscribesItem(1),

        favTop2: cache.getMostFavsItem(2),
        subTop2: cache.getMostSubsItem(2),
        viewTop2: cache.getMostViewsItem(2),
        commentTop2: cache.getMostCommentsItem(2),
        unsubTop2: cache.getMostUnsubscribesItem(2),

        favTop3: cache.getMostFavsItem(3),
        subTop3: cache.getMostSubsItem(3),
        viewTop3: cache.getMostViewsItem(3),
        commentTop3: cache.getMostCommentsItem(3),
        unsubTop3: cache.getMostUnsubscribesItem(3),
        favTop3: cache.getMostFavsItem(3),
    });
});

module.exports = router;
