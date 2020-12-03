import base from '../../base.js';

export default class AlmondColor extends base {
  constructor(client, infos) {
    super(client, {
      nome: 'Amêndoa',
      icon: 'https://twemoji.maxcdn.com/2/72x72/1f33a.png',
      color: '#ffebcd',
      defValue: 2000,
      type: 'colors',
      position: 0,
      description: 'Poderá usar a cor <@&740952074069606520> no servidor,\n através do comando `hcor`.',
      temporary: true,
      emoji: '🌺',
			emojis: ['782745531352743936', '782771102102847528'],
    });
  }

  buy() {

  }
}