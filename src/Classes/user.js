// import { client } from '../../index.js';

export class wcUser {
	constructor(client, data) {

		Object.defineProperty(this, 'client', { value: client });

		this.num = data.num;

		this.id = data.id;

		this._invites = data.invites || 0;

		this._boosting = data.boosting || null;

		this._coins = data.coins || 0;

		this._gems = data.gems || 0;

		this._messages = data.messages || 0;

		this._xp = data.xp || 0;

	}

	async changeProperty(property, num = undefined) {
		const row = await this.client.sqlite.get(`SELECT ${property} FROM users WHERE id = ${this.id}`);
		const val = row[property];

		if(!num) return val;

		if(typeof num === 'string') {
			if(num.includes('val'))
				num.replace('val', val);

			num = Number(eval(num));
		}

		return await this.client.sqlite.updateUser(this.id, property, num);
	}

	invites(num = undefined) {
		return this.changeProperty('invites', num);
	}

	boosting(num = undefined) {
		return this.changeProperty('boosting', num);
	}

	coins(num = undefined) {
		return this.changeProperty('coins', num);
	}

	gems(num = undefined) {
		return this.changeProperty('gems', num);
	}

	messages(num = undefined) {
		return this.changeProperty('messages', num);
	}

	xp(num = undefined) {
		return this.changeProperty('xp', num);
	}

	async importThing(thingData) {
		const { default: thingConstructor } = await import(`${thingData._path}`);
		return new thingConstructor(this.client, thingData);
	}

	toFirestore() {
		const userData = {
			num: this.num,
			id: this.id,
			invites: this.invites,
			boosting: this.boosting,
			wallet: this.wallet,
			messages: this.messages,
			xp: this.xp,
			buddy: this.buddy,
			inventory: {},
			jobs: {},
			lastMessage: this.lastMessage,
		};

		// Coloca cada tipo de item em seu respectivo lugar no inventário e converte eles
		if(Object.keys(this.inventory).length > 0) {
			for(const itemType of Object.keys(this.inventory)) {
				userData.inventory[itemType] = [];
				for(const item of this.inventory[itemType]) {
					userData.inventory[itemType].push(item.toFirestore());
				}
			}
		}

		// Guarda as informações de trabalho e converte
		if(Object.keys(this.jobs).length > 0) {
			for(const jobNum of Object.keys(this.jobs)) {
				userData.jobs[jobNum] = this.jobs[jobNum].toFirestore();
			}
		}
		return userData;
	}

	static fromFirestore(data) {
		return new this(this.client, data);
	}

}
