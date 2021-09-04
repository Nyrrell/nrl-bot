export const event =  {
    name: 'ready',
    once: true,
    execute(client) {
        console.log('Logged in as', client.user.tag);
        console.log('Logged on', client.guilds.cache.map(guild => guild.name).join(', '));
    },
};
