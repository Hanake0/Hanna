import { Command } from '../../CommandoV12/src/index.js';
import { stripIndents } from 'common-tags';
import { shuffle, removeDuplicates, verify } from '../../assets/util/util.js';
import eventos from '../../assets/JSON/eventos_hunger-games.js';

export default class HungerGamesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'hunger-games',
      aliases: ['jogos vorazes'],
      group: 'singleplayer',
      memberName: 'hunger-games',
      clientPermissions: ['ADMINISTRATOR'],
      description: '(não é o do Minecraft) Inicia uma partida simulada dos Jogos Vorazes',
      details: 'Até 24 participantes são aceitos, mais que isso e o comando não funciona.\nParticipantes duplicados também não são aceitos.\nO nome de cada participante pode ter no máximo 20 caractéres',
      throttling: {
            usages: 1,
            duration: 10
        },
      args: [
        {
            key: 'tributos',
            prompt: '**UM** nome(pode ter sobrenome) que deve participar, digita aí, máximo de 20 caracteres e 24 tributos.',
                type: 'string',
                infinite: true,
            max: 20
        }
      ]
    });
  }

	async run(msg, { tributos }) {

		//verifica se não tem nada de errado com os tributos.
		if (tributos.length < 2) return msg.say(`...${tributos[0]} ganha, sendo o único tributo na arena.`);
		if (tributos.length > 24) return msg.inlineReply('Ihhh, ouuu, eu avisei né, não mais que 24 tributos.');
		if (removeDuplicates(tributos).length !== tributos.length) {
				return msg.inlineReply('Ihhh, se você tivesse lido a ajuda saberia que não pode repetir tributo...');
		}

		//verifica se nenhum jogo está acontecendo no canal
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.inlineReply(`Por favor espere o fim do jogo de \`${current.name}\` neste canal.`);

		this.client.games.set(msg.channel.id, { name: this.name });


		try {
			let sun = true;
			let turn = 0;
			let bloodbath = true;
			const kills = {};
			for (const tribute of tributos) kills[tribute] = 0;
			const remaining = new Set(shuffle(tributos));
			while (remaining.size > 1) {
				if (!bloodbath && sun) ++turn;
				const sunEvents = bloodbath ? eventos.bloodbath : sun ? eventos.day : eventos.night;
				const results = [];
				const deaths = [];
				this.makeEvents(remaining, kills, sunEvents, deaths, results);
				let text = { color: bloodbath ? '#c22727' : sun ? `#fad900` : `#134a8f`, title:	`__**${bloodbath ? 'Banho de Sangue' : sun ? `Dia ${turn}` : `Noite ${turn}`}:**__\n`,
					description: results.join('\n\n')};
				if (deaths.length) {
					var mortes = {color: '#c22727', description: stripIndents`\n\n
						**${deaths.length} tiro${deaths.length === 1 ? '' : 's'} de canhão pode${deaths.length === 1 ? '' : 'm'} ser ouvido${deaths.length === 1 ? '' : 's'} a distância.**\n
						:skull: ${deaths.join('\n:skull:')}`};
				}

				await msg.embed(text)
				if (deaths.length) await msg.embed(mortes)
				await msg.embed({ description: '___Continuar?___`'});

				const verification = await verify(msg.channel, msg.author, { time: 120000 });
				if (!verification) {
					this.client.games.delete(msg.channel.id);
					return msg.say('Te vejo na próxima então!');
				}
				if (!bloodbath) sun = !sun;
				if (bloodbath) bloodbath = false;
			}
			this.client.games.delete(msg.channel.id);
			const remainingArr = Array.from(remaining);
			return msg.embed({color: 15844367, title: `E o vencedor ééé... **${remainingArr[0]}**!`, description: stripIndents`
		

				__**Ranking de kills:**__

				${this.makeLeaderboard(tributos, kills, remainingArr[0]).join('\n')}
			`, thumbnail: { url: 'https://twemoji.maxcdn.com/2/72x72/1f3c6.png' } });
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			throw err;
		}
	};

	// troca o nome nos eventos
	parseEvent(event, tributos) {
		return event
			.replace(/\(Player1\)/gi, `**${tributos[0]}**`)
			.replace(/\(Player2\)/gi, `**${tributos[1]}**`)
			.replace(/\(Player3\)/gi, `**${tributos[2]}**`)
			.replace(/\(Player4\)/gi, `**${tributos[3]}**`)
			.replace(/\(Player5\)/gi, `**${tributos[4]}**`)
			.replace(/\(Player6\)/gi, `**${tributos[5]}**`);
	};

	// Escolhe os eventos randômicamente
	makeEvents(tributos, kills, eventsArr, deaths, results) {
		const turn = new Set(tributos);
		for (const tribute of tributos) {
			if (!turn.has(tribute)) continue;
			const valid = eventsArr.filter(event => event.tributos <= turn.size && event.deaths < turn.size);
			const event = valid[Math.floor(Math.random() * valid.length)];
			turn.delete(tribute);
			if (event.tributos === 1) {
				if (event.deaths.length === 1) {
					deaths.push(tribute);
					tributos.delete(tribute);
				}
				results.push(this.parseEvent(event.text, [tribute]));
			} else {
				const current = [tribute];
				if (event.killers.includes(1)) kills[tribute] += event.deaths.length;
				if (event.deaths.includes(1)) {
					deaths.push(tribute);
					tributos.delete(tribute);
				}
				for (let i = 2; i <= event.tributos; i++) {
					const turnArr = Array.from(turn);
					const tribu = turnArr[Math.floor(Math.random() * turnArr.length)];
					if (event.killers.includes(i)) kills[tribu] += event.deaths.length;
					if (event.deaths.includes(i)) {
						deaths.push(tribu);
						tributos.delete(tribu);
					}
					current.push(tribu);
					turn.delete(tribu);
				}
				results.push(this.parseEvent(event.text, current));
			}
		}
	};

        // Faz o "Ranking de kills"
	makeLeaderboard(tributos, kills, ganhador) {
		let i = 0;
		let previousPts = null;
		let positionsMoved = 1;
		return tributos
			.filter(tribute => kills[tribute] > 0)
			.sort((a, b) => kills[b] - kills[a])
			.map(tribute => {
				if (previousPts === kills[tribute]) {
					positionsMoved++;
				} else {
					i += positionsMoved;
					positionsMoved = 1;
				}
				previousPts = kills[tribute];
				return `**${tribute === ganhador ? ':trophy: ' + `${i}` : ':skull: ' + `${i}`}.** ${tribute} (${kills[tribute]} mort${kills[tribute] === 1 ? 'e' : 'es'})`;
			});
	};
};
