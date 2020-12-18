import { wcJob } from '../base.js';

export default class ProgrammerJob extends wcJob {
	constructor(data) {
		super({
			...data,
			name: 'Programador',
			description: 'Ajuda nos projetos envolvendo programação no servidor.',
			lastWork: data.lastWork || null,
			defaultWage: 10000,
			defaultCooldown: 604800000,
			hasMiniGame: false,
		});
	}

	toFirestore() {
		return {
			_type: 'ProgrammerJob',
			_path: './src/jobs/programmer.js',
			lastWork: this.lastWork,
			lastworkchannelid: this.lastworkchannelid,
			wage: this.wage,
			profit: this.profit,
			cooldown: this.cooldown,
		};
	}

}