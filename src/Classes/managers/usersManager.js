import { Collection } from 'discord.js';
import { wcUser } from '../user.js';


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
	resolveUser(user) {
		let newUser = this.cache.get((typeof user) === 'string' ? user : user.id);
		if(!newUser) {
			newUser = new wcUser(this.client, { num: this.cache.size + 1, id: user.id });
			this.cache.set(user.id, newUser);
		}
		return newUser;
	}

	// Undefined
	updateLastMessage(message, user, updateCoins = false) {
		const aDB = this.resolveUser(user);

		if(updateCoins) {
			aDB.xp += 5;
			aDB.wallet.coins++;
		}

		aDB.messages++;
		aDB.lastMessage = {
			createdAt: `${message.createdAt.toISOString()}`,
			content: message.content,
			channel: message.channel.id,
			attachment: message.attachments.first() ? message.attachments.first().url : null,
		};
	}

	// Boolean
	verifyUsername(user, addExtraXP = false) {
		const member = this.waifusClub.members.cache.get(user.id);
		if(!member) console.log(`Não encontrei ${user.tag} (${user.id}) dentre o cache de waifusclub.`);
		const role = this.waifusClub.roles.cache.get('750739449889030235');
		const hRole = member ? member._roles.includes('750739449889030235') : false;

		if(user.username.startsWith('!ʷᶜ') || user.username.startsWith('!𝓦𝓒')) {

			if(addExtraXP) this.resolveUser(user).xp += 4;
			if(!hRole && member) member.roles.add(role, 'Username começa com \'!ʷᶜ\' ou \'!𝓦𝓒\'');
			return true;
		}

		if(hRole) member.roles.remove(role, 'Username NÃO começa com \'!ʷᶜ\' ou \'!𝓦𝓒\'');
		return false;
	}

	// Boolean
	verifyCustomActivities(user, addExtraCoin = false) {
		const member = this.waifusClub.members.cache.get(user.id);
		const role = this.waifusClub.roles.cache.get('735677045954314362');
		const hRole = member ? member._roles.includes('735677045954314362') : false;

		if(user.presence) {
			const customStatus = user.presence.activities.find(act => act.type === 'CUSTOM_STATUS');
			const undefinedOrNull = customStatus === undefined ? true : customStatus.state === null;

			if(!undefinedOrNull) {
				const inclui = this.client.data.invites.some(i => customStatus.state.includes(i.code));

				if(inclui) {
					if(addExtraCoin) this.client.data.users.cache.get(user.id).wallet.coins++;
					if(!hRole && member) member.roles.add(role, 'Convite permanente no status');
					return true;
				}
			}
		}

		if(hRole) member.roles.remove(role, 'Não tem convite permanente no Status');
		return false;
	}

	verifyBoosts(user, updateGems = false) {
		const userDB = this.client.data.users.resolveUser(user);
		const tier = userDB.boosting || 0;
		const minimumTime = (tier + 1) * 604800000;

		if(Date.now() - user.premiumSinceTimestamp >= minimumTime) {
			const semanas = Math.floor(user.premiumSinceTimestamp / 604800000);
			const reward = semanas - tier;

			if(updateGems) userDB.wallet.gems += reward * 15;
			if(updateGems) userDB.boosting = semanas;

			return true;
		} else if(user.premiumSinceTimestamp) return true;

		if(userDB.boosting) userDB.boosting = false;
		return false;
	}

}