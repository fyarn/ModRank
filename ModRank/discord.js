var Discord = require("discord.js");
var cache = require('./Cache');

function Discord(app) {
    var client = new Discord.Client();
    var commandPrefix = '!modrank ';

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setGame('ranking Rimworld mods and scenarios');
    });

    client.on('message', msg => {
        if (msg.author.id !== bot.user.id && msg.content.startsWith(commandPrefix)) {
            var reply = "";
            //get first word after !modrank
            var lookupString = msg.content.split(' ')[1];
            if (lookupString != undefined) {
                var item = cache.getItem(app);
                if (item !== null) {
                    reply = item.title + '\n' +
                        item.itemTitle + '\n' +
                        'Subscriptions: ' + item.subs + ' | #' + item.subsRank + " | " + item.subsPercent + "%\n" +
                        'Favorites: ' + item.favs + ' | #' + item.favsRank + " | " + item.favsPercent + "%\n" +
                        'Comments: ' + item.comments + ' | #' + item.commentsRank + " | " + item.commentsPercent + "%\n" +
                        'Views: ' + item.views + ' | #' + item.viewsRank + " | " + item.viewsPercent + "%\n" +
                        'Unsubscriptions: ' + item.unsubscribes + ' | #' + item.unsubscribesRank + " | " + item.unsubscribesPercent + "%\n";
                }
                else {
                    reply = 'Item not found :(';
                }
                console.log("New Message: " + JSON.stringify(msg) + "\nReplying with: " + reply);
                msg.reply(reply);
            }
        }
    });

    client.login(process.env.BotToken);
}

module.exports = Discord;