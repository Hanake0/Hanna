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
				usages: 2,
				duration: 10
			}
		});
	}

	async run(msg) {
		const embed = new Discord.RichEmbed()
			.setTitle(':ping_pong:  Pong!')
			.addField('Resposta no servidor:', `${pingMsg.createdTimestamp - msg.createdTimestamp}ms`, false)
			.addField('Resposta interna:', `${Math.round(this.client.ping)}ms`)
		if(!msg.editable) {
			const pingMsg = await msg.say('Calculando...');
			return pingMsg.edit(embed);
		} else {
			await msg.edit('Calculando...');
			return msg.edit(embed);
		}
	}
};
