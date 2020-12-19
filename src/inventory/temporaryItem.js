import { InventoryItem } from './base.js';

export class TemporaryItem extends InventoryItem {
	constructor(client, infos) {
		super(client, infos);

		this.expiringTime = infos.expiringtime;
	}

	get remainingTime() {
		return (this.expiringTime - Date.now());
	}

	async expiringtime(num = undefined) {
		if(!num) return await this.changeProperty('expiringtime', num);
		await this.changeProperty('expiringtime', num);
		await this.client.firestore.setTimeout(this);
	}

	timeout(num = undefined) {
		return this.changeProperty('timeout', num);
	}

	use() {
		if(this.usable) {
			throw new Error('Esse item não tem método de uso!');
		} else return false;
	}

	expire() {
		throw new Error('Esse item não tem método de expiração!');
	}

	remove(set) {
		this.removeFromCache(set);
		this.removeFromInventory();
	}

}