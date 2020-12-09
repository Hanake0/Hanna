import { hora } from '../util.js';
import { wcUser } from '../Classes/user.js';
import { Database } from 'sqlite3';

export class SQLiteManager {
	constructor(client) {
		this.client = client;

		this.users = undefined;

		this.itens = undefined;
	}

	init() {
		this.users = new Database('./users.db');
		this.itens = new Database('./itens.db');
	}

	initUsers() {
		const sql = `CREATE TABLE users (
			num INTEGER PRIMARY KEY,
			id TEXT NOT NULL UNIQUE,
			invites INTEGER NOT NULL,
			boosting INTEGER,
			messages INTEGER NOT NULL,
			xp INTEGER NOT NULL,

			wallet_coins INTEGER NOT NULL,
			wallet_gems INTEGER NOT NULL,

			lastMessage_createdAt TEXT,
			lastMessage_content TEXT,
			lastMessage_channel TEXT,
			lastMessage_attachment TEXT,

			budy_hat TEXT,
			budy_glasses TEXT,
			budy_shirt TEXT,
			budy_gloves TEXT,
			budy_pants TEXT,
			budy_shoes TEXT,

			budy_base TEXT,
			budy_pet TEXT,

			job_1 TEXT,
			job_2 TEXT,
			job_3 TEXT,
			job_4 TEXT,
	 )`;

		this.users.run(sql);
	}

	insert() {}

}