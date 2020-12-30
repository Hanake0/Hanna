import base from '../base.js';

export default class BabyPinkColorLoja extends base {
	constructor(client) {
		super(client, {
			nome: 'Rosa Bebê',
			icon: 'https://discord.com/assets/38939362014f3205d178580c43cbd13a.svg',
			color: '#ffa3f7',
			defValue: 2000,
			category: 'cores',
			type: 'colors',
			position: 1,
			description: 'Poderá usar a cor <@&740951943119372408> no servidor,\n através do comando `hcor`.',
			temporary: true,
			emoji: '🩰',
			emojis: ['782745531352743936', '782771102102847528'],
		});
	}

	async buy(user, tempo) {
		let expiringTime;
		const cor = this.client.data.colors.hasColor(user, this.nome);

		if(cor) expiringTime = cor.expiringTime + (86400000 * tempo);
		else expiringTime = Date.now() + (86400000 * tempo);

		await this.client.firestore.setupItem(user.id, 'colors', {
			_type: 'BabyPinkColor',
			_path: '../Inventário/Items/Colors/babyPink.js',
			_userID: user.id,
			expiringTime: expiringTime,
		}, false, true);
	}
}