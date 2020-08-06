const { Command } = require('../../CommandoV12/src/index.js');

module.exports = class AutoBase extends Command {
  constructor(client) {
    super(client, {
      name: 'autobase',
      group: 'autorespostas',
      memberName: 'base',
      description: 'Responde com: texto',
      patterns: [/coisamuitoespecificadeteste/i],
      hidden: true,
      defaultHandling: false,
    });
}

  async run(message) {
    message.say(`> ${message.content}\n${message.author} texto`);
  }
};