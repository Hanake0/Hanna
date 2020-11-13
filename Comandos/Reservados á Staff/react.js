import { Command } from '../../CommandoV12/src/index.js';
import emojis from '../../Assets/JSON/emojis.js';

export default class ReactCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'react',
			group: 'adm',
			memberName: 'react-message',
			description: 'Reage a uma mensagem',
			serverOnly: true,
      ownerOnly: true,
			throttling: {
				usages: 2,
				duration: 10
      },
      args: [
        {
          key: 'mensagem',
          prompt: 'Que mensasgem quer que eu reaja ?',
          type: 'message'
        },
				{
					key: 'emoji',
					prompt: 'Que emoji quer que eu reaja ?',
					type: 'custom-emoji',
        }
			],
		});
	}

	async run(msg, { mensagem, emoji }) {

    try { 
			mensagem.react(emoji).then(() => 
			msg.react(emojis.success.slice(10, -1)));
		} catch(err) {
			msg.embed({color: emojis.failC, description: `${emojis.fail} | Ocorreu um erro ao tentar reagir \`${err.name}: ${err.message}\``});
		}
	}
};
