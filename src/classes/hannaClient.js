import { CommandoClient } from '../../CommandoV12/src/index.js';
import { UsersManager } from './managers/usersManager.js';
import { VIPsManager } from './managers/VIPsManager.js';
import { ColorsManager } from './managers/colorsManager.js';
import { FirestoreManager } from '../firestore/base.js';
import { SQLiteManager } from '../sqlite/base.js';
import { Collection } from 'discord.js';
import { InventoryManager } from './managers/inventoryManager.js';

export class HannaClient extends CommandoClient {
	constructor(options) {
		super(options);

		this.data = {
			users: new UsersManager(this),
			VIPs: new VIPsManager(this),
			colors: new ColorsManager(this),
			misc: new Collection(),
			invites: new Collection(),
			// deletedMessages: new LimitedCollection(200),
		};

		this.inventory = new InventoryManager(this);

		this.firestore = new FirestoreManager(this, options.db);

		this.sqlite = new SQLiteManager(this);

		this.games = new Collection();

		this._wcID = '698560208309452810';

		this.on('message', (message) => this.handleMessage(message));

		this.once('ready', () => {
			this.firestore.init();
			this.prepareInvites();
			this.setLogEmbeds(options.logChannels);
		});
	}

	get waifusClub() {
		return this.guilds.cache.get(this._wcID);
	}

	async handleMessage(message) {
		const uManager = this.data.users;
		const author = message.author;

		// Cria novo usuário se não existe
		const wcUser = await uManager.resolveUser(author);

		// Pega a última mensagem do db
		const lastMessage = await this.sqlite.getLastMessage(author.id);

		let shouldReceiveCoins = false;
		if(lastMessage) {
			const tempo = Date.now() - lastMessage.timestamp;

			if(tempo > 3250) shouldReceiveCoins = true;
		}

		// Atualiza o content de "lastMessage" e add coins e xp
		await uManager.updateLastMessage(message, wcUser, !author.bot && shouldReceiveCoins);

		if(!author.bot) {
			// Verifica se tem "!wc" no username e add +4 xp
			await uManager.verifyUsername(author, wcUser, true);

			// Verifica se tem convite permanente no status e add +1 coin
			await uManager.verifyCustomActivities(author, wcUser, shouldReceiveCoins);

			// Verifica se é membro booster e add 15 coins a cada 1 semana
			await uManager.verifyBoosts(author, wcUser, true);
		}
	}

	prepareInvites() {
		this.waifusClub.fetchInvites().then(invites => {
			invites.forEach(invite => {
				this.data.invites.set(invite.code, invite);
			});
		});
	}

	setLogEmbeds(logChannels) {
		if(logChannels) {
			const logCategories = {
				channel: { channelCreate: null, channelDelete: null, ChannelUpdate: null },
				emoji: { emojiCreate: null, emojiDelete: null, emojiUpdate: null },
				ban: { guildBanAdd: null, guildBanRemove: null },
				joinLeave: { guildMemberAdd: null, guildMemberRemove: null },
				invite: { inviteCreate: null, inviteDelete: null },
				message: { messageDelete: null, messageDeleteBulk: null, messageUpdate: null },
				role: { roleCreate: null, roleDelete: null, roleUpdate: null },
				user: { userUpdate: null },
			};

			// Coloca o id de cada canal para cada evento
			for(const [entry, id] of Object.entries(logChannels)) {

				// Caso categoria inteira
				if(Object.keys(logCategories).includes(entry))
					for(const evt of Object.keys(logCategories[entry])) logCategories[entry][evt] = id;

				// Caso evento específico
				else for(const [category, evts] of Object.entries(logCategories)) {
					if(Object.keys(evts).includes(entry)) logCategories[category][entry] = id;
				}
			}

			// Configura cada evento para criar os embeds
			for(const category of Object.values(logCategories)) {
				for(const [event, id] of Object.entries(category)) {
					import(`../logEmbeds/${event}.js`).then(({ default: func }) => {
						const channel = this.channels.cache.get(id);
						this.on(event, func.bind(null, this, channel));
					});
				}
			}
		}
	}
}