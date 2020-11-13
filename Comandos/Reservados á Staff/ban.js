import { Command } from '../../CommandoV12/src/index.js';
import emojis from '../../Assets/JSON/emojis.js';

export default class SetGemsCommand extends Command {
	constructor(client) {
		super(client, {
      name: 'ban',
      aliases: ['banir'],
			group: 'adm',
			memberName: 'ban',
			description: 'Bane um usuário do server',
      serverOnly: true,
      userPermissions: ['BAN_MEMBERS'],
			throttling: {
				usages: 2,
				duration: 10
      },
      args: [
        {
					key: 'usuário',
					prompt: 'Banir quem?',
					type: 'user',
					bot: false
        },
        {
          key: 'motivo',
          prompt: 'Qual o motivo do banimento ?',
          type: 'string',
        }
			],
		});
	}

	async run(msg, { usuário, motivo }) {

    const logChannel = msg.client.channels.cache.get('719397962287022192');
    const Wclub = msg.client.guilds.cache.get('698560208309452810');

    const membro = Wclub.members.cache.get(usuário.id);
    const CliMember = Wclub.members.cache.get(msg.client.user.id);


    if(membro) {
      if(msg.member.roles.highest.rawPosition <= membro.roles.highest.rawPosition) 
        return msg.embed({color: emojis.failC, description: `${emojis.fail} | Você precisa de um cargo maior que o do membro pra bani-lo...`});
      
      if(CliMember.roles.highest.rawPosition <= membro.roles.highest.rawPosition)
        return msg.embed({color: emojis.failC, description: `${emojis.fail} | Eu preciso de um cargo maior que o do membro pra bani-lo...`});
    };

    try {
      await Wclub.members.ban(usuário, {  reason: `${msg.author.tag}(${msg.author.id}) Baniu ${usuário.tag}(${usuário.id}) com o motivo: ${motivoC}` });
      await msg.embed({color: emojis.successC, description: `${emojis.success} | Membro banido.`});
    } catch(err) {
      await msg.embed({color: emojis.failC, description: `${emojis.fail} | Algo deu errado tentando banir esse membro: \`${err.name}\`: \`${err.message}\``});
    };
  }
};
