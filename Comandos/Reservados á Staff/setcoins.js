import { Command } from '../../CommandoV12/src/index.js';
import Discord from 'discord.js';
import emojis from '../../Assets/JSON/emojis.js';

export default class SetCoinsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'set-coins',
			group: 'adm',
			memberName: 'set-coins',
			description: 'Muda a quantidade de coins na carteira de um usuário',
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
    
    uDB.wallet.coins = valor;
    msg.embed({ color: '#24960e', description: `${emojis.success} | Coins de ${usuário} atualizadas com sucesso para \`\`${valor}\`\`!`});

		msg.client.registry.commands.get('carteira').run(msg, { usuário });
		}
};
