const { Command } = require('../../CommandoV12/src/index.js');
const request = require('node-superfetch');
const Discord = require('discord.js');

module.exports = class GatoIaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gato-ia',
			aliases: ['este-gato-nao-existe', 'this-cat-does-not-exist', 'gato', 'ia-gato', 'gato-ai'],
			group: 'imgs-ia',
			memberName: 'gato-ia',
			description: 'Envia um gato criado artificialmente(Inteligência Artificial).',
			clientPermissions: ['ATTACH_FILES'],
			blackListed: ['698678688153206915'],
			credit: [
				{
					name: 'This Cat Does Not Exist',
					url: 'https://thiscatdoesnotexist.com/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const { body } = await request.get('https://thiscatdoesnotexist.com/');
        
        const img = new Discord.MessageAttachment(body, 'gato-bugado.jpg');

        msg.channel.send({ files: [img], embed: {title: 'Este gato não existe.', image: { url: 'attachment://gato-bugado.jpg' } } });

	}
};
