import { ArgumentType } from './base.js';
import { disambiguation } from '../util.js';
import { escapeMarkdown } from 'discord.js';

export default class GroupArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'group');
	}

	validate(val) {
		const groups = this.client.registry.findGroups(val);
		if(groups.length === 1) return true;
		if(groups.length === 0) return false;
		return groups.length <= 15 ?
			`${disambiguation(groups.map(grp => escapeMarkdown(grp.name)), 'grupos', null)}\n` :
			'Multiplos grupos encontrados. Por favor seja mais específico.';
	}

	parse(val) {
		return this.client.registry.findGroups(val)[0];
	}
}

