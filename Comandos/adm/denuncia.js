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
    const canal = {
      type: "text",
      parent: "728074741792899123",
      permissionOverwrites: {
        allow: ['READ_MESSAGES', 'SEND_MESSAGES', 'ATACH_FILES'],
        id: `${message.author}`,
      }
    }
    const menção = `${denunciado.username}#${denunciado.discriminator}`
    
    await message.guild.createChannel(menção, [canal], "canal de denuncia");
    message.say(testerrrr);
  }
};