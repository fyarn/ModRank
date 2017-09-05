var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    try {
        res.render('index', { title: 'ModRank' });
    }
    catch (e) {
        console.log(e.message)
    }
});

module.exports = router;
