const fs = require('fs');
const events = require('events');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const servers = require('./servers.json');
const express = require('express');
const Axios = require('axios');
const app = express();
const api = require('./api.js');

api(app);



client = new Discord.Client();
client.commands = new Discord.Collection();

const files = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (let file of files) {
    let com = require(`./commands/${file}`);
    client.commands.set(com.name, com);
}

class Server extends events.EventEmitter {
    constructor(id, serverProperties) {
        super();
        this.id = id;
        if (serverProperties) Object.assign(this, serverProperties);
    }
}

global.servers = {}

client.on('ready', async () => {
    console.log(`Ready on ${client.user.username}`);
    var data;
    await Axios.get('http://localhost:3003/servers').then(resp => {
        data = resp.data;
    }).catch(err => { console.error(err.message) });
    client.guilds.array().forEach(async guild => {
        if (data.filter(item => {
            return item.server_id === guild.id
        }).length === 0) {
            await Axios.post('http://localhost:3003/servers', {
                server_id: guild.id,
                name: guild.name
            })
        }
        global.servers[guild.id] = new Server(guild.id, servers[guild.id]);
    })

    let myColors = [[67, 181, 129], [240, 166, 26], [240, 71, 71]];
    Object.keys(global.servers).forEach(key => {
        global.servers[key].on('enter', member => {
            if (global.servers[key].spamChannel) {
                member.guild.channels.find('id', global.servers[key].spamChannel).send(new Discord.RichEmbed()
                    .setAuthor(member.user.tag, member.user.avatarURL)
                    .setColor(myColors[0])
                    .setDescription(`**Conectou em:** ${member.voiceChannel.name}`)
                    .setTimestamp(new Date(Date.now())));

            }
        })

        global.servers[key].on('leave', member => {
            if (global.servers[key].spamChannel) {
                member.guild.channels.find('id', global.servers[key].spamChannel).send(new Discord.RichEmbed()
                    .setAuthor(member.user.tag, member.user.avatarURL)
                    .setColor(myColors[2])
                    .setDescription(`**Se Desconectou.**`)
                    .setTimestamp(new Date(Date.now())));

            }
        })

        global.servers[key].on('change', (oldMember, newMember) => {
            if (global.servers[key].spamChannel) {
                if (oldMember.voiceChannel === newMember.voiceChannel) return;
                oldMember.guild.channels.find('id', global.servers[key].spamChannel).send(new Discord.RichEmbed()
                    .setAuthor(newMember.user.tag, newMember.user.avatarURL)
                    .setColor(myColors[1])
                    .setDescription(`**Trocou de:** '${oldMember.voiceChannel.name}' **para:** '${newMember.voiceChannel.name}'`)
                    .setTimestamp(new Date(Date.now())));

            }
        })
    })
})

function isEnter(oldMember, newMember) {
    if (newMember.voiceChannel && !oldMember.voiceChannel) return true;
    else false;
}

function isLeave(oldMember, newMember) {
    if (!newMember.voiceChannel && oldMember.voiceChannel) return true;
    else false;
}

function isChange(oldMember, newMember) {
    if (newMember.voiceChannel && oldMember.voiceChannel) return true;
    else false;
}


client.on('voiceStateUpdate', (oldMember, newMember) => {
    if (isLeave(oldMember, newMember)) global.servers[oldMember.guild.id].emit('leave', oldMember);
    if (isEnter(oldMember, newMember)) global.servers[newMember.guild.id].emit('enter', newMember);
    if (isChange(oldMember, newMember)) global.servers[newMember.guild.id].emit('change', oldMember, newMember);
})

client.checkPermissions = (permCollection, perms) => {
    var result = false;
    if (!perms) return true;
    for (role of perms) result = result || permCollection.has(role);

    return result;
}




client.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;
    const args = msg.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (msg.content.startsWith('!args')) {
        console.log(args.join(' '));
    }
    if (!client.commands.has(commandName)) return;
    const command = client.commands.get(commandName);

    try {
        if (!client.checkPermissions(msg.member.permissions, command.perms)) {
            msg.channel.send("Você não tem permissão para usar esse comando.");
        } else if (command.args && !args.length) {
            let reply = `Você não forneceu nenhum parâmetro, ${msg.member.displayName}`
            if (command.usage) reply += `\nO uso correto é: \`${prefix}${command.name} ${command.usage}\``
            msg.channel.send(reply);
        } else command.execute(client, msg, args);
    } catch (error) {
        console.error(error);
    }

})




client.login(token);