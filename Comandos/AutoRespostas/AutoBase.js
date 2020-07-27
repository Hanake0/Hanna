const { Command } = require('../../commando discord.js-v12/src/index.js');

module.exports = class AutoBase extends Command {
  constructor(client) {
    super(client, {
      name: 'base',
      group: 'autorespostas',
      memberName: 'base',
      description: 'Responde com: texto',
      patterns: [/coisamuitoespecificadetexte/i],
      hidden: true,
      defaultHandling: false,
    });
}

  async run(message, { mensagem }) {
    message.say(`> ${message.content}\n${message.author} texto`);
  }
};