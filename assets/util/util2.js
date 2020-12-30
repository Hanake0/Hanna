import emojis from '../JSON/emojis.js';
import { stripIndents } from 'common-tags';
import { verify } from './util.js';

export const status = {
	online: 'Disponível/Online',
	idle: 'Ausente',
	dnd: 'Não perturbe/Indisponível',
	offline: 'Offline/Invisível'
};

export const activities = {
	PLAYING: 'Jogando',
	WATCHING: 'Assistindo',
	LISTENING: 'Ouvindo',
	STREAMING: 'Transmitindo',
	CUSTOM_STATUS: 'Status customizado'
};

export const mesesN = {
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

export const mesesJS = {
	0: 'Janeiro',
	1: 'Fevereiro',
	2: 'Março',
	3: 'Abril',
	4: 'Maio',
	5: 'Junho',
	6: 'Julho',
	7: 'Agosto',
	8: 'Setembro',
	9: 'Outubro',
	10: 'Novembro',
	11: 'Dezembro'
};

export const nao = ['sim', 'yes', 'y', 's', 'ye', 'yeah', 'yup', 'yea', 'ya', 'hai', 'si', 'sí', 'oui', 'はい', 'correto', 'continuar', 'siis', 'simsim', 'sim sim'];

export const sim = ['não', 'nao', 'no', 'n', 'nah', 'nope', 'nop', 'iie', 'いいえ', 'non', 'nom', 'se foder'];


export default class Util {
	static async comprar(nome, valor, canal, user, moeda, client) {
		const uDB = client.usersData.get(user.id);
		const mg = moeda === 'gems' ? 'gems' : 'money';
		if(uDB[mg] >= valor) {
			canal.send(`${user}`, {embed: { color: emojis.warningC, description: `${emojis.warning} | Tem certeza que deseja comprar **${nome}** por ${valor} ${moeda} ?` }})
		} else {
			canal.send(`${user}`, {embed: { color: emojis.failC, description: `${emojis.fail} | **${nome}**: Você não tem ${moeda} o suficiente(faltam ${uDB[mg] !== undefined ? valor - uDB[mg] : valor} ${moeda})` }})
			return false
		}
		const sn = await verify(canal, user);
		if(uDB[mg] >= valor) {
			if(sn === true ) {
				uDB[mg] -= valor;
				canal.send(`${user}`, {embed: { color: emojis.successC, description: `${emojis.success} | Compra concluída com sucesso.` }});
				return true
			} else if(sn === false ) {
				canal.send(`${user}`, {embed: { color: emojis.failC, description: `${emojis.fail} | Compra cancelada.` }});
				return false
			} else {
				canal.send(`${user}`, {embed: { color: emojis.warningC, description: `${emojis.warning} | Tempo esgotado.` }});
				return 0;
			}
		} else{
			canal.send(`${user}`, {embed: { color: emojis.failC, description: `${emojis.fail} | **${nome}**: Você não tem ${moeda} o suficiente(faltam ${uDB[mg] !== undefined ? valor - uDB[mg] : valor} ${moeda})` }})
			return false
		}
	}

	static shopEmbed(açãoNum, item, valor, moeda, user, uDB) {
		const money = uDB.money;
		const gems = uDB.gems;
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

	static async question(canal, user, pergunta, sucesso, falha, falhaT, tentativas = 3, timeout = 30000, filtro) {
		let tent = 0;
		let verify = [];
		while(tent < tentativas) {
			canal.send(`${user}`, {embed: {color: emojis.warningC, description: stripIndents`${emojis.warning} | ${pergunta}`} });
			verify = await canal.awaitMessages(filtro, {
				max: 1,
				time: timeout
			});
			tent ++;
			if (!verify.size && tentativas > 1) {
				await canal.send(`${user}`, {embed: {color: emojis.failC, description: stripIndents`${emojis.fail} | ${falha}`}});
			} else break;
		}
		if(tent >= tentativas) {
			await canal.send(`${user}`, {embed: {color: emojis.failC, description: stripIndents`${emojis.fail} | ${falhaT}`}});
			return false;
		} else {
			await canal.send(`${user}`, {embed: {color: emojis.successC, description: stripIndents`${emojis.success} | ${sucesso}`}});
			return verify.first();
		}
	}
}

const {
	comprar, shopEmbed, question
} = Util;

export {
	comprar, shopEmbed, question
}