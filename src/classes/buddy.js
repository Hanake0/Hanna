export class Buddy {
	constructor(client, infos) {

		Object.defineProperty(this, 'client', { value: client });

		this.infos = infos;
	}
}