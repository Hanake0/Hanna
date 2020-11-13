import { ArgumentType } from './base.js';
import { disambiguation } from '../util.js';
import { escapeMarkdown } from 'discord.js';

export default class CommandArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'command');
	}

	validate(val) {
		const commands = this.client.registry.findCommands(val);
		if(commands.length === 1) return true;
		if(commands.length === 0) return false;
		return commands.length <= 15 ?
			`${disambiguation(commands.map(cmd => escapeMarkdown(cmd.name)), 'comandos', null)}\n` :
			'Multiplos comandos encontrados. Por favor seja mais específico.';
	}

	parse(val) {
		return this.client.registry.findCommands(val)[0];
	}
}

