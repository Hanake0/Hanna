const { stripIndents, oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class PrefixCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'prefixo',
			group: 'util',
			memberName: 'prefixo',
			description: 'Mostra ou define o prefixo',
			format: '[prefix/"padrão"/"nenhum"]',
			details: oneLine`
				If no prefix is provided, the current prefix will be shown.
				If the prefix is "default", the prefix will be reset to the bot's default prefix.
				If the prefix is "none", the prefix will be removed entirely, only allowing mentions to run commands.
				Only administrators may change the prefix.
			`,
			examples: ['prefixo', 'prefixo -', 'prefixo omg!', 'prefixo padrão', 'prefixo nenhum'],

			args: [
				{
					key: 'prefix',
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
		if(!args.prefix) {
			const prefix = msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix;
			return msg.reply(stripIndents`
				${prefix ? `O prefixo é \`${prefix}\`.` : 'Não a prefixo'}
				Para utilizar comandos, use ${msg.anyUsage('command')}.
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
		const lowercase = args.prefix.toLowerCase();
		const prefix = lowercase === 'nenhum' ? '' : args.prefix;
		let response;
		if(lowercase === 'padrão') {
			if(msg.guild) msg.guild.commandPrefix = null; else this.client.commandPrefix = null;
			const current = this.client.commandPrefix ? `\`${this.client.commandPrefix}\`` : 'sem prefixo';
			response = `Prefixo resetado para o padrão (atualmente: ${current}).`;
		} else {
			if(msg.guild) msg.guild.commandPrefix = prefix; else this.client.commandPrefix = prefix;
			response = prefix ? `Prefixo mudado para \`${args.prefix}\`.` : 'Prefixo removido completamente';
		}

		await msg.reply(`${response} Para utilizar comando, use ${msg.anyUsage('command')}.`);
		return null;
	}
};
