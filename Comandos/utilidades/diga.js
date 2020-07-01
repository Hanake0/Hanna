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
			argsPromptLimit: 0,
			pattern: [`canal mensagem`, `mensagem`],
		});
	}

	async run(message, { canal, mensagem }) {
	  if (canal === '') {
  	  await message.delete(5);
	  	message.say(mensagem);
	  }
	  else {
	    await message.delete(5);
	    canal.say(mensagem);
	  }
	}
};