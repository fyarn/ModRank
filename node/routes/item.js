let express = require('express');
let router = express.Router();
let sanitizer = require('sanitize')();

/* GET users listing. */
router.get('/', async function (req, res) {
    let cache = app.get('Cache');
    let id = sanitizer.value(req.query.id, app.get('parserRegex'));
    let item = await cache.getItem(id);
    if (item === null) {
        var title = "ModRank - Not Found";
        var message = "Item not found.";
        // render the error page
        res.status(404).render('error', {
            status: 404,
            message: message,
            title: title
        });
    }

    return (id === item.id) ? 
      res.render('item', item) : 
      res.redirect('/item?id=' + item.id);
});

module.exports = router;
