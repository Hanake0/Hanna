import { Collection } from 'discord.js';


export class UsersManager {
	constructor(client) {

		Object.defineProperty(this, 'client', { value: client });

		this.cache = new Collection();
	}

	get waifusClub() {
		return this.client.waifusClub;
	}

	// wcUser
	get(id) {
		return this.cache.get(id);
	}

	// wcUser
	async resolveUser(id) {
		id = typeof id === 'string' ? id : id.id;
		return this.client.sqlite.resolveUser(id);
	}

	// Undefined
	async updateLastMessage(message, wcUser, updateCoins = false) {
		if(updateCoins) {
			await wcUser.xp('val + 5');
			await wcUser.coins('val + 1');
		}

		await wcUser.messages('val + 1');
		if(!message.author.bot) await this.client.sqlite.updateLastMessage(wcUser.id, message);
	}

	// Boolean
	async verifyUsername(user, wcUser, addExtraXP = false) {
		const member = this.waifusClub.members.cache.get(user.id);
		if(!member) return;

		const role = this.waifusClub.roles.cache.get('750739449889030235');
		const hRole = member._roles.includes('750739449889030235');

		if(user.username.startsWith('!ʷᶜ') || user.username.startsWith('!𝓦𝓒')) {

			if(addExtraXP) await wcUser.xp('val + 4');
			if(!hRole) member.roles.add(role, 'Username começa com \'!ʷᶜ\' ou \'!𝓦𝓒\'')
				.catch(err => console.log(err));
			return true;
		}

		if(hRole) member.roles.remove(role, 'Username NÃO começa com \'!ʷᶜ\' ou \'!𝓦𝓒\'')
			.catch(err => console.log(err));
		return false;
	}

	// Boolean
	async verifyCustomActivities(user, wcUser, addExtraCoin = false) {
		const member = this.waifusClub.members.cache.get(user.id);
		if(!member) return;

		const role = this.waifusClub.roles.cache.get('735677045954314362');
		const hRole = member._roles.includes('735677045954314362');

		if(user.presence) {
			const customStatus = user.presence.activities.find(act => act.type === 'CUSTOM_STATUS');
			const undefinedOrNull = customStatus === undefined ? true : customStatus.state === null;

			if(!undefinedOrNull) {
				const inclui = this.client.data.invites.some(i => customStatus.state.includes(i.code));

				if(inclui) {
					if(addExtraCoin) await wcUser.coins('val + 1');
					if(!hRole) member.roles.add(role, 'Convite permanente no status')
						.catch(err => console.log(err));
					return true;
				}
			}
		}

		if(hRole) member.roles.remove(role, 'Não tem convite permanente no Status')
			.catch(err => console.log(err));
		return false;
	}

	async verifyBoosts(user, wcUser, updateGems = false) {
		const tier = wcUser.boosting() || 0;
		const minimumTime = (tier + 1) * 604800000;

		if(Date.now() - user.premiumSinceTimestamp >= minimumTime) {
			const semanas = Math.floor(user.premiumSinceTimestamp / 604800000);
			const reward = semanas - tier;

			if(updateGems) await wcUser.gems(`${reward} * 15`);
			if(updateGems) await wcUser.boosting(semanas);

			return true;
		} else if(user.premiumSinceTimestamp) return true;

		if(tier > 0) wcUser.boosting(null);
		return false;
	}

}