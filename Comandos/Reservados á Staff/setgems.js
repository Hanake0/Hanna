import { Command } from '../../CommandoV12/src/index.js';
import Discord from 'discord.js';
import emojis from '../../Assets/JSON/emojis.js';

export default class SetGemsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'set-gems',
			group: 'adm',
			memberName: 'set-gems',
			description: 'Muda a quantidade de gems na carteira de um usuário',
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
    
    uDB.wallet.gems = valor;
    msg.embed({ color: '#24960e', description: `${emojis.success} | Gems de ${usuário} atualizadas com sucesso para \`\`${valor}\`\`!`});

		msg.client.registry.commands.get('carteira').run(msg, { usuário });
		}
};
