import { Command } from '../../CommandoV12/src/index.js';
import { stripMentions, stripInvites } from '../../Assets/util/util.js';

export default class DigaCommand extends Command {
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


		if (!message.client.isOwner(message.author)) {
			texto = stripInvites(texto);
			texto = stripMentions(texto);
		}

    if (message.channel.type === 'dm') {
      message.say(texto);
    } else {
      if (message.deletable) message.delete({ timeout: 100 });
      message.say(texto);
    }
  }
};