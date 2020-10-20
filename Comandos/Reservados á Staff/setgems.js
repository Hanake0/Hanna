const { Command } = require('../../CommandoV12/src/index.js');
const Discord = require('discord.js');
const emojis = require('../../Assets/JSON/emojis.json');

module.exports = class SetGemsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'set-gems',
			group: 'adm',
			memberName: 'set-gems',
			description: 'Muda a quantidade de gems na carteira de um usuário',
			serverOnly: true,
      ownerOnly: true,
			throttling: {
				usages: 2,
				duration: 10
      },
      args: [
        {
          key: 'valor',
          prompt: 'Atualizar valor para quanto ?',
          type: 'integer'
        },
				{
					key: 'usuário',
					prompt: 'de quem?',
					type: 'user',
					default: msg => msg.author,
					bot: false
        }
			],
		});
	}

	async run(msg, { usuário, valor }) {

		const { usersOffDB } = require('../../index');
    const uDB = usersOffDB.get(usuário.id)
    
    uDB.gems = valor;
    msg.embed({ color: '#24960e', description: `${emojis.success} | Gems de ${usuário} atualizadas com sucesso para \`\`${valor}\`\`!`});

		const member = msg.client.guilds.cache.get('698560208309452810').members.cache.get(usuário.id);
    
    const coins = uDB.money;
    const gems = uDB.gems ? uDB.gems : '0';

    const embed = new Discord.MessageEmbed()
      .setColor( member ? member.displayColor : Math.floor(Math.random() * 16777214) + 1)
      .setAuthor(member.user.tag, member.user.avatarURL())
			.addField('Coins', `<:hcoin:750754664026472549>${coins}`, true)
      .addField('Gems', `<:hgem:750840705269891112>${gems} `, true)
      .addField('Total', `:money_with_wings:${gems * 1000 + coins} `, true);
		msg.embed(embed);
		}
};
