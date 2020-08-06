const { Command } = require('../../CommandoV12/src/index.js');

module.exports = class AutoGay extends Command {
  constructor(client) {
    super(client, {
      name: 'autogay',
      group: 'autorespostas',
      memberName: 'gay',
      description: 'Responde com: tu que é, tu que deixa',
      patterns: [/gay/i, /gays/i],
      hidden: true,
      defaultHandling: false,
      throttling: {
				usages: 2,
				duration: 10
			}
    });
}

  async run(message) {
    message.say('tu que é, tu que deixa');
  }
};