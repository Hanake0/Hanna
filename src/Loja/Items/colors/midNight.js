import base from '../../base.js';

export default class MidNightColor extends base {
  constructor(client, infos) {
    super(client, {
      nome: 'Meia Noite',
      icon: 'https://twemoji.maxcdn.com/2/72x72/1f319.png',
      color: '#4b0082',
      defValue: 3000,
      type: 'colors',
      position: 4,
      description: 'Poderá usar a cor <@&740951421792550992> no servidor,\n através do comando `hcor`.',
      temporary: true,
      emoji: '🌙',
			emojis: ['782745531352743936', '782771102102847528'],
    });
  }

  buy() {

  }
}