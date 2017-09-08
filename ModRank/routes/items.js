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
        var message = "Item '" + sanitizer.value(id, string) + "' not found.";
        // render the error page
        res.status(404);
        res.render('error', {
            status: 404,
            message: message,
            title: title
        });
    }
    else {
        res.render('items', item);
    }
});

module.exports = router;
