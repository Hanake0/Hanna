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
    if (addRem in remove && !perm) {
      message.channel.permissionOverwrites.get(usuário.id).delete();
    return message.say(`Todas as permissões específicas de ${usuário.username} foram removidas.`);
    }

    const perms = {};
    for (const p of perm.toUpperCase().split(/ +/)) {
      Object.defineProperty(perms, p, {
        value: addRem === 'add' ? true : false,
      });
    };

    message.channel.overwritePermissions(usuário.id, perms).then(() => {
      message.say(`Permissões ${ addRem === 'add' ? 'adicionadas' : 'removidas'} com sucesso para o usuário ${usuário.username}`)
    }, err => {
      message.say(`hmmm, acho que você esqueceu de algo: ${err.name}: ${err.message}`)
    });
  }
};