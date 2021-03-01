const TelegramBot = require('node-telegram-bot-api');
const Discord = require('discord.js');

const config = require('./config.json');



const discord = new Discord.Client();
const bot = new TelegramBot(process.env.TG_TOKEN, {polling: true});

discord.login(process.env.DISCORD_TOKEN);
discord.on('ready', () => {
  console.log(`Logged in as ${discord.user.tag}!`);
});  

discord.on('typingStart', (channel, user) => {
  if (user.username == 'Regis(Илья)')
    channel.send('лучше не стоит');
});

discord.on('message', message => {
  if (message.content === 'ping') {
    message.channel.send('хуинг');
  }
});

const usersInChannel = [];

discord.on("voiceStateUpdate", function(oldMember, newMember) {
  if (!newMember.channelID) {
    console.log('user left');
    const index = usersInChannel.indexOf(newMember.id);
    usersInChannel.splice(index, 1);
  } 
  else if (newMember.channelID && !oldMember.channelID) {
    console.log('user connected');
    usersInChannel.push(newMember.id);
  }

  // if (usersInChannel.length > 2) {
  //   bot.sendMessage(id, 'В дискорде больше двух людей');
  // }

  if (newMember.streaming && !oldMember.streaming) {
    config.chats_ids.map(id => {
      bot.sendMessage(id, 'В дискорде кто-то что-то стримит, можно глянуть');
    })
  }

});

bot.onText(/.*/, async (msg, match) => {
  bot.sendMessage(msg.chat.id, 'hello world');
  bot.sendMessage(msg.chat.id, msg.chat.id);
});