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
    const mencao = `${denunciado.username}  ${denunciado.discriminator}`
    const canal = {
      name: mencao,
      type: "text",
      parent: '728074741792899123',
      permissionOverwrites: ['READ_MESSAGES', 'SEND_MESSAGES', 'ATACH_FILES'],
      id: `${message.author.id}`,
    }
    
    await message.guild.createChannel(mencao, canal, "canal de denuncia");
    message.say(`Canal de denúncia criado com sucesso.\n${canal.name}`);
  }
};