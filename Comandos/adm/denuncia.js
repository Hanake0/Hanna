const { Command } = require('../../commando discord.js-v12/src/index.js');

module.exports = class DenunciarCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'denunciar',
      aliases: ['denuncia', 'punir'],
      group: 'adm',
      memberName: 'denunciar',
      clientPermissions: ['ADMINISTRATOR'],
      description: 'Abre um inquérito sobre determinado usuário em um canal privado onde mais informações podem ser providas.',
      args: [
        {
          key: 'denunciado',
          prompt: 'Quem você gostaria de denunciar?',
          type: 'user',
				},
			],
      argsPromptLimit: 0,
    });
  }
  
  async run(message, { denunciado }) {
    const mencao = `${denunciado.username}  ${denunciado.id}`
    const canal = {
      name: mencao,
      type: "text",
      parent: '728074741792899123',
      permissionOverwrites: [{
        id: message.author.id,
        allow: ['READ_MESSAGES', 'SEND_MESSAGES'],
      }],
    }
    
    const canalDenuncia = await message.guild.createChannel(mencao, canal, "canal de denuncia");
    canalDenuncia.send(`Canal de denúncia criado com sucesso.\nA denúncia foi feita contra o usuário: ${denunciado.username}#${denunciado.discriminator}\nID: ${denunciado.id}\nQuem denunciou foi: ${message.author.username}#${message.author.discriminator}\nID: ${message.author.id}`);
    canalDenuncia.send('Este canal é privado e apenas os membros da staff podem visualizar este canal além de você.\nPrints e a sua opinião sobre a ação do membro denunciado são bem vindos.')
  }
};