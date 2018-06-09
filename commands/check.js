module.exports = {
    name: 'check',
    args: false,
    execute: (client, msg, args) => {
        if(args[0]) {
            msg.channel.send(`${msg.guild.channels.find('id', args[0]).members.size} members.`)
        } else msg.channel.send(`${msg.member.voiceChannel.members.size}`);
    }
}
