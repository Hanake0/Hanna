export class InventoryItem {
	constructor(client, infos) {

		Object.defineProperty(this, 'client', { value: client });

		// ID do usuário (string)
		this._userID = infos._userID;

		// Valor guardado no db para id1
		this._id1;

		// Valor guardado no db para id1
		this._id2;

		// Nome do item (string)
		this.nome = infos.nome;

		// Quantos itens a pessoa possui (default: 1)
		this.quantity = infos.quantity;

		// Descrição do item (string)
		this.description = infos.description;

		// Outros nomes para o item (Array)
		this.aliases = infos.aliases;

		// Categoria do item (misc/cores/vips)
		this.category = infos.category;

		// Se o item tem ou não método de uso(Boolean)
		this.usable = infos.usable;
	}

	async changeProperty(property, num = undefined) {
		const row = await this.client.sqlite.get(`SELECT ${property} FROM itens WHERE id = ${this._userID} AND name = ${`'${this.nome}'`}`);
		const val = row[property];

		if(!num) return val;

		if(typeof num === 'string') {
			if(num.includes('val'))
				num.replace('val', val);

			num = Number(eval(num));
		}
		return await this.client.sqlite.updateItem(this._userID, this.nome, property, num);
	}

	id1(num = undefined) {
		return this.changeProperty('id1', num);
	}

	id2(num = undefined) {
		return this.changeProperty('id2', num);
	}
}