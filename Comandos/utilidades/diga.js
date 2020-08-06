const { Command } = require('../../CommandoV12/src/index.js');

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
          key: 'texto',
          prompt: 'falar oq? cabeção',
          type: 'string',
				},
			],
    });
  }

  run(message, { mensagem }) {
    const banidos = ['698560208309452810', '723218141945266177', 'daddy', 'felipe', 'fellipe', 'felippe'];

    banidos.forEach(word => {
      if (message.contet.toLowerCase().includes(word)) {
        if (message.deletable) message.delete({ timeout: 100 });
        message.reply('não diria isso nem se me pagassem...')
      }
    });

    if (message.channel.type === 'dm') {
      message.say(mensagem);
    } else {
      if (message.deletable) message.delete({ timeout: 100 });
      message.say(mensagem);
    }
  }
};