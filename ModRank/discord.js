var Discord = require("discord.js");

function Discord() {

    var client = new Discord.Client();

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('message', msg => {
        var reply = "";
        if (msg.content === 'ping') {
            msg.reply('Pong!');
        }

        console.log("New Message: " + JSON.stringify(msg) + "\nReplying with: " + reply);
    });

    client.login(process.env.BotToken);
}

module.exports = Discord;