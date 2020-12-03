import { Command } from '../../CommandoV12/src/index.js';
import emojis from '../../Assets/JSON/emojis.js';

export default class SetInvitesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'set-invites',
			group: 'adm',
			memberName: 'set-invites',
			description: 'Muda a quantidade de invites nas infos de um usuário',
			serverOnly: true,
      ownerOnly: true,
			throttling: {
				usages: 2,
				duration: 10
      },
      args: [
        {
          key: 'valor',
          prompt: 'Atualizar valor para quanto ?',
          type: 'integer'
        },
				{
					key: 'usuário',
					prompt: 'de quem?',
					type: 'user',
					default: msg => msg.author,
					bot: false
        }
			],
		});
	}

	async run(msg, { usuário, valor }) {

    const uDB = msg.client.data.users.cache.get(usuário.id);
    
    uDB.invites = valor;
    msg.embed({ color: '#24960e', description: `${emojis.success} | Invites de ${usuário} atualizados com sucesso para \`\`${valor}\`\`!`});
		}
};
