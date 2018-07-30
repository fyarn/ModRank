const express = require('express');
const router = express.Router();
const sanitizer = require('sanitize')();


/* GET compare listings. */
router.get('/', async function (req, res) {
    const app = req.app;
    const cache = app.get('Cache');
    const comps = [];

    let i = 0;
    // always true, breaks when params end
    while (++i) {
        const id = req.query[`id${i}`];
        if (id === undefined) {
            break;
        }
        comps.push(sanitizer.value(id, app.get('parserRegex')));
    }

    const items = await cache.getItems(comps);
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
