const { Command } = require('../../CommandoV12/src/index.js');
const Discord = require('discord.js');

module.exports = class WaifuIaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'waifu-ia',
			aliases: ['esta-waifu-nao-existe', 'this-waifu-does-not-exist', 'waifu', 'ia-waifu', 'waifu-ai'],
			group: 'imgs-ia',
			memberName: 'waifu-ia',
			description: 'Envia uma Waifu criada artificialmente(Inteligência Artificial).',
			clientPermissions: ['ATTACH_FILES'],
			blackListed: ['698678688153206915'],
			credit: [
				{
					name: 'This Waifu Does Not Exist',
					url: 'https://www.thiswaifudoesnotexist.net/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const num = Math.floor(Math.random() * 100000);

        msg.channel.send({ embed: {title: `Waifu criada por IA #${num}`, image: { url: `https://www.thiswaifudoesnotexist.net/example-${num}.jpg` } } });

	}
};
