const emojis = require('../JSON/emojis.json');
const { stripIndents } = require('common-tags');
const status = {
	online: 'Disponível/Online',
	idle: 'Ausente',
	dnd: 'Não perturbe/Indisponível',
	offline: 'Offline/Invisível'
};

const activities = {
	PLAYING: 'Jogando',
	WATCHING: 'Assistindo',
	LISTENING: 'Ouvindo',
	STREAMING: 'Transmitindo',
	CUSTOM_STATUS: 'Status customizado'
};

const mesesN = {
	1: 'Janeiro',
	2: 'Fevereiro',
	3: 'Março',
	4: 'Abril',
	5: 'Maio',
	6: 'Junho',
	7: 'Julho',
	8: 'Agosto',
	9: 'Setembro',
	10: 'Outubro',
	11: 'Novembro',
	12: 'Dezembro'
};

const nao = ['sim', 'yes', 'y', 's', 'ye', 'yeah', 'yup', 'yea', 'ya', 'hai', 'si', 'sí', 'oui', 'はい', 'correto', 'continuar', 'siis', 'simsim', 'sim sim'];

const sim = ['não', 'nao', 'no', 'n', 'nah', 'nope', 'nop', 'iie', 'いいえ', 'non', 'nom', 'se foder'];

module.exports.status = status;
module.exports.activities = activities;
module.exports.mesesN = mesesN;
module.exports.sim = sim;
module.exports.nao = nao;

module.exports = class Util {
	static async comprar(nome, valor, canal, user, moeda, uDB) {
		const { verify } = require('./util.js');
		const mg = moeda === 'gems' ? 'gems' : 'money';
		if(uDB[mg] > valor) {
			canal.send(`${user}`, {embed: { color: emojis.warningC, description: `${emojis.warning} | Tem certeza que deseja comprar **${nome}** por ${valor} ${moeda} ?` }})
		} else {
			canal.send(`${user}`, {embed: { color: emojis.failC, description: `${emojis.fail} | **${nome}**: Você não tem ${moeda} o suficiente(faltam ${uDB[mg] !== undefined ? valor - uDB[mg] : valor} ${moeda})` }})
			return false
		}
		const sn = await verify(canal, user);
		if(sn === true ) {
			canal.send(`${user}`, {embed: { color: emojis.successC, description: `${emojis.success} | Compra concluída com sucesso.` }});
			return true
		} else if(sn === false ) {
			canal.send(`${user}`, {embed: { color: emojis.failC, description: `${emojis.fail} | Compra cancelada.` }});
			return false
		} else {
			canal.send(`${user}`, {embed: { color: emojis.warningC, description: `${emojis.warning} | Tempo esgotado.` }});
			return 0;
		}
	}

	static shopEmbed(açãoNum, item, valor, moeda, user, uDB) {
		const money = moeda === 'gems' ? uDB.money : uDB.money - valor;
		const gems = moeda === 'gems' ? uDB.gems - valor : uDB.gems;
		const ação = açãoNum  === true ? 'Comprou' : açãoNum === 0 ? 'Recebeu timeout/Já possui o item' : 'Não conseguiu comprar';
		const cor = açãoNum === true ? emojis.successC : açãoNum === 0 ? emojis.warningC : emojis.failC;
		const embed = {
			color: cor,
			title: `${ação} ${item}`,
			author: {
				name: user.tag,
				icon_url: user.avatarURL()
			},
			description: stripIndents`
			Usuário: **${user.tag} (${user.id})**
			Valor: **${valor} ${moeda}**
			Carteira: ${money} Coins • ${gems} Gems`,
			timestamp: Date.now(),
			footer: {
				text: `${ação} em `
			}};
		return embed;
	}
}