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
    if (usuário.lastMessage == null) return message.say('sem dados :/');
    const embed = new Discord.RichEmbed()
        .setTitle(`Última mensagem de ${usuário.username}:`)
        .setDescription('`' + usuário.lastMessage.content + '`')
        .setThumbnail(`${usuário.avatarURL}`)
        .addField('Enviado em:', `${usuário.lastMessage.channel}`, true)
        .setTimestamp(usuário.lastMessage.createdTimestamp)
        .setFooter('Mensagem enviada:', `${message.author.avatarURL}`);
    if (usuário.lastMessage.deleted) {
        embed.addField('Apagada?', 'sim', true);
    };
    await message.say(embed);
    message.delete()



  }
};