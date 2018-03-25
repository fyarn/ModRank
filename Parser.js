var fs = require('fs');
var Cache = require('./Cache');
var mongojs = require('mongojs');

//parses and records lists based off given database
function parser(input, appid)
{
   //stringify because you can't have number collection titles
   appid = 'SteamApp' + appid;
   var db = mongojs('mydb', [appid]);

   data = trimVariablesFrom(input);
   data.forEach(datum => {
      db[appid].findAndModify({
         query: { id: datum.id },
         upsert: true,
         update: { 
            $set: {
               id: datum.id,
               title: datum.title,
               preview_url: datum.preview_url
            },
            $push: { 
               history: {
                  updated: new Date(),
                  comments: datum.comments,
                  subscriptions: datum.subscriptions,
                  favorited: datum.favorited,
                  views: datum.views,
                  unsubscribes: datum.unsubscribes,
               }
            }
         }
      }, (error, doc) => {
         if (error) {
            console.log(error);
         } else {
            //console.log(doc);
         }
      });
   });

   function trimVariablesFrom(db) {
      ret = [];
      for (var i = 0; i < db.length; i++) {
         var unsubs = validateUnsubs(db[i].lifetime_subscriptions, db[i].subscriptions);
         if (!unsubs) {
            continue;
         }

         ret.push({
            "id": parseInt(db[i].publishedfileid),
            "title": db[i].title,
            "comments": db[i].num_comments_public,
            "subscriptions": db[i].subscriptions,
            "favorited": db[i].favorited,
            "views": db[i].views,
            "unsubscribes": unsubs, 
            "preview_url": db[i].preview_url
         });
      }
      return ret;
   }

   function validateUnsubs(total, subs) {
      //check for undefined subscriptions
      if (typeof total !== "number" || isNaN(total)) {
         return false;
      }
      // prevent / by 0 error
      total = total || 1;
      // calculate unsubs as a percentage of unsubscribers
      return parseFloat(((total - subs) / total * 100).toFixed(2));
   }
}

module.exports = parser;
