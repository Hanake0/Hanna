const { Command } = require('../../commando discord.js-v12/src/index.js');

module.exports = class AutoGay extends Command {
  constructor(client) {
    super(client, {
      name: 'gay',
      group: 'autorespostas',
      memberName: 'gay',
      description: 'Responde com: tu que é, tu que deixa',
      patterns: [/gay/i, /gays/i],
      hidden: true,
      defaultHandling: false,
    });
}

  async run(message, { mensagem }) {
    message.say('tu que é, tu que deixa');
  }
};