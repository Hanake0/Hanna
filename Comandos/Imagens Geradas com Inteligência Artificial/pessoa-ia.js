import { Command } from '../../CommandoV12/src/index.js';
import request from 'node-superfetch';
import Discord from 'discord.js';

export default class PessoaIaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pessoa-ia',
			aliases: ['esta-pessoa-nao-existe', 'this-person-does-not-exist', 'pessoa', 'humano', 'humano-ia', 'ia-pessoa', 'pessoa-ai'],
			group: 'imgs-ia',
			memberName: 'pessoa-ia',
			description: 'Envia uma pessoa criada artificialmente(Inteligência Artificial).',
			clientPermissions: ['ATTACH_FILES'],
			blackListed: ['698678688153206915'],
			credit: [
				{
					name: 'This Person Does Not Exist',
					url: 'https://thispersondoesnotexist.com/image',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const { body } = await request.get('https://thispersondoesnotexist.com/image');
        
        const img = new Discord.MessageAttachment(body, 'pessoa-bugada.jpg');

        msg.channel.send({ files: [img], embed: {title: 'Esta pessoa não existe.', image: { url: 'attachment://pessoa-bugada.jpg' } } });

	}
};
