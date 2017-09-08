var express = require('express');
var router = express.Router();
var sanitizer = require('sanitize')();

/* GET compare listings. */
router.get('/', function (req, res) {
    require('../UpdateDB')(app, false);
    var cache = app.get('Cacher');
    var comps = [];

    for (var i = 1; i < app.get('masterDB').length; i++) {
        var id = req.param('id' + i);
        if (id === undefined) {
            break;
        }
        id = sanitizer.value(id, app.get('parserRegex'));
        console.log("id:" + id);
        item = cache.getItem(id);

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
            comps.push(item);
        }
    }
    res.render('compare', { title: 'ModRank Comparison', comps});
});

module.exports = router;
