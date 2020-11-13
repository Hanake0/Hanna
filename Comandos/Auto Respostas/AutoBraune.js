import { Command } from '../../CommandoV12/src/index.js';

export default class AutoBraune extends Command {
  constructor(client) {
    super(client, {
      name: 'autobraune',
      group: 'autorespostas',
      memberName: 'braune',
      description: 'Responde com: @braune',
      patterns: [/^braune/i],
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
    message.say(`<@432014305488142346>`);
  }
};