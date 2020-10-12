const { stripIndents, oneLine } = require('common-tags');
const Command = require('../base');
const { disambiguation } = require('../../util');
const emojis = require('../../../../Assets/JSON/emojis.json');

module.exports = class AjudaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ajuda',
			group: 'util',
			memberName: 'ajuda',
			aliases: ['comandos', 'help'],
			description: 'Lista os comandos ou mostra informação detalhada sobre um em específico.',
			details: oneLine`
				The command may be part of a command name or a whole command name.
				If it isn't specified, all available commands will be listed.
			`,
			examples: ['ajuda', 'ajuda prefixo'],
			guarded: true,

			args: [
				{
					key: 'comando',
					prompt: 'Sobre qual comando você gostaria de receber ajuda?',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, args) { // eslint-disable-line complexity
		const groups = this.client.registry.groups;
		const commands = this.client.registry.findCommands(args.comando, false, msg);
		const showAll = args.comando && args.comando.toLowerCase() === 'todos';
		if(args.comando && !showAll) {
			if(commands.length === 1) {
				let help = stripIndents`
					${oneLine`
						__Comando **${commands[0].name}**:__ ${commands[0].description}
						${commands[0].guildOnly ? ' (apenas no servidor)' : ''}
						${commands[0].nsfw ? ' (NSFW)' : ''}
					`}

					**Formato:** ${msg.anyUsage(`${commands[0].name}${commands[0].format ? ` ${commands[0].format}` : ''}`)}
				`;
				if(commands[0].aliases.length > 0) help += `.\n**Outros nomes:** \`${commands[0].aliases.join('\`, \`')}\``;
				help += `.\n**Grupo:** ${commands[0].group.name}(\`${commands[0].groupID}:${commands[0].memberName}\`)`;
				if(commands[0].details) help += `.\n**Detalhes:** ${commands[0].details}`;
				if(commands[0].examples) help += `.\n**Exemplos:**\n${commands[0].examples.join('\n')}`;

				const messages = [];
				try {
					messages.push(await msg.author.send({embed: { color: msg.member ? msg.member.displayColor : Math.floor(Math.random() * 16777214) + 1, description: help } }));
					if(msg.channel.type !== 'dm') messages.push(await msg.embed({ color: '#24960e', description: `${emojis.success} | Mandei no privado.` }));
				} catch(err) {
					messages.push(await msg.embed({ color: emojis.failC, description: `${emojis.fail} | Não consegui mandar no privado, você provavelmente tem ele fechado` }));
				}
				return messages;
			} else if(commands.length > 15) {
				return msg.embed({ color: emojis.warningC, description: `${emojis.warning} | Multiplos comandos encontrados, por favor seja mais específico.` });
			} else if(commands.length > 1) {
				return msg.embed({ color: emojis.warningC, description: `${emojis.warning} | ${disambiguation(commands, 'comandos')}` });
			} else {
				return msg.embed({ color: emojis.warningC, description: `${emojis.warning} | Não consegui identificar o comando... Utilize ${msg.usage(
						null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined
					)} para ver uma lista com todos.` });
			}
		} else {
			const messages = [];
			try {
				messages.push(await msg.author.send(stripIndents`
					Para utilizar um comando em ${msg.guild ? msg.guild.name : 'qualquer canal'},
					utilize ${Command.usage('comando', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
					Por exemplo, ${Command.usage('prefixo', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.

					Pra utilizar um comando no privado, só digite o comando, sem prefixo.

					Utilize ${this.usage('<comando>', null, null)} para ver informação mais detalhada sobre um comando.
					Utilize ${this.usage('todos', null, null)} pra ver uma lista com *todos* os comandos, não só os que você pode usar.

					__**${showAll ? 'Todos os comandos' : `Comandos disponíveis em ${msg.guild ? msg.channel : 'privado'}`}**__

					${groups.filter(grp => grp.commands.some(cmd => !cmd.hidden && (showAll || cmd.isUsable(msg))))
						.map(grp => stripIndents`
							__${grp.name}__
							${grp.commands.filter(cmd => !cmd.hidden && (showAll || cmd.isUsable(msg)))
								.map(cmd => `**${cmd.name}:** ${cmd.description}${cmd.nsfw ? ' (NSFW)' : ''}`).join('\n')
							}
						`).join('\n\n')
					}
				`, { split: true }));
				if(msg.channel.type !== 'dm') messages.push(await msg.embed({ color: '#24960e', description: `${emojis.success} | Mandei no privado.` }));
			} catch(err) {
				messages.push(await msg.embed({ color: emojis.failC, description: `${emojis.fail} | Não consegui mandar no privado, você provavelmente tem ele fechado` }));
			}
			return messages;
		}
	}
};
