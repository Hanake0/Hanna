import { TemporaryItem } from '../temporaryItem.js';

export default class BabyPinkColor extends TemporaryItem {
	constructor(client, infos) {
		super(client, {
			_userID: infos._userID,
			nome: 'Cor Rosa Bebê',
			aliases: ['Rosa Bebê', 'rosa bebe', 'rosa bebê', 'baby pink', 'Baby Pink', 'era pra ser um número'],
			type: 'colors',
			description: 'Poderá usar a cor <@&740951943119372408> no servidor,\n através do comando `hcor`.',
			usable: false,
		});

		this.roleID = 'era pra ser um número';

		this.expiringTime = infos.expiringTime;

		if(client.readyAt) this.role = client.waifusClub.roles.cache.get(this.roleID);
		else client.once('ready', () => this.role = client.waifusClub.roles.cache.get(this.roleID));
	}

	expire() {
		const user = this.client.users.cache.get(this._userID);
		try {
			user.send(`Sua \`${this.nome}\` acaba de expirar!`);
		} catch(err) { console.log(err); }

		const member = this.client.waifusClub.members.cache.get(this._userID);
		if(member) try {
			if(member._roles.includes(this.roleID))
				member.roles.remove(this.role, 'Cor expirada');
		} catch(err) { console.log(err); }

		this.remove(true);
	}

	use() {
		if(this.usable) {
			throw new Error('Esse item não tem método de uso!');
		} else return false;
	}

	toFirestore() {
		return {
			_type: 'BabyPinkColor',
			_path: '../Inventário/Items/Colors/babyPink.js',
			_userID: this._userID,
			expiringTime: this.expiringTime,
		};
	}

}