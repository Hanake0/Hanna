import base from '../base.js';

export default class BrownColor extends base {
  constructor(client, infos) {
    super(client, {
      nome: 'Marrom',
      icon: 'https://twemoji.maxcdn.com/2/72x72/1f43b.png',
      color: '#923004',
			defValue: 3000,
			category: 'cores',
      type: 'colors',
      position: 3,
      description: 'Poderá usar a cor <@&740950979381559406> no servidor,\n através do comando `hcor`.',
      temporary: true,
      emoji: '🐻',
			emojis: ['782745531352743936', '782771102102847528'],
    });
  }

  buy() {

  }
}