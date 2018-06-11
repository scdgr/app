function checkChannel(msg, id) {
    let checker = setInterval(() => {
        if (msg.guild.channels.find('id', id).members.size < 1) {
            checkMembers(msg, id);
            console.log(msg.guild.channels.find('id', id).id + ' is empty');
            clearInterval(checker);
        }
    }, 1000)
}


function checkMembers(msg, id) {
    let count = 0;
    let memberChecker = setInterval(() => {
        console.log(`${msg.guild.channels.get(id).id} Delete in: ${30 - count}, size: ${msg.guild.channels.find('id', id).members.size}`);
        if (count >= 30) {
            console.log('Delete!');
            msg.guild.channels.find('id', id).delete().catch(err => { });
            clearTimeout(memberChecker);
        } else if (msg.guild.channels.find('id', id).members.size > 0) {
            checkChannel(msg, id);
            console.log(msg.guild.channels.find('id', id).id + ' has ' + msg.guild.channels.find('id', id).members.size + ' members');
            clearInterval(memberChecker);
        }
        count++;
    }, 1000)
}


async function createChannel(msg, name, category, guildMember, tam) {
    var id;
    await msg.guild.createChannel(name, 'voice').then(channel => { id = channel.id; })
    console.log(id);
    msg.guild.channels.get(id).overwritePermissions(guildMember, {
        'MOVE_MEMBERS': true,
        'MANAGE_CHANNELS': true,
        'MANAGE_ROLES': true
    })

    if (guildMember.voiceChannel) await guildMember.setVoiceChannel(msg.guild.channels.get(id));
    checkChannel(msg, id);
    if (category) msg.guild.channels.get(id).setParent(category);
    if (tam) {
        if (tam < 100 && tam > 0) msg.guild.channels.get(id).setUserLimit(tam);
        else if (tam < 0) msg.guild.channels.get(id).setUserLimit(0);
        else if (tam > 99) msg.guild.channels.get(id).setUserLimit(99);
    }
}



module.exports = {
    name: 'create',
    description: 'Cria um canal de voz temporário',
    usage: '<nome> <tamanho>',
    execute: async (client, msg, args) => {
        var servers = require('../servers.json');
        if (args.length) {
            console.log(args, args.length, args[args.length - 1]);
            if (isNaN(args[args.length - 1])) {
                let name = args.join(' ');
                if (!servers[msg.guild.id].category) createChannel(msg, name, undefined, msg.member);
                else createChannel(msg, name, servers[msg.guild.id].category, msg.member);
                msg.channel.send(`Criei '${name}'`)
            } else {
                if (args.length > 1) {
                    let tam = args.pop();
                    let name = args.join(' ');
                    if (!servers[msg.guild.id].category) createChannel(msg, name, undefined, msg.member, tam);
                    else createChannel(msg, name, servers[msg.guild.id].category, msg.member, tam);
                    msg.channel.send(`Criei '${name}'\nLimite de ${tam} pessoas.`)
                } else {
                    let tam = args.pop();
                    if (!servers[msg.guild.id].category) createChannel(msg, `Canal: ${msg.member.displayName}`, undefined, msg.member, tam);
                    else createChannel(msg, `Canal: ${msg.member.displayName}`, servers[msg.guild.id].category, msg.member, tam);
                    msg.channel.send(`Criei 'Canal: ${msg.member.displayName}'\nLimite de ${tam} pessoas.`)
                }
            }
        } else {
            if (!servers[msg.guild.id].category) createChannel(msg, `Canal: ${msg.member.displayName}`, undefined, msg.member);
            else createChannel(msg, `Canal: ${msg.member.displayName}`, servers[msg.guild.id].category, msg.member);
            msg.channel.send(`Criei 'Canal: ${msg.member.displayName}'`)
        }
    }

}