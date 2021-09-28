export const event =  {
    name: 'ready',
    once: true,
    execute(client) {
        console.log('Logged in as', client.user.tag, 'in ver.', process.env.npm_package_version);
        console.log('Logged on', client.guilds.cache.map(guild => guild.name).join(', '));

        import('../services/deploy-commands.js');
        import('../tasks/index.js');
    },
};
