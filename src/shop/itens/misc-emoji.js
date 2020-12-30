import ShopItem from '../base.js';
import emojis from '../../../Assets/JSON/emojis.js';

export default class EmojiLoja extends ShopItem {
	constructor(client) {
		super(client, {
			nome: 'Emoji Customizado',
			icon: 'https://twemoji.maxcdn.com/2/72x72/1f921.png',
			color: '#4289C1',
			defValue: 10000,
			category: 'misc',
			type: 'misc',
			position: 0,
			description: 'Vale um slot de emoji customizado no WC\npelo tempo escolhido.\n\nSó pode ser comprado com vip lvl 2 ou mais',
			temporary: true,
			emoji: '🤡',
			emojis: ['782745531352743936', '782771102102847528'],
		});
	}

	async buy(user, currency, tempo) {
		this.changeCurrency(reaction.emoji.id);

		console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
		/*
		nome = false;
		let img = false;

		// Define as perguntas para o nome do emoji
		pergunta = 'Escolha um nome para o emoji(pelomenos 2 caracteres):\n\nEu só vou responder quando você mandar um nome válido ou demorar demais...';
		sucesso = `Nome selecionado com sucesso\!`;
		falha = `Você não enviou um nome válido a tempo, tente denovo:\n\nEu só vou responder quando você mandar um nome válido ou demorar demais...\n\n • __O nome dos emojis tem que ter pelomenos 2 caracteres__\n • __O nome dos emojis só pode conter caracteres alfanuméricos e underlines__`;
		falhaT = `Suas tentativas acabaram, suas ${valor} ${gc} foram devolvidas`;
		filtro = res => {
			const value = res.content.toLowerCase();
			return (user ? res.author.id === user.id : true) &&
			(value.length >= 2) && (value.match(/^[0-9a-zA-Z]*_*$/));
		};

		// Pergunta o nome do emoji
		nomeM = await question(confirmação, user, pergunta, sucesso, falha, falhaT, 3, 30000, filtro);
		if(nomeM) nome = nomeM.content;
		else return shopLog.send({ embed : shopEmbed(false, outro.nome, valor, gc, user, uDB) }).then(() => uDB[gm] += valor);

		// Define as perguntas para o emoji
		pergunta = 'Agora, envie uma imagem para ser usada como emoji (128x128):\n\nEu só vou responder quando você mandar uma imagem com um tamanho válido ou demorar demais...';
		sucesso = `Imagem selecionada com sucesso\!`;
		falha = `Você não enviou uma imagem válida a tempo, tente denovo:\n\nEu só vou responder quando você mandar uma imagem com um tamanho válido ou demorar demais...\n\n • __As imagens válidas tem que ter menos que 256kb e no máximo 128px x 128px__`;
		falhaT = `Suas tentativas acabaram, suas ${valor} ${gc} foram devolvidas`;
		filtro = async res => {
			if(!res.attachments.first()) return false;
			const img = res.attachments.first().url;
			const probe = require('probe-image-size');
			const dados = await probe(img);
			return (user ? res.author.id === user.id : true) &&
			(dados.width <= 128) && (dados.height <= 128);
		}

		// pergunta a imagem
		const imgM = await question(confirmação, user, pergunta, sucesso, falha, falhaT, 3, 450000, filtro);
		if(imgM) img = imgM.attachments.first().url;
		else return shopLog.send({ embed : shopEmbed(false, outro.nome, valor, gc, user, uDB) }).then(() => uDB[gm] += valor);

		// Criando emoji
		try {
			const emoji = await Wclub.emojis.create(img, nome, {reason: `Emoji comprado por ${user.tag}`});
			confirmação.send(`${user}`, {embed: {color: emojis.successC, description: stripIndents`${emojis.success} | ${emoji} criado com sucesso!`}});
			shopLog.send({ embed : shopEmbed(compra, outro.nome, valor, gc, user, uDB) });

		// Caso algo dê errado
		} catch(err) {
			console.log(err);
			uDB[gm] += valor;
			shopLog.send({ embed : shopEmbed(false, outro.nome, valor, gc, user, uDB) });
			confirmação.send(`${user}`, {embed: {color: emojis.failC, description: stripIndents`${emojis.fail} | Algo deu errado tentando criar sua tag, suas ${valor} ${gc} foram devolvidas`}})
		}

		Wstore.channels.cache.get('750031689132277901').send(stripIndents`
		<@&750084283481325671> ${user} comprou o **EMOJI** :${nome}:, olhem aí...
		`)

		*/
	}

	canBuy(user) {
		const vip = this.client.data.VIPs.isVIP(user);
		if(vip >= 2) return true;
		else return false;
	}

}