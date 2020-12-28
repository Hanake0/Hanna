import { Command } from '../../CommandoV12/src/index.js';
import Canvas from 'canvas';
import { MessageAttachment, MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class BatalhaNavalCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'batalha-naval',
			aliases: ['batalha-no-mar'],
			group: 'multiplayer',
			memberName: 'batalha-naval',
			clientPermissions: ['ADMINISTRATOR'],
			description: 'Inicia um jogo de batalha naval com mais algum participante',
			throttling: {
				usages: 1,
				duration: 10,
			},
			args: [
				{
					key: 'usuário',
					prompt: 'Deseja jogar batalha-naval com quem?',
					type: 'user',
					bot: false,
				},
			],
		});
	}

	async run(msg, { usuário }) {
		// const participante = await this.ask(usuário, `${msg.author} te convidou para uma partida de batalha naval, deseja participar?`);

		const canvas = Canvas.createCanvas(600, 600);
		const ctx = canvas.getContext('2d');

		// Select the color of the stroke
		ctx.strokeStyle = '#202225';
		// Draw a rectangle with the dimensions of the entire canvas
		// ctx.strokeRect(0, 0, canvas.width, canvas.height);

		ctx.lineWidth = 5;
		// ctx.strokeRect(2.5, 2.5, 500, 500);


		const letras = { 0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J' };
		for(let linha = 0; linha <= 10; linha++) {
			// Desenha as linhas verticais
			ctx.beginPath();
			ctx.moveTo(2.5, linha * 50 || 2.5);
			ctx.lineTo(550, linha * 50 || 2.5);
			ctx.stroke();

			// Coloca as letras e números para localização
			if(linha < 10) {
				ctx.font = '50px sans-serif';
				ctx.fillStyle = '#ffffff';
				ctx.fillText(linha, linha * 50 + 12.5, 545);
				ctx.font = '45px sans-serif';
				ctx.fillText(letras[linha], 515, linha * 50 + 45);
			}

			// Desenha as linhas horizontais
			ctx.beginPath();
			ctx.moveTo(linha * 50 || 2.5, 2.5);
			ctx.lineTo(linha * 50 || 2.5, 550);
			ctx.stroke();
		}

		const attachment = new MessageAttachment(canvas.toBuffer(), 'canvas.png');
		const embed = new MessageEmbed()
			.setAuthor('Batalha Naval', 'https://twemoji.maxcdn.com/2/72x72/2693.png')
			.attachFiles(attachment)
			.setImage('attachment://canvas.png');
		msg.inlineReply(embed);
	}

	async ask(user, quote) {
		const msg = await user.send({ embed: {
			author: { name: 'Batalha Naval', icon_url: 'https://twemoji.maxcdn.com/2/72x72/2693.png' },
			description: quote,
			footer: { text: 'Reaja ou responda com sim ou não', icon_url: 'https://garticbot.gg/images/icons/time.png' },
		} }).catch((err) => { return err; });
		msg.react('🟢').then(msg.react('🔴'));

		const promises = [];
		const filtroR = (reaction, usr) => { return (usr.id === user.id && (['🟢', '🔴'].includes(reaction._emoji.name))); };
		const filtroM = message => { return (['sim', 's', 'nao', 'não', 'n'].includes(message.content.toLowerCase())); };

		promises.push(msg.awaitReactions(filtroR, { max: 1, time: 60000 }));
		promises.push(msg.channel.awaitMessages(filtroM, { max: 1, time: 60000 }));

		const coll = await Promise.race(promises);
		const msgOrReaction = coll.first();

		if(msgOrReaction._emoji) {
			if(msgOrReaction._emoji.name === '🟢') return true;
			if(msgOrReaction._emoji.name === '🔴') return false;
		} else if(msgOrReaction.content) {
			if(['sim', 's'].includes(msgOrReaction.content.toLowerCase())) return true;
			if(['nao', 'não', 'n'].includes(msgOrReaction.content.toLowerCase())) return false;
		} else {
			msg.edit({ embed: {
				author: { name: 'Batalha Naval', icon_url: 'https://twemoji.maxcdn.com/2/72x72/2693.png' },
				description: quote,
				footer: { text: 'Tempo esgotado', icon_url: 'https://garticbot.gg/images/icons/time.png' },
			} });
			msg.reactions.removeAll();
			return 0;
		}
	}
}