import { oneLine } from 'common-tags';
import emojis from '../../../../assets/JSON/emojis.js';
import { Command } from '../base.js';

export default class DisableCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'disable',
			aliases: ['disable-command', 'cmd-off', 'command-off', 'desabilitar'],
			group: 'commands',
			memberName: 'disable',
			description: 'Desabilita um comando ou grupo de comandos.',
			details: oneLine`
				O argumento tem que ser o nome/ID (parcial ou inteiro) de um comando ou grupo de comandos.
				Apenas ADMs pode usar esse comando.
			`,
			examples: ['disable util', 'disable Utility', 'disable prefix'],
			guarded: true,

			args: [
				{
					key: 'cmdOrGrp',
					label: 'command/group',
					prompt: 'Que comando ou grupo de comandos você gostaria de desabilitar?',
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
		if(!args.cmdOrGrp.isEnabledIn(msg.guild ? msg.channel : null, true)) {
			return msg.embed({color: emojis.warningC, description: 
				`${emojis.warning} | O ${args.cmdOrGrp.group ? 'comando' : 'grupo'} \`${args.cmdOrGrp.name}\` já está desabilitado${msg.guild ? !args.cmdOrGrp.group.isEnabledIn() ? ' globalmente' : ' neste canal' : ' globalmente ou para você'}.`
			});
		}
		if(args.cmdOrGrp.guarded) {
			return msg.embed({color: emojis.failC, description: 
				`${emojis.fail} | O ${args.cmdOrGrp.group ? 'comando' : 'grupo'} \`${args.cmdOrGrp.name}\` não pode ser desabilitado.`
			});
		}
		args.cmdOrGrp.setEnabledIn(msg.guild ? msg.channel : null, false);
		return msg.embed({color: emojis.successC, description: 
			`${emojis.success} | Desabilitado o ${args.cmdOrGrp.group ? 'comando' : 'grupo'} \`${args.cmdOrGrp.name}\`${msg.guild ? ' globalmente' : ' neste canal' }.`
		});
	}
};
