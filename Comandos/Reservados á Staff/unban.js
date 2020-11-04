const { Command } = require('../../CommandoV12/src/index.js');
const Discord = require('discord.js');
const emojis = require('../../Assets/JSON/emojis.json');

module.exports = class SetGemsCommand extends Command {
	constructor(client) {
		super(client, {
      name: 'unban',
      aliases: ['desbanir'],
			group: 'adm',
			memberName: 'unban',
			description: 'Desbane um usuário do server',
      serverOnly: true,
      userPermissions: ['BAN_MEMBERS'],
			throttling: {
				usages: 2,
				duration: 10
      },
      args: [
        {
					key: 'usuário',
					prompt: 'Desbanir quem?',
					type: 'user',
					bot: false
        },
        {
          key: 'motivo',
          prompt: 'Qual o motivo do desbanimento ?',
          type: 'string'
        }
			],
		});
	}

	async run(msg, { usuário, motivo, tempoMensagens }) {

    const logChannel = msg.client.channels.cache.get('719397962287022192');
    const Wclub = msg.client.guilds.cache.get('698560208309452810');


    try {
      await Wclub.members.unban(usuário, `${msg.author.tag}(${msg.author.id}) Desbaniu ${usuário.tag}(${usuário.id}) com o motivo: ${motivo}`);
      await msg.embed({color: emojis.successC, description: `${emojis.success} | Membro desbanido.`});
    } catch(err) {
      await msg.embed({color: emojis.failC, description: `${emojis.fail} | Algo deu errado tentando desbanir esse membro: ${err.name}: ${err.message}`});
    };
  }
};
