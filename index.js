const { CommandoClient } = require('discord.js-commando');
const path = require('path');

const client = new CommandoClient({
	commandPrefix: 'h',
	owner: '380512056413257729',
	unknownCommandResponse: false,
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['utilidades', 'Utilidades'],
		['basicos', 'Base']
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'Comandos'));

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity('with Commando');
});

client.on('error', console.error);

client.login(process.env.AUTH_TOKEN);