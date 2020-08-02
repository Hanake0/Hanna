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
    });
}

  async run(message, { mensagem }) {
    const reacts = ['721906600830304306', '737395344458907980'];
    const número = Math.floor(Math.random() * reacts.length);  
    message.react(reacts[número]);
  }
};