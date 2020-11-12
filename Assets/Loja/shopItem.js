const emojis = require('../JSON/emojis.json');

module.exports = class ShopItem {
  constructor(client, infos) {

    Object.defineProperty(this, 'client', { value: client });

    this.nome = infos.nome;

    this.valor = infos.valor;

    this.currency = 'coins';

    this.desc = infos.description;

    this.channel = client.channels.cache.get(infos.channel);

    this.message = { id: infos.message };
  };

  async run(client, user) {
    throw new Error(`${this.nome} não tem método de compra!`);
  }

  logEmbed(resultado, user) {
		let cor, texto;
		if(resultado === true) {
			cor = emojis.successC;
			texto = `Comprou \*\*${this.name}\*\*:`
		} else if(resultado === false) {
			cor = emojis.failC;
			texto = `Tentou comprar \*\*${this.name}\*\* mas a compra foi cancelada:`
		} else {
			cor = emojis.warningC;
			texto = `Não respondeu a tempo para comprar \*\*${this.name}\*\*:`
		}
		const uData = this.client.usersData.get(user.id);

		const embed = {
			color: cor,
			title: texto,
			author: {
				name: user.tag,
				icon_url: user.avatarURL()
			},
			description: stripIndents`
			Usuário: **${user.tag} (${user.id})**
			Valor: **${this.valor} ${this.currency}**
			Carteira: ${uData.money} Coins • ${uData.gems ? uData.gems : 0} Gems`,
			timestamp: Date.now()
		};
		return embed;
  }

  hasMoney(user, currency = 'coins') {
    const uData = this.client.usersData.get(user.id);
    if(!uData) return false;

    const money = uData[currency] ? uData[currency] : 0;
    const valor = currency === 'coins' ? this.valor : this.valor/1000;

    if(valor > money) return false;
    else return true;
  }

  hasVip(user) {
    const uData = this.client.usersData.get(user.id);
    if(!uData) return false;

    if(!uData.vipUntil) return false;
    if(uData.vipUntil > Date.now()) return true;
    else return false;
  }

  changeCurrency(emojiID) {
    if(emojiID === emojis.gem && this.currency !== 'gems') {
      console.log('111');
      this.valor /= 1000;
      this.currency = 'gems';
      return this.currency;

    } if(emojiID === emojis.coin && this.currency !== 'coins') {
      console.log('222');
      this.valor *= 1000;
      this.currency = 'coins';
      return this.currency;
    }
  }

}