import { MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';
import { Command } from '../../CommandoV12/src/index.js';

export default class SeparadorDeSílabasCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'separador-de-silabas',
			aliases: ['separadordesilabas', 'silabas', 'sílabas'],
			group: 'utilidades',
			memberName: 'separador-de-silabas',
			clientPermissions: ['MANAGE_MESSAGES'],
			description: 'Divide uma palavra da lingua portuguesa silabicamente.',
			args: [
				{
					key: 'texto',
					prompt: 'separar o que?',
					type: 'string',
				},
			],
		});

		this.classificacao = {
			1: 'Monossílabo',
			2: 'Dissílabo',
			3: 'Trissílabo',
			4: 'Polissílabo',
		};
	}

	run(message, { texto }) {
		const embed = new MessageEmbed();
		const textoArray = texto.split(/\s/);

		if(textoArray.length === 1) {
			const resposta = this.separarSílabas(textoArray[0]);
			embed
				.setAuthor('Separador de sílabas', 'https://twemoji.maxcdn.com/2/72x72/1f4da.png')
				.setDescription(stripIndents`
					📜 Classificação: ${resposta.length > 4 ? this.classificacao[4] : this.classificacao[resposta.length]} (${resposta.length > 4 ? '+4 sílabas' : `${resposta.length} sílaba${resposta.length > 1 ? 's' : ''}`})
					📄 Palavra: ${texto}
					📑 Resultado: **${resposta.join('-')}**
				`);
		} else {
			let resposta = '';
			textoArray.forEach((palavra) => resposta += ` ${this.separarSílabas(palavra).join('-')}`);
			embed
				.setAuthor('Separador de sílabas', 'https://twemoji.maxcdn.com/2/72x72/1f4da.png')
				.setDescription(stripIndents`
					📄 Texto: ${texto}
					📑 Resultado: **${resposta}**
				`);
		}
		message.inlineReply(embed);
	}

	/*
	// Dígrafos que necessitam ser separados
	let silabas = palavra.replace(new RegExp(this.dígrafosSep, 'gi'), '$1-');

	// Encontros consonantais e dígrafos que ficam unidos
	silabas = silabas.replace(new RegExp(`([a-z]+[bdfhjklmprstv-z]|${this.dígrafosUni})+([b-df-hjkmnpqtv-z][a-z]+)`, 'gi'), '$1-$2');

	// Separa hiatos e deixa ditongos e tritongos
	silabas = silabas.replace(/([a-z]*[aeiou])([aeo](?!i|u))([a-z]+)/gi, '$1-$2-$3');

	const sPorC = '(?=b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z)';
	// eslint-disable-next-line no-useless-escape
	silabas = silabas.replace(new RegExp(`([bcdfghjklmnpqrstvwxyz]?[aeiou]r${sPorC}n${sPorC}m${sPorC}s${sPorC})(\w*)`, 'gi'), '$1-$2');

	return silabas;
	*/

	separarSílabas(palavra) {
		const vogais = ['a', 'ã', 'â', 'á', 'à', 'e', 'ê', 'é', 'è', 'i', 'î', 'í', 'ì', 'o', 'õ', 'ô', 'ó', 'ò', 'u', 'û', 'ú', 'ù'];
		const consoantes = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
		const resposta = [];

		let letras = Array.from(palavra);
		const numSilabas = letras.reduce((total, letra) => {
			if(vogais.includes(letra)) return ++total;
			return total;
		}, 0);

		for(let sil = 1;sil <= numSilabas; sil++) {
			const silaba = letras.slice();
			let vogalIndex = silaba.indexOf(silaba.find(letra => vogais.includes(letra)));

			// Caso dígrafos 'gu' ou 'qu'
			if(silaba[vogalIndex])
				if(this.retirarAcentos(silaba[vogalIndex]) === 'u' && ['g', 'q'].includes(silaba[vogalIndex - 1]))
					vogalIndex = vogalIndex + 1;

			const { letra1, letra2 } = { letra1: silaba[vogalIndex + 1] ? silaba[vogalIndex + 1].toLowerCase() : null, letra2: silaba[vogalIndex + 2] ? silaba[vogalIndex + 2].toLowerCase() : null };
			const { letra3, letra4 } = { letra3: silaba[vogalIndex + 3] ? silaba[vogalIndex + 3].toLowerCase() : null, letra4: silaba[vogalIndex + 4] ? silaba[vogalIndex + 4].toLowerCase() : null };

			const { letra1Consoante, letra1Vogal } = { letra1Consoante: consoantes.includes(letra1), letra1Vogal: vogais.includes(letra1) };
			const { letra2Consoante, letra2Vogal } = { letra2Consoante: consoantes.includes(letra2), letra2Vogal: vogais.includes(letra2) };
			const { letra3Consoante, letra3Vogal } = { letra3Consoante: consoantes.includes(letra3), letra3Vogal: vogais.includes(letra3) };
			const { letra4Vogal } = { letra4Consoante: consoantes.includes(letra4), letra4Vogal: vogais.includes(letra4) };
			// eslint-disable-next-line no-inner-declarations
			function dígrafosUni(l1, l2) { return ((l1 === 'c' && l2 === 'h') || (l1 === 'l' && l2 === 'h') || (l1 === 'n' && l2 === 'h')); }
			// eslint-disable-next-line no-inner-declarations
			function dígrafosSep(l1, l2) {
				return ((l1 === 'r' && l2 === 'r') || (l1 === 's' && l2 === 's') || (l1 === 's' && l2 === 'c')
				|| (l1 === 's' && l2 === 'ç') || (l1 === 'x' && l2 === 's') || (l1 === 'x' && l2 === 'c'));
			}

			// Caso a letra depois da vogal seja consoante
			if(letra1Consoante) {

				// Caso seja um dígrafo que tem que ser separado
				if(dígrafosSep(letra1, letra2)) {
					resposta.push(silaba.slice(0, vogalIndex + 2).join(''));
					letras = letras.slice(vogalIndex + 2);

				// Caso sílaba acompanhada de alguma letra
				} else if(letra1Consoante && !letra2Vogal && !(letra2 === 'l' || letra2 === 'r') &&	!dígrafosUni(letra1, letra2)) {

					// Acompanhado de 2 letras
					if(letra2Consoante && !letra3Vogal && !(letra3 === 'l' || letra3 === 'r') && !dígrafosUni(letra2, letra3)) {
						resposta.push(silaba.slice(0, vogalIndex + 3).join(''));
						letras = letras.slice(vogalIndex + 3);

					// Acompanhado de 1 letra
					} else {
						resposta.push(silaba.slice(0, vogalIndex + 2).join(''));
						letras = letras.slice(vogalIndex + 2);
					}

				// Caso seja uma silaba simples
				} else {
					resposta.push(silaba.slice(0, vogalIndex + 1).join(''));
					letras = letras.slice(vogalIndex + 1);
				}

			// Caso a letra depois da vogal também seja vogal
			} else if(letra1Vogal) {

				// Caso seja um ditongo
				if((['u', 'i'].includes(this.retirarAcentos(letra1)) || (letras[vogalIndex] === 'ã' && letra1 === 'o')) && !(this.retirarAcentos(letras[vogalIndex]) === this.retirarAcentos(letra1))) {

					// Caso seja acompanhado
					if(letra2Consoante && !letra3Vogal && !(letra3 === 'l' || letra3 === 'r') && !dígrafosUni(letra2, letra3)) {

						// Ditongo acompanhado de 2 letras
						if(letra3Consoante && !letra4Vogal && !(letra4 === 'l' || letra4 === 'r') && !dígrafosUni(letra3, letra4)) {
							resposta.push(silaba.slice(0, vogalIndex + 4).join(''));
							letras = letras.slice(vogalIndex + 4);

						// Ditongo acompanhado de 1 letra
						} else {
							resposta.push(silaba.slice(0, vogalIndex + 3).join(''));
							letras = letras.slice(vogalIndex + 3);
						}

					// Caso seja um ditongo simples
					} else {
						resposta.push(silaba.slice(0, vogalIndex + 2).join(''));
						letras = letras.slice(vogalIndex + 2);
					}

				// Caso seja um hiato
				} else {
					resposta.push(silaba.slice(0, vogalIndex + 1).join(''));
					letras = letras.slice(vogalIndex + 1);
				}

			// caso não tenha próxima letra
			} else if(vogalIndex >= 0) {
				resposta.push(silaba.slice(0, vogalIndex + 1).join(''));
				letras = letras.slice(vogalIndex + 1);
			}
		}

		return resposta;
	}

	retirarAcentos(letra) {
		letra = letra.replace(/[ÁÀÂÃ]/gi, 'a');
		letra = letra.replace(/[ÉÈÊ]/gi, 'e');
		letra = letra.replace(/[ÍÌÎ]/gi, 'i');
		letra = letra.replace(/[ÓÒÔÕ]/gi, 'o');
		letra = letra.replace(/[ÚÙÛ]/gi, 'u');
		letra = letra.replace(/[Ç]/gi, 'c');
		return letra;
	}
}