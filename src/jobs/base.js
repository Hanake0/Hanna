export class wcJob {
	constructor(data) {
		this.name = data.name;

		this.description = data.description;

		this.defaultWage = data.defaultWage;

		this.wage = data.wage || this.defaultWage;

		this.profit = data.profit;

		this.lastWork = data.lastWork || null;

		this.lastworkchannelid = data.lastworkchannelid || null;

		this.defaultCooldown = data.defaultCooldown;

		this.cooldown = data.cooldown || 0;

		this.hasMiniGame = data.hasMiniGame;
	}

	async changeProperty(property, num = undefined) {
		const row = await this.client.sqlite.get(`SELECT ${property} FROM jobs WHERE id = ${this.id}`);
		const val = row[property];

		if(!num) return val;

		if(typeof num === 'string') {
			if(num.includes('val'))
				num.replace('val', val);

			num = Number(eval(num));
		}

		return await this.client.sqlite.updateUser(this.id, property, num);
	}

	cooldown(num = undefined) {
		return this.changeProperty('invites', num);
	}

	wage(num = undefined) {
		return this.changeProperty('wage', num);
	}

	lastwork(num = undefined) {
		return this.changeProperty('lastwork', num);
	}

	lastworkchannelid(num = undefined) {
		return this.changeProperty('lastworkchannelid', num);
	}

	work(wcUser, channel) {
		wcUser.coins(`val + ${this.wage}`);
		this.cooldown = Date.now() + this.defaultCooldown;
		if(this.hasMiniGame) this.miniGame(wcUser, channel);
	}

	// eslint-disable-next-line no-unused-vars
	miniGame(wcUser, channel) {
		if(!this.hasMiniGame) return true;
		throw new Error('esse trabalho não tem mini-game!');
	}
}