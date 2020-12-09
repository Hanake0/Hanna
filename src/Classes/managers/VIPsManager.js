import { Collection } from 'discord.js';


export class VIPsManager {
	constructor(client) {

		Object.defineProperty(this, 'client', { value: client });

		this.cache = new Collection();
	}

	get(id) {
		return this.cache.get(id);
	}

	isVIP(user) {
		if(this.cache.has(user.id)) return (
			this.cache.get(user.id).tier
		);
		else return false;
	}
}