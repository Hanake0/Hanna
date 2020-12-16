export class InventoryItem {
	constructor(client, infos) {

		Object.defineProperty(this, 'client', { value: client });

		this._userID = infos._userID;

		this.nome = infos.nome;

		this.description = infos.description;

	}
}