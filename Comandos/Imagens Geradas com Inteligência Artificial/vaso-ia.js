import { Command } from '../../CommandoV12/src/index.js';

export default class VasoIaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'vaso-ia',
			aliases: ['este-vaso-nao-existe', 'this-vessel-does-not-exist', 'vaso', 'ia-vaso', 'vaso-ai'],
			group: 'imgs-ia',
			memberName: 'vaso-ia',
			description: 'Envia um vaso criada artificialmente(Inteligência Artificial).',
			clientPermissions: ['ATTACH_FILES'],
			blackListed: ['698678688153206915'],
			credit: [
				{
					name: 'This Vessel Does Not Exist',
					url: 'https://thisvesseldoesnotexist.com/#/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const num = Math.floor(Math.random() * 20000) + 1;

        msg.channel.send({ embed: {title: `Vaso criado por IA #${num}`, image: { url: `http://thisvesseldoesnotexist.s3-website-us-west-2.amazonaws.com/public/v2/fakes/${num.toString().padStart(7, '0')}.jpg` } } });

	}
};
