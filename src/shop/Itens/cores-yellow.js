import base from '../base.js';

export default class YellowColor extends base {
  constructor(client, infos) {
    super(client, {
      nome: 'Amarelo',
      icon: 'https://twemoji.maxcdn.com/2/72x72/2b50.png',
      color: '#fdff00',
			defValue: 5000,
			category: 'cores',
      type: 'colors',
      position: 7,
      description: 'Poderá usar a cor <@&740950888960753805> no servidor,\n através do comando `hcor`.',
      temporary: true,
      emoji: '⭐',
			emojis: ['782745531352743936', '782771102102847528'],
    });
  }

  buy() {

  }
}