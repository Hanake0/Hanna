/* eslint-disable no-unused-vars */
import { Guild } from 'discord.js';
import { Channel } from 'discord.js';

/**
 * Loads and stores settings associated with guilds
 * @abstract
 */
export class SettingProvider {
	constructor() {
		if(this.constructor.name === 'SettingProvider') throw new Error('The base SettingProvider cannot be instantiated.');
	}

	/**
	 * Initialises the provider by connecting to databases and/or caching all data in memory.
	 * {@link CommandoClient#setProvider} will automatically call this once the client is ready.
	 * @param {CommandoClient} client - Client that will be using the provider
	 * @return {Promise<void>}
	 * @abstract
	 */
	init(client) { throw new Error(`${this.constructor.name} doesn't have an init method.`); }

	/**
	 * Destroys the provider, removing any event listeners.
	 * @return {Promise<void>}
	 * @abstract
	 */
	destroy() { throw new Error(`${this.constructor.name} doesn't have a destroy method.`); }

	/**
	 * Obtains a setting for a guild
	 * @param {Guild|string} guild - Guild the setting is associated with (or 'global')
	 * @param {string} key - Name of the setting
	 * @param {*} [defVal] - Value to default to if the setting isn't set on the guild
	 * @return {*}
	 * @abstract
	 */
	get(guildOrChannel, key, defVal) { throw new Error(`${this.constructor.name} doesn't have a get method.`); }

	/**
	 * Sets a setting for a guild
	 * @param {Guild|string} guild - Guild to associate the setting with (or 'global')
	 * @param {string} key - Name of the setting
	 * @param {*} val - Value of the setting
	 * @return {Promise<*>} New value of the setting
	 * @abstract
	 */
	set(guildOrChannel, key, val) { throw new Error(`${this.constructor.name} doesn't have a set method.`); }

	/**
	 * Removes a setting from a guild
	 * @param {Guild|string} guild - Guild the setting is associated with (or 'global')
	 * @param {string} key - Name of the setting
	 * @return {Promise<*>} Old value of the setting
	 * @abstract
	 */
	remove(guildOrChannel, key) { throw new Error(`${this.constructor.name} doesn't have a remove method.`); }

	/**
	 * Removes all settings in a guild
	 * @param {Guild|string} guild - Guild to clear the settings of
	 * @return {Promise<void>}
	 * @abstract
	 */
	clear(guildOrChannel) { throw new Error(`${this.constructor.name} doesn't have a clear method.`); }

	/**
	 * Obtains the ID of the provided guild, or throws an error if it isn't valid
	 * @param {Guild|string} guild - Guild to get the ID of
	 * @return {string} ID of the guild, or 'global'
	 */
	static getGuildOrChannelID(guildOrChannel) {
		if(guildOrChannel instanceof Guild || guildOrChannel instanceof Channel) return guildOrChannel.id;
		if(guildOrChannel === 'global' || guildOrChannel === null) return 'global';
		if(typeof guildOrChannel === 'string' && !isNaN(guildOrChannel)) return guild;
		throw new TypeError('Invalid guildOrChannel specified. Must be a Guild or Channel instance, guild or channel ID, "global", or null.');
	}
}

