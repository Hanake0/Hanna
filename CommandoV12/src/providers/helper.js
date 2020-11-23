/** Helper class to use {@link SettingProvider} methods for a specific Guild */
export class GuildSettingsHelper {
	/**
	 * @param {CommandoClient} client - Client to use the provider of
	 * @param {?CommandoGuild} guild - Guild the settings are for
	 * @private
	 */
	constructor(client, guild) {
		/**
		 * Client to use the provider of
		 * @name GuildSettingsHelper#client
		 * @type {CommandoClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * Guild the settings are for
		 * @type {?CommandoGuild}
		 */
		this.guild = guild;
	}

	/**
	 * Gets a setting in the guild
	 * @param {string} key - Name of the setting
	 * @param {*} [defVal] - Value to default to if the setting isn't set
	 * @return {*}
	 * @see {@link SettingProvider#get}
	 */
	get(key, defVal) {
		if(!this.client.provider) throw new Error('No settings provider is available.');
		return this.client.provider.get(this.guild, key, defVal);
	}

	/**
	 * Sets a setting for the guild
	 * @param {string} key - Name of the setting
	 * @param {*} val - Value of the setting
	 * @return {Promise<*>} New value of the setting
	 * @see {@link SettingProvider#set}
	 */
	set(key, val) {
		if(!this.client.provider) throw new Error('No settings provider is available.');
		return this.client.provider.set(this.guild, key, val);
	}

	/**
	 * Removes a setting from the guild
	 * @param {string} key - Name of the setting
	 * @return {Promise<*>} Old value of the setting
	 * @see {@link SettingProvider#remove}
	 */
	remove(key) {
		if(!this.client.provider) throw new Error('No settings provider is available.');
		return this.client.provider.remove(this.guild, key);
	}

	/**
	 * Removes all settings in the guild
	 * @return {Promise<void>}
	 * @see {@link SettingProvider#clear}
	 */
	clear() {
		if(!this.client.provider) throw new Error('No settings provider is available.');
		return this.client.provider.clear(this.guild);
	}
}

/** Helper class to use {@link SettingProvider} methods for a specific Channel */
export class ChannelSettingsHelper {
	/**
	 * @param {CommandoClient} client - Client to use the provider of
	 * @param {?CommandoChannel} channel - channel the settings are for
	 * @private
	 */
	constructor(client, channel) {
		/**
		 * Client to use the provider of
		 * @name GuildSettingsHelper#client
		 * @type {CommandoClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * Guild the settings are for
		 * @type {?CommandoGuild}
		 */
		this.channel = channel;
	}

	/**
	 * Gets a setting in the channel
	 * @param {string} key - Name of the setting
	 * @param {*} [defVal] - Value to default to if the setting isn't set
	 * @return {*}
	 * @see {@link SettingProvider#get}
	 */
	get(key, defVal) {
		if(!this.client.provider) throw new Error('No settings provider is available.');
		return this.client.provider.get(this.guild, key, defVal);
	}

	/**
	 * Sets a setting for the channel
	 * @param {string} key - Name of the setting
	 * @param {*} val - Value of the setting
	 * @return {Promise<*>} New value of the setting
	 * @see {@link SettingProvider#set}
	 */
	set(key, val) {
		if(!this.client.provider) throw new Error('No settings provider is available.');
		return this.client.provider.set(this.guild, key, val);
	}

	/**
	 * Removes a setting from the channel
	 * @param {string} key - Name of the setting
	 * @return {Promise<*>} Old value of the setting
	 * @see {@link SettingProvider#remove}
	 */
	remove(key) {
		if(!this.client.provider) throw new Error('No settings provider is available.');
		return this.client.provider.remove(this.guild, key);
	}

	/**
	 * Removes all settings in the channel
	 * @return {Promise<void>}
	 * @see {@link SettingProvider#clear}
	 */
	clear() {
		if(!this.client.provider) throw new Error('No settings provider is available.');
		return this.client.provider.clear(this.guild);
	}
}
