const { Command } = require('../../commando discord.js-v12/src/index.js');

module.exports = class TesteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'teste',
      aliases: ['test', 'placeholder', 'place-holder'],
      group: 'adm',
      memberName: 'teste',
      clientPermissions: ['ADMINISTRATOR'],
      userPermissions: ['ADMINISTRATOR'],
      ownerOnly: true,
      description: 'placeholder de teste',
      args: [
        {
          key: 'arg',
          prompt: 'aaaaa?',
          type: 'string',
        },
			],
    });
  }

  async run(message, { arg }) {
    const db = require('../../index.js');
    db.collection('teste').doc(message.channel.guild.id).set({
      'ID': message.channel.guild.id,
      'canal': message.channel.name
    });
    message.channel.say('aaa');
  }
};