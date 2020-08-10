const { Command } = require('../../CommandoV12/src/index.js');
const { stripMentions, stripInvites } = require('../../Assets/util/util')

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

  run(message, { texto }) {
    const banidos = ['@everyone', 'daddy'];
    var a = 0
    texto = stripInvites(texto);
    texto = stripMentions(texto);

  //  banidos.forEach(word => {
  //    if (message.content.toLowerCase().includes(word) && a !== 1) {
  //      a = 1;
  //      if (message.deletable) message.delete({ timeout: 100 });
  //      message.reply('não diria isso nem se me pagassem...')
  //    }
  //  });
  //  if (a !== 1) {
      if (message.channel.type === 'dm') {
        message.say(texto);
      } else {
        if (message.deletable) message.delete({ timeout: 100 });
        message.say(texto);
      }
  //  }
  }
};