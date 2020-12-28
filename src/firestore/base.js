import { hora } from '../util.js';
import { TemporaryItem } from '../inventory/temporaryItem.js';

export class FirestoreManager {
	constructor(client, db) {
		this.db = db;

		this.client = client;
	}

	init() {
		this.initUsers();
		this.initItens();
	}

	initUsers(interval = 900000) {
		// Baixa os dados e armazena no cache
		this.importUsers();

		// Configura updates a cada 15 min
		this.client.setInterval(this.exportUsers.bind(this), interval);
	}

	// Baixa os dados e armazena no cache
	async importUsers() {
		const docs = await this.db.collection('usuarios').get();
		docs.forEach(async snap => {
			const data = snap.data().data;
			for (const userData in data)
				for(const [key, value] of Object.entries(userData))
					await this.client.sqlite.importThing(key, value);
		});
	}

	// Exporta todos os usuários para o Firestore
	async exportUsers() {
		this.client.emit('firestoreDebug', hora(), 'Iniciando update de usuários...');
		try {
			const sqlite = this.client.sqlite;
			const { 'MAX (num)': size } = await sqlite.get('SELECT MAX (num) FROM users');
			const repeats = Math.ceil(size / 250);
			let now = 1;

			while(now <= repeats) {
				const users = [];

				const rows = await sqlite.all(`SELECT * FROM users WHERE num BETWEEN ${(now - 1) * 250} AND ${now * 250}`);
				for(const user of rows) {
					const wcUser = await sqlite.resolveUser(user.id);
					users.push = await wcUser.toFirestore();
				}

				this.client.emit('firestoreDebug', hora(), `Usuários de ${(now - 1) * 250} a ${(now * 250)} filtrados e convertidos`);
				this.client.emit('firestoreDebug', hora(), `Iniciado update do doc ${now}...`);
				await this.db.collection('usuarios').doc(`${now}`).set({ data: users });
				this.client.emit('firestoreDebug', hora(), `Update de doc ${now} concluído !`);
				now++;
			}
		} catch(err) {
			this.client.emit('firestoreDebug', hora(), `Erro durante update dos usuários ${err.name}: ${err.message}`);
			this.client.waifusClub.channels.cache.get('732710544330457161')
				.send(`${hora()}Erro durante update dos usuários: ${err}`);
		}
		this.client.emit('firestoreDebug', hora(), 'Fim do update de usuários.');
	}

	initItens(interval = 900000) {
		// Baixa os dados e armazena no cache
		this.importItens();

		// Configura updates a cada 15 min
		this.client.setInterval(this.exportItens.bind(this), interval);
	}

	// Baixa os dados e armazena no cache
	async importItens() {
		const docs = await this.db.collection('itens').get();
		docs.forEach(async snap => {
			const data = snap.data().data;
			for (const item in data) {
				await this.client.sqlite.importThing('itens', data);
				const itemClass = await this.client.inventoryManager.getItem(item.id, item.name);
				await this.setTimeout(itemClass);
			}
		});
	}

	// Exporta todos os itens temporários para o Firestore
	async exportItens() {
		this.client.emit('firestoreDebug', hora(), 'Iniciando update de itens temporários...');
		try {
			const sqlite = this.client.sqlite;
			const { 'MAX (num)': size } = await sqlite.get('SELECT MAX (num) FROM itens');
			const repeats = Math.ceil(size / 250);
			let now = 1;

			while(now <= repeats) {
				const itens = await sqlite.all(`SELECT * FROM itens WHERE num BETWEEN ${(now - 1) * 250} AND ${now * 250}`);

				this.client.emit('firestoreDebug', hora(), `Itens temporários de ${(now - 1) * 250} a ${(now * 250)} filtrados e convertidos`);
				this.client.emit('firestoreDebug', hora(), `Iniciado update do doc ${now}...`);
				await this.db.collection('expiring').doc(`${now}`).set({ data: itens });
				this.client.emit('firestoreDebug', hora(), `Update de doc ${now} concluído !`);
				now++;
			} while(now < repeats);
		} catch(err) {
			this.client.emit('firestoreDebug', hora(), `Erro durante update dos itens temporários ${err.name}: ${err.message}`);
			this.client.waifusClub.channels.cache.get('732710544330457161')
				.send(`${hora()}Erro durante update dos itens temporários: ${err}`);
		}
		this.client.emit('firestoreDebug', hora(), 'Fim do update de itens temporários.');
	}

	async setTimeout(item) {
		if(item instanceof TemporaryItem) {
			const expiringtime = await item.expiringtime();
			let timeout = await item.timeout();

			if(timeout)
				this.client.clearTimeout(timeout);

			const remTime = expiringtime - Date.now();
			if(remTime > 0 && remTime < 86400000) {
				timeout = this.client.setTimeout(item.expire.bind(item), remTime);
				const num = timeout[Symbol.toPrimitive]();
				await item.timeout(num);
			} else if(remTime <= 0)
				await item.expire();
		}
	}

	// Configura um item específico vindo do Firestore
	async setupItem(id, type, data, inventory = false, set = false) {
		const { default: ItemConstructor } = await import(data._path);
		const item = new ItemConstructor(this.client, data);

		// Configura o timeout se dentro de um tempo razoável
		if(item.remainingTime > 0 && item.remainingTime < 86400000)
			item.timeout = this.client.setTimeout(item.expire.bind(item), item.remainingTime);
		else if(item.remainingTime < 0) item.expire.bind(item);

		// Adiciona ao inventario se necessário
		if(inventory) this.client.data.users.resolveUser({ id: id }).inventory.temporary.push(item);

		// Adiciona ao cache
		const clientData = this.client.data[type].cache ? this.client.data[type].cache : this.client.data[type];
		if(set) {
			if(clientData.has(id)) clientData.get(id).add(item);
			else clientData.set(id, new Set([ item ]));
		} else clientData.set(id, item);
	}
}