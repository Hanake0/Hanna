const { Command } = require('../../CommandoV12/src/index.js');
const Discord = require('discord.js');

module.exports = class DenunciarCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'denunciar',
      aliases: ['denuncia'],
      group: 'interação',
      memberName: 'denunciar',
      clientPermissions: ['MANAGE_CHANNELS'],
      guildOnly: true,
      description: 'Abre um inquérito sobre determinado usuário em um canal privado onde mais informações podem ser providas.',
      details: 'Para evitar problemas pessoais, o usuário que vai ser denunciado não precisa ser marcado, basta inserir o nome dele, ou se o nome conter caracteres especiais e você não conseguir copiar, basta utilizar o ID do usuário.\nSe estiver com problemas para conseguir um ID, peça para algum membro da staff.',
      args: [
        {
          key: 'usuário',
          prompt: 'Quem você gostaria de denunciar?',
          type: 'user',
        },
        {
          key: 'motivo',
          prompt: 'Porquê denunciar esse usuário?',
          type: 'string',
          default: 'não específicado'
        }
			],
    });
  }
  
  async run(message, { usuário, motivo }) {
    const mencao = `denuncia ${usuário.username} ${usuário.id}`
    const canal = {
      type: "text",
      parent: '728074741792899123',
      permissionOverwrites: [{
          id: message.author.id,
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
        },
        {
          id: message.guild.roles.everyone.id,
          deny: ['VIEW_CHANNEL'],
        }],
    }
    const embed = new Discord.MessageEmbed()
      .setColor('#c22727')
      .setTitle('Denúncia:')
      .setAuthor(message.author.username, message.author.avatarURL())
      .setThumbnail(usuário.avatarURL)
      .addField('Autor:', message.author, true)
      .addField('Id', `\`${message.author.id}\``, true)
      .addField('Motivo:', motivo)
      .addField('\u200b', '\u200b')
      .addField('Username:', usuário, true)
      .addField('Id:', `\`${usuário.id}\``, true)
      .setTimestamp()
    	.setFooter('Enviado:', message.client.user.avatarURL());
    const embed2 = new Discord.MessageEmbed()
      .setColor('#24960e')
      .setDescription('Este canal é privado e apenas os membros da staff podem visualizar este canal além de você.\n\nPrints e a sua opinião sobre a ação do membro denunciado são bem vindos.\n(Marque a Staff se necessário)');

    const canalDenuncia = await message.guild.channels.create(mencao, canal, "canal de denuncia");
    message.delete()
    await canalDenuncia.send(embed);
    await canalDenuncia.send(embed2);
    canalDenuncia.send(`Canal de denúncia criado com sucesso ${message.author}`);
  }
};