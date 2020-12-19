import { TemporaryItem } from '../temporaryItem.js';

export default class RedColor extends TemporaryItem {
	constructor(client, infos) {
		super(client, {
			_userID: infos._userID,
			nome: 'Cor Vermelho',
			aliases: ['Vermelho', 'vermelho', 'red', '740949818364395641'],
			type: 'colors',
			description: 'Poderá usar a cor <@&740949818364395641> no servidor,\n através do comando `hcor`.',
			usable: false,
		});

		this.roleID = '740949818364395641';

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
			_type: 'RedColor',
			_path: '../Inventário/Items/Colors/red.js',
			_userID: this._userID,
			expiringTime: this.expiringTime,
		};
	}

}

