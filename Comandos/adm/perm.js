const { Command } = require('../../CommandoV12/src/index.js');

module.exports = class AddPermCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'perm',
      aliases: ['permissao', 'regras'],
      group: 'adm',
      memberName: 'perm',
      clientPermissions: ['MANAGE_CHANNELS'],
      userPermissions: ['MANAGE_CHANNELS'],
      guildOnly: true,
      ownerOnly: true,
      description: 'Adiciona a(s) permiss(ão/ões) para o usuário no canal.',
      args: [
        {
          key: 'addRem',
          prompt: 'Você gostaria de adicionar ou remover permissões?(add/remover)',
          type: 'string',
          oneOf: ['add', 'remover', 'remove', 'rem'],
        },
        {
          key: 'usuário',
          prompt: 'Que usuário você gostaria que as permissões fossem alteradas?',
          type: 'user',
				},
        {
          key: 'perm',
          prompt: 'Qua(l/is) permiss(ão/ões) você gostaria de add/remover ?',
          type: 'string',
          default: '',
				}
			],
    });
  }

  async run(message, { addRem, usuário, perm }) {
    const remove = ['remover', 'remove', 'rem'];
    if (addRem in remove && perm === '') {
      message.channel.permissionOverwrites.get(usuário.id).delete();
    return message.say(`Todas as permissões específicas de ${usuário.username} foram removidas.`);
    }

    const permsT = {};
    for (const p of perm.toUpperCase().split(/ +/)) {
      Object.defineProperty(permsT, p, {
        value: true,
        writable: true,
        enumerable: true,
        configurable: true
      });
    };
    const permsF = {};
    for (const p of perm.toUpperCase().split(/ +/)) {
      Object.defineProperty(permsF, p, {
        value: false,
        writable: true,
        enumerable: true,
        configurable: true
      });
    };
    if (addRem === 'add') {
      try {
        message.channel.overwritePermissions(usuário.id, permsT).then(() =>
          message.say(`Permissões adicionadas com sucesso para o usuário ${usuário.username}`));
      } catch(err) { message.say(`hmmm, acho que você esqueceu de algo: ${err.name}: ${err.message}`) }
    } else {
      try {
        message.channel.overwritePermissions(usuário.id, permsF).then(() =>
          message.say(`Permissões removidas com sucesso para o usuário ${usuário.username}`));
      } catch(err) { message.say(`oopsie, algo deu errado: ${err.name}: ${err.message}`) }
    }
  }
};