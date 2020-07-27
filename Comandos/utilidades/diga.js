const { Command } = require('../../commando discord.js-v12/src/index.js');

module.exports = class DigaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'diga',
      aliases: ['say', 'anonimo'],
      group: 'utilidades',
      memberName: 'diga',
      clientPermissions: ['MANAGE_MESSAGES'],
      description: 'Responde com a mensagem designada e apaga a mensagem original.',
      args: [
        {
          key: 'mensagem',
          prompt: 'O que você quer que o bot diga?',
          type: 'string',
				},
			],
      argsPromptLimit: 0,
    });
  }

  async run(message, { mensagem }) {
    if (message.channel.type === 'dm') {
      message.say(mensagem);
    } else {
      await message.delete({ timeout: 100 });
      message.say(mensagem);
    }
  }
};