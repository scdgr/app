const fs = require('fs');
const events = require('events');
const Discord = require('discord.js');
const servers = require('./servers.json');
// const express = require('express');
const Axios = require('axios');
// const app = express();
// const api = require('./api.js');

module.exports = (client) => {
    return new Promise(async (resolve, reject) => {

        try {
            class Server extends events.EventEmitter {
                constructor(id, serverProperties) {
                    super();
                    this.id = id;
                    if (serverProperties) Object.assign(this, serverProperties);
                }
            }

            client.servers = {}

            await client.on('ready', async () => {
                console.log(`Ready on ${client.user.username}`);
                var data;
                /*await Axios.get('http://localhost:3003/servers').then(resp => {
                    data = resp.data;
                }).catch(err => { console.error(err.message) });*/
                client.guilds.array().forEach(async guild => {
                    /*if (data.filter(item => {
                        return item.server_id === guild.id
                    }).length === 0) {
                        await Axios.post('http://localhost:3003/servers', {
                            server_id: guild.id,
                            name: guild.name
                        })
                    }*/
                    client.servers[guild.id] = new Server(guild.id, servers[guild.id]);
                })

                let myColors = [[67, 181, 129], [240, 166, 26], [240, 71, 71]]; //Cores utilizadas nas mensagens

                Object.keys(client.servers).forEach(key => {
                    client.servers[key].on('enter', member => {
                        if (client.servers[key].spamChannel) {
                            member.guild.channels.find('id', client.servers[key].spamChannel).send(new Discord.RichEmbed()
                                .setAuthor(member.user.tag, member.user.avatarURL)
                                .setColor(myColors[0])
                                .setDescription(`**Conectou em:** ${member.voiceChannel.name}`)
                                .setTimestamp(new Date(Date.now())));

                        }
                    })

                    client.servers[key].on('leave', member => {
                        if (client.servers[key].spamChannel) {
                            member.guild.channels.find('id', client.servers[key].spamChannel).send(new Discord.RichEmbed()
                                .setAuthor(member.user.tag, member.user.avatarURL)
                                .setColor(myColors[2])
                                .setDescription(`**Se Desconectou.**`)
                                .setTimestamp(new Date(Date.now())));

                        }
                    })

                    client.servers[key].on('change', (oldMember, newMember) => {
                        if (client.servers[key].spamChannel) {
                            if (oldMember.voiceChannel === newMember.voiceChannel) return;
                            oldMember.guild.channels.find('id', client.servers[key].spamChannel).send(new Discord.RichEmbed()
                                .setAuthor(newMember.user.tag, newMember.user.avatarURL)
                                .setColor(myColors[1])
                                .setDescription(`**Trocou de:** '${oldMember.voiceChannel.name}' **para:** '${newMember.voiceChannel.name}'`)
                                .setTimestamp(new Date(Date.now())));

                        }
                    })
                })
            })

            /*
            funções desnecessárias, irei deletar em breve
    
    
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
            */


            client.on('voiceStateUpdate', (oldMember, newMember) => {
                if (!newMember.voiceChannel && oldMember.voiceChannel) client.servers[oldMember.guild.id].emit('leave', oldMember);
                if (newMember.voiceChannel && !oldMember.voiceChannel) client.servers[newMember.guild.id].emit('enter', newMember);
                if (newMember.voiceChannel && oldMember.voiceChannel) client.servers[newMember.guild.id].emit('change', oldMember, newMember);
            })

            client.checkPermissions = (permCollection, perms) => {
                var result = false;
                if (!perms) return true;
                for (role of perms) result = result || permCollection.has(role);

                return result;
            }
            resolve(client);
        } catch (err) { reject(err) }
    })
}