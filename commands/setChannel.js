const fs = require('fs');
module.exports = {
    name: 'set',
    description: 'Seleciona uma categoria para sincronizar com os canais temporários.',
    usage: '<category:id>',
    perms: ['ADMINISTRATOR'],
    args: true,
    execute: (client, msg, args) => {
        var server = require('../servers.json');
        if (!msg.guild.channels.find('id', args[0])) {
            msg.channel.send("O id fornecido não é uma categoria")
        } else if (msg.guild.channels.find('id', args[0]).type === 'category') {
            server[msg.guild.id] = { category: args[0] }
            var serverJson = JSON.stringify(server, null, 2);
            fs.writeFile('./servers.json', serverJson, err => { if (err) throw err });
            msg.reply(`${msg.guild.name}: ${msg.guild.channels.find('id', args[0]).name}`);
        } else {
            msg.channel.send("O id fornecido não é uma categoria");
        }


    }
}
