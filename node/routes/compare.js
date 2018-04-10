var express = require('express');
var router = express.Router();
var sanitizer = require('sanitize')();

/* GET compare listings. */
router.get('/', async function (req, res) {
    var cache = app.get('Cache');
    var comps = [];
    var redirect = false;

    var i = 0;
    // always true, breaks when params end
    while (++i) {
        var id = req.param('id' + i);
        if (id === undefined) {
            break;
        }
        id = sanitizer.value(id, app.get('parserRegex'));
        comps.push(id);
    }

    let items = await cache.getItems(comps);
  
    if (items.length !== comps.length || comps.includes('random') || comps.includes('rand')) {
        url = '/compare?';
        for (i = 1; i <= items.length; i++) {
            url += 'id' + i + '=' + items[i - 1].id + '&';
        }
        url = url.substring(0, url.length - 1);
        return res.redirect(url);
    }
    res.render('compare', { title: 'ModRank Comparison', items});
});

module.exports = router;
