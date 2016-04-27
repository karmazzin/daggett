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

controller.hears(['keyword','^pattern$'],['message_received'],function(bot,message) {
  // do something to respond to message
  bot.reply(message,'You used a keyword!');
});

controller.hears('open the (.*) doors',['message_received'],function(bot,message) {
  var doorType = message.match[1]; //match[1] is the (.*) group. match[0] is the entire group (open the (.*) doors).
  if (doorType === 'pod bay') {
    return bot.reply(message, 'I\'m sorry, Dave. I\'m afraid I can\'t do that.');
  }
  return bot.reply(message, 'Okay');
});

controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name', 'ку-ку, ёпта', 'ку-ку, епта',],
    'direct_message,direct_mention,mention', function(bot, message) {
        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,
            ':robot_face: I am a bot named <@' + bot.identity.name +
             '>. I have been running for ' + uptime + ' on ' + hostname + '.');
    });

controller.hears(['pizzatime'],['ambient'],function(bot,message) {
  bot.startConversation(message, askFlavor);
});

askFlavor = function(response, convo) {
  convo.ask("What flavor of pizza do you want?", function(response, convo) {
    convo.say("Awesome.");
    askSize(response, convo);
    convo.next();
  });
}
askSize = function(response, convo) {
  convo.ask("What size do you want?", function(response, convo) {
    convo.say("Ok.")
    askWhereDeliver(response, convo);
    convo.next();
  });
}
askWhereDeliver = function(response, convo) { 
  convo.ask("So where do you want it delivered?", function(response, convo) {
    convo.say("Ok! Good by.");
    convo.next();
  });
}

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}
