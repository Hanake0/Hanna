import base from '../base.js';

export default class RedColor extends base {
  constructor(client, infos) {
    super(client, {
      nome: 'Vermelho',
      icon: 'https://twemoji.maxcdn.com/2/72x72/1f426.png',
      color: '#ff0003',
			defValue: 5000,
			category: 'cores',
      type: 'colors',
      position: 6,
      description: 'Poderá usar a cor <@&740949818364395641> no servidor,\n através do comando `hcor`.',
      temporary: true,
      emoji: '🐦',
			emojis: ['782745531352743936', '782771102102847528'],
    });
  }

  buy() {

  }
}