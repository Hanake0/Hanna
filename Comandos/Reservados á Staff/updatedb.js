const { Command } = require('../../CommandoV12/src/index.js');

module.exports = class UpdatedbCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'updatedb',
      aliases: ['update_db', 'update-db', 'sincronizardb'],
      group: 'adm',
      memberName: 'sincronizardb',
      clientPermissions: ['ADMINISTRATOR'],
      userPermissions: ['ADMINISTRATOR'],
      ownerOnly: true,
      description: 'Sincroniza o banco de dados no Firebase'
    });
  }

  async run(message) {
    const { usersOffDB, usersOn } = require('../../index');
    usersOn.update(usersOffDB.getState()).then(() => {
        message.say('Banco de dados atualizado com suscesso.')
    });
  }
};