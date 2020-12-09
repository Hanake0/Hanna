import { Command } from '../../CommandoV12/src/index.js';
import { readdirSync } from 'fs';
import { Collection, MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';
import { coin, gem } from '../../Assets/JSON/emojis.js';
const emojis = {
	coins: `<:hcoin:${coin}>`,
	gems: `<:hgem:${gem}>`,
};
const hanake = '<@!380512056413257729>';
// const coin = `<:hcoin:${coin}>`;
// const gem = `<:hgem:${gem}>`;

export default class LojaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'loja',
			aliases: ['comprar', 'buy'],
			group: 'p&i',
			memberName: 'loja',
			description: 'Abre a loja',
			throttling: {
				usages: 2,
				duration: 10,
			},
		});

		this.itens = {
			misc: {
				nome: 'Miscelânea',
				desc: 'Itens Variados',
				emoji: '782746733096599582',
			},
			colors: {
				nome: 'Cores',
				desc: 'Cores para seu nick',
				emoji: '782746962557403176',
			},
			VIPs: {
				nome: 'VIPs',
				desc: 'Cargos com várias vantagens',
				emoji: '782747106146385960',
			},
		},

		client.once('ready', async () => {
			const cArray = readdirSync('./src/Loja/Items');

			cArray.forEach(cName =>
				readdirSync(`./src/Loja/Items/${cName}`).forEach(async iName => {
					const { default: itemConstructor } = await import(`../../src/Loja/Items/${cName}/${iName}`);
					const item = new itemConstructor(client);

					// eslint-disable-next-line no-inline-comments
					this.itens[cName][iName] = item; // .split('.')[0]
				}));
		});
	}

	async run(msg) {
		const sentMsg = await this.sendCategories(msg, msg.author);
		this.handleCategories(sentMsg, msg.author);
	}

	// sentMsg
	async sendCategories(msg, user) {
		const embed = new MessageEmbed()
			.setAuthor(`Bem Vindo a loja ${user.username}`)
			.setFooter('Esperando reações', 'https://garticbot.gg/images/icons/time.png')
			.setImage('https://cdn.discordapp.com/attachments/750026820878991461/754553827524476938/dividelinewaifusstore2.png')
			.setTimestamp()
			.setFooter(this.wallet(user), 'https://twemoji.maxcdn.com/2/72x72/1f4b0.png');

		// Define os Fields com as categorias
		for(const category in this.itens)
			embed.addField(`<:${category}:${this.itens[category].emoji}> ${this.itens[category].nome}`, this.itens[category].desc, true);

		// Envia uma mensagem nova ou edita
		let sentMsg;
		if(msg.author.id === this.client.user.id) {
			await msg.reactions.removeAll();
			sentMsg = await msg.edit(embed);
		} else sentMsg = await msg.inlineReply({ embed: embed });

		return sentMsg;
	}

	// handleItens()/end()
	async handleCategories(msg, user) {

		const promises = [];

		// Inicia o listener de reações
		promises.push(this.awaitReaction(msg, user, Object.values(this.itens)));

		// Configura a ordem de reações
		promises.push(this.react(Object.values(this.itens), msg));

		// Espera as reações
		const [reaction] = await Promise.all(promises);

		// Transfere para handleItens()
		if(reaction) {
			const nome = reaction._emoji.name;
			if(['misc', 'colors', 'VIPs'].includes(nome))
				await this.handleItens(msg, reaction._emoji.name, user);

		// Desativa a loja
		} else this.end(msg);
	}

	// Undefined
	async react(itens, msg) {
		for(const item of itens)
			await msg.react(item.emoji);
	}

	// handleItem()/handleCategories()
	async handleItens(msg, cat, user, index = 0) {
		// Separa os itens válidos numa coleção
		const validItens = new Collection();
		for(const item in this.itens[cat])
			if(!['nome', 'desc', 'emoji'].includes(item))
				validItens.set(item, this.itens[cat][item]);

		// Separa 3 itens após o index específicado
		let itens = this.getItens(validItens, index);

		// Edita o embed
		const sentMsg = await this.sendItens(msg, itens, cat, index, validItens.size, user);

		const promises = [];

		// Adiciona os emojis de navegação
		itens = [{ emoji: '⤴️' }, ...itens];
		if(index > 0) itens = [{ emoji: '◀️' }, ...itens];
		if(validItens.size > (index + 3)) itens = [...itens, { emoji: '▶️' }];

		// Inicia o listener de reações
		promises.push(this.awaitReaction(sentMsg, user, itens));

		// Reage com o emoji de cada item
		promises.push(this.react(itens, sentMsg));

		// Espera as reações
		const [reaction] = await Promise.all(promises);

		if(reaction) {
			const nome = reaction._emoji.name;
			const item = validItens.find(
				({ emoji }) => (emoji === reaction._emoji.id || emoji === nome));

			// Caso tenha escolhido algum item
			if(item)
				await this.handleItem(msg, item, user, validItens);

			// Caso for mudar a lista
			else if(nome === '▶️') await this.handleItens(sentMsg, cat, user, (index + 3));
			else if(nome === '◀️') await this.handleItens(sentMsg, cat, user, (index - 3));

			// Caso voltar
			else {
				await this.sendCategories(msg, user);
				await this.handleCategories(msg, user);
			}

		// Desativa a loja
		} else this.end(sentMsg);
	}

	// Array // Separa um grupo de 3 itens a partir do index
	getItens(collection, index = 0) {
		const itens = [];
		for(let i = index; (index <= i && i < (index + 3)); i++) {
			const item = collection.find(({ position }) => position === i);
			if(item) itens.push(item);
		}
		return itens;
	}

	// SentMsg
	async sendItens(msg, itens, cat, index, size, user) {
		const max = Math.ceil(size / 3);
		const now = Math.floor(index / 3) + 1;

		const embed = new MessageEmbed()
			.setAuthor(`${this.itens[cat].nome} ${ max === 3 ? '                                            ' : '                        '} (${now}/${max})`, `https://cdn.discordapp.com/emojis/${this.itens[cat].emoji}.png`)
			.setFooter('Esperando reações', 'https://garticbot.gg/images/icons/time.png')
			.setTimestamp()
			.setFooter(this.wallet(user), 'https://twemoji.maxcdn.com/2/72x72/1f4b0.png');

		if(itens[0]) embed.setColor(itens[0].color);

		// Define os Fields com os itens
		for(const item of itens) {
			embed.addField(stripIndents`
				${item.canBuy(user) === true ? '' : '~~'}${item.emoji}${item.nome}${item.canBuy(user) === true ? '' : '~~'}    
			`, stripIndents`
				\*\*${item.temporary ? 'Temporário' : 'Permanente'}\*\*
				7 dias:
				${emojis.coins} ${item.valorString(user, 'coins', 7)}
				${emojis.gems} ${item.valorString(user, 'gems', 7)}
			`, true);
		}

		// Envia uma mensagem nova ou edita
		let sentMsg;
		if(msg.author.id === this.client.user.id) {
			await msg.reactions.removeAll();
			sentMsg = await msg.edit(embed);
		} else sentMsg = await msg.inlineReply({ embed: embed });

		return sentMsg;
	}

	async handleItem(msg, item, user, validItens) {

		const sentMsg = await this.sendItem(msg, item, validItens.size, user);
		const canBuy = item.canBuy(user);


		// Configura os emojis
		let itens = [];
		/*
		for(const emoji of item.emojis)
		 itens.push({emoji: emoji});
		*/

		// Adiciona os emojis de navegação
		if(item.temporary) {
			if(canBuy)
				itens = [{ emoji: '1️⃣' }, { emoji: '3️⃣' }, { emoji: '7️⃣' }, ...itens];
		} else if(canBuy) itens = [{ emoji: '782771102102847528' }, ...itens];

		itens = [{ emoji: '⤴️' }, ...itens];

		if(item.position > 0) itens = [{ emoji: '◀️' }, ...itens];
		if(validItens.find(({ position }) => position === item.position + 1))
			itens = [...itens, { emoji: '▶️' }];

		const promises = [];

		// Inicia o listener de reações
		promises.push(this.awaitReaction(sentMsg, user, itens));

		// Reage com o emoji de cada item
		promises.push(this.react(itens, sentMsg));

		// Espera as reações
		const [reaction] = await Promise.all(promises);

		if(reaction) {
			const nome = reaction._emoji.name;

			// Caso tenha escolhido iniciar a compra
			if(nome === 'iniciar_compra')
				await this.confirm(msg, item, user);

			else if(nome === '1️⃣') await this.confirm(msg, item, user, 1);
			else if(nome === '3️⃣') await this.confirm(msg, item, user, 3);
			else if(nome === '7️⃣') await this.confirm(msg, item, user, 7);

			// Caso for mudar a lista
			else if(nome === '▶️') await this.handleItem(msg, validItens.find(({ position }) => position === item.position + 1), user, validItens);
			else if(nome === '◀️') await this.handleItem(msg, validItens.find(({ position }) => position === item.position - 1), user, validItens);

			// Caso voltar
			else {
				await this.handleItens(msg, item.type, user, item.position > 2 ? Math.floor(item.position / 3) * 3 : 0);
			}

		// Desativa a loja
		} else this.end(sentMsg);
	}

	// SentMsg
	async sendItem(msg, item, size, user) {
		const max = size;
		const now = item.position + 1;

		const embed = new MessageEmbed()
			.setColor(item.color)
			.setAuthor(`${item.nome} ${ item.temporary ? '                                            ' : '                        '} (${now}/${max})`, item.icon)
			.addField('Descrição', item.description)
			.setFooter(this.wallet(user), 'https://twemoji.maxcdn.com/2/72x72/1f4b0.png')
			.setTimestamp();

		if(item.temporary) {
			embed.addField('1 dia     ', `${emojis.coins} ${item.valorString(user, 'coins', 1)}\n${emojis.gems} ${item.valorString(user, 'gems', 1)}`, true);
			embed.addField('3 dias    ', `${emojis.coins} ${item.valorString(user, 'coins', 3)}\n${emojis.gems} ${item.valorString(user, 'gems', 3)}`, true);
			embed.addField('7 dias    ', `${emojis.coins} ${item.valorString(user, 'coins', 7)}\n${emojis.gems} ${item.valorString(user, 'gems', 7)}`, true);
		} else embed.addField('﹃ Valor ﹄', `${emojis.coins} ${item.valorString(user, 'coins')}\n${emojis.gems} ${item.valorString(user, 'gems')}`);

		// Envia uma mensagem nova ou edita
		let sentMsg;
		if(msg.author.id === this.client.user.id) {
			await msg.reactions.removeAll();
			sentMsg = await msg.edit(embed);
		} else sentMsg = await msg.inlineReply({ embed: embed });

		return sentMsg;
	}

	async confirm(msg, item, user, tempo = 7) {
		const uDB = this.client.data.users.resolveUser(user);

		if(uDB.wallet.gems < item.valor(user, 'gems', tempo)
			&& uDB.wallet.coins < item.valor(user, 'coins', tempo))
			return await this.reject(msg, user, item, tempo);

		const sentMsg = await this.sendConfirm(msg, item, user, tempo);

		// Configura os emojis
		let itens = [];

		if(uDB.wallet.gems >= item.valor(user, 'gems', tempo))
			itens = [{ emoji: gem }, ...itens];
		if(uDB.wallet.coins >= item.valor(user, 'coins', tempo))
			itens = [{ emoji: coin }, ...itens];

		itens = [{ emoji: '⤴️' }, ...itens];

		const promises = [];

		// Inicia o listener de reações
		promises.push(this.awaitReaction(sentMsg, user, itens));

		// Reage com os emojis
		promises.push(this.react(itens, sentMsg));

		// Espera as reações
		const [reaction] = await Promise.all(promises);

		if(reaction) {
			const nome = reaction._emoji.name;

			// Caso tenha escolhido iniciar a compra
			if(nome === 'hcoin' || nome === 'hgem')
				await item.buy(user, tempo)
					.then(async () => await this.success(msg, user, item, `${nome.slice(1)}s`, tempo),
						async (err) => await this.error(msg, user, item, err, tempo));

			// Caso voltar
			else if(nome === '⤴️') {
				await this.handleItens(msg, item.type, user, item.position > 2 ? Math.floor(item.position / 3) * 3 : 0);
			}

		// Desativa a loja
		} else this.end(sentMsg);
	}

	async sendConfirm(msg, item, user, tempo = 7) {
	//	const uDB = this.client.data.users.resolveUser(user);

		const embed = new MessageEmbed()
			.setColor('#FFFD84')
			.setAuthor('Tem certeza que deseja comprar ?', 'https://garticbot.gg/images/icons/alert.png')
			.setDescription(stripIndents`
			\*\*Nome:\*\* ${item.nome}${item.temporary ? `\n**Validade:** ${tempo} dia${tempo > 1 ? 's' : ''}` : ''}
			\*\*Valor${item.temporary ? `(${tempo} dia${tempo > 1 ? 's' : ''})` : ''}:\*\* ${emojis.coins} ${item.valorString(user, 'coins', tempo)}  ${emojis.gems} ${item.valorString(user, 'gems', tempo)}
				`)
			.setFooter(this.wallet(user), 'https://twemoji.maxcdn.com/2/72x72/1f4b0.png')
			.setTimestamp();

		// Envia uma mensagem nova ou edita
		let sentMsg;
		if(msg.author.id === this.client.user.id) {
			await msg.reactions.removeAll();
			sentMsg = await msg.edit(embed);
		} else sentMsg = await msg.inlineReply({ embed: embed });

		return sentMsg;
	}

	// Reaction/false
	async awaitReaction(msg, u, itens) {
		const emojiIDs = [];

		for(const i of itens)
			if(i.emoji) emojiIDs.push(i.emoji);

		const filtro = (reaction, user) => {
			return ((emojiIDs.includes(reaction._emoji.id) || emojiIDs.includes(reaction._emoji.name))
				&& user.id === u.id);
		};

		const reactions = await msg.awaitReactions(filtro, { max: 1, time: 60000 });
		const reaction = reactions.first();

		if(reaction) return reaction;
		else return false;
	}

	async success(msg, user, item, currency, tempo = 7) {
		const uDB = this.client.data.users.resolveUser(user);
		uDB.wallet[currency] -= item.valor(user, currency, tempo);

		const valorG = item.valorString(user, 'gems', tempo);
		const valorC = item.valorString(user, 'coins', tempo);

		const embed = new MessageEmbed()
			.setColor('#91FF84')
			.setAuthor('Concluído', 'https://garticbot.gg/images/icons/hit.png')
			.setThumbnail(item.icon)
			.setDescription(stripIndents`
				O item ${item.nome}${item.temporary ? `(${tempo} dia${tempo > 1 ? 's' : ''})` : ''},\n foi comprado com sucesso !

				\*\*Item:\*\* ${item.nome} ${item.temporary ? `(${tempo} dia${tempo > 1 ? 's' : ''})` : ''}
				\*\*Valor:\*\* ${emojis.coins} ${valorC} • ${emojis.gems} ${valorG}
			`)
			.setTimestamp()
			.setFooter(this.wallet(user), 'https://twemoji.maxcdn.com/2/72x72/1f4b0.png');

		// Envia uma mensagem nova ou edita
		let sentMsg;
		if(msg.author.id === this.client.user.id) {
			await msg.reactions.removeAll();
			sentMsg = await msg.edit(embed);
		} else sentMsg = await msg.inlineReply({ embed: embed });

		const promises = [];

		// Inicia o listener de reações
		promises.push(this.awaitReaction(sentMsg, user, [{ emoji: '⤴️' }]));

		// Reage com os emojis
		promises.push(this.react([{ emoji: '⤴️' }], sentMsg));

		// Espera as reações
		const [reaction] = await Promise.all(promises);

		if(reaction) {
			const nome = reaction._emoji.name;

			// Caso voltar
			if(nome === '⤴️') {
				await this.handleItens(msg, item.type, user, item.position > 2 ? Math.floor(item.position / 3) * 3 : 0);
			}

		// Desativa a loja
		} else this.end(sentMsg);
	}

	// => handleItens() / => end()
	async reject(msg, user, item, tempo = 7) {
		const uDB = this.client.data.users.resolveUser(user);
		const valorG = item.valorString(user, 'gems', tempo);
		const valorC = item.valorString(user, 'coins', tempo);

		const embed = new MessageEmbed()
			.setColor('#FF8484')
			.setAuthor('Cancelado', 'https://garticbot.gg/images/icons/error.png')
			.setThumbnail(item.icon)
			.setDescription(stripIndents`
				Infelizmente você não tem coins,\nnem gems suficientes para\ncomprar ${item.nome}${item.temporary ? ` por ${tempo} dia${tempo > 1 ? 's' : ''}` : ''}

				\*\*Item:\*\* ${item.nome} ${item.temporary ? `(${tempo} dia${tempo > 1 ? 's' : ''})` : ''}
				\*\*Valor:\*\* ${emojis.coins} ${valorC} • ${emojis.gems} ${valorG}
				\*\*Faltam:\*\* ${emojis.coins} ${item.valor(user, 'coins', tempo) - uDB.wallet.coins} • ou • ${emojis.gems} ${item.valor(user, 'gems', tempo) - uDB.wallet.gems}
			`)
			.setTimestamp()
			.setFooter(this.wallet(user), 'https://twemoji.maxcdn.com/2/72x72/1f4b0.png');

		// Envia uma mensagem nova ou edita
		let sentMsg;
		if(msg.author.id === this.client.user.id) {
			await msg.reactions.removeAll();
			sentMsg = await msg.edit(embed);
		} else sentMsg = await msg.inlineReply({ embed: embed });

		const promises = [];

		// Inicia o listener de reações
		promises.push(this.awaitReaction(sentMsg, user, [{ emoji: '⤴️' }]));

		// Reage com os emojis
		promises.push(this.react([{ emoji: '⤴️' }], sentMsg));

		// Espera as reações
		const [reaction] = await Promise.all(promises);

		if(reaction) {
			const nome = reaction._emoji.name;

			// Caso voltar
			if(nome === '⤴️') {
				await this.handleItens(msg, item.type, user, item.position > 2 ? Math.floor(item.position / 3) * 3 : 0);
			}

		// Desativa a loja
		} else this.end(sentMsg);
	}

	async error(msg, user, item, err, tempo) {
		const embed = new MessageEmbed()
			.setColor('#FF8484')
			.setAuthor('Cancelado', 'https://garticbot.gg/images/icons/error.png')
			.setThumbnail(item.icon)
			.setDescription(stripIndents`
				Algo deu errado durante a compra desse item.

				\*\*Item:\*\* ${item.nome} ${item.temporary ? `(${tempo} dia${tempo > 1 ? 's' : ''})` : ''}
				\*\*Erro:\*\* ${err.name}: \`${err.message}\`
				${err.fileName ? `     Arquivo: ${err.fileName}` : ''}
				${err.lineNumber ? `     Linha: ${err.lineNumber}` : ''}
			`)
			.setTimestamp()
			.setFooter(this.wallet(user), 'https://twemoji.maxcdn.com/2/72x72/1f4b0.png');

		// Envia uma mensagem nova ou edita
		if(msg.author.id === this.client.user.id) {
			await msg.reactions.removeAll();
			await msg.edit(`${hanake}`, { embed: embed });
		} else await msg.inlineReply(`${hanake}`, { embed: embed });
	}

	end(msg) {
		msg.reactions.removeAll();
		const embed = msg.embeds[0];
		embed
			.setFooter('Tempo esgotado', 'https://garticbot.gg/images/icons/time.png')
			.setTimestamp();
		msg.edit(embed);
	}

	wallet(user) {
		const uDB = this.client.data.users.resolveUser(user);
		return `Carteira: 💵 ${uDB.wallet.coins} • 💎 ${uDB.wallet.gems}`;
	}

}
