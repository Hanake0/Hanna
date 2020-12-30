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
		const cor = await this.client.inventory.getItem(user.id, 'almond');

		console.log(cor);
		const expiringTime = (cor ? await cor.expiringtime() : Date.now()) + (86400000 * tempo);

		await this.client.inventory.addItem(user.id, 'almond', { expiringtime: expiringTime })
			.then(res => { if(res === false) throw new Error('Algo deu errado...');});
	}
}