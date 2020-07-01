const { Command } = require('../../commando discord.js-v12/src/index.js');

module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'diga',
			aliases: ['say', 'echo'],
			group: 'utilidades',
			memberName: 'diga',
			clientPermissions: ['MANAGE_MESSAGES'],
			description: 'Responde com a mensagem designada e apaga a mensagem original.',
			args: [
			  {
			    key: 'canal',
			    type: 'channel',
			    default: '',
			  },
				{
					key: 'mensagem',
					prompt: 'O que você quer que o bot diga?',
					type: 'string',
				},
			],
		});
	}

	async run(message, { canal, mensagem }) {
	  if (canal === '') {
  	  await message.delete(5);
	  	message.say(mensagem);
	  }
	  else {
	    await message.delete(5);
	    canal.send(mensagem);
	  }
	}
};