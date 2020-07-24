const { Command } = require('../../commando discord.js-v12/src/index.js');

module.exports = class DenunciarCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'denunciar',
      aliases: ['denuncia', 'suporte'],
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
			],
      argsPromptLimit: 0,
    });
  }
  
  async run(message, { usuário }) {
    const mencao = `${usuário.username}  ${usuário.id}`
    const canal = {
      name: mencao,
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
    
    const canalDenuncia = await message.guild.createChannel(mencao, canal, "canal de denuncia");
    message.delete()
    canalDenuncia.send(`Canal de denúncia criado com sucesso ${message.author}.\nA denúncia foi feita contra o usuário: ${usuário.username}#${usuário.discriminator}\nID: ${usuário.id}\nQuem denunciou foi: ${message.author.username}#${message.author.discriminator}\nID: ${message.author.id}`);
    canalDenuncia.send('Este canal é privado e apenas os membros da staff podem visualizar este canal além de você.\nPrints e a sua opinião sobre a ação do membro denunciado são bem vindos.')
  }
};