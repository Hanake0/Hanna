const { stripIndents, oneLine } = require('common-tags');
const Command = require('../base');
const { disambiguation } = require('../../util');

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ajuda',
			group: 'util',
			memberName: 'ajuda',
			aliases: ['help', 'comandos', 'commands'],
			description: 'Mostra uma lista de comandos disponíveis, ou informações detalhadas sobre um comando',
			details: oneLine`
				O comando tem de ser uma parte do nome do comando, ou o nome completo.
				Se o nome não for especificado, uma lista de todos os comandos disponíveis para o usuário enviada.
			`,
			examples: ['ajuda', 'ajuda prefixo'],
			guarded: true,

			args: [
				{
					key: 'comando',
					prompt: 'Gostaria de saber sobre qual comando ou grupo de comandos?',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, args) { // eslint-disable-line complexity
		const groups = this.client.registry.groups;
		const commands = this.client.registry.findCommands(args.command, false, msg);
		const showAll = args.command && args.command.toLowerCase() === 'todos';
		if(args.command && !showAll) {
			if(commands.length === 1) {
				let help = stripIndents`
					${oneLine`
						__Comando **${commands[0].name}**:__ ${commands[0].description}
						${commands[0].guildOnly ? ' (Utilizável apenas em servidores)' : ''}
						${commands[0].nsfw ? ' (NSFW)' : ''}
					`}

					**Formato:** ${msg.anyUsage(`${commands[0].name}${commands[0].format ? ` ${commands[0].format}` : ''}`)}
				`;
				if(commands[0].aliases.length > 0) help += `\n**Outros nomes:** ${commands[0].aliases.join(', ')}`;
				help += `\n${oneLine`
					**Grupo:** ${commands[0].group.name}
					(\`${commands[0].groupID}:${commands[0].memberName}\`)
				`}`;
				if(commands[0].details) help += `\n**Detalhes:** ${commands[0].details}`;
				if(commands[0].examples) help += `\n**Exemplos de uso:**\n${commands[0].examples.join('\n')}`;

				const messages = [];
				try {
					messages.push(await msg.direct(help));
					if(msg.channel.type !== 'dm') messages.push(await msg.reply('Te mandei as informações no privado.'));
				} catch(err) {
					messages.push(await msg.reply('Não consegui te mandar as informações no privado. Você provavelmente desativou essa configuração.'));
				}
				return messages;
			} else if(commands.length > 15) {
				return msg.reply('Muitos comandos foram encontrados. Por favor, seja mais específico.');
			} else if(commands.length > 1) {
				return msg.reply(disambiguation(commands, 'comando'));
			} else {
				return msg.reply(
					`Não foi possível identificar o comando. Utilize ${msg.usage(
						null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined
					)} para ver a lista completa de comandos.`
				);
			}
		} else {
			const messages = [];
			try {
				messages.push(await msg.direct(stripIndents`
					${oneLine`
						Para utilizar um comando em ${msg.guild ? msg.guild.name : 'qualquer servidor'},
						utilize ${Command.usage('comando', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
						Por exemplo, ${Command.usage('prefixo', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
					`}
					Para usar um comando no privado, simplesmente utilize ${Command.usage('comando', null, null)} sem prefixo.

					Utilize ${this.usage('<comando>', null, null)} para ver informação específica detalhada sobre um comando.
					Utilize ${this.usage('todos', null, null)} para ver uma lista de *todos* os comandos, não apenas os disponíveis.

					__**${showAll ? 'Todos os comandos' : `Comandos disponíveis em ${msg.guild || 'privado'}`}**__

					${(showAll ? groups : groups.filter(grp => grp.commands.some(cmd => cmd.isUsable(msg))))
						.map(grp => stripIndents`
							__${grp.name}__
							${(showAll ? grp.commands : grp.commands.filter(cmd => cmd.isUsable(msg)))
								.map(cmd => `**${cmd.name}:** ${cmd.description}${cmd.nsfw ? ' (NSFW)' : ''}`).join('\n')
							}
						`).join('\n\n')
					}
				`, { split: true }));
				if(msg.channel.type !== 'dm') messages.push(await msg.reply('Te mandei as informações no privado.'));
			} catch(err) {
				messages.push(await msg.reply('Não consegui te mandar as informações no privado. Você provavelmente desativou essa configuração.'));
			}
			return messages;
		}
	}
};
