import { SettingProvider } from './base.js';
import { Channel, Guild } from 'discord.js';

/**
 * Uses an SQLite database to store settings with guilds
 * @extends {SettingProvider}
 */
export class FirebaseProvider extends SettingProvider {

	/**
	 * @param {Firebase} db - Database for the provider
	 */
	constructor(db) {
		super();

		/**
		 * Database that will be used for storing/retrieving settings
		 * @type {SQLiteDatabase}
		 */
		this.db = db;

		/**
		 * Client that the provider is for (set once the client is ready, after using {@link CommandoClient#setProvider})
		 * @name SQLiteProvider#client
		 * @type {CommandoClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: null, writable: true });

		/**
		 * Settings cached in memory, mapped by guild or channel ID (or 'global')
		 * @type {Map}
		 * @private
		 */
		this.settings = new Map();

		/**
		 * Listeners on the Client, mapped by the event name
		 * @type {Map}
		 * @private
		 */
		this.listeners = new Map();


	}

	async init(client) {
    this.client = client;
    
    const settings = await this.db.collection('settings').get();

    if(settings.empty) client.emit('warn', 'Nenhuma informação pode ser recuperada do Banco de Dados')
    else {
      // Carrega todas as configurações
      settings.forEach(snap => {
        this.settings.set(snap.id, snap.data());
        if(snap.id !== 'global' && (!client.guilds.cache.has(snap.id) && !client.channels.cache.has(snap.id))) return;
        this.setupGuildOrChannel(snap.id, snap.data());
      })
    }

		// Configura os eventos para atualizar o db
		this.listeners
			.set('commandPrefixChange', (guild, prefix) => this.set(guild, 'prefix', prefix))
			.set('commandStatusChange', (guildOrChannel, command, enabled) => this.set(guildOrChannel, `cmd_${command.name}`, enabled))
			.set('groupStatusChange', (guildOrChannel, group, enabled) => this.set(guildOrChannel, `grp_${group.id}`, enabled))
			.set('guildCreate', guild => {
				const settings = this.settings.get(guild.id);
				if(!settings) return;
				this.setupGuildOrChannel(guild.id, settings);
			})
			.set('commandRegister', command => {
				for(const [guildOrChannel, settings] of this.settings) {
          if(guildOrChannel !== 'global' && (!client.guilds.cache.has(guildOrChannel) && !client.channels.cache.has(guildOrChannel))) continue;
          
          guildOrChannel = this.client.channels.cache.get(guildOrChannel) || this.client.guilds.cache.get(guildOrChannel) || null;
					this.setupGuildOrChannelCommand(guildOrChannel, command, settings);
				}
			})
			.set('groupRegister', group => {
				for(const [guildOrChannel, settings] of this.settings) {
          if(guildOrChannel !== 'global' && (!client.guilds.cache.has(guildOrChannel) && !client.channels.cache.has(guildOrChannel))) continue;
          
          guildOrChannel = this.client.channels.cache.get(guildOrChannel) || this.client.guilds.cache.get(guildOrChannel) || null;
					this.setupGuildGroup(guildOrChannel, group, settings);
				}
			});
		for(const [event, listener] of this.listeners) client.on(event, listener);
	}

	async destroy() {
		// Remove o listener do db
		

		// Remove todos os listeners do client
		for(const [event, listener] of this.listeners) this.client.removeListener(event, listener);
		this.listeners.clear();
	}

	get(guildOrChannel, key, defVal) {
		const settings = this.settings.get(this.constructor.getGuildOrChannelID(guildOrChannel));
		return settings ? typeof settings[key] !== 'undefined' ? settings[key] : defVal : defVal;
	}

	async set(guildOrChannel, key, val) {
		guildOrChannel = this.constructor.getGuildOrChannelID(guildOrChannel);
		let settings = this.settings.get(guildOrChannel);
		if(!settings) {
			settings = {};
			this.settings.set(guildOrChannel, settings);
		}

		settings[key] = val;
		await this.db.collection('settings').doc(guildOrChannel).set(settings);
		if(guildOrChannel === 'global') this.updateOtherShards(key, val);
		return true;
	}

	async remove(guildOrChannel, key) {
		guildOrChannel = this.constructor.getGuildOrChannelID(guildOrChannel);
		const settings = this.settings.get(guildOrChannel);
		if(!settings || typeof settings[key] === 'undefined') return false;

		const val = settings[key];
		settings[key] = undefined;
    await this.db.collection('settings').doc(guildOrChannel).set(settings);
		if(guild === 'global') this.updateOtherShards(key, undefined);
		return true;
	}

	async clear(guildOrChannel) {
		guildOrChannel = this.constructor.getGuildOrChannelID(guildOrChannel);
		if(!this.settings.has(guildOrChannel)) return;
		this.settings.delete(guildOrChannel);
		await this.db.collection('settings').doc(guildOrChannel).delete()
	}

	/**
	 * Loads all settings for a guild or channel
	 * @param {string} guildOrChannel - Guild or Channel ID to load the settings of (or 'global')
	 * @param {Object} settings - Settings to load
	 * @private
	 */
	setupGuildOrChannel(guildOrChannel, settings) {
		if(typeof guildOrChannel !== 'string') throw new TypeError('The guildOrChannel must be a guild or channel ID or "global".');
		guildOrChannel = this.client.channels.cache.get(guildOrChannel) || this.client.guilds.cache.get(guildOrChannel) || null;

		// Load the command prefix
		if(typeof settings.prefix !== 'undefined') {
			if(guildOrChannel instanceof Guild) guild._commandPrefix = settings.prefix;
			else if(!guildOrChannel instanceof Channel) this.client._commandPrefix = settings.prefix;
		}

		// Load all command/group statuses
		for(const command of this.client.registry.commands.values()) this.setupGuildOrChannelCommand(guildOrChannel, command, settings);
		for(const group of this.client.registry.groups.values()) this.setupGuildOrChannelGroup(guildOrChannel, group, settings);
	}

	/**
	 * Sets up a command's status in a guild or channel from the guild or channel settings
	 * @param {?CommandoGuild} guildOrChannel - Guild or Channel to set the status in
	 * @param {Command} command - Command to set the status of
	 * @param {Object} settings - Settings of the guild
	 * @private
	 */
	setupGuildOrChannelCommand(guildOrChannel, command, settings) {
		if(typeof settings[`cmd_${command.name}`] === 'undefined') return;
		if(guildOrChannel) {
			if(!guildOrChannel._commandsEnabled) guildOrChannel._commandsEnabled = {};
			guildOrChannel._commandsEnabled[command.name] = settings[`cmd_${command.name}`];
		} else {
			command._globalEnabled = settings[`cmd_${command.name}`];
		}
	}

	/**
	 * Sets up a command group's status in a guild from the guild's settings
	 * @param {?CommandoGuild} guild - Guild to set the status in
	 * @param {CommandGroup} group - Group to set the status of
	 * @param {Object} settings - Settings of the guild
	 * @private
	 */
	setupGuildOrChannelGroup(guildOrChannel, group, settings) {
		if(typeof settings[`grp_${group.id}`] === 'undefined') return;
		if(guildOrChannel) {
			if(!guildOrChannel._groupsEnabled) guildOrChannel._groupsEnabled = {};
			guildOrChannel._groupsEnabled[group.id] = settings[`grp_${group.id}`];
		} else {
			group._globalEnabled = settings[`grp_${group.id}`];
		}
	}

	/**
	 * Updates a global setting on all other shards if using the {@link ShardingManager}.
	 * @param {string} key - Key of the setting to update
	 * @param {*} val - Value of the setting
	 * @private
	 */
	updateOtherShards(key, val) {
		if(!this.client.shard) return;
		key = JSON.stringify(key);
		val = typeof val !== 'undefined' ? JSON.stringify(val) : 'undefined';
		this.client.shard.broadcastEval(`
			if(this.shard.id !== ${this.client.shard.id} && this.provider && this.provider.settings) {
				let global = this.provider.settings.get('global');
				if(!global) {
					global = {};
					this.provider.settings.set('global', global);
				}
				global[${key}] = ${val};
			}
		`);
	}
}

