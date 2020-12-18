import { wcJob } from '../base.js';

export default class DesignerJob extends wcJob {
	constructor(data) {
		super({
			nome: 'Designer',
			description: 'Ajuda nos projetos envolvendo desenho e design no servidor.',
			lastWork: data.lastWork || null,
			wage: 10000,
			defaultCooldown: 604800000,
			hasMiniGame: false,
		});
	}

	toFirestore() {
		return {
			_type: 'DesignerJob',
			_path: '../Trabalhos/designer.js',
			lastWork: this.lastWork,
			cooldown: this.cooldown,
		};
	}

}