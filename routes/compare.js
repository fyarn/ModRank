var express = require('express');
var router = express.Router();
var sanitizer = require('sanitize')();

/* GET compare listings. */
router.get('/', function (req, res) {
    var cache = app.get('Cacher');
    var comps = [];
    var redirect = false;

    for (var i = 1; i <= app.get('masterDB').length; i++) {
        var id = req.param('id' + i);
        if (id === undefined) {
            break;
        }
        id = sanitizer.value(id, app.get('parserRegex'));
        var item = cache.getItem(id);

        if (id !== item.id) {
            redirect = true;
        }

        if (item === null) {
            var title = "ModRank - Not Found";
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
            comps.push(item);
        }
    }

    if (redirect) {
        url = '/compare?';
        for (i = 0; i < comps.length; i++) {
            url += 'id' + (i + 1) + '=' + comps[i].id + '&';
        }
        url = url.substring(0, url.length - 1);
        res.redirect(url);
    }

    res.render('compare', { title: 'ModRank Comparison', comps});
});

module.exports = router;
