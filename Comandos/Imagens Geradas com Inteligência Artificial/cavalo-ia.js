const { Command } = require('../../CommandoV12/src/index.js');
const request = require('node-superfetch');
const Discord = require('discord.js');

module.exports = class CavaloIaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cavalo-ia',
			aliases: ['este-cavalo-nao-existe', 'this-horse-does-not-exist', 'cavalo', 'ia-cavalo', 'cavalo-ai'],
			group: 'imgs-ia',
			memberName: 'cavalo-ia',
			description: 'Envia um cavalo criado artificialmente(Inteligência Artificial).',
			clientPermissions: ['ATTACH_FILES'],
			blackListed: ['698678688153206915'],
			credit: [
				{
					name: 'This Horse Does Not Exist',
					url: 'https://thishorsedoesnotexist.com/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const { body } = await request.get('https://thishorsedoesnotexist.com/');
        
        const img = new Discord.MessageAttachment(body, 'cavalo-bugado.jpg');

        msg.channel.send({ files: [img], embed: {title: 'Este cavalo não existe.', image: { url: 'attachment://cavalo-bugado.jpg' } } });

	}
};
