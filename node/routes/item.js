let express = require('express');
let router = express.Router();
let sanitizer = require('sanitize')();

/* GET users listing. */
router.get('/', async function (req, res) {
    const app = req.app;
    const cache = app.get('Cache');
    const id = sanitizer.value(req.query.id, app.get('parserRegex'));
    let item = await cache.getItem(id);
    if (!item) {
        // render the error page
        return res.render('error', {
            status: 404,
            message: "Item not found.",
            title: "ModRank - Not Found"
        });
    }

    return (id == item.id) ? 
      res.render('item', item) : 
      res.redirect('/item?id=' + item.id);
});

module.exports = router;
