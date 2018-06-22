const Discord = require('discord.js');
let client = new Discord.Client();
const { token } = require('./config.json');

const commands = require('./commands.js');
const ready = require('./ready.js');
const messages = require('./messages.js');


client = commands(client)
ready(client).then(cli => { client = cli });
messages(client).then(cli => { client = cli });

client.login(token);