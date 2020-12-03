import { Command } from '../../CommandoV12/src/index.js';
import Discord from 'discord.js';

export default class CarteiraCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'carteira',
			aliases: ['money', 'wallet', 'dinheiro', 'coins', 'gems'],
			group: 'p&i',
			memberName: 'carteira',
      description: 'Mostra quanto dinheiro você ou alguém tem na carteira',
      blackListed: ['698678688153206915'],
			throttling: {
				usages: 2,
				duration: 10
      },
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

	run(msg, { usuário }) {

		const uDB = msg.client.data.users.resolveUser(usuário)

		const member = msg.client.guilds.cache.get('698560208309452810').members.cache.get(usuário.id);
    
    const coins = uDB.wallet.coins;
    const gems = uDB.wallet.gems;

    const embed = new Discord.MessageEmbed()
      .setColor( member ? member.displayColor : Math.floor(Math.random() * 16777214) + 1)
      .setAuthor(member.user.tag, member.user.avatarURL())
			.addField('Coins', `<:hcoin:750754664026472549>${coins}`, true)
      .addField('Gems', `<:hgem:750840705269891112>${gems} `, true)
      .addField('Total', `:money_with_wings:${gems * 1000 + coins} `, true);
		msg.embed(embed);
		}
};
