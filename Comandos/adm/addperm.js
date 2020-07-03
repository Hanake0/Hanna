const { Command } = require('../../commando discord.js-v12/src/index.js');

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
      message.channel.permissionOverwrites.get(usuário.id).delete();
      return message.say(`Todas as permissões específicas de ${usuário.username} foram removidas.`);
    };
    const array = perm.split(/ +/);
    const perms = new Permissions(array);
    
    message.say(`${permsF.SEND_MESSAGES}`);
    if (addRem === 'add') {
      message.channel.overwritePermissions(usuário.id, perms);
      message.say(`Permissões adicionadas com sucesso para o usuário ${usuário.username}`);
    } else {
      message.channel.overwritePermissions(usuário.id, perms);
      message.say(`Permissões removidas com sucesso para o usuário ${usuário.username}`);
    }
  }
};