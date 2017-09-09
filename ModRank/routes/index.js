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
        subTop: cache.getMostSubsItem(),
        viewTop: cache.getMostViewsItem(),
        commentTop: cache.getMostCommentsItem(),
        unsubTop: cache.getMostUnsubscribesItem(),
        favTop: cache.getMostFavsItem()
    });
});

module.exports = router;
