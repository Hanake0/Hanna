import base from '../base.js';

export default class LimeColor extends base {
  constructor(client, infos) {
    super(client, {
      nome: 'Lima',
      icon: 'https://twemoji.maxcdn.com/2/72x72/1f438.png',
      color: '#0fff00',
			defValue: 3000,
			category: 'cores',
      type: 'colors',
      position: 5,
      description: 'Poderá usar a cor <@&740950048518701086> no servidor,\n através do comando `hcor`.',
      temporary: true,
      emoji: '🐸',
			emojis: ['782745531352743936', '782771102102847528'],
    });
  }

  buy() {

  }
}