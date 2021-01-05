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

		this.letras = { 0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J' };
		this.números = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8, J: 9 };
	}

	// ------------------------------------> run <------------------------------------
	async run(msg, { usuário }) {
		const authorCh = await msg.author.createDM();
		const usuárioCh = await usuário.createDM();

		//verifica se nenhum jogo está acontecendo no canal
		const current = this.client.games.get(authorCh.id);
		if (current) return msg.inlineReply(`Por favor espere o fim do jogo de \`${current.name}\`.`);
		const uCurrent = this.client.games.get(usuárioCh.id);
		if (uCurrent) return msg.inlineReply(`Por favor espere o fim do jogo de \`${uCurrent.name}\` de ${usuário}.`);

		// Avisa que está esperando respostas;
		await authorCh.send(`Esperando a resposta de ${usuário}`)
			.catch((err) => { return msg.say(`Suas DMs estão fechadas`); });

		// Pergunta se o usuário quer participar
		const { reaction, sentMsg } = await this.sendEmbed({ channel: usuário, author: usuário }, usuário, {
			author: 'Batalha Naval',
			authorURL: 'https://twemoji.maxcdn.com/2/72x72/2693.png',
			description: `${msg.author} te convidou para uma partida de batalha naval, deseja participar?`,
			footer: 'Reaja para confirmar ou rejeitar',
			footerURL: this.client.user.avatarURL(),
		}, ['🟢', '🔴'])
			.catch((err) => { console.log(err); return msg.say(`DMs de ${usuário} estão fechadas`); });

		if(reaction) {
			const name = reaction._emoji.name || reaction._emoji.id;

			// Marca o canal como em uso
			if(name === '🟢') {
				this.client.games.set(authorCh.id, { name: 'Batalha-naval', chalenger: usuário });
				this.client.games.set(sentMsg.channel.id, { name: 'Batalha-naval', chalenger: msg.author });

			} else if (name === '🔴') return authorCh.send(`Partida com ${usuário} recusada`);
		} else return authorCh.send(`${usuário} não respondeu a tempo`);

		// Posiciona os barcos e inicia o chat
		const promises = [];
		promises.push(this.positionShips(msg.author));
		promises.push(this.positionShips(usuário));

		const [authorData, userData] = await Promise.all(promises);

		// Faz os turnos até que alguém ganhe
		do {
			await this.sendTurn(msg.author, usuário, userData);
			if(this.verifyWinner(authorData, userData)) break;
			await this.sendTurn(usuário, msg.author, authorData);
		} while(!this.verifyWinner(authorData, userData));

		const canvas = Canvas.createCanvas(550, 550);
		const ctx = canvas.getContext('2d');

		const attachment = new MessageAttachment(canvas.toBuffer(), 'canvas.png');
		await this.sendEmbed(msg, msg.author, {
			author: 'Batalha Naval',
			authorURL: 'https://twemoji.maxcdn.com/2/72x72/2693.png',
			attachment: attachment,
			image: 'attachment://canvas.png',
		})

		this.client.games.delete(authorCh.id);
		this.client.games.delete(sentMsg.channel.id);
	}
	// ------------------------------------> run <------------------------------------

	// -----------------------------------> dados <-----------------------------------
	verifyWinner(authorData, userData) {
		const authorM = this.totalUsed(authorData, 'valuesU');
		const authorU = this.totalUsed(authorData, 'valuesU');
		if(authorU >= authorM) return 'author';

		const userM = this.totalUsed(userData, 'values');
		const userU = this.totalUsed(userData, 'values');
		if (userU >= userM) return 'user';
	}

	totalUsed(data, valueName) {
		let num = 0;
		for (const [x, ys] of Object.entries(data[valueName]))
			for (const [y, value] of Object.entries(ys)) {
				if(valueName === 'valuesU')
					if(value) ++num;
				if(valueName === 'values')
					if(value && data.valuesU[x][y]) ++num;
			}
		return num;
	}

	async positionShips(user) {
		const nomes = { 2: 'Submarino (2 espaços)', 3: 'Navio de guerra (3 espaços)', 5: 'Porta Aviões (5 espaços)'};
		const ships = [2, 2, 2, 3, 3, 5];
		const posRegex = /([0-9](?=[a-jA-J])|[a-jA-J](?=[0-9]))([0-9]|[a-jA-J])\s*(.*)/i;

		// Cria o tabuleiro com as informações
		const data = { values: {}, valuesU: {}, ships: { 2: [], 3: [], 5: [] } };
		for(const num in this.letras) {
			data.values[num] = {};
			data.valuesU[num] = {};
			for(const letra in this.letras) {
				data.values[num][letra] = false;
				data.valuesU[num][letra] = false;
			}
		};

		const uCh = await user.createDM();
		for(const ship of ships) {
			const canvas = Canvas.createCanvas(550, 550);
			const ctx = canvas.getContext('2d');

			await this.drawField(ctx, data, true, false);

			const attachment = new MessageAttachment(canvas.toBuffer(), 'canvas.png');
			await this.sendEmbed({ channel: uCh, author: user }, user, {
				author: 'Batalha Naval',
				authorURL: 'https://twemoji.maxcdn.com/2/72x72/2693.png',
				attachment: attachment,
				image: 'attachment://canvas.png',
				description: `Onde deseja colocar o ${nomes[ship]} ?`,
			});

			let pos
			do {
				const coll = await uCh.awaitMessages(m => m.author.id === user.id, { max: 1, time: 60000, errors: ['time'] })
				const msg = coll.first();

				pos = posRegex.exec(msg.content);

				let x, y;
				if(pos) {
					if (Object.values(this.letras).includes(pos[1].toUpperCase())) {
						y = this.números[pos[1].toUpperCase()]; x = Number(pos[2]);
					} else {
						y = this.números[pos[2].toUpperCase()]; x = Number(pos[1]);
					}
					const rotated = ['sim', 's', 'yes'].includes(pos[3].toLowerCase()) ? true : false;

					if (this.setShip(data, ship, x, y, rotated)) break;
				}
				msg.say('Posição inválida');
			} while(true);
		}
		uCh.send(stripIndents`Esperando outro desafiante terminar de posicionar os barcos...
		
		Conexão de mensagens pronta, tudo que for dito por você será enviado para o outro desafiante...
		
		Conexão do desafiante ficará pronta quando ele terminar de posicionar os barcos...`);
		this.setListener(user, uCh, await this.client.games.get(uCh.id).chalenger.createDM());
		return data;
	}

	setShip(data, ship, x, y, rotated) {
		if(!data || !ship || !x || !y || !rotated);
		switch (ship) {
			case 'submarino':
			case '2':
			case 2:
				if(rotated) {
					if(!data.valuesU[x][y] && y + 1 < 10){
					if(!data.valuesU[x][y + 1]) {
						data.ships[2].push({x: x, y: y, rotated: true});
						data.valuesU[x][y] = true;
						data.valuesU[x][y + 1] = true;
						return data;
					}
				}
				}else if(!data.valuesU[x][y] && x + 1 < 10){
					if(!data.valuesU[x + 1][y]) {
						data.ships[2].push({ x: x, y: y, rotated: false });
						data.valuesU[x][y] = true;
						data.valuesU[x + 1][y] = true;
						return data;
					}
				}
				return false;

			case 'navio de guerra':
			case '3':
			case 3:
				if (rotated) {
					if (!data.valuesU[x][y]	&& y + 2 < 10) {
						if(!data.valuesU[x][y + 1]&& !data.valuesU[x][y + 2]) {
							data.ships[3].push({ x: x, y: y, rotated: true });
							data.valuesU[x][y] = true;
							data.valuesU[x][y + 1] = true;
							data.valuesU[x][y + 2] = true;
							return data;
						}
					}
				} else if (!data.valuesU[x][y] && x + 2 < 10) {
					if (!data.valuesU[x + 1][y]	&& !data.valuesU[x + 2][y]) {
						data.ships[3].push({ x: x, y: y, rotated: false });
						data.valuesU[x][y] = true;
						data.valuesU[x + 1][y] = true;
						data.valuesU[x + 2][y] = true;
						return data;
					}
				}
				return false;

			case 'porta avioes':
			case '5':
			case 5:
				if (rotated) {
					if (!data.valuesU[x][y] && y + 4 < 10) {
						if (!data.valuesU[x][y + 1]	&& !data.valuesU[x][y + 2] && !data.valuesU[x][y + 3] && !data.valuesU[x][y + 4]) {
							data.ships[5].push({ x: x, y: y, rotated: true });
							data.valuesU[x][y] = true;
							data.valuesU[x][y + 1] = true;
							data.valuesU[x][y + 2] = true;
							data.valuesU[x][y + 3] = true;
							data.valuesU[x][y + 4] = true;
							return data;
						}
					}
				} else if (!data.valuesU[x][y] && x + 4 < 10) {
					if (!data.valuesU[x + 1][y]	&& !data.valuesU[x + 2][y] && !data.valuesU[x + 3][y] && !data.valuesU[x + 4][y]) {
						data.ships[5].push({ x: x, y: y, rotated: false });
						data.valuesU[x][y] = true;
						data.valuesU[x + 1][y] = true;
						data.valuesU[x + 2][y] = true;
						data.valuesU[x + 3][y] = true;
						data.valuesU[x + 4][y] = true;
						return data;
					}
				}
				return false;
		}
	}
	// -----------------------------------> dados <-----------------------------------

	// ----------------------------------> desenho <----------------------------------
	async drawField(ctx, data, showShips = true, renderClouds = true) {
		// Coloca água no mapa
		for (const [x, ys] of Object.entries(data.values))
			for (const [y, value] of Object.entries(ys)) {
				const img = await Canvas.loadImage('./assets/images/1_agua.png');
				ctx.drawImage(img, x * 50, y * 50, 50, 50);
			}

		// Coloca os navios no mapa
		for(const [name, positions] of Object.entries(data.ships))
			for(const position of positions) {
				await this.drawShip(ctx, position.x, position.y, name, position.rotated);
			}

		// Coloca nevoas e explosões no mapa
		for(const [x, ys] of Object.entries(data.values))
			for(const [y, value] of Object.entries(ys)) {

				// Caso tenha uma parte de navio
				if(value && data.valuesU[x][y]) {
					const img = await Canvas.loadImage('./assets/images/1_explosao.png');
					ctx.globalAlpha = 0.4;
					ctx.drawImage(img, x * 50, y * 50, 50, 50);
					ctx.globalAlpha = 1;

				// Caso ainda não tenha sido testado
				} else if(!value && renderClouds) {
					const img = await Canvas.loadImage('./assets/images/1_nevoa.png');
					if(showShips) ctx.globalAlpha = 0.6;
					ctx.drawImage(img, x * 50, y * 50, 50, 50);
					if(showShips) ctx.globalAlpha = 1;
				}
			}
		
		// Desenha as linhas do mapa
		ctx.strokeStyle = '#202225';
		ctx.lineWidth = 3;
		for (let linha = 0; linha <= 10; linha++) {
			// Desenha as linhas verticais
			ctx.beginPath();
			ctx.moveTo(2.5, linha * 50 || 2.5);
			ctx.lineTo(550, linha * 50 || 2.5);
			ctx.stroke();

			// Desenha as linhas horizontais
			ctx.beginPath();
			ctx.moveTo(linha * 50 || 2.5, 2.5);
			ctx.lineTo(linha * 50 || 2.5, 550);
			ctx.stroke();
		}

		// Coloca as letras e números para localização
		for (let linha = 0; linha <= 10; linha++) {
			if (linha < 10) {
				ctx.font = '50px sans-serif';
				ctx.fillStyle = '#ffffff';
				ctx.fillText(linha, linha * 50 + 12.5, 545);
				ctx.font = '45px sans-serif';
				ctx.fillText(this.letras[linha], 515, linha * 50 + 43);
			}
		}
	};

	async drawShip(ctx, x, y, ship, rotated = false) {
		let image;
		switch(ship) {
			case 'submarino':
			case '2':
			case 2:
				image = await Canvas.loadImage(`./assets/images/2_submarino${rotated ? '_rotated' : ''}.png`);
				if(rotated) ctx.drawImage(image, x * 50 - 25, y * 50 - 8.5, 105, 115);
				else ctx.drawImage(image, x * 50 - 8.5, y * 50 - 25, 115, 105);
				break;

			case 'navio de guerra':
			case '3':
			case 3:
				image = await Canvas.loadImage(`./assets/images/3_navio_de_guerra${rotated ? '_rotated' : ''}.png`);
				if (rotated) ctx.drawImage(image, x * 50 - 20, y * 50 - 8.5, 100, 175);
				else ctx.drawImage(image, x * 50 - 8.5, y * 50 - 20, 175, 100);
				break;

			case 'porta avioes':
			case '5':
			case 5:
				image = await Canvas.loadImage(`./assets/images/5_porta_avioes${rotated ? '_rotated' : ''}.png`);
				if (rotated) ctx.drawImage(image, x * 50 - 25, y * 50 - 12.5, 105, 285);
				else ctx.drawImage(image, x * 50 - 12.5, y * 50 - 25, 285, 105);
				break;
		}
	}
	// ----------------------------------> desenho <----------------------------------

	// ---------------------------------> discord.js <---------------------------------

	async sendTurn(tUser, lUser, data) {
		
		// Cria o canvas do target
		let tCanvas = Canvas.createCanvas(550, 550);
		let tCtx = tCanvas.getContext('2d');
		await this.drawField(tCtx, data, false, true);
		let tAttachment = new MessageAttachment(tCanvas.toBuffer(), 'tCanvas.png');

		// Cria o canvas do outro usuário
		let lCanvas = Canvas.createCanvas(550, 550);
		let lCtx = lCanvas.getContext('2d');
		await this.drawField(lCtx, data, true, true);
		let lAttachment = new MessageAttachment(lCanvas.toBuffer(), 'lCanvas.png');

		// Envia o canvas do target
		await this.sendEmbed({ channel: tUser, author: tUser }, tUser, {
			author: 'Batalha Naval',
			authorURL: 'https://twemoji.maxcdn.com/2/72x72/2693.png',
			attachment: tAttachment,
			image: 'attachment://tCanvas.png',
			description: `${tUser} onde deseja jogar?`,
			footer: '60 segundos para responder...',
			footerURL: 'https://garticbot.gg/images/icons/time.png',
		}, undefined, tUser);

		// Envia o canvas do outro usuário
		await this.sendEmbed({ channel: lUser, author: lUser }, lUser, {
			author: 'Batalha Naval',
			authorURL: 'https://twemoji.maxcdn.com/2/72x72/2693.png',
			attachment: lAttachment,
			image: 'attachment://lCanvas.png',
			description: `Aguarde a jogada de ${tUser}...`,
			footer: `Aguarde a jogada de ${tUser.tag} • 60 segs`,
			footerURL: 'https://garticbot.gg/images/icons/time.png',
		}, undefined, lUser);

		// Espera o target enviar uma mensagem com uma posição válida
		let { x, y } = await this.awaitPosition(tUser);
		while (!data.values[x][y]) {
			tUser.send('Posição já usada');
			const newPos = await this.awaitPosition(tUser);
			x = newPos.x; y = newPos.y;
		};

		data.values[x][y] = true;

		// Cria o canvas do target
		tCanvas = Canvas.createCanvas(550, 550);
		tCtx = tCanvas.getContext('2d');
		await this.drawField(tCtx, data, false, true);
		tAttachment = new MessageAttachment(tCanvas.toBuffer(), 'tCanvas.png');

		// Cria o canvas do outro usuário
		lCanvas = Canvas.createCanvas(550, 550);
		lCtx = lCanvas.getContext('2d');
		await this.drawField(lCtx, data, true, true);
		lAttachment = new MessageAttachment(lCanvas.toBuffer(), 'lCanvas.png');

		// Envia o canvas do target
		await this.sendEmbed({ channel: tUser, author: tUser }, tUser, {
			author: 'Batalha Naval',
			authorURL: 'https://twemoji.maxcdn.com/2/72x72/2693.png',
			attachment: tAttachment,
			image: 'attachment://tCanvas.png',
			description: data.valuesU[x][y] ? 'Acertou !' : 'Errou...',
			footer: `${this.totalUsed(data, 'values')}/${this.totalUsed(data, 'valuesU')}`,
			footerURL: 'https://twemoji.maxcdn.com/2/72x72/1f4a5.png',
		}, undefined, tUser);

		// Envia o canvas do outro usuário
		await this.sendEmbed({ channel: lUser, author: lUser }, lUser, {
			author: 'Batalha Naval',
			authorURL: 'https://twemoji.maxcdn.com/2/72x72/2693.png',
			attachment: lAttachment,
			image: 'attachment://lCanvas.png',
			description: `${tUser} ${data.valuesU[x][y] ? 'acertou !' : 'errou...'}`,
			footer: `${this.totalUsed(data, 'values')}/${this.totalUsed(data, 'valuesU')}`,
			footerURL: 'https://twemoji.maxcdn.com/2/72x72/1f4a5.png',
		}, undefined, lUser);
	}

	async awaitPosition(user, acceptRotated = false) {
		const posRegex = acceptRotated ? /([0-9](?=[a-jA-J])|[a-jA-J](?=[0-9]))\s*([0-9]|[a-jA-J])\s*(.*)/i : /([0-9](?=[a-jA-J])|[a-jA-J](?=[0-9]))\s*([0-9]|[a-jA-J])/i;
		const uCh = await user.createDM();
		const coll = await uCh.awaitMessages(m => m.author.id === user.id && posRegex.test(m.content),
			{ max: 1, time: 60000, errors: ['time'] })
		const msg = coll.first();

		console.log(posRegex.exec(msg.content));

		const pos = posRegex.exec(msg.content);

		let x, y;
		if (Object.values(this.letras).includes(pos[1].toUpperCase())) {
			y = this.números[pos[1].toUpperCase()]; x = Number(pos[2]);
		} else {
			y = this.números[pos[2].toUpperCase()]; x = Number(pos[1]);
		}
		const rotated = ['sim', 's', 'yes'].includes(pos[3].toLowerCase()) ? true : false;

		return { x, y, rotated };
	}

	// Faz a conexão entre dois canais
	async setListener(tUser, tChannel, lChannel) {
		do {
			console.log(this.client.games.get(tChannel.id).name);
			const coll = await tChannel.awaitMessages(m => m.author.id === tUser.id);
			const msg = coll.first();
			console.log(msg);

			if (this.client.games.get(tChannel.id).name === 'Batalha-naval') lChannel.send({embed: {
				author: { name: tUser.tag, url: tUser.avatarURL() },
				description: msg.content,
				image: msg.attachments.first() ? { url: msg.attachments.first().url } : undefined,
			}});
		} while (this.client.games.get(tChannel.id).name === 'Batalha-naval');
	}

	// Envia um embed reaje e espera as reações de um usuário
	async sendEmbed(msg, user, data = {}, emojis = [], mention = '') {
		const embed = new MessageEmbed()
			.setColor(data.color)
			.setAuthor(data.author, data.authorURL)
			.setImage(data.image)

		if(data.footer) embed.setFooter(data.footer, data.footerURL);

		if (data.attachment) embed.attachFiles(data.attachment);

		if (data.description) embed.setDescription(data.description);

		if (data.fields) for (const field of data.fields)
			embed.addField(field.name, field.value, field.inline);

		// Envia uma mensagem nova
		const sentMsg = await msg.channel.send(mention, { embed: embed });

		if (emojis.length > 0) {
			const promises = [];
			// Inicia o listener de reações
			promises.push(this.awaitReaction(sentMsg, user, emojis));

			// Configura a ordem de reações
			promises.push(this.react(emojis, sentMsg));

			// Espera as reações
			const [reaction] = await Promise.all(promises);

			if (!reaction) {
				this.sendEmbed(sentMsg, user, {
					...data,
					footer: 'Tempo esgotado',
					footerURL: 'https://garticbot.gg/images/icons/time.png'
				}, [], mention);
				return {};
			} else return { reaction, sentMsg };
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

		if (reaction) return reaction;
		else return false;
	}

	// Reage na ordem
	async react(emojis, msg) {
		for (const emoji of emojis)
			await msg.react(emoji);
	}
	// ---------------------------------> discord.js <---------------------------------
}