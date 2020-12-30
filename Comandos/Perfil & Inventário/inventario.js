import { Command } from '../../CommandoV12/src/index.js';
import { readdirSync } from 'fs';
import { MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class InventarioCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'inventário',
			aliases: ['itens', 'inventory'],
			group: 'p&i',
			memberName: 'inventário',
			description: 'Mostra os itens que alguém tem',
			blackListed: ['698678688153206915'],
			throttling: {
				usages: 2,
				duration: 10,
			},
			args: [
				{
					key: 'usuário',
					prompt: 'de quem?',
					type: 'user',
					default: msg => msg.author,
					bot: false,
				},
				{
					key: 'item',
					prompt: 'quer ver que item?',
					type: 'string',
					default: '',
				},
			],
		});
	}

	async run(msg, { usuário, item }) {
		return await this.sendCategories(msg, msg.author).then(() => { return null; });
	}

	// -----------------------------------> base <-----------------------------------
	async importItens() {
		const cArray = readdirSync('./src/shop/itens/');

		cArray.forEach(async iName => {
			const { default: itemConstructor } = await import(`../../src/shop/itens/${iName}`);
			const item = new itemConstructor(this.client);

			this.itens.push(item);
		});
	}

	async sendEmbed(msg, user, data = {}, emojis = [], mention = '') {
		const embed = new MessageEmbed()
			.setColor(data.color)
			.setAuthor(data.author, data.authorURL)
			.setThumbnail(data.thumb)
			.setImage(data.image)
			.setFooter(data.footer || await this.wallet(user), data.footerURL || 'https://twemoji.maxcdn.com/2/72x72/1f4b0.png')
			.setTimestamp();
		if(data.description) embed.setDescription(data.description);

		if(data.fields) for(const field of data.fields)
			embed.addField(field.name, field.value, field.inline);

		// Envia uma mensagem nova ou edita
		let sentMsg;
		if(msg.author.id === this.client.user.id) {
			await msg.reactions.removeAll();
			sentMsg = await msg.edit(mention, { embed: embed });
		} else sentMsg = await msg.inlineReply(mention, { embed: embed });

		if(emojis.length > 0) {
			const promises = [];
			// Inicia o listener de reações
			promises.push(this.awaitReaction(sentMsg, user, emojis));

			// Configura a ordem de reações
			promises.push(this.react(emojis, sentMsg));

			// Espera as reações
			const [reaction] = await Promise.all(promises);

			if(!reaction) {
				this.end(sentMsg);
				return {};
			}	else return { reaction, sentMsg };
		} return {};

	}

	// Espera a reação do usuário
	async awaitReaction(msg, user, emojis) {
		const filtro = (reaction, rUser) => {
			return ((emojis.includes(reaction._emoji.id) || emojis.includes(reaction._emoji.name))
				&& rUser.id === user.id);
		};

		const reactions = await msg.awaitReactions(filtro, { max: 1, time: 60000 });
		const reaction = reactions.first();

		if(reaction) return reaction;
		else return false;
	}

	// Reage na ordem
	async react(emojis, msg) {
		for(const emoji of emojis)
			await msg.react(emoji);
	}
	// -----------------------------------> base <-----------------------------------

	// --------------------------------> Navegação <---------------------------------
	async sendCategories(msg, user) {
		const emojis = ['782746733096599582', '782746962557403176', '782747106146385960'];
		const fields = [
			{ name: 'Miscelânea', value: 'Itens Variados', inline: true },
			{	name: 'Cores', value: 'Cores para seu nick', inline: true },
			{	name: 'VIPs',	value: 'Cargos com várias vantagens', inline: true },
		];

		const { reaction, sentMsg } = await this.sendEmbed(msg, user, {
			color: 'pink',
			author: `Bem Vindo a loja ${user.username}`,
			authorURL: this.client.user.avatarURL(),
			image: 'https://cdn.discordapp.com/attachments/750026820878991461/754553827524476938/dividelinewaifusstore2.png',
			fields: fields,
		}, emojis);

		if(reaction) {
			const name = reaction._emoji.name || reaction._emoji.id;

			if(name === 'misc') return await this.sendItens(sentMsg, user, 'misc');
			if(name === 'colors') return await this.sendItens(sentMsg, user, 'cores');
			if(name === 'VIPs') return await this.sendItens(sentMsg, user, 'vips');
		}
	}

	async sendItens(msg, user, cat, index = 0) {
		const catEmojis = { misc: '782746733096599582', cores: '782746962557403176', vips: '782747106146385960' };
		const catNames = { misc: 'Miscelânea', cores: 'Cores', vips: 'VIPs' };

		const itensCat = this.itens.filter(item => item.category === cat);
		const itensIndex = itensCat.filter(item => (item.position >= index && item.position < (index + 3)));

		const fields = [];
		let emojis = [];
		for(const item of itensIndex) {
			emojis.push(item.emoji);
			fields.push({
				name: item.showName(user, true),
				value: stripIndents`
					\*\*${item.temporary ? 'Temporário' : 'Permanente'}\*\*
					7 dias:
					${emojiss.coins} ${item.valorString(user, 'coins', 7)}
					${emojiss.gems} ${item.valorString(user, 'gems', 7)}`,
				inline: true,
			});
		}

		emojis = ['⤴️', ...emojis];
		if(index > 0) emojis = ['◀️', ...emojis];
		if(itensCat.length > (index + 3)) emojis = [...emojis, '▶️'];

		const max = Math.ceil(itensCat.length / 3);
		const now = Math.floor(index / 3) + 1;
		const { reaction, sentMsg } = await this.sendEmbed(msg, user, {
			color: itensIndex[0] ? itensIndex[0].color : undefined,
			author: `${catNames[cat]} ${ max === 3 ? '                                            ' : '                        '} (${now}/${max})`,
			authorURL: `https://cdn.discordapp.com/emojis/${catEmojis[cat]}.png`,
			fields: fields,
		}, emojis);

		if(reaction) {
			const name = reaction._emoji.name || reaction._emoji.id;
			const item = itensCat.find(
				({ emoji }) => (emoji === reaction._emoji.id || emoji === name));

			if(item) return await this.sendItem(sentMsg, user, item, itensCat);
			else if(name === '▶️') return await this.sendItens(sentMsg, user, cat, (index + 3));
			else if(name === '◀️') return await this.sendItens(sentMsg, user, cat, (index - 3));
			else if(name === '⤴️') return await this.sendCategories(sentMsg, user);
		}
	}

	async sendItem(msg, user, item, itensCat) {
		let emojis = [];
		let fields = [];
		if(item.temporary) {
			if(item.canBuy(user)) emojis = ['1️⃣', '3️⃣', '7️⃣'];
			fields = [
				{ name: '1 dia     ', value: `${emojiss.coins} ${item.valorString(user, 'coins', 1)}\n${emojiss.gems} ${item.valorString(user, 'gems', 1)}`, inline: true },
				{	name: '3 dia     ', value: `${emojiss.coins} ${item.valorString(user, 'coins', 3)}\n${emojiss.gems} ${item.valorString(user, 'gems', 3)}`, inline: true },
				{	name: '7 dia     ',	value: `${emojiss.coins} ${item.valorString(user, 'coins', 7)}\n${emojiss.gems} ${item.valorString(user, 'gems', 7)}`, inline: true },
			];
		} else {
			if(item.canBuy(user)) emojis = ['782771102102847528'];
			fields = [
				{ name: '﹃ Valor ﹄', value: `${emojiss.coins} ${item.valorString(user, 'coins', 1)}\n${emojiss.gems} ${item.valorString(user, 'gems', 1)}`, inline: true },
			];
		}
		emojis = ['⤴️', ...emojis];
		if(item.position > 0) emojis = ['◀️', ...emojis];
		if(itensCat.find(({ position }) => position === item.position + 1)) emojis = [...emojis, '▶️'];

		const { reaction, sentMsg } = await this.sendEmbed(msg, user, {
			color: item.color,
			author: `${item.showName(user)}${item.temporary ? '                                            ' : '                        '} (${item.position + 1}/${itensCat.length})`,
			description: item.description,
			// thumb: item.icon,
			authorURL: item.icon,
			fields: fields,
		}, emojis);

		if(reaction) {
			const name = reaction._emoji.name || reaction._emoji.id;

			if(name === 'iniciar_compra')	return await this.confirm(sentMsg, user, item);
			else if(name === '1️⃣') return await this.confirm(sentMsg, user, item, 1);
			else if(name === '3️⃣') return await this.confirm(sentMsg, user, item, 3);
			else if(name === '7️⃣') return await this.confirm(sentMsg, user, item, 7);

			else if(name === '▶️') return await this.sendItem(sentMsg, user, itensCat.find(({ position }) => position === item.position + 1), itensCat);
			else if(name === '◀️') return await this.sendItem(sentMsg, user, itensCat.find(({ position }) => position === item.position - 1), itensCat);
			else if(name === '⤴️') return await this.sendItens(sentMsg, user, item.category, item.position > 2 ? Math.floor(item.position / 3) * 3 : 0);
		}
	}
	// --------------------------------> Navegação <---------------------------------
}
