import { Command } from '../../CommandoV12/src/index.js';

export default class AutoBase extends Command {
  constructor(client) {
    super(client, {
      name: 'autobase',
      group: 'autorespostas',
      memberName: 'base',
      description: 'Responde com: texto',
      patterns: [/coisamuitoespecificadeteste/i],
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
    message.say(`> ${message.content}\n${message.author} texto`);
  }
};