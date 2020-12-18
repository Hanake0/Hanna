import { TemporaryItem } from '../temporaryItem.js';

export default class ApartamentoN2 extends TemporaryItem {
	constructor(client, infos) {
		super(client, {
			_userID: infos._userID,
			nome: 'Apartamento Nº2',
			type: 'misc',
			description: 'Representa um apartamento comprado na loja, e sua validade',
			defaultTime: 604800000,
			usable: false,
		});

		this.expiringTime = infos.expiringTime || Date.now() + this.defaultTime;

		if(client.readyAt) this.channel = client.waifusClub.channels.cache.get(infos.channelID);
		else client.once('ready', () => this.channel = client.waifusClub.channels.cache.get(infos.channelID));
	}

	expire() {
		if(this.channel) try {
			this.channel.delete('Tempo do apartamento expirado');

			const user = this.client.users.cache.get(this._userID);
			if(user) user.send(`Seu \`${this.nome}\` acaba de expirar!`)
		} catch(err) {};

		this.remove();
	}

	use() {
		if(this.usable) {
			throw new Error('Esse item não tem método de uso!');
		} else return false;
	}

	toFirestore() {
		return {
			_type: 'ApartamentoN1',
			_path: '../Inventário/Items/Misc/apartamento1.js',
			_userID: this._userID,
			channelID: this.channel.id,
			expiringTime: this.expiringTime
		}
	}

}

