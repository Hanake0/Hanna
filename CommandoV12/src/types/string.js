import { ArgumentType } from './base.js';

export default class StringArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'string');
	}

	validate(val, msg, arg) {
		if(arg.oneOf && !arg.oneOf.includes(val.toLowerCase())) {
			return `Por favor escolha um dos seguintes: ${arg.oneOf.map(opt => `\`${opt}\``).join(', ')}`;
		}
		if(arg.min !== null && typeof arg.min !== 'undefined' && val.length < arg.min) {
			return `Por favor mantenha o ${arg.label} igual ou acima de ${arg.min} caracteres.`;
		}
		if(arg.max !== null && typeof arg.max !== 'undefined' && val.length > arg.max) {
			return `Por favor mantenha o ${arg.label} igual ou abaixo de ${arg.max} caracteres.`;
		}
		return true;
	}

	parse(val) {
		return val;
	}
}