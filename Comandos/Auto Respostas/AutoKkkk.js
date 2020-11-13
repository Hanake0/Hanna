import { Command } from '../../CommandoV12/src/index.js';

export default class AutoKkkkk extends Command {
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

  async run(message) {
    const reacts = ['760878648919588885', '760882289440849971'];
    const número = Math.floor(Math.random() * reacts.length);
    if(Math.floor(Math.random() * 10) > 5) message.react(reacts[número]);
  }
};