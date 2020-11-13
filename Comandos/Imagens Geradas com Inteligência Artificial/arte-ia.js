import { Command } from '../../CommandoV12/src/index.js';
import request from 'node-superfetch';
import Discord from 'discord.js';

export default class ArteIaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'arte-ia',
			aliases: ['esta-arte-nao-existe', 'this-artwork-does-not-exist', 'arte', 'art', 'ia-arte', 'arte-ai'],
			group: 'imgs-ia',
			memberName: 'arte-ia',
			description: 'Envia uma obra de arte criada artificialmente(Inteligência Artificial).',
			clientPermissions: ['ATTACH_FILES'],
			blackListed: ['698678688153206915'],
			credit: [
				{
					name: 'This Artwork Does Not Exist',
					url: 'https://thisartworkdoesnotexist.com/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const { body } = await request.get('https://thisartworkdoesnotexist.com/');
        
        const img = new Discord.MessageAttachment(body, 'arte-bugada.jpg');

        msg.channel.send({ files: [img], embed: {title: 'Esta obra de arte não existe.', image: { url: 'attachment://arte-bugada.jpg' } } });

	}
};
