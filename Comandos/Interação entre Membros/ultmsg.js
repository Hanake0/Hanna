const { Command } = require('../../CommandoV12/src/index.js');
const Discord = require('discord.js');

module.exports = class UltMsgCommand extends Command {
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
    const { usersOffDB } = require('../../index');

    if (!usersOffDB.has(usuário.id).value()) return message.embed({description: 'sem dados :/' })
      .then(a => a.delete({ timeout: 5000 })
      .then(message.delete({ timeout: 5000 })))
      .then(() => null);
    const uDB = usersOffDB.get(usuário.id).value();

    const embed = new Discord.MessageEmbed()
        .setTitle(`Última mensagem de ${usuário.username}:`)
        .setDescription('`' + uDB.lastMessageContent + '`')
        .setThumbnail(`${usuário.avatarURL()}`)
        .addField('Enviado em:', `${client.channels.cache.find(channel => channel.id === uDB.lastMessageChannelID)}`, true)
        .setTimestamp(uDB.lastMessage)
        .setFooter('Mensagem enviada: ', `${message.author.avatarURL()}`)
        .setImage(uDB.lastMessageAttachment ? uDB.lastMessageAttachment : undefined);

    // if(uDB.LastMessageAttachment) embed.setImage(uDB.LastMessageAttachment);

    await message.say(embed);
    message.delete()

  }
};