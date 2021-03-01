const TelegramBot = require('node-telegram-bot-api');
const Discord = require('discord.js');
const mongoose = require('mongoose');


const logger = require('./logger');
const User = require('./bd/User');


/** ------------------------------- STARTING -------------------------------- */

const bot = new TelegramBot(process.env.TG_TOKEN, {polling: true});

const discord = new Discord.Client();
discord.login(process.env.DISCORD_TOKEN);
discord.on('ready', () => {
  console.log(`DISCORD: Logged in as ${discord.user.tag}!`);
}); 

mongoose
  .connect(
    `mongodb+srv://botUser:${process.env.DB_PASSWORD}@cluster0.vpq0d.mongodb.net/usersDb?retryWrites=true&w=majority`, 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log('DB: MongoDB cluster connected'))
  .catch(e => console.log('DB: MongoDB cluster connection failed\n', e));

/** ------------------------------------------------------------------------- */


discord.on('message', async message => {
  if (message.content === 'ping') {
    message.channel.send('хуинг');
  }
});


const usersInChannel = [];
discord.on("voiceStateUpdate", async (oldMember, newMember) => {
  if (!newMember.channelID) {
    const index = usersInChannel.indexOf(newMember.id);
    usersInChannel.splice(index, 1);
  } 
  else if (newMember.channelID && !oldMember.channelID) {
    usersInChannel.push(newMember.id);
  }

  if (usersInChannel.length > 2) {
    const users = await User.find({});
    users.map(({ id }) => {
      bot.sendMessage(id, 'В дискорде собралось больше 2х людей');
    })
  }

  if (newMember.streaming && !oldMember.streaming) {
    const users = await User.find({});
    users.map(({ id }) => {
      bot.sendMessage(id, 'В дискорде кто-то что-то стримит, можно глянуть');
    })
  }
});

bot.onText(/\/subscribe/, async msg => {
  try {
    const foundUser = await User.findOne({ id: msg.chat.id }).exec();
    if (foundUser) {
      bot.sendMessage(msg.chat.id, 'Ты уже подписан на события');
      return;
    }

    const user = new User({ id: msg.chat.id });
    await user.save();
    bot.sendMessage(msg.chat.id, 'Подписал тебя на события в дискорде');
  } catch (e) {
    bot.sendMessage(msg.chat.id, 'Подписка не сработала, напиши админу');
    logger('Error', e);
  }
});