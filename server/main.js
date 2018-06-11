const Discord = require('discord.js');
const client = new Discord.Client();
const { token } = require('./config.json');

const commands = require('./commands.js');
const ready = require('./ready.js');

commands(client)
    .then(client => ready(client))


client.login(token);