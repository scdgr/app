module.exports = {
    name: 'ping',
    args: false,
    description: 'Send a message with the ping in milliseconds',
    execute: (client, msg, args) => {
        msg.channel.send(`Pong: \`${Date.now() - msg.createdTimestamp}ms\``);
        // console.log(Date.now());
    }
}
