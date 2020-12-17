import { TemporaryItem } from '../../temporaryItem.js';

export default class EmojiN1 extends TemporaryItem {
	constructor(client, infos) {
		super(client, {
			_userID: infos._userID,
			nome: 'Slot de Emoji Nº1',
			type: 'misc',
			description: 'Representa um slot de emoji comprado na loja, e sua validade',
			defaultTime: 604800000,
			usable: false,
		});

		this.expiringTime = infos.expiringTime || Date.now() + this.defaultTime;

		if(client.readyAt) this.emoji = client.waifusClub.emojis.cache.get(infos.emojiID);
		else client.once('ready', () => this.emoji = client.waifusClub.emojis.cache.get(infos.emojiID));
	}

	expire() {
		if(this.emoji) try {
			this.emoji.delete('Tempo do emoji expirado');

			const user = this.client.users.cache.get(this._userID);
			if(user) user.send(`Seu \`${this.nome}\` acaba de expirar!`);
		} catch(err) {console.log(err); }

		this.remove();
	}

	use() {
		if(this.usable) {
			throw new Error('Esse item não tem método de uso!');
		} else return false;
	}

	toFirestore() {
		return {
			_type: 'EmojiN1',
			_path: '../Inventário/Items/Misc/emoji1.js',
			_userID: this._userID,
			emojiID: this.emoji.id,
			expiringTime: this.expiringTime,
		};
	}

}

