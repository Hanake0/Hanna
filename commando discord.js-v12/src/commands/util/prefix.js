const { stripIndents, oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class PrefixCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'prefixo',
			aliases: ['prefix'],
			group: 'util',
			memberName: 'prefixo',
			description: 'Mostra ou define o prefixo',
			format: '[prefixo/"padrão"/"nenhum"]',
			details: oneLine`
				Se nenhum prefixo for provido, o prefixo atual será mostrado.
				Se o prefixo for "padrão", o prefixo vai ser mudado para o prefixo padrão do bot.
				Se o prefixo for "nenhum", o prefixo vai ser completamente removido, apenas menções vão ser utilizadas para comandos.
				Apenas Administradores podem mudar o prefixo.
			`,
			examples: ['prefixo', 'prefixo -', 'prefixo h.', 'prefixo padrão', 'prefixo nenhum'],
			userPermissions: ['MANAGE_CHANNELS'],

			args: [
				{
					key: 'prefixo',
					prompt: 'O que você quer que seja o prefixo?',
					type: 'string',
					max: 15,
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		// Just output the prefix
		if(!args.prefixo) {
			const prefixo = msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix;
			return msg.reply(stripIndents`
				${prefixo ? `O prefixo é \`${prefixo}\`.` : 'Não há prefixo'}
				Para utilizar comandos, use ${msg.anyUsage('comando')}.
			`);
		}

		// Check the user's permission before changing anything
		if(msg.guild) {
			if(!msg.member.hasPermission('ADMINISTRATOR') && !this.client.isOwner(msg.author)) {
				return msg.reply('Apenas Administradores podem mudar o prefixo');
			}
		} else if(!this.client.isOwner(msg.author)) {
			return msg.reply('Apenas o(s) dono(s) do bot podem mudar o prefixo global');
		}

		// Save the prefix
		const lowercase = args.prefixo.toLowerCase();
		const prefixo = lowercase === 'nenhum' ? '' : args.prefixo;
		let response;
		if(lowercase === 'padrão') {
			if(msg.guild) msg.guild.commandPrefix = null; else this.client.commandPrefix = null;
			const current = this.client.commandPrefix ? `\`${this.client.commandPrefix}\`` : 'sem prefixo';
			response = `Prefixo resetado para o padrão (atualmente: ${current}).`;
		} else {
			if(msg.guild) msg.guild.commandPrefix = prefixo; else this.client.commandPrefix = prefixo;
			response = prefixo ? `Prefixo mudado para \`${args.prefixo}\`.` : 'Prefixo removido completamente';
		}

		await msg.reply(`${response} Para utilizar comandos, use ${msg.anyUsage('comando')}.`);
		return null;
	}
};
