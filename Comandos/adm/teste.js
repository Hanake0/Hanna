const { Command } = require('../../commando discord.js-v12/src/index.js');
//const lowdb = require('lowdb');

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
    const { usersOffDB } = require('../../index');
    message.channel.say(`${usersOffDB.get(message.author.id).value().money}`)
  }
};