const { Command } = require('../../CommandoV12/src/index.js');

module.exports = class AnunciarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'anunciar',
			aliases: ['digacanal', 'repita'],
			group: 'utilidades',
			memberName: 'anunciar',
			guildOnly: true,
			clientPermissions: ['MANAGE_MESSAGES'],
			description: 'Responde com a mensagem designada no canal designado e apaga a mensagem original.',
			args: [
			  {
			    key: 'canal',
			    prompt: 'em que canal você quer que o bot fale?',
			    type: 'channel',
			    default: '',
			  },
				{
					key: 'mensagem',
					prompt: 'O que você quer que o bot diga?',
					type: 'string',
				},
			],
			argsPromptLimit: 2,
		});
	}

	async run(message, { canal, mensagem }) {
	  if (message.guild.me.permissionsIn(canal).has("SEND_MESSAGES")) {
	    await message.delete(5);
	    canal.send(mensagem);
	  } else {
	    message.say('Desculpe, mas eu não tenho permissão para enviar mensagens nesse canal')
	  }
	}
};