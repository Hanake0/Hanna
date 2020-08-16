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
        },
			],
    });
  }

  async run(message, { usuário }) {
    const client = message.client;
    const { usersOffDB } = require('../../index');

    if (!usersOffDB.has(usuário.id).value()) return message.embed({description: 'sem dados :/' }).then(a => a.delete({ timeout: 5000 }).then(message.delete({ timeout: 5000 })));

    //const momento = new Date(Math.round(usersOffDB.get(usuário.id).value().lastMessage.seconds * 1000 + (usersOffDB.get(message.author.id).value().lastMessage.nanoseconds /  10000)));
    const embed = new Discord.MessageEmbed()
        .setTitle(`Última mensagem de ${usuário.username}:`)
        .setDescription('`' + usersOffDB.get(usuário.id).value().lastMessageContent + '`')
        .setThumbnail(`${usuário.avatarURL()}`)
        .addField('Enviado em:', `${client.channels.cache.find(a => a.id === usersOffDB.get(usuário.id).value().lastMessageChannelID)}`, true)
        .setTimestamp(usersOffDB.get(usuário.id).value().lastMessage)
        .setFooter('Mensagem enviada: ', `${message.author.avatarURL()}`);

    await message.say(embed);
    message.delete()

  }
};