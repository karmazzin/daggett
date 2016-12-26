var Botkit = require('botkit');
var os = require('os');

var controller = Botkit.slackbot({
  debug: false
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.SLACK_BOT_TOKEN,
}).startRTM()

// give the bot something to listen for.
controller.hears('hello',['direct_message','direct_mention','mention'],function(bot,message) {
  bot.reply(message,'Hello yourself.');
});

controller.hears('(.*)',['message_received','ambient'],function(bot,message) {
  // do something to respond to message
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'snowflake',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });
});
