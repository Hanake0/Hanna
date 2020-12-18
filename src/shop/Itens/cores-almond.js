import base from '../base.js';

export default class AlmondColorLoja extends base {
	constructor(client) {
		super(client, {
			nome: 'Amêndoa',
			icon: 'https://twemoji.maxcdn.com/2/72x72/1f33a.png',
			color: '#ffebcd',
			defValue: 2000,
			category: 'cores',
			type: 'colors',
			position: 0,
			description: 'Poderá usar a cor <@&740952074069606520> no servidor,\n através do comando `hcor`.',
			temporary: true,
			emoji: '🌺',
		});
	}

	async buy(user, tempo) {
		let expiringTime;
		const cor = this.client.data.colors.hasColor(user, this.nome);

		if(cor) expiringTime = cor.expiringTime + (86400000 * tempo);
		else expiringTime = Date.now() + (86400000 * tempo);

		await this.client.firestore.setupItem(user.id, 'colors', {
			_type: 'AlmondColor',
			_path: '../Inventário/Items/Colors/almond.js',
			_userID: user.id,
			expiringTime: expiringTime,
		}, false, true);
	}
}