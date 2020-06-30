const { oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			aliases: ['delay'],
			group: 'util',
			memberName: 'ping',
			description: 'Checa o ping do bot em relação ao servidor',
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(msg) {
		if(!msg.editable) {
			const pingMsg = await msg.reply('Calculando...');
			return pingMsg.edit(oneLine`
				${msg.channel.type !== 'dm' ? `${msg.author},` : ''}
				Pong! O tempo de resposta da mensagem no servidor foi de ${pingMsg.createdTimestamp - msg.createdTimestamp}ms.
				${this.client.ping ? `O tempo de resposta interno foi de  ${Math.round(this.client.ping)}ms.` : ''}
			`);
		} else {
			await msg.edit('Calculando...');
			return msg.edit(oneLine`
				Pong! O tempo de resposta da mensagem no servidor foi de ${msg.editedTimestamp - msg.createdTimestamp}ms.
				${this.client.ping ? `O tempo de resposta interno foi de ${Math.round(this.client.ping)}ms.` : ''}
			`);
		}
	}
};
