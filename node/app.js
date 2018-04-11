var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var ua = require('universal-analytics');
var sanitizer = require('sanitize')();

var index = require('./routes/index');
var item = require('./routes/item');
var compare = require('./routes/compare');
var chart = require('./routes/chart');

var visitor = ua('UA-64719618-2');
var mongojs = require('mongojs');
var SteamAPIWorker = require('./SteamAPIWorker');

class App {
  constructor() {
    // view engine setup
    let app = express()
      .set('visitor', visitor)
      .set('views', path.join(__dirname, 'views'))
      .set('view engine', 'jade')
      .set('DBConnection', 'mongodb://mongodb:27017')
      .set('parserRegex', /(https:\/\/steamcommunity\.com\/sharedfiles\/filedetails\/\?id=)?(\d+)|([Rr][Aa][Nn][Dd]([Oo][Mm])?)/)
      .set('steamRegex', /https:\/\/steamcommunity\.com\/sharedfiles\/filedetails\/\?id=/)
      .set('idRegex', /\d+/);

    let router = express.Router()
      .get('/', (req, res) => {
        res.json({ message: 'Connection succesful: ModRank API v1.0.0' });
        visitor.event("API", "Connection Test").send();
      })
      .get('/robots.txt', (req, res) =>
        res.send("User-agent: *\nDisallow:\/*random*\nDisallow:\/*rand*\n")
      )
      .route('/items', (req, res) => {
        res.json({ message: 'Connection succesful: ModRank Items API v1.0.0' });
        visitor.event("API", "Item Connection Test").send();
      })
      .route('/items/:item_id').get(async (req, res) => {
        let item = await app.get('Cache').getItem(
          sanitizer.value(req.params.item_id, app.get('parserRegex'))
        );
        visitor.event("API", "Item Lookup", req.params.item_id).send();
        //item not found
        item !== null ?
          res.json(doc) :
          res.status(404).send({ error: "404 item not found" });
      });

    app.use(logger('dev'))
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: false }))
      .use(cookieParser())
      .use(express.static(path.join(__dirname, '/public')))
      .use('/', index)
      .use('/item', item)
      .use('/compare', compare)
      .use('/chart', chart)
      .use('/api', this.router)
      //replace double slashes after URL
      .use('//', (req, res) => res.redirect(req.url.replace(/([^:]\/)\/+/g, "$1")))
      // catch 404 and forward to error handler
      .use((req, res, next) => next(new Error('Not Found').status(404)))
      // error handler
      .use((err, req, res, next) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        res.status(err.status || 500).render('error');
      });

    new SteamAPIWorker(app, '294100').keepUpToDate();
    return app;
  }
}

module.exports = new App();