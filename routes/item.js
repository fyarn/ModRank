var express = require('express');
var router = express.Router();
var sanitizer = require('sanitize')();

/* GET users listing. */
router.get('/', function (req, res) {
    var cache = app.get('Cacher');
    var id = sanitizer.value(req.query.id, app.get('parserRegex'));
    cache.getItem(id, (err, item) => {
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
        /*else if (id !== item.id) {
            res.redirect('/item?id=' + item.id);
        }*/
        else {
            res.render('item', item);
        }
    });
});

module.exports = router;
