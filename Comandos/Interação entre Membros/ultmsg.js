import { Command } from '../../CommandoV12/src/index.js';
import Discord from 'discord.js';

export default class UltMsgCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ultmsg',
      aliases: ['vistoporultimo', 'lastmsg', 'ultimamensagem'],
      group: 'interação',
      memberName: 'ultimamensagem',
      description: 'Mostra o conteúdo e a hora da última mensagem de um usuário no servidor.',
      guildOnly: true,
      args: [
        {
          key: 'usuário',
          prompt: 'de quem?',
          type: 'user',
          bot: false
        },
			],
    });
  }

  async run(message, { usuário }) {
    const client = message.client;
    const uDB = client.data.users.resolveUser(usuário);

    if (!uDB) return message.embed({description: 'sem dados :/' })

    const embed = new Discord.MessageEmbed()
        .setDescription(uDB.lastMessage.content)
        .setAuthor(usuário.tag, usuário.avatarURL())
        .setTimestamp(uDB.lastMessage.createdAt)
        .setFooter('Enviado em:', `${client.channels.cache.get(uDB.lastMessage.channel)}`, this.client.user.avatarURL())
        .setImage(uDB.lastMessage.attachment ? uDB.lastMessage.attachment : undefined);

    await message.embed(embed);
    message.delete()

  }
};