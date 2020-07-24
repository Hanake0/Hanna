const { Command } = require('../../commando discord.js-v12/src/index.js');
const Discord = require('discord.js');

module.exports = class UltMsgCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ultmsg',
      aliases: ['vistoporultimo', 'lastmsg', 'ultimamensagem'],
      group: 'utilidades',
      memberName: 'ultimamensagem',
      description: 'Mostra o conteúdo e a hora da última mensagem de um usuário no servidor.',
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
    const momento = new Date(Math.round(usersOffDB.get(usuário.id).value().lastMessage.seconds * 1000 + (usersOffDB.get(usuário.id).value().lastMessage.nanoseconds /  10000)));

    if (!usersOffDB.has(usuário.id).value()) return message.say('sem dados :/');

    const embed = new Discord.RichEmbed()
        .setTitle(`Última mensagem de ${usuário.username}:`)
        .setDescription('`' + usersOffDB.get(usuário.id).value().lastMessageContent + '`')
        .setThumbnail(`${usuário.avatarURL}`)
        .addField('Enviado em:', `${client.channels.find(a => a.id === usersOffDB.get(usuário.id).value().lastMessageChannelID)}`, true)
        .setTimestamp(momento.toISOString())
        .setFooter('Mensagem enviada: ', `${message.author.avatarURL}`);

    await message.say(embed);
    message.delete()

  }
};