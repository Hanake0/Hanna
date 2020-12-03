import base from '../../base.js';

export default class MintColor extends base {
  constructor(client, infos) {
    super(client, {
      nome: 'Menta',
      icon: 'https://twemoji.maxcdn.com/2/72x72/1f33f.png',
      color: '#2ECC71',
      defValue: 2000,
      type: 'colors',
      position: 2,
      description: 'Poderá usar a cor <@&740951321686966374> no servidor,\n através do comando `hcor`.',
      temporary: true,
      emoji: '🌿',
			emojis: ['782745531352743936', '782771102102847528'],
    });
  }

  buy() {

  }
}