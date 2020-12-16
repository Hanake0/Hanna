import sqlite3 from 'sqlite3';
const { Database } = sqlite3;
sqlite3.verbose();

const db = new Database('./dbdeteste.db');

class asyncDB {
	constructor(db) {
		this.db = db;

		this._invites = 2;
	}

	async invites(num = undefined) {
		const { invites: val } = await this.get(`SELECT invites FROM users WHERE id = ${this.id}`);

		if(!num) return val;

		if(typeof num === 'string') {
			if(num.includes('val'))
				num.replace('val', val);

			num = Number(eval(num));
		}

		console.log(num);

		return await this.updateUser(this.id, 'invites', num);
	}

	async updateUser(id, property, value) {
		return this.run(`
		UPDATE users
		SET ${property} = ${value}
		WHERE id = ?
		`, [id]);
	}

	async run(sql, params = []) {
		return new Promise((resolve, reject) => {
			this.db.run(sql, params, err => {
				if(err) reject(err);
				else resolve();
			});
		});
	}

	async get(sql, params = []) {
		return new Promise((resolve, reject) => {
			this.db.get(sql, params, (err, row) => {
				if(err) reject(err);
				else resolve(row);
			});
		});
	}

	async all(sql, params = []) {
		return new Promise((resolve, reject) => {
			this.db.all(sql, params, (err, rows) => {
				if(err) reject(err);
				else resolve(rows);
			});
		});
	}

	async getUser(id) {
		return this.get('SELECT * FROM users WHERE id = ?', [id]);
	}

}

const adb = new asyncDB(db);

adb.invites('val + 1').then(() => db.close());