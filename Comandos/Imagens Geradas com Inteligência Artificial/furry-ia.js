import { Command } from '../../CommandoV12/src/index.js';

export default class FurryIaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'furry-ia',
			aliases: ['este-furry-nao-existe', 'this-fursona-does-not-exist', 'furry', 'ia-furry', 'furry-ai'],
			group: 'imgs-ia',
			memberName: 'furry-ia',
			description: 'Envia um Furry criado artificialmente(Inteligência Artificial).',
			clientPermissions: ['ATTACH_FILES'],
			blackListed: ['698678688153206915'],
			credit: [
				{
					name: 'This Fursona Does Not Exist',
					url: 'https://thisfursonadoesnotexist.com/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const num = Math.floor(Math.random() * 100000);

        msg.channel.send({ embed: {title: `Furry criada por IA #${num}`, image: { url: `https://thisfursonadoesnotexist.com/v2/jpgs/seed${num.toString().padStart(5, '0')}.jpg` } } });

	}
};
