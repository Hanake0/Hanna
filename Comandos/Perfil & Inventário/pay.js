const { Command } = require('../../CommandoV12/src/index.js');
const Discord = require('discord.js');

module.exports = class PayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pagar',
			aliases: ['pay'],
			group: 'p&i',
			memberName: 'pagar',
      description: 'Paga uma quantidade de dinheiro a um usuário',
      blackListed: ['698678688153206915'],
			throttling: {
				usages: 2,
				duration: 10
      },
      args: [
				{
					key: 'usuário',
					prompt: 'pagar quem?',
					type: 'user',
					bot: false
				},
				{
					key: 'valor',
					prompt: 'pagar quanto?',
					type: 'integer',
					min: 1,
				},
				{
					key: 'moeda',
					prompt: 'em que moeda?',
					type: 'String	',
					oneOf: ['coin', 'coins', 'gem', 'gems'],
				},
			],
		});
	}

	run(msg, { usuário, valor, moeda }) {
		const uDB = msg.client.usersData.get(usuário.id);
		const member = msg.client.guilds.cache.get('698560208309452810').members.cache.get(usuário.id);
		
		const aDB = msg.client.usersData.get(msg.author.id);
		
		if(!uDB || !aDB) 
			return msg.reply('ih mano, deu ruim aqui...');
    
    const acoins = aDB.money;
    const agems = aDB.gems || 0;

		const uCoins = uDB.money;
		const uGems = uDB.gems || 0;
		
		if(['coins', 'coin'].includes(moeda))
			moeda = money;
		else moeda = gems;
		
		if(aDB[moeda] > valor)
			return msg.reply('Vish mano, parece que tu tá mei pobre pra pagar isso aí...');
			
		aDB[moeda] -= valor;
		uDB[moeda] = uDB[moeda] + valor || valor;
		
    const embed = new Discord.MessageEmbed()
      .setColor( member ? member.displayColor : Math.floor(Math.random() * 16777214) + 1)
      .setAuthor(msg.author.tag, msg.author.avatarURL())
			.setTitle(`${valor} ${moeda} pagos a ${usuário}`)
			.addField('Carteira:', `<:hcoin:750754664026472549>${coins}\n<:hgem:750840705269891112>${gems}`, true)
      .addField('usuário.tag', `<:hcoin:750754664026472549>${coins}\n<:hgem:750840705269891112>${gems}`, true)
		msg.replyEmbed(embed);
		}
};
