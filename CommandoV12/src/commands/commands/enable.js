import { oneLine } from 'common-tags';
import emojis from '../../../../assets/JSON/emojis.js';
import { Command } from '../base.js';

export default class EnableCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'enable',
			aliases: ['enable-command', 'cmd-on', 'command-on', 'habilitar'],
			group: 'commands',
			memberName: 'enable',
			description: 'Habilita um comando ou grupo de comandos',
			details: oneLine`
				O argumento tem que ser o nome/ID (parcial ou inteiro) de um comando ou grupo de comandos.
				Apenas ADMs pode usar esse comando.
			`,
			examples: ['enable util', 'enable Utility', 'enable prefix'],
			guarded: true,

			args: [
				{
					key: 'cmdOrGrp',
					label: 'command/group',
					prompt: 'Que comando ou grupo de comandos você gostaria de habilitar?',
					type: 'group|command'
				}
			]
		});
	}

	hasPermission(msg) {
		if(!msg.guild) return this.client.isOwner(msg.author);
		return msg.member.hasPermission('ADMINISTRATOR') || this.client.isOwner(msg.author);
	}

	run(msg, args) {
		const group = args.cmdOrGrp.group;
		if(args.cmdOrGrp.isEnabledIn(msg.guild ? msg.channel : null, true) && args.cmdOrGrp.isEnabledIn()) {
			return msg.embed({color: emojis.warningC, description: 
				`${emojis.warning} | O ${args.cmdOrGrp.group ? 'comando' : 'grupo'} \`${args.cmdOrGrp.name}\` já está habilitado${msg.guild ? ' neste canal' : ' globalmente'}${
					group && (!group.isEnabledIn(msg.channel) || !group.isEnabledIn()) ?
					`, mas o grupo \`${group.name}\` está desabilitado${msg.guild ? !group.isEnabledIn() ? ' globalmente' : ' neste canal' : ' globalmente ou para você'}, então ele não pode ser usado` :
					''
				}.`
			});
		}
		msg.embed({color: emojis.successC, description: 
			`${emojis.success} | O ${args.cmdOrGrp.group ? 'comando' : 'grupo'} \`${args.cmdOrGrp.name}\` foi habilitado${msg.guild ? ' neste canal' : ' globalmente'}${
				group && (!group.isEnabledIn(msg.channel) || !group.isEnabledIn()) ?
				`, mas o grupo \`${group.name}\` está desabilitado${msg.guild ? !group.isEnabledIn() ? ' globalmente' : ' neste canal' : ' globalmente ou para você'}, então ele não pode ser usado` :
				''
			}.`
		});
		args.cmdOrGrp.setEnabledIn(msg.guild ? msg.channel : null, true);
	}
};
