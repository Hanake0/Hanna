import { TemporaryItem } from '../temporaryItem.js';

export default class AlmondColor extends TemporaryItem {
	constructor(client, infos) {
		super(client, {
			_userID: infos.id,
			nome: 'Cor Amêndoa',
			category: 'cores',
			aliases: ['amêndoa', 'amendoa', 'almond', '740952074069606520'],
			type: 'cores',
			description: 'Poderá usar a cor <@&740952074069606520> no servidor,\n através do comando `hcor`.',
			usable: false,
			id1: infos.id1,
			id2:infos.id2,
			expiringTime: infos.expiringtime,
		});

		this.roleID = '740952074069606520';

		if(client.readyAt) this.role = client.waifusClub.roles.cache.get(this.roleID);
		else client.once('ready', () => this.role = client.waifusClub.roles.cache.get(this.roleID));
	}

	expire() {
		const user = this.client.users.cache.get(this._userID);
		user.send(`Sua \`${this.nome}\` acaba de expirar!`)
			.catch(err => console.log(err));

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

}

