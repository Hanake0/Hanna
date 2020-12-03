import base from '../../base.js';

export default class BabyPinkColor extends base {
  constructor(client, infos) {
    super(client, {
      nome: 'Rosa Bebê',
      icon: 'https://discord.com/assets/38939362014f3205d178580c43cbd13a.svg',
      color: '#ffa3f7',
      defValue: 2000,
      type: 'colors',
      position: 1,
      description: 'Poderá usar a cor <@&740951943119372408> no servidor,\n através do comando `hcor`.',
      temporary: true,
      emoji: '🩰',
			emojis: ['782745531352743936', '782771102102847528'],
    });
  }

  buy() {

  }
}