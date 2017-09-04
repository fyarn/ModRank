var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    require('../UpdateDB');
    res.render('items', { title: 'ModRank' });
});

module.exports = router;
