import { Command } from '../../CommandoV12/src/index.js';
import Discord from 'discord.js';
import { data, diff } from '../../Assets/util/util.js';
import { status, activities} from '../../Assets/util/util2.js';

export default class InfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'info',
			aliases: ['informacoes', 'informações', 'informaçoes'],
			group: 'p&i',
			memberName: 'info',
			description: 'Mostra as informações de um usuário do servidor.',
			blackListed: ['698678688153206915'],
			args: [
				{
					key: 'usuário',
					prompt: 'de quem?',
					type: 'user',
					default: msg => msg.author,
					bot: false
				},
			],
		});
	}

	async run(message, { usuário }) {
		const client = message.client;
		const { usersOffDB } = require('../../index');
		
		const infos = {
			money:'$$ MONEY $$',
			xp: '## XP ##',
			xp_semanal: '## XP SEMANAL ##',
			mensagens: '## MENSAGENS CONTADAS ##',
			idade: '## IDADE ##',
			sexualidade: '¬¬ SEXUALIDADE ¬¬'
		};
		const infosF = {
			medalhas: '## MEDALHAS ##',
			interesses: '## INTERESSES ##'
		};

		const userDB = usersOffDB.get(usuário.id).value();
		const membro = message.guild.members.cache.get(usuário.id);

		const embed = new Discord.MessageEmbed()
			.setColor(membro.displayColor)
			.setTitle(`${usuário.tag}${membro.nickname ? ` => ${membro.nickname}` : ''}`)
			.setDescription('id: ' + usuário.id)
			.setThumbnail(`${usuário.avatarURL()}`)
			.addField('Entrou em:', data(membro.joinedTimestamp) + ` (${diff(membro.joinedTimestamp, new Date().valueOf())})`, true)
			.addField('Conta criada em:', data(usuário.createdTimestamp) + ` (${diff(usuário.createdTimestamp, new Date().valueOf())})`, true)
			.setTimestamp(usuário.presence.activities.length > 0 ? usuário.presence.activities[0].createdTimestamp : userDB.lastMessage)
			.setFooter(usuário.presence.activities.length > 0 ? activities[usuário.presence.activities[0].type] + `: ${usuário.presence.activities[0].type === 'CUSTOM_STATUS' ? `\'${usuário.presence.activities[0].state}\'` : `\'${usuário.presence.activities[0].name}\'`}` + ' desde' : 'Última mensagem: ', usuário.avatarURL());

		if (userDB) Object.entries(userDB).forEach(([nome, valor]) => {
			if (nome in infos && valor) {
				embed.addField(infos[nome], valor, true);
			};
		})

		if (userDB) Object.entries(userDB).forEach(([nome, valor]) => {
			if (nome in infosF && valor.length > 0) {
				embed.addField(infosF[nome], valor.join(', '), false);
			}
		})
		
		embed
			.addField('Presence:', `Status: ${status[usuário.presence.status]}`)

		await message.embed(embed);
		message.delete()
	}
};