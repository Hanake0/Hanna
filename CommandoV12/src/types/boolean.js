import { ArgumentType } from './base.js';

export default class BooleanArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'boolean');
		this.truthy = new Set(['verdadeiro', 'v', 'yep', 'sim', 's', 'on', 'ligar', 'ligado', '1', '+']);
		this.falsy = new Set(['falso', 'f', 'nah', 'não', 'nao', 'n', 'off', 'desligar', 'desligado', '0', '-']);
	}

	validate(val) {
		const lc = val.toLowerCase();
		return this.truthy.has(lc) || this.falsy.has(lc);
	}

	parse(val) {
		const lc = val.toLowerCase();
		if(this.truthy.has(lc)) return true;
		if(this.falsy.has(lc)) return false;
		throw new RangeError('Unknown boolean value.');
	}
}

