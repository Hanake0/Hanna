import { Command } from '../../CommandoV12/src/index.js';
import emojis from '../../assets/JSON/emojis.js';

export default class SetCoinsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'set',
			group: 'adm',
			memberName: 'set-property',
			description: 'Muda a quantidade de alguma coisa na carteira de um usuário',
			serverOnly: true,
			ownerOnly: true,
			throttling: {
				usages: 2,
				duration: 10,
			},
			args: [
				{
					key: 'moeda',
					prompt: 'Atualizar o quê ?',
					type: 'string',
					oneOf: ['coins', 'gems', 'invites'],
				},
				{
					key: 'valor',
					prompt: 'Atualizar para quanto ?',
					type: 'string',
				},
				{
					key: 'usuário',
					prompt: 'de quem?',
					type: 'user',
					default: msg => msg.author,
					bot: false,
				},
			],
		});
	}

	async run(msg, { moeda, valor, usuário }) {

		const uDB = await this.client.sqlite.resolveUser(usuário.id);

		await uDB[moeda](valor);
		msg.embed({ color: '#24960e', description: `${emojis.success} | ${moeda} de ${usuário} atualizadas com sucesso para \`\`${await uDB[moeda]()}\`\`!` });

		msg.client.registry.commands.get('carteira').run(msg, { usuário });
	}
}
