const { usersOffDB } = require('../../index.js');

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
	static async comprar(nome, valor, canal, user, moeda) {
		const { verify } = require('./util.js');
		if(usersOffDB.get(user.id).get(moeda === 'gems' ? 'gems' : 'money').value() > valor) {
			canal.send(`${user}`, {embed: { color: '#ffa41c', description: `Tem certeza que deseja comprar **${nome}** por ${valor} ${moeda} ?` }})
		} else {
			canal.send(`${user}`, {embed: { color: '#ff2b1c', description: `<a:cross_gif:738900572664496169> | Você não tem ${moeda} o suficiente(faltam ${usersOffDB.get(user.id).get(moeda === 'gems' ? 'gems' : 'money').value() !== undefined ? valor - usersOffDB.get(user.id).get(moeda === 'gems' ? 'gems' : 'money').value() : valor} ${moeda})` }})
			return false
		}
		const sn = await verify(canal, user);
		if(sn && sn !== 0 ) {
			canal.send(`${user}`, {embed: { color: '#38b833', description: '<a:checkmark_gif:738900367814819940> | Compra concluída com sucesso.' }});
			return true
		} else if(sn !== 0) {
			canal.send(`${user}`, {embed: { color: '#ff2b1c', description: '<a:cross_gif:738900572664496169> | Compra cancelada.' }});
			return false
		} else {
			canal.send(`${user}`, {embed: { color: '#ff2b1c', description: '<a:cross_gif:738900572664496169> | Tempo esgotado.' }});
			return false
		}
	}
}