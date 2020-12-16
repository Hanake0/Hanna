import { Command } from '../../CommandoV12/src/index.js';

export default class UpdatedbCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'updatedb',
			aliases: ['update_db', 'update-db', 'sincronizardb'],
			group: 'adm',
			memberName: 'sincronizardb',
			clientPermissions: ['ADMINISTRATOR'],
			userPermissions: ['ADMINISTRATOR'],
			ownerOnly: true,
			description: 'Sincroniza o banco de dados no Firebase'
		});
	}

	async run(message) {
		await message.channel.send('aaaaaaaaaaaaaaaaaaaaa');
	}
}