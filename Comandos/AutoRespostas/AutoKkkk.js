const { Command } = require('../../commando discord.js-v12/src/index.js');

module.exports = class AutoBase extends Command {
  constructor(client) {
    super(client, {
      name: 'base',
      group: 'autorespostas',
      memberName: 'base',
      description: 'Responde com: texto',
      patterns: [/kkkk/i],
      hidden: true,
      defaultHandling: false,
    });
}

  async run(message, { mensagem }) {
    const reacts = ['721906600830304306', '737395344458907980'];
    const número = Math.floor(Math.random() * reacts.length() -1);  
    message.react(reacts[número]);
  }
};