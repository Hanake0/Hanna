import { readdirSync } from 'fs';

export class InventoryManager {
	constructor(client) {

		Object.defineProperty(this, 'client', { value: client });

		this.itens = [];

		if(client.readyAt) this.importItens();
		else client.once('ready', () => this.importItens());
	}
	async importItens() {
		const cArray = readdirSync('./src/inventory/itens/');

		cArray.forEach(async iName => {
			const { default: itemConstructor } = await import(`../../inventory/itens/${iName}`);
			const item = new itemConstructor(this.client, {});

			this.itens.push(item);
		});
	}

	findItem(alias) {
		console.log(alias);
		return this.itens.find(item =>
			item.aliases.includes(alias.toLowerCase()) || item.name.toLowerCase() === alias.toLowerCase(),
		);
	}

	async getItem(id, alias) {
		const item = this.findItem(alias);
		if(!item) return false;

		const db = await this.client.sqlite.getItem(id, item.nome);
		if(!db) return null;

		console.log(db);
		return new item.constructor(this.client, db);
	}

	async addItem(id, alias, data = {}) {
		let item = this.findItem(alias);
		if(!item) return false;

		await this.client.sqlite.importThing('itens', { id: id, name: item.nome, ...data });
		item = new item.constructor(this.client, { id: id, ...data });
		await this.client.firestore.setTimeout(item);
	}

}