const { Command } = require('../../commando discord.js-v12/src/index.js');

module.exports = class DenunciarCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'denunciar',
      aliases: ['denuncia', 'punir'],
      group: 'Administrativos',
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
    await message.delete(5);
    message.say(denunciado.id);
  }
};