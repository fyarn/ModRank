var express = require('express');
var router = express.Router();

/* GET chart. */
router.get('/', function (req, res) {
    var chartName = req.query.cat;
    if (chartName === undefined) {
        var title = "ModRank - Not Found";
        var message = "Category not found.";
        // render the error page
        res.status(404);
        res.render('error', {
            status: 404,
            message: message,
            title: title
        });
    }
    else {
        chartName = chartName.toLowerCase();
    }

    var from;
    if (req.query.from === undefined) {
        from = 1;
    }
    else {
        from = parseInt(req.query.from);
        if (from === null) {
            from = 1;
        }
    }

    if (req.query.to === undefined
        || parseInt(req.query.to) === null) {
        to = from + 100;
    }
    else {
        to = parseInt(req.query.to);
    }

    if (to < 1) {
        to = 10000000;
    }

    require('../UpdateDB')(app).Update('294100', false);

    var list = app.get('masterDB');
    var cache = app.get('Cacher');
    var chart;
    var name = '';
    if (chartName === 'subs' || chartName === 'subscriptions' || chartName === 'sub') {
        chart = app.get('subsDB');
        name = 'subscriptions';
    }
    else if (chartName === 'favs' || chartName === 'favorites' || chartName === 'fav') {
        chart = app.get('favsDB');
        name = 'favorited';
    }
    else if (chartName === 'comments' || chartName === 'comment') {
        chart = app.get('commentsDB');
        name = 'comments';
    }
    else if (chartName === 'views' || chartName === 'view') {
        chart = app.get('viewsDB');
        name = 'views';
    }
    else if (chartName === 'unsubs' || chartName === 'unsubscribe' || chartName === 'unsubscribes' || 
     chartName === 'unsubscriptions') {
        chart = app.get('unsubsDB');
        name = 'unsubscribes';
    }
    else {
        // render the error page
        res.status(404);
        res.render('error', {
            status: 404,
            message: "Category not found",
            title: "ModRank - Not Found"
        });
    }

    if (chart === undefined) {
        // render the error page
        res.status(404);
        res.render('error', {
            status: 404,
            message: "Category not found",
            title: "ModRank - Not Found"
        });
    }


    res.render("chart", {
        title: 'ModRank - ' + name[0].toUpperCase() + name.slice(1) + ' Charts',
        name: name,
        chart: chart,
        from: from,
        to: to
    });
});

module.exports = router;
