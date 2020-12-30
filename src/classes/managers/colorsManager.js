import { Collection } from 'discord.js';


export class ColorsManager {
	constructor(client) {

		Object.defineProperty(this, 'client', { value: client });

		this.cache = new Collection();
	}

	get(id) {
		return this.cache.get(id);
	}

	hasColor(user, color) {
		const uDB = this.cache.get(user.id);
		let has = false;
		if(uDB)
			for(const cor of uDB)
				if(cor.aliases.includes(color))
					has = cor;
		return has;
	}
}