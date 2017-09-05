var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    db = require('../UpdateDB');
    res.render('items', { title: 'ModRank', id: req.param("id", 0) });
});

module.exports = router;
