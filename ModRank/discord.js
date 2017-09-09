var Discord = require("discord.js");
var sanitizer = require('sanitize')();
var request = require('request');

function discord(app) {
    var token;
    console.log('posting');
    var client = new Discord.Client();

    function makeRequest() {
        request.post('https://discordapp.com/api/auth/login',
            {
                url: 'https://discordapp.com/api/auth/login',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "email": process.env.acctEmail, "password": process.env.acctPwd })
            }, function (err, res, body) {
                if (err) {
                    setTimeout(makeRequest, (1000 * 30));
                    return console.log('login fail: ' + err);
                }
                else {
                    client.login(JSON.parse(body).token).catch(function () { setTimeout(makeRequest, (1000 * 20)) });
                }
            }
        );
    }

    var commandPrefix = '!modrank';

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setGame('ranking mods');
    });

    client.on('message', msg => {
        msg.content = msg.content.toLowerCase();
        if (msg.author.id !== client.user.id && msg.content.startsWith(commandPrefix)) {
            var reply = "";
            //get first word after !modrank
            var lookupString = msg.content.split(' ')[1];
            if (lookupString != undefined) {
                var cache = app.get('Cacher');
                var item = cache.getItem(sanitizer.value(lookupString, app.get('parserRegex')));
                if (item !== null) {
                    //pad columns
                    var column1Length = Math.max(("" + item.subs).length, ("" + item.favs).length, ("" + item.comments).length,
                        ("" + item.views).length, ("" + item.unsubscribes).length);
                    var subsPaddingLength = column1Length - ("" + item.subs).length;
                    var subsPadding = "";
                    for (var i = 0; i < subsPaddingLength; i++) {
                        subsPadding += " ";
                    }
                    var favsPaddingLength = column1Length - ("" + item.favs).length;
                    var favsPadding = "";
                    for (var i = 0; i < favsPaddingLength; i++) {
                        favsPadding += " ";
                    }
                    var unsubscribesPaddingLength = column1Length - ("" + item.unsubscribes).length;
                    var unsubscribesPadding = "";
                    for (var i = 0; i < unsubscribesPaddingLength; i++) {
                        unsubscribesPadding += " ";
                    }
                    var viewsPaddingLength = column1Length - ("" + item.views).length;
                    var viewsPadding = "";
                    for (var i = 0; i < viewsPaddingLength; i++) {
                        viewsPadding += " ";
                    }
                    var commentsPaddingLength = column1Length - ("" + item.comments).length;
                    var commentsPadding = "";
                    for (var i = 0; i < commentsPaddingLength; i++) {
                        commentsPadding += " ";
                    }
                    var column2Length = Math.max(("" + item.subsRank).length, ("" + item.favsRank).length, ("" + item.commentsRank).length,
                        ("" + item.viewsRank).length, ("" + item.unsubsRankcribes).length);
                    var subsRankPaddingLength = column1Length - ("" + item.subsRank).length;
                    var subsRankPadding = "";
                    for (var i = 0; i < subsRankPaddingLength; i++) {
                        subsRankPadding += " ";
                    }
                    var favsRankPaddingLength = column1Length - ("" + item.favsRank).length;
                    var favsRankPadding = "";
                    for (var i = 0; i < favsRankPaddingLength; i++) {
                        favsRankPadding += " ";
                    }
                    var unsubscribesRankPaddingLength = column1Length - ("" + item.unsubscribesRank).length;
                    var unsubscribesRankPadding = "";
                    for (var i = 0; i < unsubscribesRankPaddingLength; i++) {
                        unsubscribesRankPadding += " ";
                    }
                    var viewsRankPaddingLength = column1Length - ("" + item.viewsRank).length;
                    var viewsRankPadding = "";
                    for (var i = 0; i < viewsRankPaddingLength; i++) {
                        viewsRankPadding += " ";
                    }
                    var commentsRankPaddingLength = column1Length - ("" + item.commentsRank).length;
                    var commentsRankPadding = "";
                    for (var i = 0; i < commentsRankPaddingLength; i++) {
                        commentsRankPadding += " ";
                    }
                    var totalLength = ('Views:           ' + viewsPadding + item.views + ' | #' + viewsRankPadding + item.viewsRank + " | " + item.viewsPercent + "%\n").length;
                    var titlePaddingAmount = (totalLength - item.title.length) / 2;
                    var titlePadding = "";
                    for (var i = 0; i < titlePaddingAmount; i++) {
                        titlePadding += " ";
                    }
                    var itemTitlePaddingAmount = (totalLength - item.itemTitle.length) / 2;
                    var itemTitlePadding = "";
                    for (var i = 0; i < itemTitlePaddingAmount; i++) {
                        itemTitlePadding += " ";
                    }
                    reply = '\n' + titlePadding + titlePadding + '`' + item.title + '`\n' +
                        itemTitlePadding + itemTitlePadding + '`' + item.itemTitle + '`\n`' +
                        'Subscriptions:   ' + subsPadding + item.subs + ' | ' + subsRankPadding + '#' + item.subsRank + " | " + item.subsPercent + "%\n" +
                        'Favorites:       ' + favsPadding + item.favs + ' | ' + favsRankPadding + '#' + item.favsRank + " | " + item.favsPercent + "%\n" +
                        'Comments:        ' + commentsPadding + item.comments + ' | ' + commentsRankPadding + '#' + item.commentsRank + " | " + item.commentsPercent + "%\n" +
                        'Views:           ' + viewsPadding + item.views + ' | ' + viewsRankPadding + '#' + item.viewsRank + " | " + item.viewsPercent + "%\n" +
                        'Unsubscriptions: ' + unsubscribesPadding + item.unsubscribes + ' | ' + unsubscribesRankPadding + '#' + item.unsubscribesRank + " | " + item.unsubscribesPercent + "%`\n" +
                        'See more at: http://tinyurl.com/ModRank';
                }
                else {
                    reply = 'item not found :(';
                }
                console.log("New Message: '" + msg + "'\nReplying with: " + reply);
                msg.reply(reply);
            }
            else if (msg.content.startsWith(commandPrefix + ' ') || msg.content === commandPrefix) {
                msg.reply("Hi, I'm ModRank Bot!\nUse `!modrank ID` to get a mod's rank! ID can be a Steam ID, URL to a Steam mod page, or `random`!\nAm I broken? Contact the other fyarn!")
            }
        }
    });
}

module.exports = discord; 