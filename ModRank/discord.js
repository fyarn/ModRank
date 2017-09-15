var Discord = require("discord.js");
var sanitizer = require('sanitize')();
var request = require('request');

function discord(app) {
    var token;
    console.log('Starting Discord...');
    var client = new Discord.Client();

    //set initial interval to 30 seconds (/2 because of initial multiplication by 2)
    var interval = 30000 / 2;

    function makeRequest() {
        //increase interval every time to avoid breaking API rate limit if site reboots while afk
        interval *= 2;
        request.post('https://discordapp.com/api/auth/login',
            {
                url: 'https://discordapp.com/api/auth/login',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "email": process.env.acctEmail, "password": process.env.acctPwd })
            }, function (err, res, body) {
                if (err) {
                    return console.log('login fail: ' + err);
                }
                else {
                    client.login(JSON.parse(body).token).catch((e) => { console.log(e); setTimeout(makeRequest, interval); });
                }
            }
        );
    }

    makeRequest();

    var commandPrefix = '!modrank';

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setGame('ranking mods');
    });


    client.on('message', msg => {
        var visitor = app.get('visitor');
        msg.content = msg.content.toLowerCase();
        if (msg.author.id !== client.user.id && msg.content.startsWith(commandPrefix)) {
            var reply = "";
            //get first word after !modrank
            var lookupString = msg.content.split(' ')[1];
            if (lookupString !== undefined) {
                var cache = app.get('Cacher');
                var id = sanitizer.value(lookupString, app.get('parserRegex'));
                var item = cache.getItem(id);
                if (item !== null) {
                    visitor.event("Chatbot", "Item Lookup", id, item.id).send();
                    //pad columns
                    var column1Length = Math.max(("" + item.subs).length, ("" + item.favs).length, ("" + item.comments).length,
                        ("" + item.views).length, (item.unsubscribes + '%').length);
                    var subsPaddingLength = column1Length - ("" + item.subs).length;
                    var subsPadding = "";
                    for (var i = 0; i < subsPaddingLength; i++) {
                        subsPadding += " ";
                    }
                    var favsPaddingLength = column1Length - ("" + item.favs).length;
                    var favsPadding = "";
                    for (i = 0; i < favsPaddingLength; i++) {
                        favsPadding += " ";
                    }
                    var unsubscribesPaddingLength = column1Length - (item.unsubscribes + "%").length;
                    var unsubscribesPadding = "";
                    for (i = 0; i < unsubscribesPaddingLength; i++) {
                        unsubscribesPadding += " ";
                    }
                    var viewsPaddingLength = column1Length - ("" + item.views).length;
                    var viewsPadding = "";
                    for (i = 0; i < viewsPaddingLength; i++) {
                        viewsPadding += " ";
                    }
                    var commentsPaddingLength = column1Length - ("" + item.comments).length;
                    var commentsPadding = "";
                    for (i = 0; i < commentsPaddingLength; i++) {
                        commentsPadding += " ";
                    }
                    var column2Length = Math.max(("" + item.subsRank).length, ("" + item.favsRank).length, ("" + item.commentsRank).length,
                        ("" + item.viewsRank).length, ("" + item.unsubsRankcribes).length);
                    var subsRankPaddingLength = column1Length - ("" + item.subsRank).length;
                    var subsRankPadding = "";
                    for (i = 0; i < subsRankPaddingLength; i++) {
                        subsRankPadding += " ";
                    }
                    var favsRankPaddingLength = column1Length - ("" + item.favsRank).length;
                    var favsRankPadding = "";
                    for (i = 0; i < favsRankPaddingLength; i++) {
                        favsRankPadding += " ";
                    }
                    var unsubscribesRankPaddingLength = column1Length - ("" + item.unsubscribesRank).length;
                    var unsubscribesRankPadding = "";
                    for (i = 0; i < unsubscribesRankPaddingLength; i++) {
                        unsubscribesRankPadding += " ";
                    }
                    var viewsRankPaddingLength = column1Length - ("" + item.viewsRank).length;
                    var viewsRankPadding = "";
                    for (i = 0; i < viewsRankPaddingLength; i++) {
                        viewsRankPadding += " ";
                    }
                    var commentsRankPaddingLength = column1Length - ("" + item.commentsRank).length;
                    var commentsRankPadding = "";
                    for (i = 0; i < commentsRankPaddingLength; i++) {
                        commentsRankPadding += " ";
                    }
                    var totalLength = ('Views:           ' + viewsPadding + item.views + ' | #' + viewsRankPadding + item.viewsRank + " | " + item.viewsPercent + "%\n").length;
                    var titlePaddingAmount = (totalLength - item.title.length) / 2;
                    var titlePadding = "";
                    for (i = 0; i < titlePaddingAmount; i++) {
                        titlePadding += " ";
                    }
                    var itemTitlePaddingAmount = (totalLength - item.itemTitle.length) / 2;
                    var itemTitlePadding = "";
                    for (i = 0; i < itemTitlePaddingAmount; i++) {
                        itemTitlePadding += " ";
                    }
                    reply = '\n' + titlePadding + titlePadding + '`' + item.title + '`\n' +
                        itemTitlePadding + itemTitlePadding + '`' + item.itemTitle + '`\n`' +
                        'Subscriptions:   ' + subsPadding + item.subs + ' | ' + subsRankPadding + '#' + item.subsRank + " | " + item.subsPercent + "%\n" +
                        'Favorites:       ' + favsPadding + item.favs + ' | ' + favsRankPadding + '#' + item.favsRank + " | " + item.favsPercent + "%\n" +
                        'Comments:        ' + commentsPadding + item.comments + ' | ' + commentsRankPadding + '#' + item.commentsRank + " | " + item.commentsPercent + "%\n" +
                        'Views:           ' + viewsPadding + item.views + ' | ' + viewsRankPadding + '#' + item.viewsRank + " | " + item.viewsPercent + "%\n" +
                        'Unsubscriptions: ' + unsubscribesPadding + item.unsubscribes + '% | ' + unsubscribesRankPadding + '#' + item.unsubscribesRank + " | " + item.unsubscribesPercent + "%`\n" +
                        'Find online anytime at: http://tinyurl.com/ModRank/item?id=' + item.id;
                }
                else {
                    visitor.event("Chatbot", "Item Lookup", id, -1).send();
                    reply = 'item not found :(';
                }
                console.log("New Message: '" + msg + "'\nReplying with: " + reply);
                msg.reply(reply);
            }
            else if (msg.content.startsWith(commandPrefix + ' ') || msg.content === commandPrefix) {
                visitor.event("Chatbot", "Base Command").send();
                msg.reply("Hi, I'm ModRank Bot! (online at http://tinyurl.com/ModRank) \n" +
                    "Use `!modrank ID` to get a mod's rank! ID can be a Steam ID, URL to a Steam mod page, or `random`!\n" +
                    "Am I broken? Contact the other fyarn!");
            }
        }
    });
}

module.exports = discord; 