import { Command } from '../../CommandoV12/src/index.js';

export default  class TesteCommand extends Command {
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
    const { usersOffDB, usersOn } = require('../../index');
    usersOffDB.get(message.author.id).update('mensagens', n => n+1).write();
    usersOn.update(usersOffDB.getState());
    message.say(`${usersOffDB.get(message.author.id).value().money}`)
  }
};