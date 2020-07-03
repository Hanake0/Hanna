const { Command } = require('../../commando discord.js-v12/src/index.js');

module.exports = class AddPermCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'perm',
      aliases: ['permissao', 'regras'],
      group: 'adm',
      memberName: 'perm',
      clientPermissions: ['MANAGE_CHANNEL'],
      userPermissions: ['MANAGE_CHANNEL'],
      guildOnly: true,
      description: 'Adiciona a(s) permiss(ão/ões) para o usuário no canal.',
      args: [
        {
          key: 'addRem',
          prompt: 'Você gostaria de adicionar ou remover permissões?(add/remover)',
          type: 'string',
          oneOf: ['add', 'remover'],
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
    
    if (addRem === 'remover' && perm === '') {
      message.channel.permissionOverwrites.get(message.author.id).delete();
    };
    
    const permsT = {};
    for (const p of perm.split(/ +/)) {
      Object.defineProperty(perms, p, {
        value: true,
        writable: true,
        enumerable: true,
        configurable: true
      });
    };
    const permsF = {};
    for (const p of perm.split(/ +/)) {
      Object.defineProperty(perms, p, {
        value: false,
        writable: true,
        enumerable: true,
        configurable: true
      });
    };
    for (const p of perms) {
      if (addRem === 'add') {
        message.channel.permissionOverwrites(usuário.id, permsT);
      } else {
        message.channel.permissionOverwrites(usuário.id, permsF);
      }
    }
  }
};