import { hora } from '../util.js';
import { wcUser } from '../Classes/user.js';
import { Buddy } from '../Classes/buddy.js';
import sqlite3 from 'sqlite3';
const { Database } = sqlite3;
sqlite3.verbose();

export class SQLiteManager {
	constructor(client) {
		this.client = client;

		this.db = new Database('./src/sqlite/sqlite3.db', err => {
			if(err) console.log(hora(), 'Erro ao acessar banco de dados: ', err);
			console.log(hora(), 'Sucesso ao acessar banco de dados');

			this.init();
		});

		this.users = undefined;

		this.itens = undefined;
	}

	async init() {
		return new Promise((resolve, reject) => {
			this.createUsersTable()
				.then(this.createBuddysTable(), err => reject(err))
				.then(this.createItensTable(), err => reject(err))
				.then(this.createLastMessagesTable(), err => reject(err));
		});
	}

	// db.run() mas promisified
	async run(sql, params = []) {
		return new Promise((resolve, reject) => {
			try {
				this.db.run(sql, params, err => {
					if(err) reject(err);
					else resolve();
				});
			} catch(err) {
				reject(err);
			}
		});
	}

	// db.get() mas promisified
	async get(sql, params = []) {
		return new Promise((resolve, reject) => {
			try {
				this.db.get(sql, params, (err, row) => {
					if(err) reject(err);
					else resolve(row);
				});
			} catch(err) {
				reject(err);
			}
		});
	}

	// db.all() mas promisified
	async all(sql, params = []) {
		return new Promise((resolve, reject) => {
			try {
				this.db.all(sql, params, (err, rows) => {
					if(err) reject(err);
					else resolve(rows);
				});
			} catch(err) {
				reject(err);
			}
		});
	}


	// Reconstroi um usuário do banco de dados
	async getUser(id) {
		const userData = await this.get('SELECT * FROM users WHERE id = ?', [id]);
		if(userData) return new wcUser(this.client, userData);
		return false;
	}

	// Reconstroi um buddy do banco de dados
	async getBuddy(id) {
		const buddyData = await this.get('SELECT * FROM buddys WHERE id = ?', [id]);
		if(buddyData) return new Buddy(buddyData);
		return false;
	}

	// Todos os itens do usuário
	async getItens(id) {
		const rows = await this.all('SELECT * FROM itens WHERE id = ?', [id]);
		if(rows.length > 0) return rows;
		return false;
	}

	// JSON dsimplificado da mensagem
	async getLastMessage(id) {
		return await this.get(`
			SELECT * FROM lastmessages WHERE id = ?
		`, [id]);
	}

	// Cria um usuário se não existe
	async resolveUser(id, data = {}) {
		const user = await this.getUser(id);
		if(user) return user;

		const model = {
			id: id, invites: 0, boosting: null, messages: 0,
			xp: 0, coins: 0, gems: 0,
		};

		const dataArray = [];
		for(const property in model)
			if(data[property]) dataArray.push(data[property]);
			else dataArray.push(model[property]);

		await this.run(
			`INSERT INTO users (id, invites, boosting, messages, xp, coins, gems)
			VALUES (?, ?, ?, ?, ?, ?, ?)`,
			dataArray,
		);

		return this.getUser(id);
	}

	async updateUser(id, property, value) {
		return this.run(`
		UPDATE users
		SET ${property} = ?
		WHERE id = ?
		`, [value, id]);
	}

	async updateBuddy(id, property, value) {
		return this.run(`
		UPDATE users
		SET ${property} = ?
		WHERE id = ?
		`, [value, id]);
	}

	async updateItem(id, itemClass, property, value) {
		return this.run(`
		UPDATE users
		SET ${property} = ?
		WHERE id = ? AND class = ?
		`, [value, id, itemClass]);
	}

	async updateLastMessage(id, message) {
		return this.run(`
		REPLACE INTO lastmessages (id, content, attachment, timestamp, channelid)
		VALUES (
			?,
			${message.content ? `'${message.content}'` : null},
			${message.attachments.first() ? `'${message.attachments.first().url}'` : null},
			${`'${message.createdAt.toISOString()}'`},
			${`'${message.channel.id}'`}
		)
		`, [id]);
	}

	async createUsersTable() {
		return new Promise((resolve, reject) => {
			this.run(`
				CREATE TABLE IF NOT EXISTS users (
					num INTEGER PRIMARY KEY,
					id TEXT NOT NULL UNIQUE,
					invites INTEGER NOT NULL,
					boosting INTEGER,
					messages INTEGER NOT NULL,
					xp INTEGER NOT NULL,
			
					coins INTEGER NOT NULL,
					gems INTEGER NOT NULL
				)`).then(resolve(), err => reject(err));
		});
	}

	async createBuddysTable() {
		return new Promise((resolve, reject) => {
			this.run(`
				CREATE TABLE IF NOT EXISTS buddys (
					num INTEGER PRIMARY KEY,
					id TEXT NOT NULL UNIQUE,

					hat TEXT,
					glasses TEXT,
					shirt TEXT,
					gloves TEXT,
					pants TEXT,
					shoes TEXT,

					base TEXT,
					pet TEXT,

					FOREIGN KEY (id)
					REFERENCES users (id)
						ON UPDATE CASCADE
						ON DELETE CASCADE
				)`).then(resolve(), err => reject(err));
		});
	}

	async createItensTable() {
		return new Promise((resolve, reject) => {
			this.run(`
				CREATE TABLE IF NOT EXISTS itens (
					num INTEGER PRIMARY KEY,
					id TEXT NOT NULL,
			
					quantity INTEGER NOT NULL,
			
					FOREIGN KEY (id)
					REFERENCES users (id)
						ON UPDATE CASCADE
						ON DELETE CASCADE
				)`).then(resolve(), err => reject(err));
		});
	}

	async createLastMessagesTable() {
		return new Promise((resolve, reject) => {
			this.run(`
				CREATE TABLE IF NOT EXISTS lastmessages (
					num INTEGER PRIMARY KEY,
					id TEXT NOT NULL,

					content TEXT,
					attachment TEXT,
					timestamp TEXT NOT NULL,
					channelid TEXT NOT NULL,

					FOREIGN KEY (id)
					REFERENCES users (id)
						ON UPDATE CASCADE
						ON DELETE CASCADE
				)`).then(resolve(), err => reject(err));
		});
	}

}