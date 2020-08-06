const { Command } = require('../../CommandoV12/src/index.js');

module.exports = class AutoBase extends Command {
  constructor(client) {
    super(client, {
      name: 'autokkkk',
      group: 'autorespostas',
      memberName: 'kkkk',
      description: 'Responde com: texto',
      patterns: [/kkkk/i],
      hidden: true,
      defaultHandling: false,
      throttling: {
				usages: 1,
        duration: 10,
        respond: false
			}
    });
}

  async run(message) {
    const reacts = ['721906600830304306', '737395344458907980'];
    const número = Math.floor(Math.random() * reacts.length);  
    message.react(reacts[número]);
  }
};