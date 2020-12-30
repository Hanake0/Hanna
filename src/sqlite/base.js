import { hora } from '../util.js';
import { wcUser } from '../classes/user.js';
import { Buddy } from '../classes/buddy.js';
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

	// Promise => undefined
	async init() {
		return new Promise((resolve, reject) => {
			this.createUsersTable()
				.then(this.createBuddysTable(), err => reject(err))
				.then(this.createItensTable(), err => reject(err))
				.then(this.createLastMessagesTable(), err => reject(err))
				.then(this.createJobsTable(), err => reject(err));
		});
	}

	// -----------------------------------> base <-----------------------------------
	// Promise => undefined ( db.run() mas promisified )
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

	// Promise => undefined ( db.get() mas promisified )
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

	// Promise => undefined ( db.all() mas promisified )
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
	// -----------------------------------> base <-----------------------------------

	// ----------------------------------> getters <---------------------------------
	// wcUser/false
	async getUser(id) {
		const userData = await this.get('SELECT * FROM users WHERE id = ?', [id]);
		if(userData) return new wcUser(this.client, userData);
		return false;
	}

	// Buddy/false
	async getBuddy(id) {
		const buddyData = await this.get('SELECT * FROM buddys WHERE id = ?', [id]);
		if(buddyData) return new Buddy(buddyData);
		return false;
	}

	// rows/false
	async getItens(id) {
		const rows = await this.all('SELECT * FROM itens WHERE id = ?', [id]);
		if(rows.length > 0) return rows;
		return false;
	}

	// JSON/null
	async getLastMessage(id) {
		return await this.get(`
			SELECT * FROM lastmessages WHERE id = ?
		`, [id]);
	}

	// rows/false
	async getJobs(id) {
		const rows = await this.all('SELECT * FROM jobs WHERE id = ?', [id]);
		if(rows.length > 0) return rows;
		return false;
	}

	async getJob(id, jobName) {
		const jobs = await this.getJobs(id);
		for(const job in jobs)
			if(job.name === jobName) {
				const { default: jobConstructor } = await import(job._path);
				return new jobConstructor(job);
			}
	}

	async getItem(id, name) {
		const itens = await this.getItens(id);
		for(const item in itens)
			if(item.name === name)
				return item;
	}

	// wcUser/false
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
	// ----------------------------------> getters <---------------------------------

	// ----------------------------------> setters <---------------------------------
	// Promise => undefined ( deve ser usado pela classe wcUser )
	async updateUser(id, property, value) {
		return await this.run(`
		UPDATE users
		SET ${property} = ?
		WHERE id = ?
		`, [value, id]);
	}

	// Promise => undefined ( deve ser usado pela classe Buddy )
	async updateBuddy(id, property, value) {
		return await this.run(`
		UPDATE users
		SET ${property} = ?
		WHERE id = ?
		`, [value, id]);
	}

	// Promise => undefined ( deve ser usado pela classe UserInventoryManager )
	async updateItem(id, itemName, property, value) {
		return await this.run(`
		UPDATE itens
		SET ${property} = ?
		WHERE id = ? AND name = ?
		`, [value, id, itemName]);
	}

	// Promise => undefined
	async updateLastMessage(id, message) {
		return await this.run(`
		REPLACE INTO lastmessages (num, id, content, attachment, timestamp, channelid)
		VALUES (
			(SELECT num FROM lastmessages WHERE id = ${`'${id}'`}),
			?,
			?,
			?,
			${message.createdAt.valueOf()},
			${`'${message.channel.id}'`}
		)
		`, [id, message.content, message.attachments.first() ? message.attachments.first().url : null]);
	}
	// ----------------------------------> setters <---------------------------------

	// --------------------------------> import/export <-----------------------------
	// Promise => undefined
	async importThing(dbName, data) {
		const keyArray = [],
			valueArray = [];
		for(const [key, value] of Object.entries(data)) {
			keyArray.push(key);
			valueArray.push(value);
		}

		await this.run(`
			REPLACE INTO ${dbName} (num, ${keyArray.join()})
			VALUES ((SELECT num FROM ${dbName} WHERE id = ${`'${data.id}'`}),${valueArray.map((val => {
	if(typeof val === 'string')
		return `'${val}'`;
	return val;
}))})
		`);
	}

	// Promise => data/false
	async exportThing(dbName, id) {
		const data = await this.all(`
		SELECT * FROM ${dbName} WHERE id = ?
		`, [id]);
		if(data) return data;
		return false;
	}
	// --------------------------------> import/export <-----------------------------

	// -----------------------------------> init <-----------------------------------
	// Promise => undefined
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

	// Promise => undefined
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

	// Promise => undefined
	async createItensTable() {
		return new Promise((resolve, reject) => {
			this.run(`
				CREATE TABLE IF NOT EXISTS itens (
					num INTEGER PRIMARY KEY,
					id TEXT NOT NULL,
			
					name TEXT NOT NULL,
					quantity INTEGER,
					expiringtime INTEGER NOT NULL,
					timeout INTEGER,
					id1 TEXT,
					id2 TEXT,
			
					FOREIGN KEY (id)
					REFERENCES users (id)
						ON UPDATE CASCADE
						ON DELETE CASCADE
				)`).then(resolve(), err => reject(err));
		});
	}

	// Promise => undefined
	async createLastMessagesTable() {
		return new Promise((resolve, reject) => {
			this.run(`
				CREATE TABLE IF NOT EXISTS lastmessages (
					num INTEGER PRIMARY KEY,
					id TEXT NOT NULL UNIQUE,

					content TEXT,
					attachment TEXT,
					timestamp INTEGER NOT NULL,
					channelid TEXT NOT NULL,

					FOREIGN KEY (id)
					REFERENCES users (id)
						ON UPDATE CASCADE
						ON DELETE CASCADE
				)`).then(resolve(), err => reject(err));
		});
	}

	// Promise => undefined
	async createJobsTable() {
		return new Promise((resolve, reject) => {
			this.run(`
				CREATE TABLE IF NOT EXISTS jobs (
					num INTEGER PRIMARY KEY,
					id TEXT NOT NULL,

					classname TEXT NOT NULL,
					_path TEXT NOT NULL,
					cooldown INTEGER,
					works INTEGER NOT NULL,
					wage TEXT NOT NULL,
					profit INTEGER NOT NULL,
					lastwork TEXT,
					lastworkchannelid TEXT,

					FOREIGN KEY (id)
					REFERENCES users (id)
						ON UPDATE CASCADE
						ON DELETE CASCADE
				)`).then(resolve(), err => reject(err));
		});
	}
	// -----------------------------------> init <-----------------------------------

}