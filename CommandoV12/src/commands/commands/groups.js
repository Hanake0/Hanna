import { stripIndents } from 'common-tags';
import emojis from '../../../../Assets/JSON/emojis.js';
import { Command } from '../base.js';

export default class ListGroupsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'groups',
			aliases: ['list-groups', 'show-groups'],
			group: 'commands',
			memberName: 'groups',
			description: 'Lists all command groups.',
			details: 'Only administrators may use this command.',
			guarded: true
		});
	}

	hasPermission(msg) {
		if(!msg.guild) return this.client.isOwner(msg.author);
		return msg.member.hasPermission('ADMINISTRATOR') || this.client.isOwner(msg.author);
	}

	run(msg) {
		return msg.embed({description: stripIndents`
			__**Grupos em ${msg.channel}**__
			${this.client.registry.groups.map(grp =>
				`${grp.isEnabledIn(msg.channel) && grp.isEnabledIn() ? emojis.success : emojis.fail}**${grp.name}:** ${grp.isEnabledIn(msg.channel) && grp.isEnabledIn() ? `Habilitado` : 'Desabilitado'}`
			).join('\n')}
		`});
	}
};
