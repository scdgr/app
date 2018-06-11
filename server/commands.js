const Discord = require('discord.js');
const fs = require('fs');
module.exports = (client) => {

    return new Promise((resolve, reject) => {

        try {
            client.commands = new Discord.Collection();
            const files = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

            for (let file of files) {
                let com = require(`./commands/${file}`);
                client.commands.set(com.name, com);
            }

            resolve(client);
        } catch (err) { reject(err) }
    })
}