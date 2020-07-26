const { Command } = require('../../commando discord.js-v12/src/index.js');
const Discord = require('discord.js');

module.exports = class DenunciarCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'denunciar',
      aliases: ['denuncia'],
      group: 'adm',
      memberName: 'denunciar',
      clientPermissions: ['ADMINISTRATOR'],
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
      argsPromptLimit: 0,
    });
  }
  
  async run(message, { usuário, motivo }) {
    const mencao = `${usuário.username}  ${usuário.id}`
    const canal = {
      name: `Denuncia ${mencao}`,
      type: "text",
      parent: '728074741792899123',
      permissionOverwrites: [{
          id: message.author.id,
          allow: ['READ_MESSAGES', 'SEND_MESSAGES'],
        },
        {
          id: message.guild.defaultRole.id,
          deny: ['READ_MESSAGES'],
        }],
    }
    const embed = new Discord.RichEmbed()
      .setColor('#c22727')
      .setTitle('Denúncia:')
      .setAuthor(message.author.username, message.author.avatarURL)
      .setThumbnail(usuário.avatarURL)
      .setField('Autor:', message.author, true)
      .setField('Id', `\`${message.author.id}\``, true)
      .addField('Motivo:', motivo)
      .addBlankField()
      .addField('Username:', usuário, true)
      .addField('Id:', `\`${usuário.id, true}\``)
      .setTimestamp()
    	.setFooter('Enviado:', message.client.user.avatarURL);
    const embed2 = new Discord.RichEmbed()
      .setColor('#24960e')
      .setDescription('Este canal é privado e apenas os membros da staff podem visualizar este canal além de você.')
      .addBlankField()
      .addField('', 'Prints e a sua opinião sobre a ação do membro denunciado são bem vindos.', false);

    const canalDenuncia = await message.guild.createChannel(mencao, canal, "canal de denuncia");
    message.delete()
    await canalDenuncia.send(embed);
    canalDenuncia.send(`Canal de denúncia criado com sucesso ${message.author}`);
    canalDenuncia.send(embed2);
  }
};