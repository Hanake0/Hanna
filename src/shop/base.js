/* eslint-disable no-unused-vars */
import emojis from '../../Assets/JSON/emojis.js';
import { stripIndents } from 'common-tags';

export default class ShopItem {
	constructor(client, infos) {

		Object.defineProperty(this, 'client', { value: client });

		this.nome = infos.nome;

		this.icon = infos.icon;

		this.color = infos.color;

		this.defValue = infos.defValue;

		this.category = infos.category;

		this.position = infos.position;

		this.description = infos.description;

		this.temporary = infos.temporary;

		this.emoji = infos.emoji;
	}

	showName(user, til = false) {
		return stripIndents`
			${this.canBuy(user) === true ? '' : `🚫${til ? '~~' : this.emoji}`}${this.nome}${this.canBuy(user) === true ? '' : `🚫${til ? '~~' : ''}`}`;
	}

	valor(user, currency = 'coins', tempo = 7) {
		const defValue = this.defineCurrency(currency, tempo);
		const discounts = this.hasDiscounts(user);

		if(discounts)
			return defValue * (1 - discounts);
		return defValue;
	}

	valorString(user, currency = 'coins', tempo = 7) {
		const defValue = this.defineCurrency(currency, tempo);
		const value = this.valor(user, currency, tempo);

		if(value !== defValue)
			return `_~~${defValue}~~_ ${value}`;
		else
			return `${value}`;
	}

	async buy(user, tempo = 7, ...nomes) {
		throw new Error(`${this.nome} não tem método de compra!`);
	}

	canBuy(user) {
		return true;
	}

	// Embed
	logEmbed(resultado, user) {
		let cor, texto;
		if(resultado === true) {
			cor = emojis.successC;
			texto = `Comprou **${this.name}**:`;
		} else if(resultado === false) {
			cor = emojis.failC;
			texto = `Tentou comprar **${this.name}** mas a compra foi cancelada:`;
		} else {
			cor = emojis.warningC;
			texto = `Não respondeu a tempo para comprar **${this.name}**:`;
		}
		const uData = this.client.data.users.resolveUser(user.id);

		const embed = {
			color: cor,
			title: texto,
			author: {
				name: user.tag,
				icon_url: user.avatarURL(),
			},
			description: stripIndents`
			Usuário: **${user.tag} (${user.id})**
			Valor: **${this.valor()} ${this.currency}**
			Carteira: ${uData.money} Coins • ${~~uData.gems} Gems`,
			timestamp: Date.now(),
		};
		return embed;
	}

	// Boolean
	hasMoney(user, currency = 'coins') {
		const uData = this.client.data.users.resolveUser(user.id);
		if(!uData) return false;

		const money = uData.wallet[currency] || 0;
		const valor = this.valor(user, currency);

		if(valor > money) return false;
		else return true;
	}

	// Discount/false
	hasDiscounts(user) {
		const vip = this.client.data.VIPs.get(user.id);
		if(vip)
			if(vip.discounts)
				if(vip.discounts[this.type])
					return vip.discounts[this.type];
		return false;
	}

	// defValue, na moeda específicada e no tempo específicado
	defineCurrency(currency = 'coins', tempo = 7) {
		let valor = this.defValue;

		if(currency === 'gems') valor /= 1000;

		if(tempo === 3) valor = Math.ceil(valor / 2);
		if(tempo === 1) valor = Math.ceil(valor / 5);

		return valor;
	}
}