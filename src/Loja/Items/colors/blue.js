import base from '../../base.js';

export default class BlueColor extends base {
  constructor(client, infos) {
    super(client, {
      nome: 'Azul',
      icon: 'https://twemoji.maxcdn.com/2/72x72/1f30a.png',
      color: '#00b2ff',
      defValue: 5000,
      type: 'colors',
      position: 8,
      description: 'Poderá usar a cor <@&750763215289319464> no servidor,\n através do comando `hcor`.',
      temporary: true,
      emoji: '🌊',
			emojis: ['782745531352743936', '782771102102847528'],
    });
  }

  buy() {

  }
}