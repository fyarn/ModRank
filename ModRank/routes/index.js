var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    require('../UpdateDB')(app, false);
    var list = app.get('masterDB');

    res.render("index", {
        title: 'ModRank',
        llen: list.length ? list.length : 0
    });
});

module.exports = router;
