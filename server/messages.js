const { prefix } = require('./config.json');
module.exports = (client) => {
    return new Promise((resolve, reject) => {
        try {
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

            resolve(client);
        } catch (err) { reject(err) }
    })
}